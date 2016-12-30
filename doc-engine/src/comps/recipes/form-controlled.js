import React from 'react'
import {Form, ReformContext} from 'react-reform'
import defaultValidators from 'react-reform/opt/validators'
import {Text} from 'react-reform/opt/inputs'
import defaultTheme from '../default-theme'

export default class ExampleForm extends React.Component {

  state = {
    model: {firstName: null}
  }

  handleSubmit = (data) => {
    console.log('data', data)
  }

  handleFieldChange = (fieldName, value) => {
    this.setState({model: {...this.state.model, [fieldName]: value}})
  }

  render() {
    const {model} = this.state

    return (
      <ReformContext themes={{default: defaultTheme}} validations={defaultValidators}>
        <div>
          <h4>Hello {model.firstName || 'there'}!</h4>
          <Form model={model}
            onFieldChange={this.handleFieldChange}
            onSubmit={this.handleSubmit}
          >
            <Text name="firstName" label="First Name" is-required/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}
