process.env.NODE_ENV = 'development'

var chalk = require('chalk')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')

var clearConsole = require('react-dev-utils/clearConsole')
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
var openBrowser = require('react-dev-utils/openBrowser')
var historyApiFallback = require('connect-history-api-fallback')

var config = require('../webpack.config.dev')

var compiler
var handleCompile

function setupCompiler(host, port, protocol) {
  compiler = webpack(config, handleCompile)

  compiler.plugin('invalid', function() {
    clearConsole()
    console.log('Compiling...')
  })

  compiler.plugin('done', function(stats) {
    clearConsole()

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    var messages = formatWebpackMessages(stats.toJson({}, true))
    if (!messages.errors.length && !messages.warnings.length) {
      console.log(chalk.green('Compiled successfully!'))
      console.log()
      console.log('The app is running at:')
      console.log()
      console.log('  ' + chalk.cyan(protocol + '://' + host + ':' + port + '/'))
      console.log()
      console.log('Note that the development build is not optimized.')
      console.log('To create a production build, use ' + chalk.cyan('npm run build') + '.')
      console.log()
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'))
      console.log()
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'))
      console.log()
      messages.warnings.forEach(message => {
        console.log(message)
        console.log()
      })
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.')
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.')
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.')
    }
  })
}

function addMiddleware(devServer) {
  devServer.use(historyApiFallback({disableDotRule: true}))
  devServer.use(devServer.middleware)
}

function runDevServer(host, port, protocol) {
  var devServer = new WebpackDevServer(compiler, {
    clientLogLevel: 'none',
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    // Enable HTTPS if the HTTPS environment variable is set to "true"
    https: protocol === 'https',
    host: host
  })

  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer)

  // Launch WebpackDevServer.
  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err)
    }

    clearConsole()
    console.log(chalk.cyan('Starting the development server...'))
    console.log()
    openBrowser(protocol + '://' + host + ':' + port + '/')
  })
}

function run(port) {
  var protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  var host = process.env.HOST || 'localhost'
  setupCompiler(host, port, protocol)
  runDevServer(host, port, protocol)
}

// Tools like Cloud9 rely on this.
var DEFAULT_PORT = process.env.PORT || 3000
run(DEFAULT_PORT)
