import React from 'react'
import {Form, ReformContext, WrapInput} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import defaultTheme from '../default-theme'

const DatePicker = props => (
  <WrapInput type="DatePicker" directProps={props}>{
    ({value, themeProps: {onChange, onFocus, onBlur, ref, ...remainingThemeProps}}) => (
      <div {...remainingThemeProps}>
        <input type="number" value={(value && value.day) || ''}
          onChange={e => onChange({...value, day: e.target.value})}
          onFocus={onFocus} onBlur={onBlur} ref={ref}
          placeholder="day" style={{width: '3em'}}
        />
        <select value={(value && value.month) || ''}
          onChange={e => onChange({...value, month: e.target.value})}
          onFocus={onFocus} onBlur={onBlur}
        >
          {'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ').map((m, i) => (
            <option value={i + 1} key={i}>{m}</option>
          ))}
        </select>
        <input type="number" value={(value && value.year) || ''}
          onChange={e => onChange({...value, year: e.target.value})}
          onFocus={onFocus} onBlur={onBlur}
          placeholder="year" style={{width: '4em'}}
        />
      </div>
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
            <DatePicker name="startDate" isRequired/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
