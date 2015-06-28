import React from "react";
import classNames from "classnames";

export default (FormContainer, Fields, {globalErrors, submitForm}) => (
  <FormContainer>
    <Fields>
      {/* validations = [{type: "required", isValid: true|false|"pending", hintMessage: "is required", errorMessage: "..."}] */}
      {(Field, {label, type, validations, isTouched, isFocused, hasFailedToSubmit, fieldProps, id}) => {
        const hasError = validations.some(({isValid}) => isValid === false);
        const showError = (isTouched || hasFailedToSubmit) && !isFocused && hasError;
        const showWarning = isFocused && hasError;

        const validationList = validations
          .filter(({isValid}) => fieldProps.showHints || ((isTouched || hasFailedToSubmit) && isValid !== true))
          .map(({isValid, errorMessage, hintMessage, type: valType}) => {
            if (isValid === false) return {message: errorMessage, valType};
            if (isValid === true) return {message: hintMessage, valType};
            return {message: isValid, valType};
          })
          .map(({valType, message}) => <span key={valType} className="help-block">{message}</span>);

        if (type === "Checkbox") {
          return (
            <div className={classNames("checkbox", {"has-error": showError, "has-warning": showWarning})}>
              <label htmlFor={id}>
                <Field id={id}/> {label}
              </label>
              {validationList}
            </div>
          );
        } else {
          return (
            <div className={classNames("form-group", {"has-error": showError, "has-warning": showWarning})}>
              <label className="control-label" htmlFor={id}>{label}</label>
              <Field className="form-control" id={id}/>
              {validationList}
            </div>
          );
        }
      }}
    </Fields>
    <footer>
      {globalErrors.length ? (
        globalErrors.map((error, i) => (
          <div key={i} className="alert alert-danger">{error}</div>
        ))
      ) : null}
      <button className="btn btn-default">Submit</button>
    </footer>
  </FormContainer>
);
