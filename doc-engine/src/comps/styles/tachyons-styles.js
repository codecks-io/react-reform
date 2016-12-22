import colorVars from './colors'

const colorNames = Object.keys(colorVars)

// --- SPACING ---

const spaceScale = [{i: 0, m: '0rem'}, {i: 1, m: '.25rem'}, {i: 2, m: '.5rem'}, {i: 3, m: '1rem'}, {i: 4, m: '2rem'}, {i: 5, m: '4rem'}, {i: 6, m: '8rem'}, {i: 7, m: '16rem'}]
const marginSpaceScale = [...spaceScale, {i: 'a', m: 'auto'}]

const mapToKeyAndVal = (list, keyAndValFn, intoDict = {}) => {
  for (let i = 0; i < list.length; i++) {
    const [key, val] = keyAndValFn(list[i], i)
    intoDict[key] = val
  }
  return intoDict
}

const spacing = {};

[['p', 'padding', spaceScale], ['m', 'margin', marginSpaceScale]].forEach(([short, long, scale]) => {
  mapToKeyAndVal(scale, (v) => [`${short}a${v.i}`, {[long]: v.m}], spacing)

  mapToKeyAndVal(scale, (v) => [`${short}l${v.i}`, {[`${long}Left`]: v.m}], spacing)
  mapToKeyAndVal(scale, (v) => [`${short}r${v.i}`, {[`${long}Right`]: v.m}], spacing)
  mapToKeyAndVal(scale, (v) => [`${short}b${v.i}`, {[`${long}Bottom`]: v.m}], spacing)
  mapToKeyAndVal(scale, (v) => [`${short}t${v.i}`, {[`${long}Top`]: v.m}], spacing)

  mapToKeyAndVal(scale, (v) => [`${short}v${v.i}`, {[`${long}Top`]: v.m, [`${long}Bottom`]: v.m}], spacing)
  mapToKeyAndVal(scale, (v) => [`${short}h${v.i}`, {[`${long}Left`]: v.m, [`${long}Right`]: v.m}], spacing)
})

// --- POSITION ---

const positionScale = [0, 1, 2]

const position = {
  static: {position: 'static'},
  relative: {position: 'relative'},
  absolute: {position: 'absolute'},
  fixed: {position: 'fixed'},
};

['top', 'left', 'right', 'bottom'].forEach(dir => {
  mapToKeyAndVal(positionScale, (v, i) => [`${dir}-${i}`, {[dir]: `${v}rem`}], position)
})

// --- Typo Scale ---

const typeScale = {
  f1: {fontSize: '3rem' },
  f2: {fontSize: '2.25rem' },
  f3: {fontSize: '1.5rem' },
  f4: {fontSize: '1.25rem' },
  f5: {fontSize: '1rem' },
  f6: {fontSize: '.875rem' },
}

// --- Line Height ---

const lineHeight = {
  'lh-solid': {lineHeight: 1 },
  'lh-title': {lineHeight: 1.25 },
  'lh-copy':  {lineHeight: 1.5 },
}

// --- Font Weight ---

const fontWeight = {
  normal: {fontWeight: 'normal'},
  b: {fontWeight: 'bold'},
}

const fontScale = [100, 200, 300, 400, 500, 600, 700, 800, 900]
mapToKeyAndVal(fontScale, (v, i) => [`fw${i + 1}`, {fontWeight: v}], fontWeight)


// --- Font Style ---

const fontStyle = {
  i: {fontStyle: 'italic'},
  'fs-normal': {fontStyle: 'normal'}
}

// --- Text Align ---

const textAlign = {
  tl: {textAlign: 'left'},
  tr: {textAlign: 'right'},
  tc: {textAlign: 'center'},
}

// --- Text Transform ---

const textTransform = {
  ttc: {textTransform: 'capitalize'},
  ttl: {textTransform: 'lowercase'},
  ttu: {textTransform: 'uppercase'},
  ttn: {textTransform: 'none'},
}

// --- Text Decoration ---

const textDecoration = {
  strike: {textDecoration: 'line-through'},
  underline: {textDecoration: 'underline'},
  'no-underline': {textDecoration: 'none'},
}

// --- Border Radius ---

const borderRadius = {
  br0: {borderRadius: 0},
  br1: {borderRadius: '.125rem'},
  br2: {borderRadius: '.25rem'},
  br3: {borderRadius: '.5rem'},
  br4: {borderRadius: '1rem'},
  'br-100': {borderRadius: '100%'},
  'br-pill': {borderRadius: '9999px'},
  'br--bottom': {borderTopLeftRadius: 0, borderTopRightRadius: 0},
  'br--top': {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
  'br--right': {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
  'br--left': {borderTopRightRadius: 0, borderBottomRightRadius: 0},
}

// --- Box Shaodow ---

const boxShadow = {
 'shadow-1': {boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.2)'},
 'shadow-2': {boxShadow: '0px 0px 8px 2px rgba(0, 0, 0, 0.2)'},
 'shadow-3': {boxShadow: '2px 2px 4px 2px rgba(0, 0, 0, 0.2)'},
 'shadow-4': {boxShadow: '2px 2px 8px 0px rgba(0, 0, 0, 0.2)'},
 'shadow-5': {boxShadow: '4px 4px 8px 0px rgba(0, 0, 0, 0.2)'}
}

// --- Borders ---

const borders = {
  ba: {borderStyle: 'solid', borderWidth: 1 },
  bt: {borderTopStyle: 'solid', borderTopWidth: 1 },
  br: {borderRightStyle: 'solid', borderRightWidth: 1 },
  bb: {borderBottomStyle: 'solid', borderBottomWidth: 1 },
  bl: {borderLeftStyle: 'solid', borderLeftWidth: 1 },
  bn: {borderStyle: 'none', borderWidth: 0 },

  bw0: {borderWidth: 0 },
  bw1: {borderWidth: '.125rem' },
  bw2: {borderWidth: '.25rem' },
  bw3: {borderWidth: '.5rem' },
  bw4: {borderWidth: '1rem' },
  bw5: {borderWidth: '2rem' },

  'bt-0': {borderTopWidth: 0 },
  'br-0': {borderRightWidth: 0 },
  'bb-0': {borderBottomWidth: 0 },
  'bl-0': {borderLeftWidth: 0 },
}

// --- Forms ----

const forms = {
  'input-reset': {'WebkitAppearance': 'none', 'MozAppearance': 'none'},
}

// --- Colors ---

const colors = mapToKeyAndVal(colorNames, c => [c, {color: colorVars[c]}])
mapToKeyAndVal(colorNames, c => [`bg${c[0].toUpperCase()}${c.slice(1)}`, {backgroundColor: colorVars[c]}], colors)
mapToKeyAndVal(colorNames, c => [`b--${c}`, {borderColor: colorVars[c]}], colors)


export default {
  ...spacing,
  ...position,
  ...lineHeight,
  ...typeScale,
  ...fontStyle,
  ...fontWeight,
  ...textAlign,
  ...textTransform,
  ...textDecoration,
  ...borderRadius,
  ...boxShadow,
  ...forms,
  ...borders,
  ...colors
}


