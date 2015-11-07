import React from "react";
import ReactDOM from "react-dom";
import {Form, wrapInput} from "react-reform";
import minimalTheme from "react-reform/opt/theme-minimal";
import "react-reform/opt/validators";

import DatePicker from "react-date-picker";
import "react-date-picker/index.css";

const WrappedDatePicker = wrapInput("DatePicker", DatePicker, {valueToProps: value => ({date: value})});

export default class CustomInputForm extends React.Component {

  handleSubmit(values) {
    console.log("submitted", values);
  }

  render() {

    return (
      <div>
        <h2>Custom Input</h2>
        <Form onSubmit={::this.handleSubmit} theme={minimalTheme}>
          <WrappedDatePicker name="birthday" is-required maxDate={new Date()}/>
        </Form>
      </div>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  ReactDOM.render(<CustomInputForm/>, appEl);
});
