import React from 'react'
import {createTheme} from 'react-reform'

export default createTheme({
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
    return (
      <div>
        <label htmlFor={id}>{name}</label>
        <Field id={id} {...directProps}/>
        {errors.length > 0 && <span>{errors}</span>}
      </div>
    )
  }
})
