# React-Themed-Forms

Because your forms are as individual as you are.

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
  - [ ] test cases
  - [x] standard lib of validators
    - [x] required
    - [x] email
    - [x] minlength
    - [x] maxlength
    - [x] pattern
  - [x] sample bootstrap theme
  - [ ] themes can be registered
  - [ ] uuids for htmlFor and input ids
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

  maybe all fields should be stateful, providing a onChange callback to the form? how about contenteditable though (can't see how to possibly make this controlled without *a lot* of effort)?

## Contribute

  please do(n't quite yet)!
  _(TODO: state the philosophy of what this package is about somewhere)_

  - clone the repo
  - `npm install`
  - for running examples: `npm run examples` and open `http://localhost:8080/`