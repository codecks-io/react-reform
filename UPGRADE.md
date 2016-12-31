# 0.5 -> 1.0

First off the good news: The whole React Reform experiences is now much more rounded. Also: existing your `<Form>`'s don't need to be updated. But probably everything else.

Let's have a look at the details:

## ReformContext

Rather than registering themes and validations in some global module, you now need to use ReformContext. [Check out the docs](http://react-reform.codecks.io/docs/reform-context/) for more details.

## Creating themes

For creating themes you now have to use the `createTheme(themeObj)` method. You probably don't have to change too much. You need to replace the old `<Fields>[fieldDescription]</Fields>` component by `children` and the `fieldDescription` now gets its place under the `renderField` key within the `themeObj`. The docs explain all [the details](http://react-reform.codecks.io/docs/themes/).

## Wrapping inputs

Got a lot more powerful and explicit. There's a [`simpleInputWrapper`](./src/opt/inputs.js) that almost looks like the old `wrapInput`. Have a look at this and [the docs](http://react-reform.codecks.io/docs/wrap-input/) to see how to migrate your code

## Validations vs validators

Instead of `validators` we're now more consistently using `validations` everywhere. This also means that you need to do `import defaultValidations from 'react-reform/opt/validations'` to import the default validations.

## Form methods

If you were calling `validate()` on the `<Form>`'s reference. You now need to call `checkForErrors()`.
