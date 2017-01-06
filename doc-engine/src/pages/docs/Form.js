import React from 'react'
import {Scaffold, H1, H2, H3, P, Code, Section, Link, AppliedCode} from 'comps/layouts'

export default class Form extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb5>Form</H1>
        <Section>
          <P>Let's have a look of what using your themes and writing some actual forms looks like.</P>
        </Section>
        <Section>
          <H2>Controlled vs uncontrolled forms</H2>
          <P>When writing your form you need to decide whether your form should be controlled or uncontrolled. I.e do you need to keep track of all the form changes via <Code.Inline>onFieldChange</Code.Inline> and inform the form via a changed <Code.Inline>model</Code.Inline>? Or is it sufficient to maybe provide an <Code.Inline>initialModel</Code.Inline> and only get to know the field values in the <Code.Inline>onSubmit</Code.Inline>handler?</P>
          <P>In most cases the less complex uncontrolled forms will be fine. But sometimes you need to be aware of the field values to change the render output accordingly. This is when controlled forms come in handy.</P>
          <H3>Uncontrolled form example</H3>
          <Code>{require('raw!comps/recipes/form-uncontrolled')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/form-uncontrolled').default}/>
          <H3>Controlled form example</H3>
          <Code>{require('raw!comps/recipes/form-controlled')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/form-controlled').default}/>
        </Section>
        <Section>
          <H2>Form props</H2>
          <H3><Code.Inline>theme: (string|themeObj)</Code.Inline></H3>
          <P>Defaults to <Code.Inline>'default'</Code.Inline>. You may either pass a string referencing a theme name that you defined via <Link to="/docs/reform-context/">ReformContext</Link> or you may pass a theme object created via <Link to="/docs/themes/"><Code.Inline>createTheme</Code.Inline></Link>.</P>
          <H3><Code.Inline>onSubmit: fn(data, event) => (Promise?)</Code.Inline></H3>
          <P>The <Code.Inline>onSubmit</Code.Inline> handler will be called once the form was submitted and all fields' validations returned <Code.Inline>true</Code.Inline>.</P>
          <P>The data is an object with the fields' <Code.Inline>name</Code.Inline>s as keys and their values as the value.</P>
          <P>You may return a promise to indicate to the theme that there's no result yet. The <Code.Inline>status</Code.Inline> within the <Code.Inline>renderFormFn</Code.Inline> will be <Code.Inline>'pending'</Code.Inline>.</P>
          <P>If the promise gets resolved the form gets reset and a <Code.Inline>'success'</Code.Inline> status will be set.</P>
          <P>You may also reject the promise. You have two options. If you know the field(s) that led to the error you may reject like this: <Code.Inline>{'reject({fieldName: \'is not unique\'})'}</Code.Inline>. If the error is more generic, reject with a string or react element: <Code.Inline>{'reject(<span>the server responded with a <b>{code}</b> message</span>)'}</Code.Inline></P>
          <H3><Code.Inline>initialModel</Code.Inline> (optional) <i>uncontrolled forms only.</i></H3>
          <P>You may pass in initial data in the form of an object mapping field name to values. These values will be used when the form is mounted or reset.</P>
          <H3><Code.Inline>model</Code.Inline> <i>controlled forms only.</i></H3>
          <P>Passing a model prop signals to the form that it's an controlled form. It expects an object mapping field name to values. Field values won't be changed unless you explicitely change the <Code.Inline>model</Code.Inline>.</P>
          <H3><Code.Inline>onFieldChange: fn(fieldName, value)</Code.Inline> <i>controlled forms only.</i></H3>
          <P>This handler allows you to react to fieldChange request. Most typically it looks like the one form the controlled form example above.</P>
          <P>You may return <Code.Inline>false</Code.Inline> to indicate that no change has happened. This will prevent the input from becoming <Code.Inline>isDirty</Code.Inline>.</P>
          <H3><Code.Inline>children</Code.Inline></H3>
          <P>Pass your inputs here. It's perfectly fine to pass in non-inputs here as well. So a form like this will work:</P>
          <Code>{`
            <Form onSubmit={this.handleSubmit} theme="dark">
              <Text name="name" isRequired/>
              <hr/>
              <button type="button" onClick={this.toggleSpecial}>
                toggle special
              </button>
              {this.state.showSpecial && (
                <div className="special">
                  <Text name="price" isRequired/>
                </div>
              )}
            </Form>
          `}</Code>
        </Section>
        <Section>
          <H2>Form instance methods</H2>
          <P>You may attach a <Code.Inline>ref</Code.Inline> prop to the form. This ref officially supports some methods you might want to take advantage of.</P>
          <H3><Code.Inline>reset()</Code.Inline></H3>
          <P>Sets the form inputs to an untouched state.</P>
          <H3><Code.Inline>{'checkForErrors() => ({hasErrors, firstInvalidFieldName})'}</Code.Inline></H3>
          <P>In case you'd like to validate the form without submitting it. Call this method. You can use the <Code.Inline>firstInvalidFieldName</Code.Inline> to focus the relevant input (see below).</P>
          <H3><Code.Inline>focusField(fieldName)</Code.Inline></H3>
          <P>Calls focuses the input by executing the <Code.Inline>focusFn(node)</Code.Inline> method according to it's definition on the <Code.Inline>WrapInput</Code.Inline> component.</P>
        </Section>
      </Scaffold>
    )
  }
}
