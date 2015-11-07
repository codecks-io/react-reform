import React from "react";
import ReactDOM from "react-dom";
import {Form, wrapInput} from "react-reform";
import minimalTheme from "react-reform/opt/theme-minimal";
import "react-reform/opt/validators";

import DatePicker from "react-date-picker";
import "react-date-picker/index.css";

import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-daterangepicker/css/daterangepicker.css";

const WrappedDatePicker = wrapInput("DatePicker", DatePicker, {valueToProps: value => ({date: value})});

const WrappedDateRangePicker = wrapInput("DateRangePicker", DateRangePicker, {
  valueToProps: value => value ? ({startDate: value.startDate, endDate: value.endDate}) : {},
  propNameForOnChange: "onApply",
  extractValueFromOnChange: (e, picker) => ({startDate: picker.startDate, endDate: picker.endDate})
});

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
          <WrappedDateRangePicker name="range">
            <button type="button">Click Me To Open Picker!</button>
          </WrappedDateRangePicker>
        </Form>
      </div>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  ReactDOM.render(<CustomInputForm/>, appEl);
});
