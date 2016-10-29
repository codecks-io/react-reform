
export default function({renderForm, renderField, validationLabels = {}}) {
  if (!renderForm) throw new Error('create Theme needs "renderForm" function')
  if (!renderField) throw new Error('create Theme needs "renderField" function')
  return {renderForm, renderField, validationLabels}
}