/* eslint-disable no-useless-escape */

const path = require('path')
const glob = require('glob-all')
const webpack = require('webpack')
const merge = require('webpack-merge')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const common = require('./webpack.common.js')

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
      whitelistPatterns: [/^fade-.+/],
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
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('_redirects'),
        to: '_redirects',
        toType: 'file'
      }
    ])
  ]
})
