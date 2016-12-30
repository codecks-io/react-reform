import 'lib/polyfill'
import React from 'react'

import 'normalize.css/normalize.css'
import './App.css'

export default class App extends React.Component {

  static childContextTypes = {
    appInfo: React.PropTypes.object
  }

  getChildContext() {
    return {
      appInfo: {
        routes: this.props.allRoutes,
        isServerRender: this.props.isServerRender
      }
    }
  }

  render() {
    return this.props.children
  }
}
