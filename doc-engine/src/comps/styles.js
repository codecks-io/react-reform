import defaultOpts from 'retachyons/defaults'
import builder from 'retachyons/builder'

const opts = {
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

export default builder(opts)
