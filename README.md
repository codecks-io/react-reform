# react-<i>re</i>form

A React Form Framework

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Quick Start](#quick-start)
- [Api Reference](#api-reference)
  - [`<Form>`](#form)
  - [Create a Theme](#create-a-theme)
    - [`<FormContainer>`](#formcontainer)
    - [`<Fields>`](#fields)
  - [Custom Inputs](#custom-inputs)
  - [Validators](#validators)
- [Recipes](#recipes)
  - [Add a * to all required Fields](#add-a--to-all-required-fields)
  - [Theme with Custom Button Text](#theme-with-custom-button-text)
  - [Multiple Submit Buttons](#multiple-submit-buttons)
  - [Submit on Blur](#submit-on-blur)
  - [Dynamic Form based on Content](#dynamic-form-based-on-content)
- [Contribute](#contribute)
- [License](#license)

## Motivation

Forms are hard. There are so many ways to approach them and too few libraries out there offering enough flexibility.

My main struggle with other libraries was the lack of separation between logic and representation. This is why this library was created.

The goal is to put you in full control of:

 - What DOM-Structure and style to use for displaying your fields
 - What DOM-Structure and style to use for displaying your form
 - How and when you see what validation message

All this while trying to maintain a small, yet powerful API.

## Features

- **Pleasant DX (Developer Experience)**

  Once you've set up your Themes and Validators, and you get to actually apply them, it should be a straight forward experience as simple as:

  ```javascript
    import {Form, Text} from "./lib/form"; // <- your config file

    [...]

    render() {
      return (
        <Form onSubmit={this.handleSubmit} theme="my-theme-name">
          <Text name="comment" is-required has-maxlength={140}/>
        </Form>
      );
    }
  ```

- **Small Footprint**

  react-reform aims to keep all optional dependencies out of the core. For example validations: If you start off just `import "react-reform/opt/validators"` for a basic set of validations (like `is-required` `has-maxlength="140"`, but most bigger projects probably will come up with their own set of validations and therefore don't need this particular code in their bundle later on.

- **Easy to expand**

  It should be pretty simple adding your own input-types and validators.

## Quick Start

`npm install --save react-reform`
(or for people with less time on their hands: `npm i -S react-reform`)

It is recommended to create a _config file_ which acts as interface between your application code and react-reform.

A config file can look like this:

**lib/form.js**
```javascript
import React from "react";

import {Form, registerTheme, wrapInput} from "react-reform";

// import default inputs <Text>, <Password>, <Textarea>, <Checkbox>, <Select>
import * as defaultInputs from "react-reform/opt/inputs";

// globally register default set of validators
import "react-reform/opt/validators";

// import DatePicker to wrap it below
import DatePicker from "react-date-picker";
import "react-date-picker/index.css";


registerTheme("my-theme-name", (FormContainer, Fields, {globalErrors}) => (
  <FormContainer className="my-form-class">
    {globalErrors.length ? (
      globalErrors.map((error, i) => <div key={i}>{error}</div>)
    ) : null}
    <Fields>
      {(Field, {label, validations}) => {
        const hasError = validations.some(({isValid}) => isValid !== true);
        return (
          <div>
            <label>{label} {hasError ? <span style={{color: "red"}}>Error</span> : null}</label>
            <Field/>
          </div>
        );
      }}
    </Fields>
    <footer>
      <button>Submit</button>
    </footer>
  </FormContainer>
));

export default {
  Form,
  ...defaultInputs,
  DatePicker: wrapInput("DatePicker", DatePicker, {extractValueFromOnChange: date => date, propNameForValue: "date"})
};

```

This way you're ready to start using react-reform like this:

**quick-start-form.js**
```javascript
import React from "react";
import {Form, Text, DatePicker} from "./form";

export default class extends React.Component {

  handleSubmit = ({firstName, lastName, birthday}) => {
    console.log(firstName, lastName, birthday);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} theme="my-theme-name">
        <Text name="fistName" label="first name" is-required has-minlength={2}/>
        <Text name="lastName" label="last name"/>
        <DatePicker name="birthday" label="your birthday" is-required/>
      </Form>
    );
  }
}

```

## Api-Reference

### `<Form>`

The `<Form>` component is the container for your Inputs. You can use non-input component and input component in here:

```javascript
<Form onSubmit={this.handleSubmit}>
  <Text name="first"/>
  <hr/>
  <Text name="second"/>
  <footer>
    <Text name="last"/>
  </footer>
</Form>
```

or even

```javascript
<Form onSubmit={this.handleSubmit}>
  <Text name="first"/>
  <div>
    {this.state.users.map(user => <Text name={`name-${user.id}`}/>)}
  </div>
</Form>
```

#### Uncontrolled vs Controlled `<Form>`

There are two flavours of how forms can be used. They can either be controlled (i.e the parent owns the state, or uncontrolled, i.e the form owns the state)

An _uncontrolled_ Form looks like this:

```javascript
<Form onSubmit={this.handleSubmit} initialModel={{first: "val1", second: "val2"}}>
  <Text name="first"/>
  <Text name="second"/>
</Form>
```

For displaying a _controlled_ Form we needs a bit more context:

```javascript
class extends React.Component {

  state = {
    model: {first: "val1", second: "val2"}
  }

  handleSubmit = ({first, second}) => {
    console.log(first, second);
  }

  handleFieldChange = (name, val) => {
    const {model} = this.state;
    model[name] = val;
    this.setState({model});
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} onFieldChange={this.handleFieldChange} model={this.state.model}>
        <Text name="first"/>
        <Text name="second"/>
      </Form>
    );
  }
}
```

#### Props

##### `onSubmit(data)` _required_

is called when form is submitted _and_ all the validations pass.

You may return a Promise. If this promise resolves successfully, then the form will be reset. This means the values will be set to the initalModel (if the form is uncontrolled), and field attributes like `touched` and `dirty` will be set to `false`.

If the promise is rejected, react-reform will try and evaluate the contents of the rejection. If it is an object, then it will look wether the keys correspond to fieldnames and create a validation error for this field. In all other cases the error object will be added to the `globalErrors` attribute that can be accessed in the theme's `<FormContainer>`

##### `initialModel`

Optional default values for your uncontrolled form.

##### `model`

required form values for your controlled form.

##### `onFieldChange(fieldName, value)`

called whenever a field's content are changed. You may return `false` to avoid any effect of this change (i.e. the corresponding field won't be marked as `dirty`)

##### `theme` _default value: "default"_

you can either pass a string with the registered name of the theme, or a theme definition itself. If you omit this prop, the form will look for a theme registered as "default".

### Create a Theme

This is where the fun begins! Here you have full control over how you want to display which state of your form to the user. Let's start with a minimal example:

```javascript
const myMinimalTheme = (FormContainer, Fields, formContainerOpts) => (
  <FormContainer className="my-form-class">
    <Fields>
      {(Field, fieldOpts) => {
        return (
          <div>
            <label htmlFor={fieldOpts.id}>{fieldOpts.label}</label>
            <Field className="my-form-field-class" id={fieldOpts.id}/>
          </div>
        );
      }}
    </Fields>
    <button>Submit</button>
  </FormContainer>
)
```

As you can see you need to position two components: `<FormContainer>` and `<Fields>`.

`<FormContainer>` will render the actual `<form>` DOM Node. Within this Container you need to define the position of the fields supplied by the user and probably also a submit button.

The `<Fields>` component defines how each field (like e.g. `<Text>` or `<Select>`) is being rendered.

A more complete example can be found [here](./src/opt/theme-bootstrap.js).

#### formContainerOpts

##### `globalErrors`

if the `<Form>`'s `onSubmit` handler returns a promise that will be rejected, the non-field-specific error messages will be listed here. Note that `globalErrors` is an Array.

##### `submitForm`

useful if you have several ways of submitting a form (either via multiple submit buttons, or for example when leaving focus of a field.) Have a look at the [Recipes](#recipes) for some exampled.

##### `hasFailedToSubmit`

This value is `true` when an attempt to submit failed. (In that case you want to probablt show all validation errors, even for fields that have not been touched yet.)

##### `formProps`

this key contains all props that were passed to the user's `<Form>` component. This could be used to allow your theme users to define a custom submit button label as shown in this [Recipe](#theme-with-custom-button-text).

#### `<FormContainer>`

This component is used to describe the overall structure of your form. All props defined on this component are passed directly to the underlying `<form>`.

#### `<Fields>`

This component determines the location of the contents of a theme user's `<Form>`. All props passed to this component will be passed to an underlying `<div>`.

The child-function passed to the `<Field>` component plays a crucial role however. It describes how each field should be wrapped.

Let's have a look at the child-function again:

```javascript
<Fields>{(Field, fieldOpts) => ...}
```

The first argument represents the actual field (which was defined within `<Form>`)

the `fieldOpts` contain a lot of important values for displaying e.g. labels and validation messages:

##### `label`

contains the value passed in the input's `label`. If there is no `label`-prop present the `name` will be used.

##### `validations`

contains an object with the current validation state of all validators. It has a shape like this:

```javascript
[
  {
    type: "email",
    isValid: false,
    errorMessage: "is not a valid email address",
    hintMessage: "needs to be an email"
  },
  {
    type: "required",
    isValid: true,
    errorMessage: "is required",
    hintMessage: "is required"
  },
  {
    type: "myAsyncValidator"
    isValid: "isLoading", // <- validators can return non-boolean values
    errorMessage: "is already taken",
    hintMessage: "needs to be unique",
  },
  ...
]
```

##### `type`

contains the type of input. It's the first argument of the `wrapInput` function and can be used to treat e.g. `Checkboxes` differently within your theme

##### `id`

a computed unique id which can be used to establish a connection between a label and the input via `htmlFor` and `id`.

##### `isDirty`

is `true` when the field was changed

##### `isFocused`

is `true` when the field currently is focused

##### `isTouched`

is `true` when the field was focused once

##### `hasFailedToSubmit`

This value is `true` when an attempt to submit failed. Will be `false` once validation was successful.

##### `fieldProps`

contains the props passed to the `<Form>`'s input

### Custom Inputs via `wrapInput`

react-reform only allows the use of _controlled_ inputs. I.e. it requires that the input defines a prop pair like `onChange` and `value`.

Given this preqrequisite, wrapping custom form inputs is fairly straight forward using the `wrapInput` method.

`wrapInput` accepts the follwing parameters: `wrapInput(name, Component, opts)`

#### `name`

This parameter serves for setting a proper display name for the wrapper class and, more importantly, is passed as `type` to a theme's `<Field>` definition. This way you could treat certain inputs differntly within your theme.

#### `Component`

This can be either a string for wrapping a DOM node (like e.g. `select` or `input`), or a react component like e.g. a DatePicker Component.

#### `opts`

Is an optional object to account for non-default behaviour of the component.

##### `defaultProps`

props that should always be passed to the component. This makes sense for the various `<input>` variants:
```
wrapInput("Password", "input", {defaultProps: {type: "password"}});
```

##### `extractValueFromOnChange` _default: `e => e.target.value`_

This option defines how the value is extracted from the `onChange` event of the component.

##### `propNameForValue` _default: `value`_

Defines the prop name for passing the value to the component.

##### `propNameForOnChange` _default: `onChange`

Defines the prop name for listening to change events.

#### Examples:

Let's have a look at various date pickers

##### [react-datepicker](https://github.com/Hacker0x01/react-datepicker)

```javascript
const DatePicker1 = wrapInput("DatePicker1", require("react-datepicker"), {
  extractValueFromOnChange: date => date,
  propNameForValue: "selected"
});
```

##### [react-date-picker](https://github.com/zippyui/react-date-picker)

```javascript
const DatePicker2 = wrapInput("DatePicker2", require("react-date-picker"), {
  extractValueFromOnChange: date => date,
  propNameForValue: "date"
});
```

##### [Belle's DatePicker](http://nikgraf.github.io/belle/#/component/date-picker?_k=9lwpee)

```javascript
const DatePicker3 = wrapInput("DatePicker3", require('belle').DatePicker, {
  extractValueFromOnChange: date => date,
  propNameForValue: "date",
  propNameForOnChange: "onUpdate"
});
```

##### Using those examples:

The DatePickers can then be embedded like this:

```javascript
<Form onSubmit={this.handleSubmit} theme="my-theme-name">
  <DatePicker1 name="firstDate" is-required/>
  <DatePicker2 name="firstDate" minDate='2015-11-06' maxDate='2016-01-31'/> // props defined here get passed straight to the underlying Component
  <DatePicker3 name="firstDate" defaultYear={new Date().getFullYear()}/>
</Form>
```

### Validators

## Recipes

### Add a * to all required Fields

### Theme with Custom Button Text

### Multiple Submit Buttons

### Submit on Blur

### Dynamic Form based on Content


## Contribute

- clone the repo
- `npm install`
- for running examples: `npm run examples` and open `http://localhost:8080/`

## License

ISC
