import React from "react";
import Form from "react-themed-forms";

import {Text, Checkbox, Password, Textarea, Select} from "react-themed-forms/opt/inputs";
import "react-themed-forms/opt/validators";

// require("normalize.css/normalize.css");
require("./style.css");

export default class SimpleExample extends React.Component {
  static displayName = "SimpleExample"

  handleSubmit(values) {
    console.log("submitted", values);
  }

  render() {
    const theme = (FormContainer, Fields, {globalErrors, submitForm}) => (// todo (Form, Fields, Button, {validations = {name: validations}})
      <FormContainer className="innerFormClass">
        {globalErrors.length ? (
          globalErrors.map((error, i) => <div key={i}>{error}</div>)
        ) : null}
        <Fields>
          {/* validations = [{type: "required", isValid: true|false|"pending", hintMessage: "is required", errorMessage: "..."}] */}
          {(Field, {label, validations, isDirty, isTouched, isFocused, hasFailedToSubmit, fieldProps}) => {// isTouched, isDirty, isFocused, hasFailedToSubmit
            const hasError = validations.some(({isValid}) => isValid !== true);
            return (
              <div>
                <label>{label} {hasError ? "Error" : null}</label>
                <Field/>
                dirty: {isDirty ? "true" : "false"}
                {" "}touched: {isTouched ? "true" : "false"}
                {" "}focused: {isFocused ? "true" : "false"}
                {" "}failed? {hasFailedToSubmit ? "true" : "false"}
                <small>{fieldProps["custom-hint"]}</small>
              </div>
            );
          }}
        </Fields>
        <footer>
          <button>Submit</button>
          <button type="button" close onClick={e => submitForm(e, "closing")}>Submit and Close</button>
        </footer>
      </FormContainer>
    );

    return (
      <Form onSubmit={::this.handleSubmit} initialData={{name: "Daniel", email: "em@il", date: "2015-06-18", fruit: "apple"}} theme={theme}>
        <Text name="name" label="Your Name" placeholder="name..." is-required/>
        <Text name="email" label="Your Email" placeholder="your email" is-required is-email/>
        <Password name="password" placeholder="your password" is-required/>
        <Textarea name="content" placeholder="Enter your Text here" is-required/>
        <Select name="fruit">
          {["apple", "banana", "pear"].map(fruit => <option key={fruit}>{fruit}</option>)}
        </Select>
        <Checkbox name="foo" is-required/>
      </Form>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  React.render(<SimpleExample/>, appEl);
});
