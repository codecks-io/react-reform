# react-reform

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
  - [Custom Inputs via `wrapInput`](#custom-inputs-via-wrapinput)
  - [Validators via `registerValidator`](#validators-via-registervalidator)
- [Recipes](#recipes)
  - [Add a * to all required Fields](#add-a--to-all-required-fields)
  - [Theme with Custom Button Text](#theme-with-custom-button-text)
  - [Multiple Submit Buttons](#multiple-submit-buttons)
  - [Submit on Blur](#submit-on-blur)
  - [Dynamic Form based on Content](#dynamic-form-based-on-content)
- [FAQ](#faq)
- [Contribute](#contribute)
- [License](#license)

## Motivation

Forms tend to be a fairly individual affair. Different projects have different requirements. And even within one project there are likely different types of forms.
Rather than desparately trying to attempt to cover all use cases with one library, react-reform aims to empower you to create your own form primitives for your specific use cases. Once you've set up your themes and wrapped your custom inputs, your forms will be a lot more pleasant to write.

## Features

- **Pleasant DX (Developer Experience)**

  As soon as you've set up your inputs, themes and validators, they should be as straight forward to use as this:

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

  react-reform aims to keep all optional dependencies out of the core. For example validations: If you start off, simply `import "react-reform/opt/validators"` for a basic set of validations (like `is-required` `has-maxlength={140}`. Most bigger projects, however, most likely will come up with their own set of validations. Here's the good news: if you don't import any `opt` modules, they won't be added into your bundle.

- **Strict Separation of Logic and Representation**

  The concept of _[themes](#create-a-theme)_ allows you to define all the `div`s and `className`s and/or `style`s that you need for your form. react-reform makes no assumptions about which DOM-Elements to use.

  This is also true for validations, it's up to you to define the logic which defines when you want to show error messages. (e.g. `isDirty && !isFocused` or maybe you prefer `isDirty`, it's up to you!)

## Quick Start

`npm install --save react-reform`
(or for people with less time on their hands: `npm i -S react-reform`)

It is recommended to create a _config file_ which acts as interface between your application code and react-reform.

A config file could look like this:

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
  DatePicker: wrapInput("DatePicker", DatePicker, {valueToProps: value => ({date: value})})
};

```

Now you can use the code above like this:

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

The `<Form>` component describes an individual form. It is the container for your inputs. You can use both, wrapped compents as inputs and normal components in here:

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

There are two flavours of how `<Form>`s can be used. They can either be controlled (i.e a `<Form>`'s parent owns the state), or uncontrolled (i.e the `<Form>` owns the state).

An _uncontrolled_ `<Form>` looks like this:

```javascript
<Form onSubmit={this.handleSubmit} initialModel={{first: "val1", second: "val2"}}>
  <Text name="first"/>
  <Text name="second"/>
</Form>
```

For writing a _controlled_ `<Form>` we need a bit more context:

```javascript
class extends React.Component {

  state = {
    model: {firstField: "val1", otherField: "val2"}
  }

  handleSubmit = ({firstField, otherField}) => {
    console.log(firstField, otherField);
  }

  handleFieldChange = (name, val) => {
    const {model} = this.state;
    this.setState({model: {...model, [name]: val}});
  }

  render() {
    const {model} = this.state;
    return (
      <Form onSubmit={this.handleSubmit} onFieldChange={this.handleFieldChange} model={model}>
        <Text name="firstField"/>
        <Text name="otherField" disabled={model.firstField === "foo"}/>
      </Form>
    );
  }
}
```

#### Props

##### `onSubmit(data)` _required_

is called when the form is submitted _and_ all the validations pass.

You may return a Promise. If this promise resolves successfully, then the form will be reset. This means the values will be set to the `initalModel` (if the form is uncontrolled), and field attributes like `touched` and `dirty` will be set to `false`.

If the promise is rejected, react-reform will evaluate the contents of the rejection. If it is an object, then it will look wether the keys correspond to fieldnames and create a validation error for this field. In all other cases the error object will be added to the `globalErrors` attribute that can be accessed in the theme's `<FormContainer>`

##### `initialModel`

Optional default values for your uncontrolled form.

##### `model`

required form values for your controlled form. Needs to be an object. Each input of your form has a `name` prop. Its value needs to be present as a key in the model.

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

`<FormContainer>` will render the actual `<form>` DOM node. Within this Container you need to define the position of the fields supplied by the user and probably also a submit button.

The `<Fields>` component defines how each field (like e.g. `<Text>` or `<Select>`) is being rendered.

A more complete example can be found [here](./src/opt/theme-bootstrap.js).

#### formContainerOpts

##### `globalErrors`

if the `<Form>`'s `onSubmit` handler returns a promise that will be rejected, the non-field-specific error messages will be listed here. Note that `globalErrors` is an Array.

##### `submitForm`

useful if you have several ways of submitting a form (either via multiple submit buttons, or for example when leaving focus of a field.) Have a look at the [Recipes](#recipes) for some examples.

##### `status`

can be one of these values:

- `unsubmitted` initial value
- `preSubmitFail` if form submit failed because validation rules returned non-`true` values
- `pending` if `onSubmit` returns a promise which hasn't beend resolved or rejected yet
- `postSubmitFail` if `onSubmit` promise was rejected
- `success` if `onSubmit` was resolved

the value of `status` if `onSubmit` did not return a promise should currently be considered as undefined. If you have an idea for a good generic behaviour here please let me know!

##### `formProps`

this key contains all props that were passed to the user's `<Form>` component. This could be used to allow your theme users to define a custom submit button label as shown in this [Recipe](#theme-with-custom-button-text).

##### `isValid`

is `true` if all validators on all fields return `true`.

##### `validations`

contains a map from a field name to it's validation list. To see what such a validation list looks like, checkout the [`<Fields>`](#fields) section.


#### `<FormContainer>`

This component is used to describe the overall structure of your form. All props defined on this component are passed directly to the underlying `<form>`.

#### `<Fields>`

This component determines the location of the contents of a theme user's `<Form>`. All props passed to this component will be passed to an underlying `<div>`.

The child-function passed to the `<Field>` component plays a crucial role however. It describes how each field should be wrapped.

Let's have a look at the child-function again:

```javascript
<Fields>{(Field, fieldOpts) => ...}
```

The first argument represents the actual field (which was defined within the theme user's `<Form>`)

the `fieldOpts` contain a lot of important values for displaying e.g. labels and validation messages:

##### `label`

contains the value passed in the input's `label`. If there is no `label`-prop present the `name` will be used.

##### `validations`

contains an object with the current validation state of all validators for this field. It has a shape like this:

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

contains the type of input. It's the first argument of the `wrapInput` function and can be used to treat e.g. `Checkbox`es differently within your theme

##### `id`

a computed unique id which can be used to establish a connection between a label and the input via `htmlFor` and `id`.

##### `isDirty`

is `true` when the field was changed

##### `isFocused`

is `true` when the field currently is focused

##### `isTouched`

is `true` when the field was focused once

##### `fieldProps`

contains the props passed to the input by the theme's user.

### Custom Inputs via `wrapInput`

react-reform only allows the use of _controlled_ inputs. I.e. it requires that the input defines a prop pair like `onChange` and `value`.

Given this preqrequisite, wrapping custom form inputs is fairly straight forward using the `wrapInput` method provided via `import {wrapInput} from "react-reform"`.

`wrapInput` accepts the follwing parameters: `wrapInput(name, Component, opts)`

#### `name`

This parameter serves for setting a proper display name for the wrapper class and, more importantly, is passed as `type` to a theme's `<Field>` definition. This way you could treat certain inputs differntly within your theme.

#### `Component`

This can be either a string for wrapping a DOM node (like e.g. `"select"` or `"input"`), or a react component like e.g. a DatePicker Component.

#### `opts`

Is an optional object to account for non-default behaviour of the component.

##### `defaultProps`

props that should always be passed to the component. This is useful for example for the various `<input>` variants:
```
wrapInput("Password", "input", {
  defaultProps: {type: "password"},
  extractValueFromOnChange: e => e.target.value
});
```

##### `extractValueFromOnChange` _default: `value => value`_

This option defines how the value is extracted from the `onChange` event of the component.

For DOM-based inputs the value looks like `{extractValueFromOnChange: e => e.target.value}`

##### `valueToProps` _default: `value => ({value: value})`_

Defines how the value is being passed to the underlying components via its props.

##### `propNameForOnChange` _default: `onChange`

Defines the prop name for listening to change events.

#### Examples:

Let's have a look at various date pickers

##### [react-datepicker](https://github.com/Hacker0x01/react-datepicker)

```javascript
const DatePicker1 = wrapInput("DatePicker1", require("react-datepicker"), {
  valueToProps: value => ({selected: value})
});
```

##### [react-date-picker](https://github.com/zippyui/react-date-picker)

```javascript
const DatePicker2 = wrapInput("DatePicker2", require("react-date-picker"), {
  valueToProps: value => ({date: value})
});
```

##### [Belle's DatePicker](https://nikgraf.github.io/belle/#/component/date-picker)

```javascript
const DatePicker3 = wrapInput("DatePicker3", require("belle").DatePicker, {
  valueToProps: value => ({date: value})
  propNameForOnChange: "onUpdate"
});
```

##### [react-bootstrap-daterangepicker](https://github.com/skratchdot/react-bootstrap-daterangepicker)

```javascript
const DateRangePicker = wrapInput("DateRangePicker", require("react-bootstrap-daterangepicker"), {
  valueToProps: value => value ? ({startDate: value.startDate, endDate: value.endDate}) : {},
  propNameForOnChange: "onApply",
  extractValueFromOnChange: (e, picker) => ({startDate: picker.startDate, endDate: picker.endDate})
});
```

##### Using these examples:

The date pickers can then be embedded like this:

```javascript
<Form onSubmit={this.handleSubmit} theme="my-theme-name">
  <DatePicker1 name="firstDate" is-required/>
  <DatePicker2 name="secondDate" minDate='2015-11-06' maxDate='2016-01-31'/> // props defined here get passed straight to the underlying Component
  <DatePicker3 name="thirdDate" defaultYear={new Date().getFullYear()}/>
  <DateRangePicker name="range">
    <button type="button">Open Picker</button>
  </DateRangePicker>
</Form>
```

### Validators via `registerValidator`

Validators need to be registered globally via the `registerValidator(name, opts)` methods.

Here's an example validator for ensuring a maximum length requirement:

```javascript
import {registerValidator} from "react-reform";

registerValidator("maxlength", {
  isValid: (val, ctx) => (val || "").toString().length <= ctx.opts,
  hintMessage: (val, ctx) => `needs to have ${ctx.opts} characters or less`,
  errorMessage: (val, ctx) => {
    const currLength = (val || "").toString().length;
    return `maximal length: ${currLength}/${ctx.opts}`;
  }
});
```

#### `name`

The name is used for assigning this validator to an input. _A validator name has to be prefixed with either `is-` or `has-` when applied to an input._ If you name your validator `required` or `maxlength`, you need to apply them like `<Text name="..." is-required has-maxlength={5}/>` (or even `<Text name="..." has-required is-maxlength={5}/>` if you really feel like it)

#### `opts`

The `opts` needs to be either an object of the shape `{isValid: ..., hintMessage: ..., errorMessage: ...}` or a function which returns an object of this shape.
If it is a function this function will be invoked when mounting an input. This will be useful for caching validation results – especially for async validators (See below).

 `isValid`, `hintMessage` and `errorMessage` all are functions with the same two first parameters:

- `value` represents the input's current value.
- `ctx` has this shape: `{opts: ...}`
  - `opts` represent the value passed to the `is-[validatorname]` or `has-[validatorname]` prop. Please note that e.g. `has-maxlength={5}` is different from `has-maxlength="5"`!

##### `isValid(value, ctx, validateAgainCb)`

This function should usually return `true` or `false`. But you can return whatever you want, which is useful to represent a _pending_ state for async validations. The returned value is accessible through the theme's `<Field>` [children-function](#validations).

A form won't submit unless all validators return `true`.

The purpose of `value` and `ctx` is explained above. The third parameter `validateAgainCb` is useful for async validations. Once you've received an answer from your server, you can store the result and call `validateAgainCb()` to re-run the validation on this input. Here's some example code:

```javascript
import {registerValidator} from "react-reform";

registerValidator("unique-name", () => {
  // this variable is scoped to a field, and gets created when the field is mounted
  const cachedData = {};

  return {
    isValid: (value, ctx, validateAgainCb) => {
      // if we haven't seen this value before, fetch information from the server
      if (cachedData[value] === undefined) {
        // while we don't know the answer just set the value to "pending"
        cachedData[value] = "pending";

        getDataFromServer(SERVERURL, {name: value}).then(result => {
          // now that we now the answer for this value, save it, and ask react-reform to validate the input again.
          cachedData[value] = result;
          validateAgainCb();
        })
      }
      return cachedData[value];
    },
    errorMessage: val => `'${val}' is not unique`,
    hintMessage: () => "needs to be a unique name"
  };
});
```

##### `hintMessage(value, ctx)` _optional_

the return value of this function is accessible through the theme's `<Field>` [children-function](#validations). If no `hintMessage` function is provided the output of the `errorMessage` will be used.

##### `errorMessage(value, ctx)`

the return value of this function is accessible through the theme's `<Field>` [children-function](#validations).

## Recipes

### Add a * to all required Fields

```javascript
registerTheme("starTheme", (FormContainer, Fields) => (
  <FormContainer className="star-form-class">
    <Fields>
      {(Field, {label, validations}) => {
        const isRequired = validations.some(({type}) => type === "required");
        return (
          <div>
            <label>{label}{isRequired ? "*" : ""}</label>
            <Field/>
          </div>
        );
      }}
    </Fields>
    <button>Submit</button>
  </FormContainer>
));
```

### Theme with Custom Button Text

```javascript
registerTheme("customButtonTextTheme", (FormContainer, Fields, {formProps}) => (
  <FormContainer style={{display: "flex", flexDirection: "column"}}>
    <Fields>
      {(Field, {label, validations}) => {
        return (
          <div>
            <label>{label}</label>
            <Field/>
          </div>
        );
      }}
    </Fields>
    <button>{formProps.buttonText || "Submit"}</button>
  </FormContainer>
));
```

This can then be used like

```javascript
<Form theme="customButtonTextTheme" buttonText="Click me now!" onSubmit={...}>
  <Text name="username"/>
</Form>
```

### Multiple Submit Buttons


Imagine a form like github's issue comments with two buttons: "comment" and "comment and close"

```javascript
registerTheme("comment-theme", (FormContainer, Fields, {submitForm}) => (
  <FormContainer>
    <Fields>
      {(Field, {label, validations}) => {
        return (
          <div>
            <label>{label}</label>
            <Field/>
          </div>
        );
      }}
    </Fields>
    <button onClick={event => submitForm(event, {close: false})}>Comment</button>
    <button onClick={event => submitForm(event, {close: true})}>Comment & Close</button>
  </FormContainer>
));
```

this can be used like this:

```javascript
handleSubmit = ({comment}, event, {close}) => {
  console.log(comment, close);
}

render() {
  return (
    <Form onSubmit={this.handleSubmit} theme="comment-theme">
      <Textarea name="comment" is-required has-minlength={2}/>
    </Form>
  );
}
```

### Submit on Blur

```javascript
registerTheme("submit-on-blur", (FormContainer, Fields, {submitForm}) => (
  <FormContainer>
    <Fields>
      {(Field, {label, fieldProps}) => {
      return (
        <div>
          <label>{label}</label>
          <Field onBlur={fieldProps.submitOnBlur ? submitForm : undefined}/>
        </div>
      );
    }}
    </Fields>
    <button>Submit</button>
  </FormContainer>
));
```

This can then be used like

```javascript
<Form theme="submit-on-blur" buttonText="Click me now!" onSubmit={...}>
  <Text name="name" label="Your Name" is-required submitOnBlur dontFocusAfterFail/>
</Form>
```

Hint: `dontFocusAfterFail` prevents the default behaviour of focussing this field after validation failed when attempting to submit.

### Dynamic Form Inputs based on Form Value

TODO...

## FAQ

### Why are themes and validators registered globally?

Ease of use. Rather then explicitely importing or requiring each single validator or theme each time a form is used, just relying on globals seems nicer. For themes a more explict variant is possible, too. You can create a theme collection like this:

```javascript
export default const themes = {
  theme1: (FormContainer, Fields, formContainerOpts) => ...
  theme2: (FormContainer, Fields, formContainerOpts) => ...
}
```

and in your form code apply it like this:

```javascript
import themes from "./file-above";

...

return (
  <Form theme={themes.theme2} onSubmit={...}>
    <Text name="username"/>
  </Form>
)
```

If you feel this sort of API would also benefit validations, let me know in the issues!

### What's the status of this project?

This library is being used and actively developed alongside [www.codecks.io](https://www.codecks.io/). Don't expect the API to stabilise too soon. A lot still can and probably will change. Breaking changes will be marked as such in the commit history and result in a new minor version.

### _more questions?_

File an issue, and if the question seems generic enough, it will be added to the FAQ section here.

## Contribute

- clone the repo
- `npm install`
- for running examples: `npm run examples` and open `http://localhost:8080/`

## License

ISC
