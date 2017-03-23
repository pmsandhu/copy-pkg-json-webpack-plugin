const path = require('path')
const webpack = require('webpack')

const { fileExists } = require('../util')
const CopyPkgJsonPlugin = fileExists('lib')
  ? require('../../dist/lib')
  : require('../../src')

function run(opts) {
  const compiler = webpack(getConfig(opts))
  return new Promise((resolve, reject) => {
    compiler.run(function (err, stats) {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function getConfig(opts = {}) {
  return {
    entry: path.join(__dirname, 'src/app.js'),
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'build')
    },
    plugins: [
      new CopyPkgJsonPlugin(opts, path.resolve(__dirname))
    ]
  }
}

module.exports = run
