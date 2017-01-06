import React from 'react'
import {Form, ReformContext, createTheme} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import {Text} from 'react-reform/opt/inputs'

const defaultTheme = createTheme({
  renderForm: (FormContainer, children, {directProps}) => (
    <FormContainer {...directProps}>
      <div>{children}</div>
      <button>Submit</button>
    </FormContainer>
  ),
  renderField: (Field, {directProps, name, validations, id}) => {
    const errors = validations
      .filter(({isValid}) => isValid === false)
      .map(({errorMessage, name}) => <span key={name}>{errorMessage} </span>)
    const isRequired = validations.some(({name}) => name === 'required')
    return (
      <div>
        <label htmlFor={id}>{name}{isRequired && '*'}</label>
        <Field id={id} {...directProps}/>
        {errors.length > 0 && <span>{errors}</span>}
      </div>
    )
  }
})

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
            <Text name="required-name" isRequired/>
            <Text name="optional-name"/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
