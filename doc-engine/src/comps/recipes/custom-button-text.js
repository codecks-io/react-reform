import React from 'react'
import {Form, ReformContext, createTheme} from 'react-reform'
import defaultValidators from 'react-reform/opt/validators'
import {Text} from 'react-reform/opt/inputs'

const defaultTheme = createTheme({
  renderForm: (FormContainer, children, {directProps: {buttonLabel = 'Submit', ...remainingDirectProps}}) => (
    <FormContainer {...remainingDirectProps}>
      <div>{children}</div>
      <button>{buttonLabel}</button>
    </FormContainer>
  ),
  renderField: (Field, {directProps, name, validations, id}) => {
    const errors = validations
      .filter(({isValid}) => isValid === false)
      .map(({errorMessage, name}) => <span key={name}>{errorMessage} </span>)
    return (
      <div>
        <label htmlFor={id}>{name}</label>
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
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidators}>
        <div>
          <h4>Form</h4>
          <Form onSubmit={this.handleSubmit} buttonLabel="Custom button text">
            <Text name="field1" is-required/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
