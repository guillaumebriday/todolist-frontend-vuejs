/* eslint-disable no-useless-escape */

let path = require('path')
let glob = require('glob-all')
let webpack = require('webpack')
let merge = require('webpack-merge')
let PurgecssPlugin = require('purgecss-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let common = require('./webpack.common.js')

class TailwindExtractor {
  static extract (content) {
    return content.match(/[A-z0-9-:\/]+/g) || []
  }
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(common, {
  devtool: false,
  mode: 'production',
  plugins: [
    new PurgecssPlugin({
      // Specify the locations of any files you want to scan for class names.
      paths: glob.sync([
        resolve('src/js/components/**/*.vue'),
        resolve('index.html')
      ]),
      extractors: [
        {
          extractor: TailwindExtractor,
          extensions: ['html', 'js', 'vue']
        }
      ]
    }),
    new CleanWebpackPlugin([
      resolve('dist/**/*.*')
    ], { allowExternal: true }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
})
