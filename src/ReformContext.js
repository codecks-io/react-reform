import React from "react"

export default class ReformContext extends React.Component {

  static childContextTypes = {
    reformRoot: React.PropTypes.object.isRequired
  }

  static propTypes = {
    children: React.PropTypes.element.isRequired,
    themes: React.PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      reformRoot: {
        getTheme: (name) => {
          const theme = this.props.themes[name]
          if (!theme) throw new Error(`No theme with name '${name}'!`)
          return theme
        }
      }
    }
  }

  render() {
    return this.props.children
  }
}