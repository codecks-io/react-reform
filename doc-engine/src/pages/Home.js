import React from 'react'
import {B} from 'comps/styles'
import {Scaffold, H1, H2, H3, SubH1, List, Code, P, Section, Link} from 'comps/layouts'

export default class Home extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb1>React Reform</H1>
        <SubH1>Helps you create powerful themes for pleasant to use forms</SubH1>
        <Section>
          <H2 mb3>tl;dr</H2>
          <List>
            <List.Item>Define one or several <b>form themes</b> for your project.</List.Item>
            <List.Item>Set up <b>validations</b> if the defaults aren't enough for you.</List.Item>
            <List.Item><b>Wrap your input components</b> or use the default ones.</List.Item>
            <List.Item>
              <B mb3>Use them to write forms like this:</B>
              <Code>{`
                <Form onSubmit={this.handleSubmit} theme="dark">
                  <Text name="name" label="Your Name" is-required has-minlength={3}/>
                  <DatePicker name="birthday" label="Your Birthday"/>
                </Form>
              `}</Code>
            </List.Item>
          </List>
        </Section>
        <Section>
          <H2 mb4>Features</H2>
          <H3>You get full control over all tags and styles</H3>
          <P mb4>
            Do you prefer <Code.Inline>{'<p>'}</Code.Inline>s over <Code.Inline>{'<div>'}</Code.Inline>s?
            Do you prefer inline styles over class names? It's all up to you! You remain control over how your forms are rendered.
          </P>
          <H3>Define your custom behaviour for validation</H3>
          <P mb4>
            Do you want to indicate validation errors while the user is typing?
            Do you want to treat erros sent from the server differently?
            React-Reform allows you to consistently define such behaviours accross all your forms.
          </P>
          <H3>Low level</H3>
          <P mb4>
            Take a look at the <Link to="/recipes/">recipes</Link> to see what kind of stuff React Reform allows you to do. Sure, being low level means that you've got quite some stuff to write to get production-ready themes. But you'll be rewarded with a very concise way of creating powerful and consistent forms.
          </P>
          <H3>Small</H3>
          <P mb4>
            React Reform comes with <b>0</b> dependencies.
            It also leaves out all optional things like default inputs and validation rules out of the core.
          </P>
        </Section>
      </Scaffold>
    )
  }
}
