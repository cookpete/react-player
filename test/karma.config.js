require("babel-polyfill")
var webpackConfig = require('../webpack.config.dev')
webpackConfig.devtool = 'inline-source-map'

module.exports = function (config) {
  config.set({
    browsers: process.env.TRAVIS ? [ 'ChromeTravis' ] : [ 'Chrome', 'Firefox' ],
    singleRun: true,
    frameworks: [ 'mocha', 'chai' ],
    files: [
      'karma.webpack.js'
    ],
    preprocessors: {
      'karma.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha' ],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    client: {
      mocha: {
        timeout: 60000
      }
    },
    browserNoActivityTimeout: 60000,
    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  })
}
