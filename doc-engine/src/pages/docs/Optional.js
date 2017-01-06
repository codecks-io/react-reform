import React from 'react'
import {Scaffold, H1, H2, H3, P, Code, Section, Link} from 'comps/layouts'

export default class Optional extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb5>Optional validations and inputs</H1>
        <Section>
          <P>React Reform comes with some validations and wrapped inputs out of the box. They are not included in the main bundle. I.e. if you don't explicitely require them they won't be added to your build.</P>
          <P>Also there's no magic in here. Have a look at the <Link href="https://github.com/codecks-io/react-reform/tree/master/src/opt">sources</Link> to learn what's going on here.</P>
        </Section>
        <Section>
          <H2>Inputs</H2>
          <P>You can require them via <Code.Inline>react-reform/opt/inputs</Code.Inline>. Take a look below at all the inputs in use:</P>
          <Code>{`
            import {Form, ReformContext} from 'react-reform'
            import {Text, Textarea, Password, Select, Checkbox} from 'react-reform/opt/inputs'

            ...

            <Form onSubmit={this.handleSubmit}>
              <Text name="name" isRequired/>
              <Textarea name="comment" hasMaxlength={140}/>
              <Password name="password" isRequired/>
              <Select name="fruit">
                <option value="apple">Apple</option>
                <option value="orange">Orange</option>
              </Select>
              <Checkbox name="agreeToTos" isRequired/>
            </Form>
          `}</Code>
          <P>Note: there's no default <Code.Inline>Radio</Code.Inline> input. This is because there's no unopionated way of handling those in react. It's recommended <Link to="/docs/wrap-input/">wrapping</Link> a package like <Link href="https://github.com/chenglou/react-radio-group">react-radio-group</Link>.</P>
        </Section>
        <Section>
          <H2>Validations</H2>
          <P>React Reform also offers some typical validations. Here's a list of them</P>
          <H3><Code.Inline>required</Code.Inline></H3>
          <Code>{`
            <Text name="..." isRequired/>
          `}</Code>
          <H3><Code.Inline>email</Code.Inline></H3>
          <Code>{`
            <Text name="..." isEmail/>
          `}</Code>
          <H3><Code.Inline>minlength</Code.Inline></H3>
          <Code>{`
            <Text name="..." hasMinlength={6}/>
          `}</Code>
          <H3><Code.Inline>maxlength</Code.Inline></H3>
          <Code>{`
            <Text name="..." hasMaxlength={140}/>
          `}</Code>
          <H3><Code.Inline>pattern</Code.Inline></H3>
          <Code>{`
            <Text name="..." hasPattern={/^\\d+(\\.\\d+)?$/}/>
          `}</Code>
        </Section>
      </Scaffold>
    )
  }
}
