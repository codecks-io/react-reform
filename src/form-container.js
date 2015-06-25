import React from "react";

export default class FormContainer {
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
