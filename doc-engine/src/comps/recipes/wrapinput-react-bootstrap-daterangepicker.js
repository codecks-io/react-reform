import React from 'react'
import {Form, ReformContext, WrapInput} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import defaultTheme from '../default-theme'
import RawDateRangePicker from 'react-bootstrap-daterangepicker'
import 'react-bootstrap-daterangepicker/css/daterangepicker.css'

const DateRangePicker = props => (
  <WrapInput type="DatePicker" directProps={props} focusFn={n => n.$picker.data('daterangepicker').show()}>{
    ({value, themeProps: {onChange, onFocus, onBlur, ...remainingThemeProps}}) => (
      <RawDateRangePicker
        startDate={(value && value.startDate) || undefined}
        endDate={(value && value.endDate) || undefined}
        onShow={onFocus}
        onHide={onBlur}
        onApply={(e, datePicker) => onChange({startDate: datePicker.startDate, endDate: datePicker.endDate})}
        {...remainingThemeProps}
      />
    )
  }</WrapInput>
)

export default class ExampleForm extends React.Component {

  handleSubmit = (data) => {
    console.log('data', data)
  }

  render() {
    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidations}>
        <div>
          <h4>Form</h4>
          <Form onSubmit={this.handleSubmit}>
            <DateRangePicker name="range" is-required>
              <button type="button">Open picker</button>
            </DateRangePicker>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
