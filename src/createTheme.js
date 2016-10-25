
export default function(data) {
  if (!data.renderForm) throw new Error('create Theme needs "renderForm" function')
  if (!data.renderField) throw new Error('create Theme needs "renderField" function')
  return data
}