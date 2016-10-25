import React from 'react'
import {render} from 'react-dom'
import {Form, ReformContext, createTheme} from 'react-reform'

const themes = {
  "default": createTheme({
    renderForm: (FormContainer, children, {themeProps, formProps}) => (
      <FormContainer style={{background: "red", ...formProps.style}}>
        <div>{children}</div>
        <button>{themeProps.buttonLabel || "Submit"}</button>
      </FormContainer>
    ),
    renderField: (Field, {label}) => (
      <div>
        <label>{label}</label>
        <Field/>
      </div>
    )
  })
}



class App extends React.Component {

  handleSubmit = (data) => {
    console.log("data", data)
  }

  render() {
    return (
      <ReformContext themes={themes}>
        <Form onSubmit={this.handleSubmit} style={{color: "yellow"}}>App</Form>
      </ReformContext>
    )
  }
}

render(<App/>, document.getElementById('app'))