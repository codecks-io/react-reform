import React from 'react'

import {Form, createTheme, ReformContext} from 'react-reform'
import {Text, Password} from 'react-reform/opt/inputs'
import defaultValidators from 'react-reform/opt/validators'

import {B, col} from 'comps/styles'
import {Input, BigButton} from 'comps/layouts'

const defaultTheme = createTheme({
  renderForm: (FormContainer, children, {globalErrors, directProps: {buttonLabel, noButton}, status}) => (
    <FormContainer>
      {globalErrors.length ? (
        globalErrors.map((error, i) => <B mb3 pink f5 key={i}>{error}</B>)
      ) : null}
      {children}
      {noButton ? (
        <BigButton disabled={status === 'pending'} display="none" type="submit"/>
      ) : (
        <B.Col hCenter>
          <BigButton disabled={status === 'pending'} type="submit">
            {buttonLabel || 'Submit'}
          </BigButton>
        </B.Col>
      )}
    </FormContainer>
  ),
  renderField: (Field, {directProps: {label, explanation, postfix}, validations, isTouched, isFocused, id, formStatus}) => {
    let errors = validations
      .filter(({isValid, name: errorType}) => ((isTouched || formStatus === 'preSubmitFail' || errorType === 'server') && isValid !== true))
      .map(({isValid, errorMessage, hintMessage, name: errorType}) => {
        if (isValid === false) return {message: errorMessage, name: errorType}
        if (isValid === true) return {message: hintMessage, name: errorType}
        return {message: isValid, name: errorType}
      })
    let reqError
    if ((reqError = errors.find(({name: errorType}) => errorType === 'required'))) errors = [reqError]
    return (
      <B mb4 key={id}>
        <B.Row component="label" b mb2 cursor="pointer" props={{htmlFor: id}} baseline>
          <B flexShrink="0">{label}</B>
          <B pink f6 ml3>{errors.map(({name, message}) => <B.I ml2 key={name}>{message}</B.I>)}</B>
        </B.Row>
        <B.Row vCenter>
          <Input component={Field} props={{id, disabled: formStatus === 'pending'}} width="100%" boxShadow={errors.length > 0 ? `0 0 0 2px ${col.pink}` : null}/>
          {postfix && <B ml1 f4 fw3>{postfix}</B>}
        </B.Row>
        {explanation && <B f6 white60 mv2 mh1>{explanation}</B>}
      </B>
    )
  },
  validationLabels: {
    minlength: {
      errorMessage: (val, {name, arg}) => `please use at least ${arg} characters`
    }
  }
})

const validations = {
  ...defaultValidators
}

export {
  ReformContext,
  validations,
  defaultTheme,
  Form,
  Text,
  Password
}
