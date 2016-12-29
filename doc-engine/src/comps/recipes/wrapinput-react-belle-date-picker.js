import React from 'react'
import ReactDOM from 'react-dom'
import {Form, ReformContext, WrapInput} from 'react-reform'
import defaultValidators from 'react-reform/opt/validators'
import defaultTheme from '../default-theme'
import {DatePicker as RawDatePicker} from 'belle'
import 'react-date-picker/index.css'

const DatePicker = props => (
  <WrapInput type="DatePicker" directProps={props} focusFn={node => ReactDOM.findDOMNode(node).focus()}>{
    ({value, themeProps: {onChange, ...remainingThemeProps}}) => (
      <RawDatePicker value={value || null} onUpdate={e => onChange(e.value)} {...remainingThemeProps}/>
    )
  }</WrapInput>
)

export default class ExampleForm extends React.Component {

  handleSubmit = (data) => {
    console.log('data', data)
  }

  render() {
    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidators}>
        <div>
          <h4>Form</h4>
          <Form onSubmit={this.handleSubmit}>
            <DatePicker name="startDate" is-required/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
