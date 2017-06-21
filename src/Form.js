import React from 'react'

let nextFormId = 1 // used for id-generation

// FormContainer is what is being passed as first arg to theme.renderForm(FormContainer, children, opts)

const FormContainer = ({children, ...rest}, {reformForm}) => (
  <form {...rest} onSubmit={reformForm.onSubmit}>{children}</form>
)

FormContainer.contextTypes = {reformForm: React.PropTypes.object}

export default class Form extends React.Component {

  static contextTypes = {
    reformRoot: React.PropTypes.object
  }

  static childContextTypes = {
    reformForm: React.PropTypes.object.isRequired
  }

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    theme: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]).isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    model: React.PropTypes.object,
    initialModel: React.PropTypes.object,
    onFieldChange: React.PropTypes.func
  }

  static defaultProps = {
    model: null,
    initialModel: {},
    theme: 'default',
    onFieldChange: () => {}
  }

  getChildContext() {
    return {
      reformForm: {
        getRestProps: this.getRestProps,
        onSubmit: this.handleSubmit,
        getValue: this.getValue,
        setValue: this.setValue,
        notifyOfValidationResults: this.notifyOfValidationResults,
        onFocusField: this.handleFocusField,
        onBlurField: this.handleBlurField,
        theme: this.getTheme(),
        isDirty: (name) => (this.state.fields[name] && this.state.fields[name].dirty) || false,
        isTouched: (name) => (this.state.fields[name] && this.state.fields[name].touched) || false,
        isFocused: (name) => (this.state.fields[name] && this.state.fields[name].focused) || false,
        registerFocusHook: (name, hook) => this.focusHooks[name] = hook,
        unregister: this.handleUnregisterField,
        serverErrors: this.state.serverErrors,
        formId: this.formId,
        status: this.state.status,
        setState: a => this.setState(a)
      }
    }
  }

  state = {
    fields: {},
    serverErrors: {$global: []},
    status: 'unsubmitted'
  }

  isFormUnmounted = false
  isFormMounted = false
  focusHooks = {}
  formId = nextFormId++

  componentDidMount() {
    this.isFormMounted = true
  }

  componentWillUnmount() {
    this.isFormUnmounted = true
  }

  ensureFieldWith(name, props) {
    if (this.isFormUnmounted) return
    const {fields} = this.state
    const {initialModel} = this.props
    const existing = fields[name]
    if (!existing || this.resetInProgress) {
      fields[name] = {
        value: name in initialModel ? initialModel[name] : null,
        validations: [],
        dirty: false,
        touched: false,
        focused: false,
        ...props
      }
      this.setState({fields})
    } else {
      const hasChanged = Object.keys(props).some(propName => existing[propName] !== props[propName])
      if (hasChanged) {
        fields[name] = {...existing, ...props}
        this.setState({fields})
      }
    }
  }

  getRestProps = () => {
    const {theme: _, children: _1, onSubmit: _2, model: _3, initialModel: _4, onFieldChange: _5, ...rest} = this.props
    return rest
  }

  getValue = (name) => {
    const {model, initialModel} = this.props
    const {fields} = this.state
    if (model) {
      return model[name]
    } else {
      return fields[name] ? fields[name].value : initialModel[name] !== undefined ? initialModel[name] : null
    }
  }

  setValue = (name, value) => {
    const {model, onFieldChange} = this.props
    if (model) {
      if (onFieldChange(name, value) !== false) {
        this.ensureFieldWith(name, {dirty: true})
      }
    } else {
      this.ensureFieldWith(name, {value, dirty: true})
    }
  }

  getAllValues = () => {
    const {model, initialModel} = this.props
    const {fields} = this.state
    if (model) {
      return model
    } else {
      return {...initialModel, ...Object.keys(fields).reduce((m, name) => {m[name] = fields[name].value; return m}, {})}
    }
  }

  getTheme() {
    const {theme} = this.props
    if (theme && theme.$isReformTheme) {
      return theme
    } else {
      return this.context.reformRoot.getTheme(theme)
    }
  }

  reset() {
    this.resetInProgress = true
    this.setState({fields: {}}, () => this.resetInProgress = false)
  }

  focusField(name) {
    if (!this.focusHooks[name]) {
      console.warn(`no mounted field with name "${name}"`)
    } else {
      this.focusHooks[name]()
    }
  }

  notifyOfValidationResults = (name, validations) => {
    const {fields} = this.state
    const existing = fields[name] && fields[name].validations
    if (existing) {
      if (existing.length === validations.length) {
        const areIdentical = existing.every((ex, i) => {
          const other = validations[i]
          return ex.name === other.name && ex.isValid === other.isValid && ex.errorMessage === other.errorMessage && ex.hintMessage === other.hintMessage
        })
        if (areIdentical) return
      }
    }
    const cb = () => this.ensureFieldWith(name, {validations})
    if (this.isFormMounted) {setTimeout(cb)} else {cb()}
  }

  handleUnregisterField = (name) => {
    delete this.focusHooks[name]
    this.setState(({fields}) => {
      delete fields[name]
      return fields
    })
  }

  handleFocusField = (name) => {
    this.ensureFieldWith(name, {focused: true, touched: true})
  }

  handleBlurField = (name) => {
    this.ensureFieldWith(name, {focused: false})
  }

  handleAsyncSuccess = () => {
    if (this.isFormUnmounted) return
    this.reset()
    this.setState({
      serverErrors: {$global: []},
      status: 'success'
    })
  }

  // shape of error: {fieldName: error} or 'global error message as string or react object'
  handleAsyncError = (errors) => {
    if (this.isFormUnmounted) return
    const {fields} = this.state
    let afterSetStateCb = null
    // if it's a real Error, throw it!
    if (errors instanceof Error) {
      setTimeout(() => {console.error('onSubmit threw:', errors)})
      throw errors
    }
    if (this.isFormUnmounted) return
    const errorMessages = {$global: []}
    if (typeof errors === 'string' || React.isValidElement(errors)) {
      errorMessages.$global.push(errors)
    } else {
      let focussedInvalidField = false
      Object.keys(errors).forEach(errorField => {
        if (fields[errorField]) {
          errorMessages[errorField] = {
            isValid: false,
            errorMessage: errors[errorField],
            hintMessage: errors[errorField],
            name: 'server'
          }
          if (!focussedInvalidField) {
            afterSetStateCb = () => this.focusField(errorField)
            focussedInvalidField = true // to ensure only the *first* field get focused
          }
        } else {
          errorMessages.$global.push({[errorField]: errors[errorField]})
        }
      })
    }
    this.setState({
      serverErrors: errorMessages,
      status: 'postSubmitFail'
    }, afterSetStateCb)
  }

  checkForErrors() {
    const {fields} = this.state
    let firstInvalidFieldName = null
    const hasErrors = !Object.keys(fields).every(name => {
      if (!fields[name].validations.every(v => v.isValid === true)) {
        firstInvalidFieldName = name
        return false
      } else {
        return true
      }
    })
    return {hasErrors, firstInvalidFieldName}
  }

  handleSubmit = (e, ...args) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    const {hasErrors, firstInvalidFieldName} = this.checkForErrors()
    if (hasErrors) {
      this.setState({status: 'preSubmitFail'}, () => this.focusField(firstInvalidFieldName))
    } else {
      this.setState({serverErrors: {$global: []}})
      const result = this.props.onSubmit(this.getAllValues(), e, ...args)
      if (result && typeof result.then === 'function') {
        this.setState({status: 'pending'})
        result.then(this.handleAsyncSuccess, this.handleAsyncError)
      } else {
        this.reset()
        this.setState({status: 'UNCERTAIN STATUS'})
      }
    }
  }

  render() {
    const {children} = this.props
    const {fields, status, serverErrors} = this.state
    const validations = Object.keys(fields).reduce((m, f) => {m[f] = fields[f].validations; return m}, {})
    const isValid = !this.checkForErrors().hasErrors
    return this.getTheme().renderForm(FormContainer, children, {
      directProps: this.getRestProps(),
      isValid,
      validationsPerField: validations,
      status,
      submitForm: this.handleSubmit,
      globalErrors: serverErrors.$global
    })
  }
}
