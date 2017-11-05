import 'lib/polyfill'
import React from 'react'
import {StyleProvider} from 'reta'

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
    return (
      <StyleProvider element={!this.props.isServerRender && !__DEV__ && document.getElementsByClassName('_styletron_hydrate_')}>
        {this.props.children}
      </StyleProvider>
    )
  }
}
