import React from 'react'

// const MyInput = props => (
//   <WrapInput {...props}>{({value, listeners: {onChange, ...restListeners}}) => (
//     <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} {...restListeners}/>
//   )}</WrapInput>
// )

// <Form>
//   <MyInput name="name" label="hi"/>
// </Form>

const createFieldComponent = (propsGetter, stateGetter, reformCtxGetter) => {
  const handleChange = (v, themeOnChange) => {
    if (themeOnChange) themeOnChange(v)
    reformCtxGetter().setValue(propsGetter().name, v)
  }
  const handleFocus = (v, themeOnFocus) => {
    if (themeOnFocus) themeOnFocus(v)
    reformCtxGetter().onFocusField(propsGetter().name, v)
  }
  const handleBlur = (v, themeOnBlur) => {
    if (themeOnBlur) themeOnBlur(v)
    reformCtxGetter().onBlurField(propsGetter().name, v)
  }
  return (themeProps) => {
    const {children} = propsGetter()
    const {value} = stateGetter()
    return children({
      value,
      listeners: {
        onChange: themeProps.onChange ? (v) => handleChange(v, themeProps.onChange): handleChange,
        onFocus: themeProps.onFocus ? (v) => handleFocus(v, themeProps.onFocus): handleFocus,
        onBlur: themeProps.onBlur ? (v) => handleBlur(v, themeProps.onBlur): handleBlur
      },
      themeProps
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
    name: React.PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context)
    const value = this.context.reformForm.getValue(props.name)
    this.state = this.prepareState(value, props, context)
    this.fieldComponent = createFieldComponent(() => this.props, () => this.state, () => this.context.reformForm)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newVal = this.context.reformForm.getValue(nextProps.name)
    this.setState(this.prepareState(newVal, nextProps, nextContext))
  }

  revalidateHook = () => {
    this.setState(this.prepareState(this.state.value, this.props, this.context))
  }

  prepareState(newVal, props, context) {
    const {name: fieldName, children: _1, ...rest} = props
    const {reformRoot, reformForm} = context
    const validators = []
    const nonValidationRestProps = {}
    for (let prop in rest) {
      if (prop in reformRoot.validationVariants) {
        validators.push({validator: reformRoot.validationVariants[prop], arg: rest[prop]})
      } else {
        nonValidationRestProps[prop] = rest[prop]
      }
    }
    const validations = validators.map(({validator: {name, rule}, arg}) => ({
      name,
      isValid: rule.isValid(newVal, {arg, getValue: reformForm.getValue}, this.revalidateHook)
    }))
    reformForm.notifyOfValidationResults(fieldName, validations)
    return {nonValidationRestProps, validations, value: newVal}
  }

  render() {
    const {reformForm: {theme, isDirty, isTouched, isFocused}} = this.context
    const {nonValidationRestProps, validations} = this.state
    const {name} = this.props
    // console.log("render", name)
    return theme.renderField(this.fieldComponent, {
      directProps: nonValidationRestProps,
      validations,
      name,
      isDirty: isDirty(name),
      isTouched: isTouched(name),
      isFocused: isFocused(name)
    })
  }
}