import React from 'react'
import {Form, ReformContext, createTheme} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import {Text} from 'react-reform/opt/inputs'

const defaultTheme = createTheme({
  renderForm: (FormContainer, children, {submitForm, directProps: {button1, button2, ...remainingDirectProps}}) => (
    <FormContainer {...remainingDirectProps}>
      <div>{children}</div>
      <button onClick={e => submitForm(e, button1.data)} type={button1.type}>
        {button1.label}
      </button>
      <button onClick={e => submitForm(e, button2.data)} type={button2.type}>
        {button2.label}
      </button>
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

  handleSubmit = (data, event, buttonArgs) => {
    console.log('data', data, 'buttonArgs', buttonArgs)
  }
  render() {
    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidations}>
        <div>
          <h4>Form</h4>
          <Form onSubmit={this.handleSubmit}
            button1={{label: 'Send', type: 'button', data: {close: false}}}
            button2={{label: 'Send & Close', type: 'submit', data: {close: true}}}
          >
            <Text name="comment" isRequired/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
