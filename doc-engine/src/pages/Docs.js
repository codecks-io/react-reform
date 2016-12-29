import React from 'react'
// import {B} from 'comps/styles'
import {Scaffold, H1, H2, SubH1, P, Code, Section, Link} from 'comps/layouts'

export default class Docs extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb1>Api Docs</H1>
        <SubH1>A detailed looks at all the moving parts of React Reform</SubH1>
        <Section>
          <Link to="/docs/reform-context"><H2 color="inherit">ReformContext</H2></Link>
          <P>Add this component to the root of your app to inform all forms within which themes and validations are available.</P>
        </Section>
        <Section>
          <Link to="/docs/create-theme"><H2 color="inherit">Themes</H2></Link>
          <P>Define what your form look like with<Code.Inline>createTheme</Code.Inline>. You can define how the form body and each field is rendered, as well as allowing you to overwrite validation messages.</P>
        </Section>
        <Section>
          <Link to="/docs/create-validators"><H2 color="inherit">Validators</H2></Link>
          <P>Learn how to write custom sync or async validators.</P>
        </Section>
        <Section>
          <Link to="/docs/wrap-input"><H2 color="inherit">WrapInput</H2></Link>
          <P>The <Code.Inline>WrapInput</Code.Inline> component allows to wrap any input component to make the ready for React Reform.</P>
        </Section>
        <Section>
          <Link to="/docs/form"><H2 color="inherit">Form</H2></Link>
          <P>Let's apply all the techniques above to see how forms are written.</P>
        </Section>
        <Section>
          <Link to="/docs/optional"><H2 color="inherit">Optional default validations and inputs</H2></Link>
          <P>To get you off the ground, see which validators and inputs come with React Reform</P>
        </Section>
      </Scaffold>
    )
  }
}
