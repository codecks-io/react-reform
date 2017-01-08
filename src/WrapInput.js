import React from 'react'

// const MyInput = props => (
//   <WrapInput directProps={props} type="myInput">{({value, themeProps: {onChange, ...remainingThemeProps}}) => (
//     <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} {...remainingThemeProps}/>
//   )}</WrapInput>
// )

// <Form>
//   <MyInput name="name" label="hi"/>
// </Form>

// The component we create here gets passed as the first argument of a themes's renderField() function.
// It would be easier to understand if we created this component within the render method of WrapInput,
// but this would mean creating a *new* component type every time we call render, leading to new
// dom nodes being created constantly. This is why we create this component in the constructor of WrapInput
// with a reference to the WrapInput instance to be able to interface with it
const createFieldComponent = (instance) => {
  return class extends React.Component {

    constructor(props) {
      super(props)
      instance.shouldPreventFocusAfterFail = () => this.props.dontFocusAfterFail
    }

    handleChange = (v, themeOnChange) => {
      const value = typeof v === 'function' ? v(instance.state.value) : v
      if (themeOnChange) themeOnChange(value)
      instance.context.reformForm.setValue(instance.props.directProps.name, value)
    }
    handleFocus = (e, themeOnFocus) => {
      if (themeOnFocus) themeOnFocus(e)
      instance.context.reformForm.onFocusField(instance.props.directProps.name)
    }
    handleBlur = (e, themeOnBlur) => {
      if (themeOnBlur) themeOnBlur(e)
      instance.context.reformForm.onBlurField(instance.props.directProps.name)
    }

    render() {
      const {onChange, onFocus, onBlur, dontFocusAfterFail: _, ...remainingThemeProps} = this.props
      const {children: wrapInputChild} = instance.props
      const {value} = instance.state
      // setting `instance` as `this` so that you can call e.g. `this.setState` for more complex interactions
      return wrapInputChild.call(instance, {
        value,
        themeProps: {
          onChange: (v) => this.handleChange(v, onChange),
          onFocus: (e) => this.handleFocus(e, onFocus),
          onBlur: (e) => this.handleBlur(e, onBlur),
          ref: n => instance.registeredNode = n,
          ...remainingThemeProps
        }
      })
    }
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
      name: React.PropTypes.string.isRequired
    }).isRequired,
    focusFn: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    focusFn(node) {if (!this.shouldPreventFocusAfterFail || !this.shouldPreventFocusAfterFail()) node.focus()}
  }

  constructor(props, context) {
    super(props, context)
    this.registeredNode = null
    this.scopedValidators = {}
    this.postponedNotification = null
    const value = this.context.reformForm.getValue(props.directProps.name)
    this.state = this.prepareState(value, props, context, {postponeNotifying: true})
    this.fieldComponent = createFieldComponent(this)
  }

  componentWillMount() {
    if (this.postponedNotification) {
      this.context.reformForm.notifyOfValidationResults(this.postponedNotification.name, this.postponedNotification.validations)
      this.postponedNotification = null
    }
  }

  componentDidMount() {
    this.context.reformForm.registerFocusHook(this.props.directProps.name, () => this.props.focusFn.call(this, this.registeredNode))
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newVal = this.context.reformForm.getValue(nextProps.directProps.name)
    this.setState(this.prepareState(newVal, nextProps, nextContext))
  }

  componentWillUnmount() {
    this.context.reformForm.unregister(this.props.directProps.name)
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

  prepareState(newVal, props, context, {postponeNotifying = false} = {}) {
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
    if (postponeNotifying) {
      this.postponedNotification = {name: props.directProps.name, validations}
    } else {
      reformForm.notifyOfValidationResults(props.directProps.name, validations)
    }
    return {nonValidationRestProps, validations, value: newVal}
  }

  render() {
    const {reformForm: {theme, isDirty, isTouched, isFocused, onSubmit, serverErrors, formId, status, getRestProps}} = this.context
    const {nonValidationRestProps, validations} = this.state
    const {children: _, directProps: {name}, ...rest} = this.props
    return theme.renderField(this.fieldComponent, {
      directProps: nonValidationRestProps,
      wrapperProps: rest,
      directFormProps: getRestProps(),
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
