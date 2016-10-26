import React from 'react'
import {render} from 'react-dom'
import {Form, ReformContext, createTheme, WrapInput} from 'react-reform'

const themes = {
  "default": createTheme({
    renderForm: (FormContainer, children, {directProps, isValid}) => (
      <FormContainer style={{background: isValid ? "green" : "red", ...directProps.style}}>
        <div>{children}</div>
        <button>{directProps.buttonLabel || "Submit"}</button>
      </FormContainer>
    ),
    renderField: (Field, {directProps, name}) => (
      <div>
        <label>{directProps.label || name}</label>
        <Field style={{background: "yellow"}} {...directProps}/>
      </div>
    )
  })
}

const validations = {
  required: {
    isValid: (val) => val === 0 || !!val && (typeof val !== "string" || val.trim().length > 0)
  }
}

const MyInput = props => (
  <WrapInput {...props}>{({value, listeners: {onChange, ...restListeners}, themeProps}) => (
    <input type="text" value={value || ""} {...themeProps} onChange={e => onChange(e.target.value)} {...restListeners}/>
  )}</WrapInput>
)


class App extends React.Component {

  handleSubmit = (data) => {
    console.log("data", data)
  }

  render() {
    return (
      <ReformContext themes={themes} validations={validations}>
        <Form onSubmit={this.handleSubmit} style={{color: "yellow"}} initialModel={{name: null}} buttonLabel="Yo!">
          <MyInput name="name" label="Name"/>
          <MyInput name="name2" label="Name2*" is-required/>
        </Form>
      </ReformContext>
    )
  }
}

render(<App/>, document.getElementById('app'))