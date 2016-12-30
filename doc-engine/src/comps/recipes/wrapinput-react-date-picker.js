import React from 'react'
import {Form, ReformContext, WrapInput} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import defaultTheme from '../default-theme'
import {DateField} from 'react-date-picker'
import 'react-date-picker/index.css'

const DatePicker = props => (
  <WrapInput type="DatePicker" directProps={props}>{
    ({value, themeProps}) => (
      <DateField value={value || null} {...themeProps}/>
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
          <Form onSubmit={this.handleSubmit} style={{paddingBottom: 300}}>
            <DatePicker name="startDate" dateFormat="DD-MM-YYYY" is-required/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
