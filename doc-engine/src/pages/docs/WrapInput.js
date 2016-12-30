import React from 'react'
import {Scaffold, H1, H2, H3, P, Code, Section, Link, List, AppliedCode} from 'comps/layouts'

export default class WrapInput extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb5>WrapInput</H1>
        <Section>
          <P>To make your inputs ready for React Reform you need to wrap them first. The <Code.Inline>WrapInput</Code.Inline> component should provide all functionality to interface with all kinds of components.</P>
          <P>Let's see a simple to get an idea of what it looks like</P>
          <Code>{`
            import {WrapInput} from 'react-reform'

            const Checkbox = props => (
              <WrapInput type="Checkbox" directProps={props}>{
                ({value, themeProps: {onChange, ...restThemeProps}}) => (
                  <input type="checkbox" checked={value || false}
                    onChange={e => onChange(e.target.checked)}
                    {...restThemeProps}
                  />
                )
              }</WrapInput>
            )

          `}</Code>
          <P>Okay, so what is going on here?</P>
          <P><Code.Inline>Checkbox</Code.Inline> is a functional component that returns a <Code.Inline>WrapInput</Code.Inline> component with a <i>child-as-function</i>. Here you put your raw input component and tell it how to interface with React Reform's primitives.</P>
          <P>Most importantly you tell how the value is set on your component and how to extract the value from its <Code.Inline>onChange</Code.Inline> callback.</P>
        </Section>
        <Section>
          <H2><Code.Inline>WrapInput</Code.Inline> props</H2>
          <P>Let's take a more detailed look at how to use the <Code.Inline>WrapInput</Code.Inline> component.</P>
          <H3><Code.Inline>directProps</Code.Inline></H3>
          <P>This should always be the same: whatever props the user puts on the wrapped component should be passed as <Code.Inline>directProps</Code.Inline>. The theme's <Code.Inline>renderField</Code.Inline> function will then decide which of these props will be propagated to the real component via <Code.Inline>themeProps</Code.Inline>.</P>
          <H3><Code.Inline>focusFn (optional)</Code.Inline></H3>
          <P>Defines how the component's reference can be used to focus the input when there's a validation error (and we don't skip this behaviour via setting <Code.Inline>dontFocusAfterFail</Code.Inline>). The default definition looks like this: <Code.Inline>{'function() {if (!this.shouldPreventFocusAfterFail || !this.shouldPreventFocusAfterFail()) node.focus()}'}</Code.Inline>.</P>
          <H3>children: <Code.Inline>(value, themeProps) => (React Element)</Code.Inline></H3>
          <P>As seen in the example above, <Code.Inline>WrapInput</Code.Inline>' child needs to be a function. This function provides two arguments, <Code.Inline>value</Code.Inline> and <Code.Inline>themeProps</Code.Inline> to allow adjusting to the raw input component's needs.</P>
          <List>
            <List.Item><Code.Inline>value</Code.Inline> describes the value of the form's model. This value might need to be translated such that the input component can understand it.</List.Item>
            <List.Item><Code.Inline>themeProps</Code.Inline> contains all the props that are passed to the input compoent via the theme. In addition it'll contain <Code.Inline>onChange</Code.Inline>, <Code.Inline>onFocus</Code.Inline> and <Code.Inline>onBlur</Code.Inline> listeners that you might have to adapt in order to get the correct behaviour. It also contains a <Code.Inline>ref</Code.Inline> callback to get a handle on the rendered instance to allow focusing it when validation fails.</List.Item>
          </List>
        </Section>
        <Section>
          <H2>Examples</H2>
          <P>Let's take a look at various DatePickers to see how we can wrap them.</P>
          <Link href="https://github.com/Hacker0x01/react-datepicker"><H3 color="inherit">react-datepicker</H3></Link>
          <Code>{require('raw!comps/recipes/wrapinput-react-datepicker')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/wrapinput-react-datepicker').default}/>
          <Link href="https://github.com/zippyui/react-date-picker"><H3 color="inherit">react-date-picker</H3></Link>
          <Code>{require('raw!comps/recipes/wrapinput-react-date-picker')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/wrapinput-react-date-picker').default}/>
          <Link href="https://nikgraf.github.io/belle/#/component/date-picker?_k=7z6v6x"><H3 color="inherit">Belle's date picker</H3></Link>
          <Code>{require('raw!comps/recipes/wrapinput-react-belle-date-picker')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/wrapinput-react-belle-date-picker').default}/>
          <Link href="https://github.com/skratchdot/react-bootstrap-daterangepicker"><H3 color="inherit">react-bootstrap-daterangepicker</H3></Link>
          <Code>{require('raw!comps/recipes/wrapinput-react-bootstrap-daterangepicker')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/wrapinput-react-bootstrap-daterangepicker').default}/>
          <H3>Custom components</H3>
          <P>The recommended way would be to create one component first and wrap it rather than wrapping 3 inputs. But to give you a idea of what a very incomplete approach could look like:</P>
          <Code>{require('raw!comps/recipes/wrapinput-custom-datepicker')}</Code>
          <AppliedCode comp={require('babel!comps/recipes/wrapinput-custom-datepicker').default}/>
        </Section>
      </Scaffold>
    )
  }
}
