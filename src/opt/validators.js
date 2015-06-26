import {registerValidator} from "../validator-store";

// <Text is-required/>
registerValidator("required", {
  isValid: val => val === 0 || !!val && (typeof val !== "string" || val.trim().length > 0),
  errorMessage: () => "is required",
  hintMessage: () => "is required"
});

// taken from here: http://stackoverflow.com/a/1373724/616974
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

// <Text is-email/>
registerValidator("email", {
  isValid: val => emailRegex.test(val),
  errorMessage: () => `is not a valid email address`,
  hintMessage: () => "needs to be an email"
});

// <Text has-minlength={5}/>
registerValidator("minlength", {
  isValid: (val, opts) => (val || "").toString().length >= opts,
  errorMessage: (val, opts) => {
    const currLength = (val || "").toString().length;
    return `minimal length: ${currLength}/${opts}`;
  }
});

// <Text has-maxlength={5}/>
registerValidator("maxlength", {
  isValid: (val, opts) => (val || "").toString().length <= opts,
  errorMessage: (val, opts) => {
    const currLength = (val || "").toString().length;
    return `maximal length: ${currLength}/${opts}`;
  }
});


// <Text has-pattern={/^\d+(\.\d+)?$/}/>
registerValidator("pattern", {
  isValid: (val, opts) => (typeof opts === "string" ? new RegExp(opts) : opts).test(val),
  errorMessage: val => `'${val}' is not valid`,
  hintMessage: (val, opts) => `needs to correspond to this pattern: ${opts}`
});

registerValidator("dummy-unique", () => { // to be moved to example section
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
