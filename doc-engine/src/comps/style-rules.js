import defaultOpts from 'reta/defaults'

export default {
  ...defaultOpts,
  borderWidthScale: [0, '.125rem', '.25rem'],
  colors: {
    ...defaultOpts.colors,
    brand: '#30A783',
    'dark-brand': '#006C71',
  },
  mediaQueries: {
    max750: 'screen and (max-width: 750px)',
  },
}