import React from 'react'
import {Scaffold, H1, H2, SubH1, Code, P, Section} from 'comps/layouts'

export default class GettingStarted extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb1>Getting Started</H1>
        <SubH1>Learn about the essential pieces of React Reform</SubH1>
        <Section>
          <H2 mb3>Install</H2>
          <P>Add React Reform to your application via</P>
          <Code>npm install react-reform</Code>
        </Section>
        <Section>
          <H2 mb3>Create your first theme</H2>
          <P>Use the <Code.Inline>createTheme</Code.Inline> method and define how your form body and each field should be rendered</P>
          <Code>{`
            import {createTheme} from 'react-reform'

            const defautTheme = createTheme({

              renderForm: (FormContainer, children, {directProps, isValid}) => (
                <FormContainer
                  style={{background: isValid ? 'green' : 'red', ...directProps.style}}
                >
                  <div>{children}</div>
                  <button>{directProps.buttonLabel || 'Submit'}</button>
                </FormContainer>
              ),

              renderField: (Field, {directProps, name, isFocused, validations, id}) => {
                const errors = validations
                  .filter(({isValid}) => isValid === false)
                  .map(({errorMessage, name}) => <span key={name}>{errorMessage}, </span>)
                return (
                  <div>
                    <label htmlFor={id}>
                      {directProps.label || name}
                      {!isFocused && errors}
                    </label>
                    <Field id={id}
                      style={{background: isFocused ? 'lightgreen' : 'yellow'}}
                      {...directProps}
                    />
                  </div>
                )

            })
          `}</Code>
        </Section>
        <Section>
          <H2 mb3>Create custom validations</H2>
          <P>Let's add a <Code.Inline>validTag</Code.Inline> validation to the default validations like e.g. <Code.Inline>required</Code.Inline> or <Code.Inline>maxlength</Code.Inline>.</P>
          <Code>{`
            import defaultValidations from 'react-reform/opt/validations'

            const validations = {
              ...defaultValidations,

              validTag: {
                isValid: val => /#\\W+/.test(val),
                errorMessage: val => \`'\${val}' is not a valid tag!\`
              }
            }

          `}</Code>
        </Section>
        <Section>
          <H2 mb3>Make your app aware of your themes and validations</H2>
          <P>React Reform uses react's context to propagate what themes and validations you have enabled for your app.</P>
          <P>Therefore you need to wrap your root component with the <Code.Inline>{'<ReformContext>'}</Code.Inline> Component like so.</P>
          <Code>{`
            import React, {Component} from 'react'
            import {render} from 'react-dom'
            import {ReformContext} from 'react-reform'

            const themes = {default: defaultTheme};

            class App extends Component {

              render() {
                return (
                  <ReformContext themes={themes} validations={validations}>
                    <div>
                      ...Your App Code...
                    </div>
                  </ReformContext>
                )
              }
            }

            render(<App/>, document.getElementById('root'))
          `}</Code>
        </Section>

        <Section>
          <H2 mb3>Let's write our first form</H2>
          <P>Now that the basics are set up, enjoy writing your forms with very little boilerplate!</P>
          <Code>{`
            import React, {Component} from 'react'
            import {Form} from 'react-reform'
            import {Text, Textarea} from 'react-reform/opt/inputs'

            class TagForm extends Component {

              handleSubmit = ({tag, description}) => {
                ...
              }

              render() {
                return (
                  <div>
                    <h2>Enter your tag information here</h2>
                    <Form onSubmit={this.handleSubmit}>
                      <Text name="tag" isRequired isValidTag/>
                      <Textarea name="description" label="Enter description"/>
                    </Form>
                  </div>
                )
              }
            }
          `}</Code>
        </Section>
      </Scaffold>
    )
  }
}
