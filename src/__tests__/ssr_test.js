import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Form, ReformContext, createTheme} from '../index'
import defaultValidations from '../opt/validations'
import {Text} from '../opt/inputs'

test('It does not throw errors when server side rendering', () => {

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


  return new Promise((res, rej) => {
    console.error = jest.fn(e => console.log('mocked:', e))
    ReactDOMServer.renderToString(
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidations}>
        <div>
          <Form onSubmit={() => {}} buttonLabel="Custom button text">
            <Text name="field1" isRequired/>
          </Form>
        </div>
      </ReformContext>
    )
    setTimeout(() => {
      expect(console.error).not.toHaveBeenCalled()
      res()
    })
  })
})
