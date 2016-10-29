import React from 'react'
import {WrapInput} from '../'


// the `type={typeName}` allows to differentiate between different input types
// by reading the `wrapperProps.type` within your `renderField` definition
// PS: there's nothing special about the `type` prop. Any prop you define here will
// automatically show up within the `wrapperProps`

export const simpleInputWrapper = (typeName, Comp, {defaultProps, extractValueFromOnChange = (value => value)}) => (
  props => (
    <WrapInput type={typeName} directProps={props}>{({value, listeners: {onChange, ...restListeners}, themeProps, registerFocusNode}) => (
      <Comp {...defaultProps} value={value || ''} {...themeProps} onChange={e => onChange(extractValueFromOnChange(e))} {...restListeners} ref={registerFocusNode}/>
    )}</WrapInput>
  )
)

export const Text = simpleInputWrapper('Text', 'input', {defaultProps: {type: 'text'}, extractValueFromOnChange: e => e.target.value})
export const Textarea = simpleInputWrapper('Textarea', 'textarea', {extractValueFromOnChange: e => e.target.value})
export const Password = simpleInputWrapper('Password', 'input', {defaultProps: {type: 'password'}, extractValueFromOnChange: e => e.target.value})
export const Select = simpleInputWrapper('Select', 'select', {extractValueFromOnChange: e => e.target.value})
export const Checkbox = props => (
  <WrapInput type="Checkbox" directProps={props}>{({value, listeners: {onChange, ...restListeners}, themeProps, registerFocusNode}) => (
    <input type="checkbox" value={value || false} {...themeProps} onChange={e => onChange(e.target.checked)} {...restListeners} ref={registerFocusNode}/>
  )}</WrapInput>
)
