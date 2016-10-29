import React from 'react'

// const MyInput = props => (
//   <WrapInput {...props}>{({value, listeners: {onChange, ...restListeners}}) => (
//     <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} {...restListeners}/>
//   )}</WrapInput>
// )

// <Form>
//   <MyInput name="name" label="hi"/>
// </Form>


// it would be much easier to understand if we created this component within the render method,
// but this would mean creating a *new* component type every time we call render, leading to new
// dom nodes being created constantly.
const createFieldComponent = (instance, registerFocusNode) => {
  const handleChange = (v, themeOnChange) => {
    const value = typeof v === 'function' ? v(instance.state.value) : v
    if (themeOnChange) themeOnChange(value)
    instance.context.reformForm.setValue(instance.props.directProps.name, value)
  }
  const handleFocus = (v, themeOnFocus) => {
    if (themeOnFocus) themeOnFocus(v)
    instance.context.reformForm.onFocusField(instance.props.directProps.name, v)
  }
  const handleBlur = (v, themeOnBlur) => {
    if (themeOnBlur) themeOnBlur(v)
    instance.context.reformForm.onBlurField(instance.props.directProps.name, v)
  }
  return (themeProps) => {
    const {children} = instance.props
    const {value} = instance.state
    // setting `instance` as `this` so that you can call e.g. `this.setState` for more complex interactions
    return children.call(instance, {
      value,
      listeners: {
        onChange: themeProps.onChange ? (v) => handleChange(v, themeProps.onChange): handleChange,
        onFocus: themeProps.onFocus ? (v) => handleFocus(v, themeProps.onFocus): handleFocus,
        onBlur: themeProps.onBlur ? (v) => handleBlur(v, themeProps.onBlur): handleBlur
      },
      themeProps,
      registerFocusNode
    })
  }
}

export default class WrapInput extends React.Component {

  static contextTypes = {
    reformForm: React.PropTypes.object,
    reformRoot: React.PropTypes.object
  }

  static propTypes = {
    children: React.PropTypes.func.isRequired,
    directProps: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      preventFocusAfterFail: React.PropTypes.bool
    }),
    focusFn: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    focusFn(node) {if (!this.props.directProps.preventFocusAfterFail) node.focus()}
  }

  constructor(props, context) {
    super(props, context)
    this.registeredNode = null
    this.scopedValidators = {}
    const value = this.context.reformForm.getValue(props.directProps.name)
    this.state = this.prepareState(value, props, context)
    this.fieldComponent = createFieldComponent(this, n => {this.registeredNode = n})
  }

  componentDidMount() {
    this.context.reformForm.registerFocusHook(this.props.directProps.name, () => this.props.focusFn.call(this, this.registeredNode))
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newVal = this.context.reformForm.getValue(nextProps.directProps.name)
    this.setState(this.prepareState(newVal, nextProps, nextContext))
  }

  componentWillUnmount() {
    this.context.reformForm.unregisterFocusHook(this.props.directProps.name)
  }

  revalidateHook = () => {
    this.setState(this.prepareState(this.state.value, this.props, this.context))
  }

  getMessages(context, validationName, rule, value, fieldName, arg) {
    const {reformForm} = context
    const themeValidationObj = reformForm.theme.validationLabels[validationName]
    const opts = {name: fieldName, arg}
    return {
      errorMessage: ((themeValidationObj && themeValidationObj.errorMessage) || rule.errorMessage)(value, opts),
      hintMessage: ((themeValidationObj && themeValidationObj.hintMessage) || rule.hintMessage || rule.errorMessage)(value, opts)
    }
  }

  prepareState(newVal, props, context) {
    const {reformRoot, reformForm} = context
    const validators = []
    const nonValidationRestProps = {}
    for (let prop in props.directProps) {
      if (prop in reformRoot.validationVariants) {
        let {name, rule} = reformRoot.validationVariants[prop]
        if (typeof rule === 'function') {
          rule = (this.scopedValidators[name] = this.scopedValidators[name] || rule())
        }
        validators.push({validator: {name, rule}, arg: props.directProps[prop]})
      } else {
        nonValidationRestProps[prop] = props.directProps[prop]
      }
    }
    const validations = validators.map(({validator: {name, rule}, arg}) => ({
      name,
      isValid: rule.isValid(newVal, {arg, getValue: reformForm.getValue}, this.revalidateHook),
      ...this.getMessages(context, name, rule, newVal, props.directProps.name, arg)
    }))
    reformForm.notifyOfValidationResults(props.directProps.name, validations)
    return {nonValidationRestProps, validations, value: newVal}
  }

  render() {
    const {reformForm: {theme, isDirty, isTouched, isFocused, onSubmit, serverErrors, formId, status}} = this.context
    const {nonValidationRestProps, validations} = this.state
    const {children: _, directProps: {name}, ...rest} = this.props
    return theme.renderField(this.fieldComponent, {
      directProps: nonValidationRestProps,
      wrapperProps: rest,
      validations: serverErrors[name] ? [...validations, serverErrors[name]] : validations,
      name,
      id: `form${formId}-${name}`,
      isDirty: isDirty(name),
      isTouched: isTouched(name),
      isFocused: isFocused(name),
      submitForm: onSubmit,
      formStatus: status
    })
  }
}