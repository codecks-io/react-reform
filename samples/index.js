import React from 'react'
import {render} from 'react-dom'
import {Form, ReformContext, createTheme} from 'react-reform'
import {Text, Checkbox, Select} from 'react-reform/opt/inputs'

const themes = {
  'default': createTheme({
    renderForm: (FormContainer, children, {directProps, isValid}) => (
      <FormContainer style={{background: isValid ? 'green' : 'red', ...directProps.style}}>
        <div>{children}</div>
        <button>{directProps.buttonLabel || 'Submit'}</button>
      </FormContainer>
    ),
    renderField: (Field, {directProps, name, isFocused, validations, id}) => {
      const errors = validations.filter(({isValid}) => isValid === false).map(({errorMessage, name}) => <span key={name}>{errorMessage}, </span>)
      return (
        <div>
          <label htmlFor={id}>{directProps.label || name}{errors}</label>
          <Field id={id} style={{background: isFocused ? 'lightgreen' : 'yellow'}} {...directProps}/>
        </div>
      )
    },
    validationLabels: {
      required: {
        errorMessage: (val, {name, arg}) => `'${name}' is really required`
      }
    }
  })
}

const validations = {
  required: {
    isValid: (val) => val === 0 || (!!val && (typeof val !== 'string' || val.trim().length > 0)),
    errorMessage: (val, {name, arg}) => `'${name}' is required`
  },
  unique: () => {
    const data = {}
    return {
      isValid: (val, args, askAgain) => {
        if (!val) return true
        if (data[val] === undefined) {
          data[val] = 'pending'
          setTimeout(() => {data[val] = false; askAgain()}, 1000)
        }
        return data[val]
      },
      errorMessage: (val, {name, arg}) => `'${name}' has to be unique. '${val}' isn't`
    }
  }
}


class App extends React.Component {

  state = {
    model: {name: 'me'}
  }

  handleSubmit = (data) => {
    console.log('data', data)
  }

  handleAsyncSubmit = (data) => {
    console.log('processing', data)
    return new Promise((resolve, reject) => {
      setTimeout(() => reject({name: 'bad'}) ,1000)
    })
  }

  render() {
    return (
      <ReformContext themes={themes} validations={validations}>
        <div>
          <h1>Uncontrolled</h1>
          <Form onSubmit={this.handleSubmit} style={{color: 'yellow'}} initialModel={{name: null}} buttonLabel="Yo!">
            <Text name="name" label="Name" is-unique/>
            <Text name="name2" label="Name2*" is-required/>
          </Form>
          <h1>Controlled</h1>
          <Form onSubmit={this.handleAsyncSubmit} model={this.state.model} onFieldChange={(key, val) => this.setState({model: {...this.state.model, [key]: val}})}>
            <Text name="name" label="Name"/>
            <Text name="name2" label="Name2*" is-required/>
            <Select name="fruit" label="favourite fruit">
              <option value="orange">Orange</option>
              <option value="apple">Apple</option>
              <option value="tomato">Tomato</option>
            </Select>
            <Checkbox name="readTos" label="I've read this" is-required/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}

render(<App/>, document.getElementById('app'))