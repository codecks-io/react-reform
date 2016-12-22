import React from 'react'
import {Flex, Block, InlineBlock} from 'glamor/jsxstyle'
import ta from './tachyons-styles'
import colors from './colors'

/* eslint-disable guard-for-in */
const inlineTa = (props) => {
  const result = {}
  for (let prop in props) {
    if (ta.hasOwnProperty(prop)) {
      if (!props[prop]) continue
      const tas = ta[prop]
      for (let taProp in tas) result[taProp] = tas[taProp]
    } else {
      result[prop] = props[prop]
    }
  }
  return result
}

export const col = colors

export const B = (props) => <Block {...inlineTa(props)}/>

B.I = (props) => <InlineBlock {...inlineTa(props)}/>

B.Col = class extends React.Component {

  render() {
    const {left, right, hCenter, stretch, top, bottom, vCenter, ...rest} = this.props
    rest.flexDirection = 'column'
    if (left) rest.alignItems = 'flex-start'
    if (right) rest.alignItems = 'flex-end'
    if (hCenter) rest.alignItems = 'center'
    if (stretch) rest.alignItems = 'stretch'
    if (top) rest.justifyContent = 'flex-start'
    if (bottom) rest.justifyContent = 'flex-end'
    if (vCenter) rest.justifyContent = 'center'
    return (
      <Flex {...inlineTa(rest)}></Flex>
    )
  }
}

B.Row = class extends React.Component {

  render() {
    const {left, right, hCenter, spaceBetween, spaceAround, top, bottom, vCenter, baseline, ...rest} = this.props
    if (baseline) rest.alignItems = 'baseline'
    if (left) rest.justifyContent = 'flex-start'
    if (right) rest.justifyContent = 'flex-end'
    if (hCenter) rest.justifyContent = 'center'
    if (spaceBetween) rest.justifyContent = 'space-between'
    if (spaceAround) rest.justifyContent = 'space-around'

    if (top) rest.alignItems = 'flex-start'
    if (bottom) rest.alignItems = 'flex-end'
    if (vCenter) rest.alignItems = 'center'
    if (baseline) rest.alignItems = 'baseline'
    return (
      <Flex {...inlineTa(rest)}></Flex>
    )
  }
}
