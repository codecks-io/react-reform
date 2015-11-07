import wrapInput from "../core/wrap-input";

export const Text = wrapInput("Text", "input", {
  defaultProps: {type: "text"},
  extractValueFromOnChange: e => e.target.value
});

export const Textarea = wrapInput("Textarea", "textarea", {
  extractValueFromOnChange: e => e.target.value
});

export const Password = wrapInput("Password", "input", {
  defaultProps: {type: "password"},
  extractValueFromOnChange: e => e.target.value
});

export const Select = wrapInput("Select", "select", {
  extractValueFromOnChange: e => e.target.value
});

export const Checkbox = wrapInput("Checkbox", "input", {
  defaultProps: {type: "checkbox"},
  extractValueFromOnChange: e => e.target.checked,
  valueToProps: value => ({checked: value})
});
