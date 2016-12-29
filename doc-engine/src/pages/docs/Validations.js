import React from 'react'
import {Scaffold, H1, H2, H3, P, Code, Section, Link} from 'comps/layouts'

export default class Validations extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb5>Validations</H1>
        <Section>
          <P>Validations consist of 4 parts. A <Code.Inline>name</Code.Inline>, an <Code.Inline>isValid</Code.Inline> function and an error and a hint message.</P>
          <P>You may omit defining a hint message in which case the error message will be passed as <Code.Inline>hintMessage</Code.Inline> to the <Code.Inline>renderField</Code.Inline> function.</P>
        </Section>
        <Section>
          <H2>Define a validation</H2>
          <P>Validations are passed to the <Link to="/docs/reform-context/"><Code.Inline>ReformContext</Code.Inline></Link> component. This is where you assign a name to a validation. Have a look at this example to know how it works:</P>
          <Code>{`
            import React, {Component} from 'react'
            import {render} from 'react-dom'
            import {ReformContext, createTheme} from 'react-reform'

            const defaultTheme = createTheme(...)

            const validations = {
              validUserName: {
                isValid: val => /#\\W+(-\\W+)*/.test(val),
                errorMessage: () => 'is not a valid username',
                hintMessage: () => 'may contain letters, digits, underscores and dashes'
              },
              maxLength: {
                isValid: (val, {arg}) => (val || '').toString().length <= arg,
                errorMessage: (val, {arg}) => {
                  const currLength = (val || '').toString().length
                  return \`maximal length: \${currLength}/\${arg}\`
                },
                hintMessage: (val, {arg}) => 'may contain letters at most \${arg} chars'
              }
            }

            class App extends Component {

              render() {
                return (
                  <ReformContext themes={{default: defaultTheme}} validations={validations}>
                    <div>
                      ...Your App Code...
                    </div>
                  </ReformContext>
                )
              }
            }

            render(<App/>, document.getElementById('root'))
          `}</Code>
          <P>The two validations <Code.Inline>validUserName</Code.Inline> and <Code.Inline>maxLength</Code.Inline> may be used within inputs when prefixing either <Code.Inline>is-</Code.Inline> or <Code.Inline>has-</Code.Inline>:</P>
          <Code>{`
            <Form onSubmit={this.handleSubmit}>
              <Text name="name" is-validUserName/>
              <Textarea name="about" has-maxLength={140}/>
            </Form>
          `}</Code>
        </Section>
        <Section>
          <H2>isValid: <Code.Inline>(val, data, revalidateFn) => (true|false|string)</Code.Inline></H2>
          <P>This function determines whether a given input is valid or not. You may also return something else than <Code.Inline>true</Code.Inline> or <Code.Inline>false</Code.Inline> in case you have more states like e.g. <Code.Inline>"pending"</Code.Inline>. But be aware that submitting a form will only suceed if all inputs' validations return <Code.Inline>true</Code.Inline>.</P>
          <H3><Code.Inline>val</Code.Inline></H3>
          <P>Contains the current value of the input.</P>
          <H3><Code.Inline>data.arg</Code.Inline></H3>
          <P>You may add options to a validation like <Code.Inline>{'<Text name="content" has-maxLength={140}/>'}</Code.Inline> or even <Code.Inline>{'<Textarea name="username" is-unique={{attribute: \'name\', label: \'this better be a unique name\'}}/>'}</Code.Inline>. You can access the passed prop value via this field.</P>
          <H3><Code.Inline>data.getValue(fieldName)</Code.Inline></H3>
          <P>In case you want to access other field's values use this function. Imagine an input like <Code.Inline>{'<Text name="passwordRepeat" has-sameValueAs="password"/>'}</Code.Inline>, a useful implementation would be:</P>
          <Code>{`
            {
              isValid: (val, {arg, getValue}) => val === getValue(arg),
              ...
            }
          `}</Code>
          <H3><Code.Inline>revalidateFn</Code.Inline></H3>
          <P>When dealing with asynchronous validatoins, you need to tell React Reform to revalidate the input once a result gets back to you. Use this function to do exactly this. See the section below for a full example.</P>
        </Section>
        <Section>
          <H2>hintMessage/errorMessage: <Code.Inline>(val, data) => (string|React element)</Code.Inline></H2>
          <P>Use this to define two types of messages for your validation. The <Code.Inline>hintMessage</Code.Inline> is optional and the <Code.Inline>errorMessage</Code.Inline>'s output will be used in the <Code.Inline>renderField</Code.Inline> function</P>
          <H3><Code.Inline>val</Code.Inline></H3>
          <P>Contains the current value of the input.</P>
          <H3><Code.Inline>data.arg</Code.Inline></H3>
          <P>Same as <Code.Inline>isValid</Code.Inline>'s <Code.Inline>data.arg</Code.Inline> described above.</P>
          <H3><Code.Inline>data.name</Code.Inline></H3>
          <P>Contains the name of the field.</P>
        </Section>
      </Scaffold>
    )
  }
}
