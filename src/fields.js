import React from "react";

export default class Fields {
  static displayName = "Fields";

  static contextTypes = {
    themedForms: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.themedForms.fieldRenderer = this.props.children;
  }

  render() {
    const {children: fieldChildren, ...fieldsRest} = this.props;
    const {
      getFormProps,
      getFieldClass,
      getValidationResults,
      findChild,
      isDirty,
      isTouched,
      isFocused,
      hasFailedToSubmit,
      getId
    } = this.context.themedForms;
    const fieldComps = React.Children.map(getFormProps().children, field => {
      if (field === null) return null;
      const {label, name} = field.props;
      return fieldChildren(getFieldClass(name), {
        label: label || name,
        validations: getValidationResults(name),
        type: findChild(name).type.displayName,
        isDirty: isDirty(name),
        isTouched: isTouched(name),
        isFocused: isFocused(name),
        hasFailedToSubmit: hasFailedToSubmit(),
        fieldProps: field.props,
        id: getId(name)
      });
    });

    return <div {...fieldsRest}>{fieldComps}</div>;
  }
}
