import React from 'react'
import {Scaffold, H1, P} from 'comps/layouts'

export default class P404 extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1>404</H1>
        <P>Page not found :(</P>
      </Scaffold>
    )
  }
}
