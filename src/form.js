import React from "react";
import deepEqual from "deep-equal";

import FormContainer from "./form-container";
import Fields from "./fields";

function createFieldClass(name) {
  return class Field {
    static displayName = `Field[${name}]`;

    static contextTypes = {
      themedForms: React.PropTypes.object.isRequired
    };

    componentWillUnmount() {
      this.context.themedForms.unregisterField(name);
    }

    render() {
      const {themedForms} = this.context;
      return React.cloneElement(themedForms.findChild(name), {
        ...this.props,
        themedForms: {
          registerCallbacks: callbacks => themedForms.registerField(name, callbacks),
          submitForm: themedForms.handleSubmit,
          onValidate: results => themedForms.handleValidationResults(name, results),
          setDirty: isDirty => themedForms.setDirty(name, isDirty),
          setTouched: isTouched => themedForms.setTouched(name, isTouched),
          setFocused: isFocused => themedForms.setFocused(isFocused ? name : null)
        }
      });
    }
  };
}

export default class Form extends React.Component {
  static displayName = "Form";
  static defaultProps = {
    initialData: {}
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      validationResults: {},
      serverErrors: {$global: []},
      dirtyFields: {},
      touchedFields: {},
      focusedField: null,
      hasFailedToSubmit: false
    };
    this.fields = {};
  }

  componentWillMount() {
    const {children} = this.props;
    this.fieldClasses = (Array.isArray(children) ? children : [children]).reduce(
      (memo, child) => {
        memo[child.props.name] = createFieldClass(child.props.name);
        return memo;
      },
      {}
    );
  }

  componentDidMount() {
    Object.keys(this.fields).forEach(fieldName => {
      this.fields[fieldName].setValue(this.props.initialData[fieldName] || null);
    });
  }

  static childContextTypes = {
    themedForms: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {themedForms: {
      registerField: (f, callbacks) => {this.fields[f] = callbacks; },
      unregisterField: f => {delete this.fields[f]; },
      handleSubmit: ::this.handleSubmit,
      handleValidationResults: ::this.handleValidationResults,
      findChild: name => {
        let comp = null;
        const {children} = this.props;
        (Array.isArray(children) ? children : [children]).some(child => child.props.name === name && (comp = child));
        return comp;
      },
      getFieldClass: name => this.fieldClasses[name],
      getValidationResults: name => {
        const clientErrors = this.state.validationResults[name] || [];
        if (this.state.serverErrors[name]) clientErrors.push(this.state.serverErrors[name]);
        return clientErrors;
      },
      getFormProps: () => this.props,
      setDirty: (name, val) => {
        const {dirtyFields} = this.state;
        dirtyFields[name] = val;
        this.setState({dirtyFields});
      },
      isDirty: name => !!this.state.dirtyFields[name],
      setTouched: (name, val) => {
        const {touchedFields} = this.state;
        touchedFields[name] = val;
        this.setState({touchedFields});
      },
      isTouched: name => !!this.state.touchedFields[name],
      setFocused: name => this.setState({focusedField: name}),
      isFocused: name => this.state.focusedField === name,
      hasFailedToSubmit: () => this.state.hasFailedToSubmit
    }};
  }

  handleSubmit(e, ...args) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    let firstErrorField = null;
    let hasErrors = false;
    Object.keys(this.fields).forEach(fieldName => {
      this.fields[fieldName].validate().forEach(validation => {
        if (validation.isValid !== true) hasErrors = true;
        if (validation.isValid === false && !firstErrorField) firstErrorField = this.fields[fieldName];
      });
    });
    if (hasErrors) {
      if (firstErrorField) firstErrorField.focus();
      this.setState({hasFailedToSubmit: true});
    } else {
      this.setState({hasFailedToSubmit: false});
      const values = Object.keys(this.fields)
        .map(fieldName => ({fieldName, validationResults: this.fields[fieldName].validate(), value: this.fields[fieldName].extractValue()}))
        .reduce(
          (memo, {fieldName, value}) => {
            memo[fieldName] = value;
            return memo;
          },
          {}
        );
      const result = this.props.onSubmit(values, e, ...args);
      if (typeof result.then === "function") {
        result.then(
          () => { // success
            this.setState({
              serverErrors: {$global: []},
              touchedFields: {},
              dirtyFields: {}
            });
          },
          errors => { // shape of error: {fieldName: error} or "global error message as string"
            const errorMessages = {$global: []};
            if (typeof errors === "string") {
              errorMessages.$global.push(errors);
            } else {
              Object.keys(errors).forEach(errorField => {
                if (this.fields[errorField]) {
                  errorMessages[errorField] = {
                    isValid: false,
                    errorMessage: errors[errorField],
                    hintMessage: errors[errorField],
                    type: "server"
                  };
                } else {
                  errorMessages.$global.push({[errorField]: errors[errorField]});
                }
              });
            }
            this.setState({serverErrors: errorMessages});
          }
        );
      } else {
        this.setState({touchedFields: {}, dirtyFields: {}});
      }
    }
  }

  handleValidationResults(fieldName, results) {
    const {validationResults} = this.state;
    if (!deepEqual(validationResults[fieldName], results)) {
      validationResults[fieldName] = results;
      this.setState(validationResults);
    }
  }

  render() {
    const {theme} = this.props;
    return theme(FormContainer, Fields, {
      globalErrors: this.state.serverErrors.$global,
      submitForm: ::this.handleSubmit,
      hasFailedToSubmit: this.state.hasFailedToSubmit,
      validations: this.state.validationResults
    });
  }
}
