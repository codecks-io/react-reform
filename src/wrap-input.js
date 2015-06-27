import React from "react";
import {getValidator} from "./validator-store";

export default function wrapInput(typeName, comp, {defaultProps = {}, controlled, uncontrolled = {}} = {}) {
  uncontrolled.extractValue = uncontrolled.extractValue || (node => node.value);
  uncontrolled.setValue = uncontrolled.setValue || ((node, value) => node.value = value);

  const factory = (typeof comp) === "string" ? React.DOM[comp] : React.createFactory(comp);
  return class extends React.Component {
    static displayName = typeName;
    static defaultProps = {
      themedFormsOptions: {}
    }

    constructor(props, context) {
      super(props, context);
      if (controlled) this.state = {value: null};
    }

    componentWillMount() {
      this.validators = {};
      this.setupValidators();
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
          return m && {propName, name: m[1], validator: getValidator(m[1])} || {};
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
      if (controlled) {
        return this.state.value;
      } else {
        return uncontrolled.extractValue(React.findDOMNode(this));
      }
    }

    setValue(value) {
      value = value || null;
      if (controlled) {
        this.setState({value}, this.validate);
      } else {
        uncontrolled.setValue(React.findDOMNode(this), value);
        this.validate();
      }
    }

    focus() {
      if (this.props.themedFormsOptions.focusAfterFail !== false) {
        React.findDOMNode(this).focus();
      }
    }

    handleChange(...args) {
      const changeFn = () => {
        this.validate();
        this.props.themedForms.setDirty(true);
      };
      if (controlled) {
        this.setState({value: controlled.onChange(...args)}, changeFn);
      } else {
        changeFn();
      }
      if (this.props.onChange) this.props.onChange(...args);
    }

    handleBlur(e) {
      this.props.themedForms.setFocused(false);
      if (this.props.onBlur) this.props.onBlur(e);
    }

    handleFocus(e) {
      this.props.themedForms.setTouched(true);
      this.props.themedForms.setFocused(true);
      if (this.props.onFocus) this.props.onFocus(e);
    }

    validate() {
      const validationResults = Object.keys(this.validators).map(name => {
        const {propName, validator} = this.validators[name];
        const value = this.extractValue();
        const ctx = {
          opts: this.props[propName]
        };
        return {
          isValid: validator.isValid(value, ctx, ::this.validate),
          errorMessage: validator.errorMessage(value, ctx),
          hintMessage: validator.hintMessage ? validator.hintMessage(value, ctx) : validator.errorMessage(value, ctx),
          type: name
        };
      });
      this.props.themedForms.onValidate(validationResults);
      return validationResults;
    }

    render() {
      const {themedForms, ...rest} = this.props;
      const controlledProp = controlled ? {[controlled.prop]: this.state.value} : {};
      return factory({
        ...defaultProps,
        ...rest,
        ...controlledProp,
        onChange: ::this.handleChange,
        onFocus: ::this.handleFocus,
        onBlur: ::this.handleBlur
      });
    }
  };
}
