import React from 'react'
import {renderToString} from 'react-dom/server'
import html from './index.html'
import fetchRules from 'reta/ssr'
import {match, RouterContext} from 'react-router'
import getRoutes from './routes'
import P404 from 'pages/404'
import styleRules from 'comps/style-rules'

export default function render(locals, cb) {
  match({routes: getRoutes(true, require('routes?onlySync!pages/Home')), location: locals.path}, (error, redirectLocation, renderProps) => {
    if (error) {
      throw new Error(error)
    } else if (redirectLocation) {
      throw new Error('Found redirect for ' + locals.path)
    } else if (renderProps) {
      console.log('render', locals.path)
      if (renderProps.components.some(c => c === P404)) throw new Error('No route for ' + locals.path)
      const {html: markup, stylesheets} = fetchRules(styleRules, () => renderToString(<RouterContext {...renderProps} />))

      const cssFileWithReta = locals.clientAssets.main.css 
      // const cssFileWithoutReta = Object.keys(locals.webpackStats.compilation.assets).find(f => /\.css$/.test(f))
      // main.css contains reta.css,
      // generate-html.css does not! (it contains all the styles for the date selectors though, which main.css doesn't!?)
      
      const inlineStyles = [locals.fs.readFileSync(locals.pathLib.join(locals.pathToDocs, cssFileWithReta), 'utf-8')]

      const loadAsyncCss = `<script type="text/javascript">(function(){var a=document.createElement("link");a.rel="stylesheet";a.href="${cssFileWithReta}";(document.getElementsByTagName("head")[0]).appendChild(a)})();</script>`
      const htmlWithBody = html
        .replace('></div>', `>${markup}</div><script async src=${locals.clientAssets.main.js} type="text/javascript"></script>${loadAsyncCss}`)

      cb(null, htmlWithBody.replace('</head>', `<style>${locals.purify(htmlWithBody, inlineStyles.join('\n'), {minify: true})}</style>${stylesheets}</head>`))
    } else {
      throw new Error('No route for ' + locals.path)
    }
  })
};
