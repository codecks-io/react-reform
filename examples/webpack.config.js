var path = require("path");
var fs = require("fs");

var srcDirs = [__dirname, path.join(__dirname, "..", "src")];

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

var entries = fs.readdirSync(__dirname).reduce(
  function(memo, dir) {
    var isDraft = dir.charAt(0) === "_";

    if (!isDraft && isDirectory(path.join(__dirname, dir))) {
      memo[dir] = path.join(__dirname, dir, "app.js");
    }

    return memo;
  },
  {}
);

module.exports = {
  context: __dirname,
  entry: entries,
  output: {
    filename: "[name]/app.js"
  },
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint", include: srcDirs}
    ],
    loaders: [
      {test: /\.js$/, loader: "babel?cacheDirectory", include: srcDirs},
      {test: /\.css$/, loader: "style!css!postcss"},
      {test: /\.(svg|eot|ttf|woff2?)(\?.*)?$/, loader: "file"}
    ]
  },
  devtool: "eval",
  postcss: [require("autoprefixer-core"), require("csswring")],
  resolve: {
    extensions: ["", ".js", ".jsx"],
    alias: {
      "react-reform": "../../src"
    }
  },
  devServer: {
    contentBase: __dirname,
    stats: {
      chunkModules: false,
      colors: true
    }
  }
};
