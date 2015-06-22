import React from "react";
import {Form, Text} from "./index";

export default class MyComponent extends React.Component {
  static displayName = "MyComponent"
  static defaultProps = {initialCount: 0}

  state = {visible: true}

  handleSubmit(values) {
    console.log("compSubmit", values);
  }

  render() {
    const theme = (Fields, Button) => (// todo (Form, Fields, Button, {validations = {name: validations}})
      <form>
        <header>
          <button type="button" onClick={() => React.findDOMNode(this.refs.name).focus()}>focus</button>
        </header>
        <Fields>
          {(Field, {label, validations}) => {// isTouched, isDirty, isFocused, hasFailedToSubmit
            const hasError = validations.some(({isValid}) => !isValid);
            return (
              <div>
                <label>{label} {hasError ? "Error" : null}</label>
                <Field className="unvalidated"/>
              </div>
            );
          }}
        </Fields>
        <footer>
          <Button>Submit</Button>
          <Button close>Submit and Close</Button>
        </footer>
      </form>
    );
    return (
      <div>
      <button onClick={() => this.setState(({visible}) => ({visible: !visible}))}>toggle</button>
        <Form onSubmit={::this.handleSubmit} initialData={{name: "Daniel", email: "em@il"}} theme={theme}>
          <Text name="name" label="Your Name" placeholder="name..." is-required ref="name"/>
          <Text name="email" label="Your Email" placeholder="your email" is-required is-email/>
          {this.state.visible ? <Text name="foo"/> : null}
        </Form>
      </div>
    );
  }
}
