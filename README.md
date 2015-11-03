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
    import {Form, Text} from "lib/form"; // <- your setup-file

    [...]

    render() {
      return (
        <Form onSubmit={this.handleSubmit} theme="my-theme-name">
          <Text name="comment" is-required has-maxlength={140}/>
        </Form>
      )
    }
  ```

- **Small Footprint**

  react-reform aims to keep all optional dependencies out of the core. For example validations: If you start off just `import "react-reform/opt/validators"` for a basic set of validations (like `is-required` `has-maxlength="140"`, but most bigger projects probably will come up with their own set of validations and don't need this particular code in their bundle.

- **Easy to expand**

  It should be pretty simple adding your own input-types and validators.

## Quick Start

`npm install --save react-reform` (or for people with less time on their hands: `npm i -S react-reform`)

It is recommended to create a _setup-file_ which acts as interface between your application code and react-reform.

A setup file can look like this:

**lib/form.js**
```javascript

import React from "react";

import {Form, registerTheme, wrapInput} from "react-reform";

// import default inputs <Text>, <Password>, <Textarea>, <Checkbox>, <Select>
import defaultInputs from "react-reform/opt/inputs";

// globally register default set of validators
import "react-reform/opt/validators";

// import DatePicker to wrap it below
import DatePicker from "react-date-picker";
import("react-date-picker/index.css");


registerTheme("my-theme-name", (FormContainer, Fields, {globalErrors}) => (
  <FormContainer className="my-form-class">
    {globalErrors.length ? (
      globalErrors.map((error, i) => <div key={i}>{error}</div>)
    ) : null}
    <Fields>
      {(Field, {label, validations, fieldProps}) => {
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
}

```

This way you're ready to start using react-reform like this:

**quick-start-form.js**
```javascript
  import {Form, Text, DatePicker} from "lib/form";

  export default class {

    handleSubmit = ({firstName, lastName, birthday}) => {
      console.log(firstName, lastName, birthday);
    }

    render() {
      <Form onSubmit={this.handleSubmit} theme="my-theme-name">
        <Text name="fistName" label="first name" is-required has-minlength={2}/>
        <Text name="lastName" label="last name"/>
        <DatePicker name="birthday" label="your birthday" is-required/>
      </Form>
    }

  }

```

## Api-Reference

### `<Form>`

### Create a Theme

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
