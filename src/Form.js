import React from "react"

// FormContainer is what is being passed as first arg to theme.renderForm(FormContainer, children, opts)

const FormContainer = ({children, ...rest}, {reformForm}) => (
  <form {...rest} onSubmit={reformForm.handleSubmit}>{children}</form>
)

FormContainer.propTypes = {children: React.PropTypes.node.isRequired}
FormContainer.contextTypes = {reformForm: React.PropTypes.object}

export default class Form extends React.Component {

  static contextTypes = {
    reformRoot: React.PropTypes.object
  }

  static childContextTypes = {
    reformForm: React.PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      reformForm: {
        getRestProps: this.getRestProps,
        handleSubmit: this.handleSubmit,
        getValue: this.getValue,
        setValue: this.setValue,
        notifyOfValidationResults: this.notifyOfValidationResults,
        theme: this.getTheme()
      }
    }
  }

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    theme: React.PropTypes.string,
    onSubmit: React.PropTypes.func.isRequired,
    model: React.PropTypes.object,
    initialModel: React.PropTypes.object,
    onFieldChange: React.PropTypes.func
  }

  static defaultProps = {
    model: null,
    initialModel: {},
    theme: "default",
    onFieldChange: () => {}
  }

  state = {
    fields: {}
  }

  ensureFieldWith(name, key, value) {
    const {fields} = this.state
    const {initialModel} = this.props
    const existing = fields[name]
    if (!existing) {
      fields[name] = {value: initialModel[name] || null, validations: [], [key]: value}
      this.setState({fields})
    } else {
      if (existing[key] !== value) {
        existing[key] = value
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
      onFieldChange(name, value)
    } else {
      this.ensureFieldWith(name, "value", value)
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
    return this.context.reformRoot.getTheme(this.props.theme)
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
    // postpone updating state, since we're currently within the render cycle
    setTimeout(() => this.ensureFieldWith(name, "validations", validations))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.onSubmit(this.getAllValues())
  }

  render() {
    const {children} = this.props
    const {fields} = this.state
    const validations = Object.keys(fields).reduce((m, f) => {m[f] = fields[f].validations; return m}, {})
    const isValid = Object.keys(validations).every(name => validations[name].every(v => v.isValid === true))
    return this.getTheme().renderForm(FormContainer, children, {directProps: this.getRestProps(), isValid, validationsPerField: validations})
  }
}