import React from "react";
import ReactDOM from "react-dom";
import {getValidator} from "./validator-store";
import withFormCtx from "./form-context";

@withFormCtx
export default function wrapInput(typeName, comp, {defaultProps = {}, extractValueFromOnChange = value => value, valueToProps = value => ({value}), propNameForOnChange = "onChange"} = {}) {

  const factory = (typeof comp) === "string" ? React.DOM[comp] : React.createFactory(comp);
  return class extends React.Component {
    static displayName = typeName;

    validators = {}

    constructor(props) {
      super(props);
      const getUserFieldProps = () => this.props;
      const getHandleChange = () => this.handleChange;
      const getHandleFocus = () => this.handleFocus;
      const getHandleBlur = () => this.handleBlur;
      const getRegisterInfo = () => this.registerInfo;
      const setInputNode = el => this.node = ReactDOM.findDOMNode(el);
      this.classPassedToTheme = class extends React.Component {

        handleBlur = (...args) => {
          getHandleBlur()(...args);
          if (this.props.onBlur) this.props.onBlur(...args);
        }

        handleFocus = (...args) => {
          getHandleFocus()(...args);
          if (this.props.onFocus) this.props.onFocus(...args);
        }

        handleChange = (...args) => {
          getHandleChange()(...args);
          if (this.props[propNameForOnChange]) this.props[propNameForOnChange](...args);
        }

        render() {
          const {formCtx, defaultValue, ...userFieldProps} = getUserFieldProps();
          return factory({
            ...this.props, // themeProps
            ...defaultProps,
            ...userFieldProps,
            [propNameForOnChange]: this.handleChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            ref: setInputNode,
            ...valueToProps(getRegisterInfo().getValue() || null)
          });
        }
      };
    }


    componentWillMount() {
      this.setupValidators();
      this.registerInfo = this.props.formCtx.registerField(this.props.name, {
        validate: this.validate,
        focus: this.focus,
        reRender: () => this.forceUpdate(),
        defaultValue: this.props.defaultValue
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setupValidators(nextProps);
    }

    componentWillUnmount() {
      this.registerInfo.unregister();
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

    focus = () => {
      if (!this.props.dontFocusAfterFail) this.node.focus();
    }

    handleChange = (...args) => {
      this.registerInfo.onChange(extractValueFromOnChange(...args));
      if (this.props.onChange) this.props.onChange(...args);
    }

    handleBlur = (e) => {
      this.registerInfo.onBlur();
      if (this.props.onBlur) this.props.onBlur(e);
    }

    handleFocus = (e) => {
      this.registerInfo.onFocus();
      if (this.props.onFocus) this.props.onFocus(e);
    }

    validate = () => {
      const validationResults = Object.keys(this.validators).map(name => {
        const {propName, validator} = this.validators[name];
        const value = this.registerInfo.getValue();
        const ctx = {
          opts: this.props[propName]
        };
        return {
          isValid: validator.isValid(value, ctx, () => {this.validate(); this.forceUpdate(); }),
          errorMessage: validator.errorMessage(value, ctx),
          hintMessage: validator.hintMessage ? validator.hintMessage(value, ctx) : validator.errorMessage(value, ctx),
          type: name
        };
      });
      return validationResults;
    }

    render() {
      const {formCtx, formFieldRendererCtx, ...rest} = this.props;
      return formFieldRendererCtx(this.classPassedToTheme, ...rest, this.registerInfo, this.validate, typeName);
    }
  };
}
