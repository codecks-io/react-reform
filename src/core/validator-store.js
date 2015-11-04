const validators = {};

export function registerValidator(name, validator) {
  validators[name] = validator;
}

export function getValidator(name) {
  return validators[name];
}
