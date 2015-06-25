const Validators = {};

export function registerValidator(name, validator) {
  Validators[name] = validator;
}

export function getValidator(name) {
  return Validators[name];
}
