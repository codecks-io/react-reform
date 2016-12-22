import React from 'react'
import {B} from 'comps/styles'
import {Link as RRLink} from 'react-router'

export const RawButton = ({onClick, to, href, disabled, type = to || href ? undefined : 'button', props, ...rest}) => (
  <B component={to ? RRLink : href ? 'a' : 'button'} props={{onClick, type, to, href, disabled, ...props}} {...rest} cursor="pointer"/>
)
export const PlainLink = ({href, to, target, props, nofollow, ...rest}) => (
  <B.I component={to ? RRLink : 'a'} props={{...props, to, href, target, rel: nofollow ? 'nofollow' : undefined}} transitionProperty="color" {...rest}/>
)

export const BigButton = (props) => (
  <RawButton {...props}/>
)

export const Input = (props) => (
  <input type="text" {...props}/>
)
