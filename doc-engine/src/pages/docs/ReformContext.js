import React from 'react'
import {Scaffold, H1, H2, P, Code, Section, Link} from 'comps/layouts'

export default class ReformContext extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb5>ReformContext</H1>
        <Section>
          <P>Your forms need to know which themes and validations are available within your app. ReformContext uses React's <Link href="https://facebook.github.io/react/docs/context.html">context</Link> feature to propage this information.</P>
          <P>For this to work, you need to put the <Code.Inline>ReformContext</Code.Inline> component at the root of your app.</P>
          <P>Have a look here for how to use it:</P>
          <Code>{`
            import React, {Component} from 'react'
            import {render} from 'react-dom'
            import {ReformContext, createTheme} from 'react-reform'
            import defaultValidations from 'react-reform/opt/validations'

            const defaultTheme = createTheme(...)
            const darkTheme = createTheme(...)
            const singleInputTheme = createTheme(...)

            const themes = {
              default: defaultTheme,
              dark: darkTheme,
              singleInput: singleInputTheme
            };

            const validations = {
              ...defaultValidations,
              validTag: {...}
            }

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
          <H2><Code.Inline>themes</Code.Inline> prop</H2>
          <P>The <Code.Inline>themes</Code.Inline> prop expect an object mapping keys to <Link to="/docs/themes/">themes</Link>.</P>
          <P>The key names allow to set a form's theme like this:</P>
          <Code>{`
            <Form theme="singleInput" onSubmit={this.handleSubmit}>
              ...
            </Form>
          `}</Code>
          <P>If a form sets no explicit theme, the <Code.Inline>default</Code.Inline> theme will be chosen.</P>
        </Section>
        <Section>
          <H2><Code.Inline>validations</Code.Inline> prop</H2>
          <P>To setup <Link to="/docs/validations/">validations</Link>, use the <Code.Inline>validations</Code.Inline> prop. Pass an object that maps validation names to an validation object.</P>
          <P>This validation names can then be used by inputs by prefixing <Code.Inline>is</Code.Inline> or <Code.Inline>has</Code.Inline>:</P>
          <Code>{`
            <Form onSubmit={this.handleSubmit}>
              <Text name="tag" isRequired isValidTag hasMinlength={3}/>
            </Form>
          `}</Code>
        </Section>
      </Scaffold>
    )
  }
}
