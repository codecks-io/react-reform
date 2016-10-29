import React from 'react'
import {render} from 'react-dom'
import {Form, ReformContext, createTheme, WrapInput} from 'react-reform'

const themes = {
  'default': createTheme({
    renderForm: (FormContainer, children, {directProps, isValid}) => (
      <FormContainer style={{background: isValid ? 'green' : 'red', ...directProps.style}}>
        <div>{children}</div>
        <button>{directProps.buttonLabel || 'Submit'}</button>
      </FormContainer>
    ),
    renderField: (Field, {directProps, name, isFocused}) => (
      <div>
        <label>{directProps.label || name}</label>
        <Field style={{background: isFocused ? 'lightgreen' : 'yellow'}} {...directProps}/>
      </div>
    )
  })
}

const validations = {
  required: {
    isValid: (val) => val === 0 || (!!val && (typeof val !== 'string' || val.trim().length > 0))
  }
}

const MyInput = props => (
  <WrapInput {...props}>{({value, listeners: {onChange, ...restListeners}, themeProps}) => (
    <input type="text" value={value || ''} {...themeProps} onChange={e => onChange(e.target.value)} {...restListeners}/>
  )}</WrapInput>
)


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
            <MyInput name="name" label="Name"/>
            <MyInput name="name2" label="Name2*" is-required/>
          </Form>
          <h1>Controlled</h1>
          <Form onSubmit={this.handleAsyncSubmit} model={this.state.model} onFieldChange={(key, val) => this.setState({model: {...this.state.model, [key]: val}})}>
            <MyInput name="name" label="Name"/>
            <MyInput name="name2" label="Name2*" is-required/>
          </Form>
        </div>
      </ReformContext>
    )
  }
}

render(<App/>, document.getElementById('app'))