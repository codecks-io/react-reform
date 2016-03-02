import React from "react";
import withFormCtx from "./form-context";

@withFormCtx
export default class Fields extends React.Component {

  static childContextTypes = {
    formFieldRenderer: React.PropTypes.func.isRequired
  };

  getChildContext() {
    const {children: renderFieldByTheme, formCtx, ...fieldsRest} = this.props;
    return {
      formFieldRenderer: (Comp, userFieldProps, registerInfo, validateFn, typeName) => {
        const validations = validateFn();
        const serverError = formCtx.serverErrors()[userFieldProps.name];
        if (serverError) validations.push(serverError);

        return renderFieldByTheme(Comp, {
          label: userFieldProps.label || userFieldProps.name,
          validations,
          type: typeName,
          id: `form-${typeName}-${registerInfo.id}`,
          fieldProps: userFieldProps,
          isDirty: registerInfo.isDirty(),
          isFocused: registerInfo.isFocused(),
          isTouched: registerInfo.isTouched()
        });
      }
    };
  }

  render() {
    const {children, formCtx, ...themeFieldsProps} = this.props;
    return <div {...themeFieldsProps}>{formCtx.getUserFormProps().children}</div>;
  }
}
