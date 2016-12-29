import React from 'react'
import {Scaffold, H1, H2, H3, P, Code, Section, Link, List} from 'comps/layouts'

export default class Themes extends React.Component {

  render() {
    return (
      <Scaffold>
        <H1 mb5>Themes</H1>
        <Section>
          <P>Themes are probably the most central piece of React Reform. Use the <Code.Inline>createTheme</Code.Inline> function to pass all necessary information about how you want to render your forms.</P>
        </Section>
        <Section>
          <H2>Minimal Example</H2>
          <P>To give you a quick impression of how things work let's start with a simple example:</P>
          <Code>{`
            createTheme({

              renderForm: (FormContainer, children) => (
                <FormContainer>
                  <div>{children}</div>
                  <button>Submit</button>
                </FormContainer>
              ),

              renderField: (Field, {name, validations}) => {
                const errors = validations
                  .filter(({isValid}) => isValid === false)
                  .map(({errorMessage, name}) => <span key={name}>{errorMessage} </span>)
                return (
                  <div>
                    <label>{name}</label>
                    <Field/>
                    {errors.length > 0 && <span>{errors}</span>}
                  </div>
                )
              }

            })
          `}</Code>
          <P>This results in an unstyled form with it's fields getting basic error messages.</P>
        </Section>
        <Section>
          <H2>Full Example</H2>
          <P>Now let's take a look at a more complete Example. While the lines below certainly are nothing production ready, they certainly should hint at most of what React Reform is capable of and how it's supposed to work.</P>
          <Code>{`
            createTheme({

              renderForm: (FormContainer, children, {directProps: {buttonLabel, style, ...remainingDirectProps}, isValid, status, globalErrors}) => (
                <FormContainer {...remainingDirectProps} style={{background: isValid ? "green" : "red", ...style}}>
                  {globalErrors.length ? (
                    globalErrors.map((error, i) => <div style={{color: "red"}} key={i}>{error}</div>)
                  ) : null}
                  <div>{children}</div>
                  <button disabled={status === "pending"}>Submit</button>
                </FormContainer>
              ),

              renderField: (Field, {name, validations, directProps, wrapperProps, id, isDirty, isTouched, isFocused, formStatus}) => {
                const errors = validations
                  .filter(({isValid}) => isValid === false)
                  .map(({errorMessage, name}) => <span key={name}>{errorMessage} </span>)
                const hints = validations.map(({hintMessage, name}) => <span key={name}>{hintMessage} </span>)

                const label = (
                  <label htmlFor={id}
                    style={{color: errors.length > 0 && isDirty ? "red" : "black"}}
                  >{directProps.label || name}</label>
                )

                const field = (
                  <Field id={id}
                    disabled={formStatus === "pending"}
                    style={{border: \`1px solid \${isFocused ? "blue" : "black"}\`}}
                  />
                )

                return (
                  <div>
                    {wrapperProps.type === "Checkbox" ? (
                      <div>{field} {label}</div>
                    ) : (
                      <div>{label} {field}</div>
                    )}
                    {hints.length > 0 && <span>{hints}</span>}
                    {directProps.explanation && <div className="form-explanaition">{directProps.explanation}</div>}
                    {errors.length > 0 && !isTouched && <span>{errors}</span>}
                  </div>
                )
              }

              validationLabels: {
                required: {
                  errorMessage: (val, {name, arg}) => \`'\${name}' is really required\`
                }
              }

            })
          `}</Code>
        </Section>
        <Section>
          <H2><Code.Inline>createTheme(themeDefinition)</Code.Inline></H2>
          <P><Code.Inline>createTheme(themeDefinition)</Code.Inline> expects a <Code.Inline>themeDefinition</Code.Inline> of this shape</P>
          <Code>{`
            const themeDefinition = {
              renderForm: renderFormFn,
              renderField: renderFieldFn,
              validationLabels: validationLabelsObject (optional)
            }
          `}</Code>
          <P>This function returns a theme object which can be used either in the <Link to="/docs/reform-context/"><Code.Inline>ReformContext</Code.Inline></Link> component or can be passed directly to a form's <Code.Inline>theme</Code.Inline> prop.</P>
        </Section>
        <Section>
          <H2>renderFormFn: <Code.Inline>{'(FormContainer, children, data) => {...}'}</Code.Inline></H2>
          <P>This function allows you to define the body of all the forms using your theme. Typically this includes global error messages (i.e messages that are not specific to a field) and the submit button (if any)</P>
          <H3><Code.Inline>FormContainer</Code.Inline></H3>
          <P>The <Code.Inline>FormContainer</Code.Inline> represents the actual <Code.Inline>{'<form/>'}</Code.Inline> tag. It's up to the theme-author to decide if users may pass props to this Component. In this case you may write something like <Code.Inline>{'<FormContainer {...data.directProps}>'}</Code.Inline>.</P>
          <H3><Code.Inline>children</Code.Inline></H3>
          <P>As the name suggests, this argument contains the form's children. I.e. the fields of the form.</P>
          <H3><Code.Inline>data.directProps</Code.Inline></H3>
          <P>This field contains all the props that the user passes to the form. This could be used to allow overwriting/extending the <Code.Inline>style</Code.Inline> or <Code.Inline>className</Code.Inline> of a form.</P>
          <P>You may also define your own contracts and allow the user to pass props like <Code.Inline>buttonLabel</Code.Inline> or <Code.Inline>noButton</Code.Inline> or <Code.Inline>formWidth</Code.Inline> to customise the form according to your theme's capabilities.</P>
          <P>Note that <Code.Inline>directProps</Code.Inline> actually doesn't include <i>all</i> props. <Code.Inline>theme</Code.Inline>, <Code.Inline>children</Code.Inline>, <Code.Inline>onSubmit</Code.Inline>, <Code.Inline>model</Code.Inline>, <Code.Inline>initialModel</Code.Inline> and <Code.Inline>onFieldChange</Code.Inline> get exlcuded.</P>
          <H3><Code.Inline>data.globalErrors</Code.Inline></H3>
          <P>When a form's <Code.Inline>onSubmit</Code.Inline> handler returns a promise that gets rejected, you may decide whether to reject with an object describing which fields were the reason, or whether to reject with a string or React element. The latter will be found in the <Code.Inline>globalErrors</Code.Inline> list.</P>
          <P><Code.Inline>data.globalErrors</Code.Inline>'s shape looks like this</P>
          <Code>{`
             [
              'Your error message as a String (if you reject with reject(string)), you may also reject an React element.',
              {fieldName: 'if you reject with \`reject({fieldName: string})\` and a field with \`name="fieldName"\` is not present in your form, it'll be here'},
            ]
          `}</Code>
          <H3><Code.Inline>data.isValid</Code.Inline></H3>
          <P>If all fields' <Link to="/docs/validations/">validations</Link> return <Code.Inline>true</Code.Inline>, <Code.Inline>isValid</Code.Inline> will be <Code.Inline>true</Code.Inline>. <Code.Inline>false</Code.Inline> in all other cases.</P>
          <P>Note that you may define (async) validations that return strings like <Code.Inline>"pending"</Code.Inline> in this case <Code.Inline>isValid</Code.Inline> will be <Code.Inline>false</Code.Inline> as well.</P>
          <H3><Code.Inline>data.validationsPerField</Code.Inline></H3>
          <P>For more fine grained control you may access all validation objects from all fields. This field will have a shape like this:</P>
          <Code>{`
            {
              fieldName1: [
                {name: 'required', isValid: true, errorMessage: '...', hintMessage: '...'},
                ...
              ],
              fieldName2: [
                {name: 'unique', isValid: "pending", errorMessage: '...', hintMessage: '...'}
              ],
            }
          `}</Code>
          <H3><Code.Inline>data.status</Code.Inline></H3>
          <P>This field indicates the current state of the form. <Code.Inline>status</Code.Inline> can have these values:</P>
          <List>
            <List.Item><Code.Inline>'unsubmitted'</Code.Inline>: the form wasn't submitted yet</List.Item>
            <List.Item><Code.Inline>'preSubmitFail'</Code.Inline>: the form was submitted but validation errors were found.</List.Item>
            <List.Item><Code.Inline>'pending'</Code.Inline>: the form's <Code.Inline>onSubmit</Code.Inline> handler returned a Promise and was neither resolved nor rejected yet.</List.Item>
            <List.Item><Code.Inline>'success'</Code.Inline>: the form's <Code.Inline>onSubmit</Code.Inline> handler returned a Promise and the Promise was resolved.</List.Item>
            <List.Item><Code.Inline>'postSubmitFail'</Code.Inline>: the form's <Code.Inline>onSubmit</Code.Inline> handler returned a Promise and the Promise was rejected.</List.Item>
            <List.Item><Code.Inline>'UNCERTAIN STATUS'</Code.Inline>: the form's <Code.Inline>onSubmit</Code.Inline> handler returned no promise. This still is a TODO. So please file an issue if you have good generalisable idea for a status here.</List.Item>
          </List>
          <H3><Code.Inline>data.submitForm</Code.Inline></H3>
          <P>If your theme is attempting some non-standard submit behaviours, you get access to the submit function which will validate the form and invoke the form's <Code.Inline>onSubmit</Code.Inline> handler.</P>
          <P>Have a look at the <Link to="/recipes/#multiple-submit">Multiple submit buttons recipe</Link> to see a use-case.</P>
        </Section>
        <Section>
          <H2>renderFieldFn: <Code.Inline>{'(Field, data) => {...}'}</Code.Inline></H2>
          <P>This function let's you describe how each field should be rendered and how to display its different states.</P>
          <H3><Code.Inline>Field</Code.Inline></H3>
          <P>The <Code.Inline>Field</Code.Inline> contains the <Link to="/docs/wrap-input">wrapped input</Link>. You may pass any props to it and may access them via <Code.Inline>WrapInput</Code.Inline>'s <Code.Inline>themeProps</Code.Inline>. The recommended behaviour is to pass all <Code.Inline>themeProps</Code.Inline> directly to the input. So please filter your props here in the <Code.Inline>renderField</Code.Inline> function.</P>
          <P>Typically you want to set <Code.Inline>className</Code.Inline>, <Code.Inline>style</Code.Inline> or <Code.Inline>id</Code.Inline> props. But depending on your requirements you may also set e.g. <Code.Inline>onBlur</Code.Inline> handlers.</P>
          <H3><Code.Inline>data.directProps</Code.Inline></H3>
          <P>This field contains all the non-validation props that the user passes to the input (minus the <Code.Inline>name</Code.Inline>) prop. Use this to pass style or class information to the input. You may also allow custom props such as <Code.Inline>label</Code.Inline> or <Code.Inline>explanation</Code.Inline> and deal with those within your theme.</P>
          <H3><Code.Inline>data.name</Code.Inline></H3>
          <P>Contains the required <Code.Inline>name</Code.Inline> attribute passed to input. Might act as a good fallback if no better label is present.</P>
          <H3><Code.Inline>data.validations</Code.Inline></H3>
          <P>A list comprised of the validation objects for each validation on this input. It has a shape like this:</P>
          <Code>{`
            [
              {name: 'required', isValid: true, errorMessage: '...', hintMessage: '...'},
              {name: 'unique', isValid: "pending", errorMessage: '...', hintMessage: '...'},
              {name: 'minlength', isValid: false, errorMessage: '...', hintMessage: '...'}
            }
          `}</Code>
          <H3><Code.Inline>data.wrapperProps</Code.Inline></H3>
          <P>When <Link to="/docs/wrap-input">wrapping your inputs</Link> you may pass props to the <Code.Inline>WrapInput</Code.Inline> component. For example, it's recommended to pass a <Code.Inline>type</Code.Inline> prop to help differenatiate between different inputs. Have a look at the <b>Full example</b> above to see how it may help you.</P>
          <H3><Code.Inline>data.directFormProps</Code.Inline></H3>
          <P>Sometimes it might be useful to set some properties on a form that should affect all fields. Think of e.g. <Code.Inline>{'<Form onSubmit={...} fieldHeight="big">'}</Code.Inline>. <Code.Inline>directFormProps</Code.Inline> allows you to access this information.</P>
          <H3><Code.Inline>data.id</Code.Inline></H3>
          <P>Contains a generated and unique id which can be used to bind a label to a input via <Code.Inline>htmlFor</Code.Inline>.</P>
          <H3><Code.Inline>data.isDirty</Code.Inline></H3>
          <P>Is <Code.Inline>true</Code.Inline> if the input's <Code.Inline>onChange</Code.Inline> was called once.</P>
          <H3><Code.Inline>data.isTouched</Code.Inline></H3>
          <P>Is <Code.Inline>true</Code.Inline> if the input's <Code.Inline>onFocus</Code.Inline> was called once.</P>
          <H3><Code.Inline>data.isFocused</Code.Inline></H3>
          <P>Is <Code.Inline>true</Code.Inline> if the input is currently focused.</P>
          <H3><Code.Inline>data.submitForm</Code.Inline></H3>
          <P>As with the <Code.Inline>renderForm</Code.Inline> function above, you have access to the form's submit handler to allow for custom submit behaviour. Have a look at the <Link to="/recipes/#submit-on-blur">Submit on blur recipe</Link> to see how it might help.</P>
          <H3><Code.Inline>data.formStatus</Code.Inline></H3>
          <P>Contains the form's status described in the <Code.Inline>renderFormFn</Code.Inline> section above. Use it if you would like to disable the inputs while the form is <Code.Inline>'pending'</Code.Inline>.</P>
        </Section>
        <Section>
          <H2>validationLabelsObject</H2>
          <P>Specific themes might want to phrase validation messages differently. To allow for this feature, add a validation object of this shape to overwrite the validation's default messages:</P>
          <Code>{`
            {
              required: {
                errorMessage: (val, {name, arg}) => \`'\${name}' is really required\`,
                hintMessage: (val, {name, arg}) => \`'\${name}' needs to be set.\`,
              }
            }
          `}</Code>
          <P>Note that you may omit either <Code.Inline>hintMessage</Code.Inline> or <Code.Inline>errorMessage</Code.Inline> to fallback to the validation's default message.</P>
        </Section>
      </Scaffold>
    )
  }
}
