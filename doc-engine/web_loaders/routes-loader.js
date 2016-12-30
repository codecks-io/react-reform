

/*
use like this: `import routeList from "routes!./pages/Home"`;

This will treat `Home.js` as your homepage and all other js files as routes defined by the file names.

`routeList` will return an array like this:

```
[
  {path: "/", comp: function Home() {...}},
  {path: "/about/", comp: function About() {...}}
]
```
*/

const glob = require('glob')
const path = require('path')
const loaderUtils = require('loader-utils')
const kebabCase = require('lodash/kebabCase')
const fs = require('fs')
const frontMatter = require('front-matter')
const commonmark = require('commonmark')

const reader = new commonmark.Parser()

const shrink = (text, maxChars) => {
  if (text.length <= maxChars) return text
  const lastPartLength = Math.round(maxChars / 4)
  let lastPart = text.slice(maxChars - lastPartLength, maxChars)
  const m = lastPart.match(/\s+\S*$/)
  if (m) lastPart = lastPart.slice(0, lastPart.length - m[0].length + 1)
  lastPart = `${lastPart.slice(0, -1)}…`
  return text.slice(0, maxChars - lastPartLength) + lastPart
}


const extractExcerpt = (md) => {
  const parsed = reader.parse(md)
  const walker = parsed.walker()
  let event
  let processed = 0
  let parts = []
  const add = (part) => {
    processed += part.length
    parts.push(part)
  }
  while (processed < 300 && (event = walker.next())) {
    let node = event.node
    if (event.entering) {
      if (node.type === 'text') {
        add(node.literal)
      } else if (node.type === 'softbreak' || node.type === 'hardbreak' || node.type === 'paragraph') {
        add(' ')
      }
    }
  }
  return shrink(parts.join('').trim(), 300)
}

const getRoutes = (homePath, cb) => {
  const homeFile = path.basename(homePath)
  const baseDir = path.dirname(homePath)

  const fileToUrl = (f) => {
    if (f === homeFile) return '/'
    const extLength = path.extname(f).length
    const parts = f.slice(0, -extLength).split(path.sep)
    if (parts.length > 1 && parts[parts.length - 1] === parts[parts.length - 2]) parts.pop()
    return '/' + parts.map(p => kebabCase(p)).join('/') + '/'
  }

  const transformFile = (f) => new Promise((res, rej) => {
    const extension = path.extname(f)
    const data = {
      location: f,
      path: fileToUrl(f),
      extension,
      isAsync: true
    }
    if (extension === '.md') {
      fs.readFile(path.join(baseDir, f), 'utf8', (err, content) => {
        if (err) return rej(err)
        const fm = frontMatter(content)
        data.info = fm.attributes
        data.info.excerpt = data.info.excerpt || extractExcerpt(fm.body)
        res(data)
      })
    } else {
      res(data)
    }
  })

  const options = {cwd: baseDir}

  if (cb) {
    glob('**/*.{js,md}', options, (err, files) => {
      if (err) return cb(err)
      Promise.all(files.map(f => transformFile(f))).then(r => cb(null, r), e => cb(e))
    })
  } else {
    return glob.sync('**/*.{js,md}', options).map(f => fileToUrl(f))
  }
}

const loader = function(source) {
  this.cacheable()
  const webpackCallback = this.async()

  var query = loaderUtils.parseQuery(this.query)

  let callbackCalled = false
  const callback = (err, result) => {
    if (callbackCalled) return
    webpackCallback(err, result)
    callbackCalled = true
  }

  const result = []
  let done = 0

  getRoutes(this.resourcePath, (err, fileData) => {
    if (err) return callback(err)
    fileData.forEach(data => {
      this.resolve(this.context, `.${path.sep}${data.location}`, (err, resolved) => {
        if (err) return callback(err)
        const request = `${loaderUtils.stringifyRequest(this, `${data.extension === '.md' ? 'cdx-md!' : ''}${resolved}`)}`
        const req = `require(${request})${data.extension === '.md' ? '' : '.default'}`
        const source = data.isAsync && !query.onlySync ? (
          `function load${data.location.replace(/\W+/g, '')}Async(cb) {
            require.ensure([${request}], function (err) {
              cb(${req})
            }, ${JSON.stringify(data.location)})
          }`
        ) : req
        result.push({
          path: data.path,
          info: data.info || null,
          isAsync: (data.isAsync && !query.onlySync) || false,
          comp: source
        })
        done += 1

        if (done === fileData.length) {
          const stringified = result.map((o) => (
            `{path: ${JSON.stringify(o.path)}, info: ${JSON.stringify(o.info)}, isAsync: ${JSON.stringify(o.isAsync)}, comp: ${o.comp}}`
          )).join(',\n')
          callback(null, `module.exports = [${stringified}]`)
        }
      })
    })
  })
}

loader.getRoutes = getRoutes

module.exports = loader
