import React from "react";
import Form from "react-reform";

import {Text, Checkbox, Password, Textarea, Select} from "react-reform/opt/inputs";
import bootstrapTheme from "react-reform/opt/theme-bootstrap";
import "react-reform/opt/validators";

require("./style.css");
require("bootstrap/dist/css/bootstrap.css");

export default class SimpleExample extends React.Component {
  static displayName = "SimpleExample"

  handleSubmit(values) {
    console.log("submitted", values);
  }

  render() {
    return (
      <Form onSubmit={::this.handleSubmit} initialModel={{name: "Daniel", email: "em@il", fruit: "apple", foo: false}} theme={bootstrapTheme}>
        <Text name="name" label="Your Name" placeholder="name..." is-required/>
        <Text name="email" label="Your Email" placeholder="your email" is-required is-email/>
        <Password name="password" placeholder="your password" is-required/>
        <Textarea name="content" placeholder="Enter your Text here" is-required/>
        <Select name="fruit">
          {["apple", "banana", "pear"].map(fruit => <option key={fruit}>{fruit}</option>)}
        </Select>
        <hr/>
        <Checkbox name="foo" is-required/>
      </Form>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  React.render(<SimpleExample/>, appEl);
});
