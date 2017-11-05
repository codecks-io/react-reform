const frontMatter = require('front-matter')
const commonmark = require('commonmark')
const loaderUtils = require('loader-utils')


const reader = new commonmark.Parser()
const writer = new commonmark.HtmlRenderer({softbreak: '<br />'})

writer.heading = function(node, entering) {
  var tagname = 'h' + node.level, attrs = this.attrs(node)
  attrs.push(['id', (node.firstChild.literal || '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()])
  if (entering) {
      this.cr()
      this.tag(tagname, attrs)
  } else {
      this.tag('/' + tagname)
      this.cr()
  }
}


function randomIdent() {
  return 'xxxMDLINKxxx' + Math.random() + Math.random() + 'xxx'
}

module.exports = function(source) {
  this.cacheable()

  const data = frontMatter(source)

  if (!data.attributes.layout) throw new Error(`No layout given for ${this.resourcePath}`)

  const links = {}

  const parsed = reader.parse(data.body)
  const walker = parsed.walker()
  let event
  while ((event = walker.next())) {
    let node = event.node
    if (event.entering && node.type === 'image') {
      if (loaderUtils.isUrlRequest(node.destination, root)) {
        const ident = randomIdent()
        links[ident] = node.destination
        node.destination = ident
        loaderUtils.isUrlRequest(node.destination)
      }
    }
  }
  const html = JSON.stringify(writer.render(parsed)).replace(/xxxMDLINKxxx[0-9\.]+xxx/g, function(match) {
    if(!links[match]) return match
    return '" + require(' + JSON.stringify(loaderUtils.urlToRequest(links[match])) + ') + "'
  })

  return `
    var Comp = require("comps/${data.attributes.layout}").default;
    var React = require("react");
    module.exports = function ${data.attributes.layout}Renderer(props) {return React.createElement(Comp, Object.assign({}, props, ${JSON.stringify(data.attributes)}), ${html});}
  `
}
