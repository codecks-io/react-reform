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
      hasFailedToSubmit: false,
      fields: {}
    };
  }

  static childContextTypes = {
    form: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {form: {
      registerField: (name, {focus, validate, reRender}) => {
        const {fields} = this.state;
        fields[name] = {
          focus, validate, reRender,
          value: this.props.model ? undefined : this.props.initialModel[name],
          touched: false,
          focused: false,
          dirty: false
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
            field.toched = true;
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
              if (!this.props.model) field.value = val;
              field.touched = true;
              field.dirty = true;
              this.setState({fields: this.state.fields}, reRender);
            }
          }
        };
      },
      getUserFormProps: () => this.props,
      getHandleSubmit: () => this.handleSubmit,
      getHasFailedToSubmit: () => this.state.hasFailedToSubmit
    }};
  }

  reset() {
    const {fields} = this.state;
    Object.keys(fields).forEach(name => {
      const field = fields[name];
      field.touched = false;
      field.dirty = false;
      field.value = this.props.model ? undefined : this.props.initialModel[name];
    });
    this.setState({fields: fields}, Object.keys(fields).forEach(name => fields[name].reRender()));
  }

  handleSubmit = (e, ...args) => {
    const {fields} = this.state;
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    let firstErrorField = null;
    let hasErrors = false;
    Object.keys(fields).forEach(name => {
      fields[name].validate().forEach(validation => {
        if (validation.isValid !== true) hasErrors = true;
        if (validation.isValid === false && !firstErrorField) firstErrorField = fields[name];
      });
    });
    if (hasErrors) {
      if (firstErrorField) firstErrorField.focus();
      this.setState({hasFailedToSubmit: true}, Object.keys(fields).forEach(name => fields[name].reRender()));
    } else {
      this.setState({hasFailedToSubmit: false});
      const values = Object.keys(fields).reduce(
          (memo, name) => {
            memo[name] = this.props.model ? this.props.mode[name] : fields[name].value;
            return memo;
          },
          {}
        );
      const result = this.props.onSubmit(values, e, ...args);
      if (result && typeof result.then === "function") {
        result.then(
          () => { // success
            this.setState({
              serverErrors: {$global: []}
            });
            this.reset();
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
    return themeFn(FormContainer, Fields, {
      globalErrors: this.state.serverErrors.$global,
      submitForm: this.handleSubmit,
      hasFailedToSubmit: this.state.hasFailedToSubmit,
      formProps: this.props
    });
  }
}
