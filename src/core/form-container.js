import React from "react";
import withFormCtx from "./form-context";

@withFormCtx
export default class FormContainer extends React.Component {

  render() {
    const {...themeFormProps, formCtx} = this.props;
    const {model, initialModel, theme, children, ...userFormProps} = formCtx.getUserFormProps();
    return <form {...themeFormProps} {...userFormProps} onSubmit={formCtx.getHandleSubmit()}/>;
  }

}
