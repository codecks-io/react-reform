import React from "react";
import {Form, registerTheme} from "react-themed-forms";

import {Text} from "react-themed-forms/opt/inputs";
import bootstrapTheme from "react-themed-forms/opt/theme-bootstrap";
import "react-themed-forms/opt/validators";

require("bootstrap/dist/css/bootstrap.css");

registerTheme("default", bootstrapTheme);
registerTheme("myTheme", (FormContainer, Fields, {globalErrors}) => (
  <FormContainer className="my-form-class">
    {globalErrors.length ? (
      globalErrors.map((error, i) => <div key={i}>{error}</div>)
    ) : null}
    <Fields>
      {(Field, {label, validations, fieldProps}) => {
        const hasError = validations.some(({isValid}) => isValid !== true);
        return (
          <div>
            <label>{label} {hasError ? <span style={{color: "red"}}>Error</span> : null}</label>
            <Field/>
            {fieldProps["custom-hint"] ? <small>{fieldProps["custom-hint"]}</small> : null}
          </div>
        );
      }}
    </Fields>
    <footer>
      <button>Submit</button>
    </footer>
  </FormContainer>
));

export default class SimpleExample extends React.Component {
  static displayName = "SimpleExample"

  handleSubmit(values) {
    console.log("submitted", values);
  }

  render() {

    const customTheme = (FormContainer, Fields, {globalErrors, submitForm}) => (
      <FormContainer>
        {globalErrors.length ? (
          globalErrors.map((error, i) => <div key={i}>{error}</div>)
        ) : null}
        <Fields>
          {(Field, {label, validations, fieldProps}) => {
            const hasError = validations.some(({isValid}) => isValid !== true);
            return (
              <div>
                <label>{label}</label>
                <Field onBlur={fieldProps.submitOnBlur ? submitForm : undefined}/>
                {hasError ? <span style={{color: "red"}}>Error</span> : null}
              </div>
            );
          }}
        </Fields>
      </FormContainer>
    );

    return (
      <div>
        <h2>Default theme</h2>
        <Form onSubmit={::this.handleSubmit}>
          <Text name="name" label="Your Name" placeholder="name..." is-required/>
        </Form>

        <h2>My theme</h2>
        <Form onSubmit={::this.handleSubmit} theme="myTheme">
          <Text name="name" label="Your Name" placeholder="name..." is-required/>
        </Form>

        <h2>Custom theme</h2>
        <p>(enabling submit on blur)</p>
        <Form onSubmit={::this.handleSubmit} theme={customTheme}>
          <Text name="name" label="Your Name" placeholder="name..." is-required submitOnBlur dontFocusAfterFail/>
        </Form>
      </div>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  React.render(<SimpleExample/>, appEl);
});
