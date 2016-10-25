import React from "react"

class FormContainer extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  }

  render() {
    return (
      <ReformCtx>{(ctx) => (
        <form {...ctx.getRestProps()} {...this.props} onSubmit={ctx.handleSubmit}>{this.props.children}</form>
      )}</ReformCtx>
    )
  }
}

class ReformCtx extends React.Component {

  static contextTypes = {
    reformForm: React.PropTypes.object
  }

  static propTypes = {
    children: React.PropTypes.func.isRequired
  }

  render() {
    return this.props.children(this.context.reformForm)
  }
}

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
        handleSubmit: this.handleSubmit
      }
    }
  }

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    theme: React.PropTypes.string,
    themeProps: React.PropTypes.object,
    onSubmit: React.PropTypes.func.isRequired,
    model: React.PropTypes.object,
    initialModel: React.PropTypes.object,
    onFieldChange: React.PropTypes.func
  }

  static defaultProps = {
    themeProps: {},
    model: null,
    initialModel: {},
    theme: "default",
    onFieldChange: () => {}
  }

  getRestProps = () => {
    const {theme: _, children: _1, themeProps: _2, onSubmit: _3, model: _4, initialModel: _5, onFieldChange: _6, ...rest} = this.props
    return rest
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.onSubmit("tada")
  }

  render() {
    const {theme, children, themeProps} = this.props
    const {reformRoot} = this.context
    return reformRoot.getTheme(theme).renderForm(FormContainer, children, {themeProps, formProps: this.getRestProps()})
  }
}