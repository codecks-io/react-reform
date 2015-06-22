import React from "react";
import deepEqual from "deep-equal";

const Validators = {};

const reduxShape = React.PropTypes.shape({
  registerField: React.PropTypes.func.isRequired,
  unregisterField: React.PropTypes.func.isRequired
});

class Fields {
  static displayName = "Fields";

  static contextTypes = {
    themedForms: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.themedForms.fieldRenderer = this.props.children;
  }

  render() {
    const {children: fieldChildren, ...fieldsRest} = this.props;
    const {getFormProps, getFieldClass, getValidationResults, findChild} = this.context.themedForms;
    const fieldComps = React.Children.map(getFormProps().children, field => {
      if (field === null) return null;
      const {label, name} = field.props;
      return fieldChildren(getFieldClass(name), {
        label: label || name,
        validations: getValidationResults(name),
        type: findChild(name).type.displayName
      });
    });

    return <div {...fieldsRest}>{fieldComps}</div>;
  }
}

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
          setDirty: isDirty => themedForms.setDirty(name, isDirty)
        }
      });
    }
  };
}

class FormContainer {
  static displayName = "FormContainer";

  static contextTypes = {
    themedForms: React.PropTypes.object.isRequired
  };

  render() {
    const themeProps = this.props;
    const {onSubmit, initialData, theme, children, ...formProps} = this.context.themedForms.getFormProps();
    return <form {...themeProps} {...formProps} onSubmit={this.context.themedForms.handleSubmit}/>;
  }

}


class Form extends React.Component {
  static displayName = "Form";
  static defaultProps = {
    initialData: {}
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      validationResults: {},
      serverErrors: {$global: []}
    };
    this.fields = {};
  }

  componentWillMount() {
    this.fieldClasses = this.props.children.reduce(
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
    themedForms: reduxShape.isRequired
  };

  getChildContext() {
    return {themedForms: {
      registerField: (f, callbacks) => {this.fields[f] = callbacks; },
      unregisterField: f => {delete this.fields[f]; },
      handleSubmit: ::this.handleSubmit,
      handleValidationResults: ::this.handleValidationResults,
      findChild: name => {
        let comp = null;
        this.props.children.some(child => child.props.name === name && (comp = child));
        return comp;
      },
      getFieldClass: name => this.fieldClasses[name],
      getValidationResults: name => {
        const clientErrors = this.state.validationResults[name] || [];
        if (this.state.serverErrors[name]) clientErrors.push(this.state.serverErrors[name]);
        return clientErrors;
      },
      getFormProps: () => this.props
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
    } else {
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
            this.setState({serverErrors: {$global: []}});
          },
          errors => { // shape of error: {fieldName: error} or "global error message as string"
            const errorMessages = {$global: []};
            if (typeof errors === "string") {
              errorMessages.$global.push(errors);
            } else {
              Object.keys(errors).forEach(errorField => {
                if (this.fields[errorField]) {
                  errorMessages[errorField] = {isValid: false, errorMessage: errors[errorField], hintMessage: errors[errorField], type: "server"};
                } else {
                  errorMessages.$global.push({[errorField]: errors[errorField]});
                }
              });
            }
            this.setState({serverErrors: errorMessages});
          }
        );
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
      submitForm: ::this.handleSubmit
    });
  }
}

function createType(typeName, comp, defaultProps) {
  const factory = (typeof comp) === "string" ? React.DOM[comp] : React.createFactory(comp);
  return class {
    static displayName = typeName;

    componentWillMount() {
      this.validators = {};
      this.setupValidators();
      this.defaultValue = null;
    }

    componentDidMount() {
      this.props.themedForms.registerCallbacks({
        extractValue: ::this.extractValue,
        setValue: ::this.setValue,
        validate: ::this.validate,
        focus: ::this.focus
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setupValidators(nextProps);
    }

    setupValidators(props = this.props) {
      const nextValidators = Object.keys(props)
        .map(propName => {
          const m = propName.match(/(?:is|has)-([\w\-]+)/);
          return m && {propName, name: m[1], validator: Validators[m[1]]} || {};
        })
        .filter(({propName, name, validator}) => {
          if (propName && !validator) console.warn(`received validator-like prop '${propName}' without registered validator '${name}'`);
          return validator && props[propName];
        });

      Object.keys(this.validators).forEach(name => {
        if (!nextValidators.some(({name: nextName}) => nextName === name)) {
          delete this.validators[name];
        }
      });

      nextValidators.forEach(({propName, name, validator}) => {
        if (!this.validators[name]) {
          this.validators[name] = {
            propName,
            name,
            validator: typeof validator === "function" ? validator() : validator
          };
        }
      });
    }

    extractValue() {
      return React.findDOMNode(this).value;
    }

    setValue(val) {
      React.findDOMNode(this).value = val || null;
      this.defaultValue = val || null;
      this.validate();
    }

    focus() {
      React.findDOMNode(this).focus();
    }

    handleChange(e) {
      this.validate();
      if (this.props.onChange) this.props.onChange(e);
    }

    validate() {
      const validationResults = Object.keys(this.validators).map(name => {
        const {propName, validator} = this.validators[name];
        const value = this.extractValue();
        const ctx = {
          opts: this.props[propName],
          name,
          value
        };
        return {
          isValid: validator.isValid(value, ctx, ::this.validate),
          errorMessage: validator.errorMessage(value, ctx),
          hintMessage: validator.hintMessage(value, ctx),
          type: name
        };
      });
      this.props.themedForms.onValidate(validationResults);
      return validationResults;
    }

    render() {
      const {themedForms, onChange, ...rest} = this.props;
      return factory({...defaultProps, ...rest, onChange: ::this.handleChange});
    }
  };
}

const Text = createType("Text", "input", {type: "text"});

Validators.required = {
  isValid: val => !!val && val.trim().length > 0,
  errorMessage: () => "is required",
  hintMessage: () => "is required"
};

Validators.email = function() {
  return {
    isValid: val => /[\w.-]+@[\w.-]+/.test(val),
    errorMessage: val => `'${val}' is not an email`,
    hintMessage: () => "email"
  };
};

Validators.unique = function() {
  return {
    isValid: (val, ctx, done) => {setTimeout(done, 1000); return "processing"; }
  };
};

export default {Text, Form};
