// <Text is-required/>

// taken from here: http://stackoverflow.com/a/1373724/616974
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

export default {
  required: {
    isValid: val => val === 0 || (!!val && (typeof val !== 'string' || val.trim().length > 0)),
    errorMessage: () => 'is required',
    hintMessage: () => 'is required'
  },

  // <Text is-email/>
  email: {
    isValid: val => emailRegex.test(val),
    errorMessage: () => 'is not a valid email address',
    hintMessage: () => 'needs to be an email'
  },

  // <Text has-minlength={5}/>
  minlength: {
    isValid: (val, {arg}) => (val || '').toString().length >= arg,
    errorMessage: (val, {arg}) => {
      const currLength = (val || '').toString().length
      return `minimal length: ${currLength}/${arg}`
    }
  },

  // <Text has-maxlength={5}/>
  maxlength: {
    isValid: (val, {arg}) => (val || '').toString().length <= arg,
    errorMessage: (val, {arg}) => {
      const currLength = (val || '').toString().length
      return `maximal length: ${currLength}/${arg}`
    }
  },


  // <Text has-pattern={/^\d+(\.\d+)?$/}/>
  pattern: {
    isValid: (val, {arg}) => (typeof arg === 'string' ? new RegExp(arg) : arg).test(val),
    errorMessage: val => `'${val}' is not valid`,
    hintMessage: (val, {arg}) => `needs to correspond to this pattern: ${arg}`
  }
}
