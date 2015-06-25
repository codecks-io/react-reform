import wrapInput from "../wrap-input";

export const Text = wrapInput("Text", "input", {defaultProps: {type: "text"}});

export const Checkbox = wrapInput("Checkbox", "input", {
  defaultProps: {type: "checkbox"},
  uncontrolled: {
    extractValue: node => node.checked,
    setValue: (node, value) => node.checked = !!value
  }
});
