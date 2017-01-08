import renderer from 'react-test-renderer'
import React from 'react'
import {Form, ReformContext, createTheme} from '../index'
import defaultValidations from '../opt/validations'
import {Text} from '../opt/inputs'

test('It doesn\'t explode when rendering a basic form', () => {

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


  const component = renderer.create(
    <ReformContext themes={{default: defaultTheme}} validations={defaultValidations}>
      <div>
        <Form onSubmit={() => {}} buttonLabel="Custom button text">
          <Text name="field1" isRequired/>
        </Form>
      </div>
    </ReformContext>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
