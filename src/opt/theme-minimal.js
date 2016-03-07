import React from "react";

export default (FormContainer, Fields, {globalErrors, submitForm, status}) => (
  <FormContainer>
    {globalErrors.length ? (
      globalErrors.map((error, i) => (
        <div key={i} style={{color: "red"}}>{error}</div>
      ))
    ) : null}
    <Fields>
      {(Field, {label, validations, isTouched, fieldProps, id}) => {
        const validationList = validations
          .filter(({isValid}) => fieldProps.showHints || ((isTouched || status === "preSubmitFail") && isValid !== true))
          .map(({isValid, errorMessage, hintMessage, type}) => {
            if (isValid === false) return {message: errorMessage, type};
            if (isValid === true) return {message: hintMessage, type};
            return {message: isValid, type};
          })
          .map(({type, message}) => <span key={type} style={{color: "red"}}>{message}</span>);
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <Field id={id}/>
            {validationList}
          </div>
        );
      }}
    </Fields>
    <button>Submit</button>
  </FormContainer>
);
