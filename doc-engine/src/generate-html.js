import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import html from './index.html'
import {renderStaticOptimized} from 'retachyons/glamor-server'
import {match, RouterContext} from 'react-router'
import getRoutes from './routes'
import P404 from 'pages/404'

export default function render(locals, cb) {
  match({routes: getRoutes(true, require('routes?onlySync!pages/Home')), location: locals.path}, (error, redirectLocation, renderProps) => {
    if (error) {
      throw new Error(error)
    } else if (redirectLocation) {
      throw new Error('Found redirect for ' + locals.path)
    } else if (renderProps) {
      console.log('render', locals.path)
      if (renderProps.components.some(c => c === P404)) throw new Error('No route for ' + locals.path)
      const {html: markup, css} = renderStaticOptimized(() => renderToStaticMarkup(<RouterContext {...renderProps} />))

      const cssFile = locals.assets.main.css
      const inlineStyles = [css, locals.fs.readFileSync(locals.pathLib.join(locals.pathToDocs, cssFile), 'utf-8')]

      const loadAsyncCss = `<script type="text/javascript">(function(){var a=document.createElement("link");a.rel="stylesheet";a.href="${cssFile}";(document.getElementsByTagName("head")[0]).appendChild(a)})();</script>`
      const htmlWithBody = html
        .replace('></div>', `>${markup}</div><script async src=${locals.assets.main.js} type="text/javascript"></script>${loadAsyncCss}`)

      cb(null, htmlWithBody.replace('</head>', `<style>${locals.purify(htmlWithBody, inlineStyles.join('\n'), {minify: true})}</style></head>`))
    } else {
      throw new Error('No route for ' + locals.path)
    }
  })
};
