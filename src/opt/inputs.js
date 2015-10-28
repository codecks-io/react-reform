import wrapInput from "../wrap-input";

export const Text = wrapInput("Text", "input", {defaultProps: {type: "text"}});
export const Textarea = wrapInput("Textarea", "textarea");
export const Password = wrapInput("Password", "input", {defaultProps: {type: "password"}});
export const Select = wrapInput("Select", "select");

export const Checkbox = wrapInput("Checkbox", "input", {
  defaultProps: {type: "checkbox"},
  extractValueFromOnChange: e => e.target.checked,
  propNameForValue: "checked"
});
