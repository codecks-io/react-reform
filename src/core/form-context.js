import React from "react";

export default function(Comp) {
  return class {
    static displayName = `WithFormContext[${Comp.displayName}]`;

    render() {
      const formCtx = this.context.form !== undefined ? this.context.form : this._reactInternalInstance._context.form;
      if (!formCtx) throw new Error(`no form context found for ${Comp.displayName}`);
      let formFieldRendererCtx = this.context.formFieldRenderer !== undefined ? this.context.formFieldRenderer : this._reactInternalInstance._context.formFieldRenderer;
      return <Comp {...this.props} formCtx={formCtx} formFieldRendererCtx={formFieldRendererCtx}/>;
    }
  };
}
