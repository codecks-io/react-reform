# React-Themed-Forms

Because your forms are as individual as you are.

## Goals

#### very strict separation of logic and representation

Designing forms is hard and there is no one way to approach this. This is why this library makes no assumptions of what your forms should look like. This library only deals with the annoying parts (aka validation logic) – you deal with how it's rendered to the DOM.

#### making it easy to expand

It shouldn't take much more than three lines of code to wrap your own (or third-party) form input components. Controlled or Uncontrolled.

Same for validators. Async validators are also supported.

#### pleasant DX (developer experience)

Writing your forms, defining your themes, adding your custom inputs and validators: all of this should require as few key strokes as possible while staying expressive.

#### Small Footprint

Komplex Web Apps are allready big enough. This is why this library tries to move all the optional stuff away from the core.
Some batteries are included in the optional `/opt/` folder (a bootstrap theme, default inputs and validators). However the core idea of this library is to give you a toolset which makes it very easy to assemble the components you need for powerful forms.


### Time for some code

you can define a theme like this:

```
const myTheme = (FormContainer, Fields, {globalErrors}) => (
  <FormContainer className="my-form-class">
    {globalErrors.length ? globalErrors.map((error, i) => <div key={i}>{error}</div>) : null}
    <Fields>
      {(Field, {label, validations, isFocused}) => {
        const hasError = validations.some(({isValid}) => isValid !== true);
        return (
          <div>
            <label>{label} {hasError && isFocused ? <span style={{color: "red"}}>Error</span> : null}</label>
            <Field className="my-form-control"/>
          </div>
        );
      }}
    </Fields>
    <button>Submit</button>
  </FormContainer>

  ```

(for a more complete example take a look at the [bootstrap-theme](src/opt/theme-bootstrap.js))

and then apply it to a form like this:

```
<Form onSubmit={this.handleSubmit} theme={myTheme}>
  <Text name="name" label="Your Name" placeholder="name..." is-required/>
  <Textarea name="comment" label="Your Comment please" placeholder="you can use markdown here" is-required has-minlength={20}/>
  <Select name="fruit" label="Your favourite fruit" is-required>
    {["apple", "banana", "pear"].map(fruit => <option key={fruit}>{fruit}</option>)}
  </Select>
  <Checkbox name="tosNotRead" label={<span>I have <i>not</i> read the ToS</span>}/>
</Form>
```

## TODOS

  - [ ] finding a nicer name for this
  - [x] creating a git repo
  - [x] don't submit if there are errors, focus first errorneous form
  - [x] deal with submit responses containing promises
  - [x] adding `Form` argument to theme-callback
  - [x] adding `isTouched`, `isDirty`, `isFocused`, `hasFailedToSubmit` options to <Fields> callback
  - [x] api for adding own types
  - [x] api for adding own validators
  - [x] split into several parts
  - [x] examples infrastructure
  - [x] standard lib of default inputs:
    - [x] text
    - [x] checkbox
    - [x] textarea
    - [x] password
    - [x] select
    - [ ] ~~radio~~ wont be done, makes only sense as a _radio group_. But there's no unopinionated way to go ahead.
  - [x] setting up test infrastructure
  - [x] setting up test cases
  - [x] standard lib of validators
    - [x] required
    - [x] email
    - [x] minlength
    - [x] maxlength
    - [x] pattern
  - [x] sample bootstrap theme
  - [x] themes can be registered
  - [x] uuids for htmlFor and input ids
  - [ ] building: core -> /modules, opt -> /opt
  - [ ] naming: field vs input
  - [ ] a11y: e.g. aria-describedby in bootstrap theme
  - [ ] documentation and examples of
    - [ ] how to add custom inputs
    - [ ] how to add custom validators
    - [ ] how to add custom theme
    - [ ] multiple submit buttons
    - [ ] refs within inputs (focus)
  - [ ] Use cases made simple using this library
    - [ ] how do I put a `*` behind the label of each required field?
    - [ ] check if two password fields contain the same value
    - [ ] theme with custom button text

  maybe all fields should be stateful, providing a onChange callback to the form? how about contenteditable though (can't see how to possibly make this controlled without *a lot* of effort)?

## Contribute

  please do(n't quite yet)!
  _(TODO: state the philosophy of what this package is about somewhere)_

  - clone the repo
  - `npm install`
  - for running examples: `npm run examples` and open `http://localhost:8080/`