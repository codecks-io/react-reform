import React from 'react'
import {B} from 'comps/styles'

// const Section = (props) => (
//   <B.Col mha mb6 maxWidth="40em" width="100%" {...props}/>
// );

export default class P404 extends React.Component {

  render() {
    return (
      <B.Col bgYellow>
        <B b f2 mb4>404</B>
        <B tc f4>Page not found :(</B>
      </B.Col>
    )
  }
}
