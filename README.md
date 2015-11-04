# react-<i>re</i>form

A React Form Framework

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
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

My main struggle with other libraries was the lack of separation of logic and representation. This is why this library was created.

The goal is to put you in full control of:

 - What DOM-Structure to use for displaying your fields
 - What DOM-Structure to use for displaying your form
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

export default class {

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
const myMinimalTheme = (FormContainer, Fields) => (
  <FormContainer className="my-form-class">
    <Fields>
      {(Field, {label}) => {
        return (
          <Field className="my-form-field-class"/>
        );
      }}
    </Fields>
    <button>Submit</button>
  </FormContainer>
)
```

#### `<FormContainer>`

#### `<Fields>`

### Custom Inputs

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
