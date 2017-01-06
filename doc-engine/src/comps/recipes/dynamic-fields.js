import React from 'react'
import {Form, ReformContext, createTheme} from 'react-reform'
import defaultValidations from 'react-reform/opt/validations'
import {Text, Textarea, Select} from 'react-reform/opt/inputs'

const defaultTheme = createTheme({
  renderForm: (FormContainer, children, {directProps}) => (
    <FormContainer {...directProps}>
      <div>{children}</div>
      <button>Submit</button>
    </FormContainer>
  ),
  renderField: (Field, {directProps, name, validations, id}) => {
    const errors = validations
      .filter(({isValid}) => isValid === false)
      .map(({errorMessage, name}) => <span key={name}>{errorMessage} </span>)
    return (
      <div style={{marginBottom: 15}}>
        <label htmlFor={id}>{name}</label>
        <Field id={id} style={{display: 'block'}} {...directProps}/>
        {errors.length > 0 && <span>{errors}</span>}
      </div>
    )
  }
})

export default class ExampleForm extends React.Component {

  state = {model: {
    formVariant: 'one',
    changingMinlength: 'inital',
    withinInFormVariant1: null,
    withinInFormVariant2: null
  }}

  handleSubmit = (data) => {
    console.log('data', data)
  }

  handleFieldChange = (fieldName, value) => {
    this.setState({model: {...this.state.model, [fieldName]: value}})
  }

  render() {
    const {model} = this.state
    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidations}>
        <div>
          <h4>Form</h4>
          <Form onSubmit={this.handleSubmit} model={model}
            onFieldChange={this.handleFieldChange}
          >
            <Select name="formVariant">
              <option value="one">Variant one</option>
              <option value="two">Variant two</option>
            </Select>
            <Text name="changingMinlength" hasMinlength={model.formVariant === 'one' ? 10 : 20}/>
            {model.formVariant === 'one' ? (
              <Textarea rows={5} name="withinInFormVariant1" isRequired/>
            ) : (
              <Text name="withinInFormVariant2" isEmail/>
            )}
          </Form>
        </div>
      </ReformContext>
    )
  }
}
