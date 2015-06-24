import React from "react";
import {Form, Text, DatePicker, Checkbox} from "./index";

export default class MyComponent extends React.Component {
  static displayName = "MyComponent"
  static defaultProps = {initialCount: 0}

  state = {visible: true}

  handleSubmit(values) {
    console.log("submit", values);
    return new Promise(function(resolve, reject) {
      setTimeout(reject("not yet implemented"));
    });
  }

  render() {
    const theme = (FormContainer, Fields, {globalErrors, submitForm}) => (// todo (Form, Fields, Button, {validations = {name: validations}})
      <FormContainer className="innerFormClass">
        <header>
          <button type="button" onClick={() => React.findDOMNode(this.refs.name).focus()}>focus</button>
        </header>
        {globalErrors.length ? (
          globalErrors.map((error, i) => <div key={i}>{error}</div>)
        ) : null}
        <Fields>
          {/* validations = [{type: "required", isValid: true|false|"pending", hintMessage: "is required", errorMessage: "..."}] */}
          {(Field, {label, validations, isDirty, isTouched, isFocused, hasFailedToSubmit}) => {// isTouched, isDirty, isFocused, hasFailedToSubmit
            const hasError = validations.some(({isValid}) => isValid !== true);
            return (
              <div>
                <label>{label} {hasError ? "Error" : null}</label>
                <Field/>
                dirty: {isDirty ? "true" : "false"}
                {" "}touched: {isTouched ? "true" : "false"}
                {" "}focused: {isFocused ? "true" : "false"}
                {" "}failed? {hasFailedToSubmit ? "true" : "false"}
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
      <div>
      <button onClick={() => this.setState(({visible}) => ({visible: !visible}))}>toggle</button>
        <Form onSubmit={::this.handleSubmit} initialData={{name: "Daniel", email: "em@il", date: "2015-06-18"}} theme={theme}>
          <Text name="name" label="Your Name" placeholder="name..." is-required is-unique ref="name"/>
          <Text name="email" label="Your Email" placeholder="your email" is-required is-email/>
          {this.state.visible ? <Checkbox name="foo" is-required/> : null}
          <DatePicker name="date" label="date" is-required/>
        </Form>
      </div>
    );
  }
}
