const path = require('path')
const webpack = require('webpack')
const { fileExists } = require('../util')

const CopyPkgJsonPlugin = fileExists('dist')
  ? require('../../dist')
  : require('../../src')

function run(opts, context) {
  const compiler = webpack(getConfig(opts, context))
  return new Promise((resolve, reject) => {
    compiler.run(function (err, stats) {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function getConfig(opts = {}, context = path.resolve(__dirname)) {
  return {
    entry: path.join(__dirname, 'src/app.js'),
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'build')
    },
    plugins: [
      new CopyPkgJsonPlugin(opts, context)
    ]
  }
}

module.exports = run
