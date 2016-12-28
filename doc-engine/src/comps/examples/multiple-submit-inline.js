import React from 'react'
import {Form, ReformContext, createTheme} from 'react-reform'
import defaultValidators from 'react-reform/opt/validators'
import {Text} from 'react-reform/opt/inputs'

const defaultTheme = createTheme({
  renderForm: (FormContainer, children, {directProps: {noButton, ...remainingDirectProps}}) => (
    <FormContainer {...remainingDirectProps}>
      <div>{children}</div>
      {!noButton && <button>Submit</button>}
    </FormContainer>
  ),
  renderField: (Field, {directProps, name, isFocused, validations, id}) => {
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

  handleSendClick = () => {
    this.formNode.handleSubmit('noClose')
  }

  handleSubmit = (data, event) => {
    console.log('data', data, 'close', event !== 'noClose')
  }
  render() {
    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidators}>
        <div>
          <h4>Form</h4>
          <Form onSubmit={this.handleSubmit} noButton ref={node => this.formNode = node}>
            <Text name="comment" is-required/>
            <div>
              <button type="button" onClick={this.handleSendClick}>Send</button>
              <button type="submit">Send & Close</button>
            </div>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
