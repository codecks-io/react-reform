import React from 'react'
import {createTheme} from 'react-reform'

export default createTheme({
  renderForm: (FormContainer, children, {directProps}) => (
    <FormContainer {...directProps}>
      <div>{children}</div>
      <button>Submit</button>
    </FormContainer>
  ),
  renderField: (Field, {directProps: {label, ...remainingDirectProps}, name, validations, id}) => {
    const errors = validations
      .filter(({isValid}) => isValid === false)
      .map(({errorMessage, name}) => <span key={name}>{errorMessage} </span>)
    return (
      <div>
        <label htmlFor={id}>{label || name}</label>
        <Field id={id} {...remainingDirectProps}/>
        {errors.length > 0 && <span>{errors}</span>}
      </div>
    )
  }
})
