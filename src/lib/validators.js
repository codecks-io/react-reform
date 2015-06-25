import {registerValidator} from "../validator-store";

registerValidator("required", {
  isValid: val => !!val,
  errorMessage: () => "is required",
  hintMessage: () => "is required"
});

registerValidator("email", {
  isValid: val => /[\w.-]+@[\w.-]+/.test(val),
  errorMessage: val => `'${val}' is not an email`,
  hintMessage: () => "email"
});

registerValidator("unique", () => {
  const data = {};
  return {
    isValid: (val, ctx, askAgain) => {
      if (data[val] === undefined) {
        data[val] = true;
        setTimeout(askAgain, 1000);
        return "pending";
      }
      return data[val];
    },
    errorMessage: val => `'${val}' is not unique`,
    hintMessage: () => "needs to be unique"
  };
});
