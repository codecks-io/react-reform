import 'lib/polyfill'
import React from 'react'

import 'normalize.css/normalize.css'
import './App.css'

import {ReformContext, validations, defaultTheme} from 'comps/forms'

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
    return (
      <ReformContext validations={validations} themes={{default: defaultTheme}}>
        {this.props.children}
      </ReformContext>
    )
  }
}
