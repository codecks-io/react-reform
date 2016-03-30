import React from "react";
import ReactDOM from "react-dom";
import Form from "react-reform";

import {Text, Checkbox, Password, Textarea, Select} from "react-reform/opt/inputs";
import bootstrapTheme from "react-reform/opt/theme-bootstrap";
import "react-reform/opt/validators";

require("./style.css");
require("bootstrap/dist/css/bootstrap.css");

export default class SimpleExample extends React.Component {

  state = {
    controlledModel: {name: "Daniel"}
  }

  handleFieldChange = (key, value) => {
    this.setState({controlledModel: {...this.state.controlledModel, [key]: value}});
  }

  handleSubmit = (values) => {
    console.log("submitted", values);
  }

  render() {
    return (
      <div>
        <h2>Uncontrolled Form</h2>
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

        <h2>Controlled Form</h2>
        <Form onSubmit={::this.handleSubmit} model={this.state.controlledModel} theme={bootstrapTheme} onFieldChange={this.handleFieldChange}>
          <Text name="name" label="Your Name" placeholder="name..." is-required/>
        </Form>
      </div>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  ReactDOM.render(<SimpleExample/>, appEl);
});
