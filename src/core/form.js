import React from "react";

import FormContainer from "./form-container";
import Fields from "./fields";
import {getTheme} from "./theme-store";

let idCounter = 0;

export default class Form extends React.Component {

  static defaultProps = {
    model: null,
    initialModel: {},
    theme: "default",
    onFieldChange: () => {}
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      serverErrors: {$global: []},
      fields: {},
      status: "unsubmitted"
    };
    this.isUnmounted = false;
  }

  static childContextTypes = {
    form: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {form: {
      // this will be called whenever a wrapped input gets mounted
      // it provides properties to interact with it and it receives
      // an object the input can call to ask about it's properties
      registerField: (name, {focus, validate, reRender, defaultValue}) => {
        const {fields} = this.state;
        const initialValue = this.props.model ? this.props.model[name] : defaultValue || this.props.initialModel[name];
        fields[name] = {
          focus, validate, reRender,
          value: initialValue,
          touched: false,
          focused: false,
          dirty: false,
          validations: validate(initialValue)
        };
        this.setState({fields});
        return {
          id: idCounter += 1,
          unregister: () => {delete this.state.fields[name]; this.setState({fields: this.state.fields}); },
          getValue: () => this.props.model ? this.props.model[name] : this.state.fields[name].value,
          isDirty: () => this.state.fields[name].dirty,
          isFocused: () => this.state.fields[name].focused,
          isTouched: () => this.state.fields[name].touched,
          onFocus: () => {
            const field = this.state.fields[name];
            field.touched = true;
            field.focused = true;
            this.setState({fields: this.state.fields}, reRender);
          },
          onBlur: () => {
            const field = this.state.fields[name];
            field.focused = false;
            this.setState({fields: this.state.fields}, reRender);
          },
          onChange: (val) => {
            const field = this.state.fields[name];
            if (this.props.onFieldChange(name, val) !== false) {
              if (!this.props.model) {
                field.value = val;
                field.validations = field.validate(val);
              }
              field.dirty = true;
              this.setState({fields: this.state.fields}, reRender);
            }
          },
          reValidate: () => {
            const field = this.state.fields[name];
            const value = this.props.model ? this.props.model[name] : field.value;
            field.validations = field.validate(value);
            this.setState({fields: this.state.fields}, reRender);
          }
        };
      },
      getUserFormProps: () => this.props,
      getHandleSubmit: () => this.handleSubmit,
      getFieldValidations: (fieldName) => this.state.fields[fieldName].validations,
      serverErrors: () => this.state.serverErrors
    }};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model) {
      const {fields} = this.state;
      Object.keys(fields).forEach(name => {
        const field = fields[name];
        field.validations = field.validate(nextProps.model[name]);
      });
      this.setState({fields});
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  reset({status = "UNCERTAIN STATUS"} = {}) {
    const {fields} = this.state;
    Object.keys(fields).forEach(name => {
      const field = fields[name];
      field.touched = false;
      field.dirty = false;
      field.value = this.props.model ? this.props.model[name] : this.props.initialModel[name];
    });
    const newState = {fields: fields};
    if (status !== undefined) newState.status = status;
    this.setState(newState, Object.keys(fields).forEach(name => fields[name].reRender()));
  }

  handleSubmit = (e, ...args) => {
    const {fields} = this.state;
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    let firstErrorField = null;
    let hasErrors = false;
    Object.keys(fields).forEach(name => {
      const value = this.props.model ? this.props.model[name] : this.state.fields[name].value;
      fields[name].validate(value).forEach(validation => {
        if (validation.isValid !== true) hasErrors = true;
        if (validation.isValid === false && !firstErrorField) firstErrorField = fields[name];
      });
    });
    if (hasErrors) {
      if (firstErrorField) firstErrorField.focus();
      this.setState({status: "preSubmitFail"}, Object.keys(fields).forEach(name => fields[name].reRender()));
    } else {
      this.setState({serverErrors: {$global: []}});
      const values = Object.keys(fields).reduce(
          (memo, name) => {
            memo[name] = this.props.model ? this.props.model[name] : fields[name].value;
            return memo;
          },
          {}
        );
      const result = this.props.onSubmit(values, e, ...args);
      if (result && typeof result.then === "function") {
        this.setState({status: "pending"}, Object.keys(fields).forEach(name => fields[name].reRender()));
        result.then(() => { // success
          if (this.isUnmounted) return;
          this.reset({status: undefined});
          this.setState({
            serverErrors: {$global: []},
            status: "success"
          });
        }).catch(errors => { // shape of error: {fieldName: error} or "global error message as string"
          // if it's a real Error, throw it!
          if (errors instanceof Error) {
            setTimeout(() => {console.error("onSubmit threw:", errors); });
            throw errors;
          }
          if (this.isUnmounted) return;
          const errorMessages = {$global: []};
          if (typeof errors === "string" || React.isValidElement(errors)) {
            errorMessages.$global.push(errors);
          } else {
            Object.keys(errors).forEach(errorField => {
              if (fields[errorField]) {
                errorMessages[errorField] = {
                  isValid: false,
                  errorMessage: errors[errorField],
                  hintMessage: errors[errorField],
                  type: "server"
                };
                if (!firstErrorField) {
                  firstErrorField = fields[errorField];
                  firstErrorField.focus();
                }
              } else {
                errorMessages.$global.push({[errorField]: errors[errorField]});
              }
            });
          }
          this.setState({
            serverErrors: errorMessages,
            status: "postSubmitFail"
          }, Object.keys(fields).forEach(name => fields[name].reRender()));
        });
      } else {
        this.reset();
      }
    }
  }

  render() {
    const {theme} = this.props;
    let themeFn;
    if (typeof theme === "string") {
      themeFn = getTheme(theme);
      if (!themeFn && theme !== "default") {
        console.warn(`no theme named "${theme}" falling back to "default"`);
        themeFn = getTheme("default");
      }
      if (!themeFn) {
        console.error(`found no theme for "default"`);
        return <div style={{backgroundColor: "red", color: "white"}}>No Theme for this Form</div>;
      }
    } else {
      themeFn = theme;
    }

    const {fields, status, serverErrors} = this.state;

    return themeFn(FormContainer, Fields, {
      globalErrors: serverErrors.$global,
      submitForm: this.handleSubmit,
      formProps: this.props,
      status,
      validations: Object.keys(fields).reduce((m, f) => {m[f] = fields[f].validations; return m; }, {}),
      isValid: Object.keys(fields).every(f => fields[f].validations.every(v => v.isValid === true))
    });
  }
}
