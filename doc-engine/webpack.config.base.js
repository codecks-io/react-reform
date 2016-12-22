const webpack = require('webpack')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const routeLoader = require('./web_loaders/routes-loader')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const purify = require('purify-css')
const DirectoryNameAsMain = require('webpack-directory-name-as-main')

const REACT_REFORM_SRC = path.join(__dirname, '..', 'src')

module.exports = function(env) {
  const isDev = env === 'dev'
  const isProd = env === 'prod'

  process.env.NODE_ENV = isProd ? 'production' : 'development'

  const envVars = Object.assign({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })

  return {
    bail: isProd,

    contentBase: path.join(__dirname, 'src'),

    entry: Object.assign({
      'main': [
        ...(isDev ? [require.resolve('react-dev-utils/webpackHotDevClient')] : []),
        './src/client.js'
      ]
    }, isProd ? {
      'generate-html': './src/generate-html.js'
    } : {}
    ),

    output: Object.assign({
      filename: `[name]-[${isDev ? 'hash' : 'chunkhash'}].js`,
      chunkFilename: '[id]-[chunkhash].chunk.js',
      path: isProd ? '../docs' : '/',
      publicPath: '/',
      libraryTarget: 'umd', // required by StaticSiteGeneratorPlugin,
      hashDigestLength: 5
    }, isDev ? {
      pathinfo: true
    } : {}),

    devtool: isProd ? 'source-map' : 'eval',

    module: {
      loaders: [
        ...(isProd ? [
          {
            test: /\.html$/,
            loader: 'html',
            query: {
              attrs: ['img:src', 'link:href'],
              conservativeCollapse: false
            }
          }
        ] : []),
        {
          test: /\.js?$/,
          loader: path.join(__dirname, 'node_modules', 'babel-loader'),
          exclude: /node_modules/,
          query: {
            cacheDirectory: true
          }
        },
        {
          test: /\.css$/,
          loader: isProd ? ExtractTextPlugin.extract('style', 'css') : 'style!css'
        },
        {
          test: /\.svg\?inline$/,
          loader: 'svg-inline'
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/,
          exclude: /\/favicon.ico$/,
          loader: 'file',
          query: {
            name: 'static/media/[name].[hash:5].[ext]'
          }
        },
        {
          test: /\/favicon.ico$/,
          loader: 'file',
          query: {
            name: 'favicon.ico?[hash:8]'
          }
        },
      ]
    },

    resolve: {
      modulesDirectories: ['./src', 'node_modules'],
      alias: {
        'react-reform': REACT_REFORM_SRC,
        'react': path.join(__dirname, 'node_modules', 'react')
      }
    },

    plugins: [
      new webpack.ResolverPlugin([
        new DirectoryNameAsMain()
      ]),
      new webpack.DefinePlugin(Object.assign(envVars, {__DEV__: isDev})),
      ...(isProd ? [
        new ExtractTextPlugin('[name]-[contenthash].css'),
        new StaticSiteGeneratorPlugin(
          'generate-html',
          routeLoader.getRoutes('src/pages/Home.js'),
          {purify: purify},
          {}
        ),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {screw_ie8: true, warnings: false},
          mangle: {screw_ie8: true},
          output: {comments: false, screw_ie8: true}
        }),
      ] : []),
      ...(isDev ? [
        new HtmlWebpackPlugin({inject: true, template: './src/index.html'})
      ] : [])
    ]
  }
}
