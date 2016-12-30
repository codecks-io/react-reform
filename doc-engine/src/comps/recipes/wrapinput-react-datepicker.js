import React from 'react'
import {Form, ReformContext, WrapInput} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import defaultTheme from '../default-theme'
import RawDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DatePicker = props => (
  <WrapInput type="DatePicker" directProps={props} focusFn={node => node.setOpen.call(node, true)}>{
    ({value, themeProps}) => (
      <RawDatePicker selected={value} {...themeProps}/>
    )
  }</WrapInput>
)

export default class ExampleForm extends React.Component {

  handleSubmit = (data) => {
    console.log('data', data)
  }

  render() {
    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidations}>
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
