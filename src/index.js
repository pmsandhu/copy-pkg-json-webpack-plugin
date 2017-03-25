const path = require('path')

const re = /\/?package.json$/

class CopyPkgJsonPlugin {
  constructor(options, context = null) {
    if (typeof options !== 'object' || Array.isArray(options)) options = {}
    this.options = options
    this.context = context
  }
  apply(compiler) {
    let pkgJson
    const { options, context } = this
    const root = context
      ? context.match(re)
        ? path.resolve(context.replace(re, ''), 'package.json')
        : path.resolve(context, 'package.json')
      : path.resolve(process.cwd(), 'package.json')

    try {
      compiler.inputFileSystem._statSync(root)
      pkgJson = JSON.parse(JSON.stringify(require(root)))
    } catch (e) {
      throw new Error(notFoundError(root), e)
    }
    compiler.plugin('emit', (compilation, callback) => {
      if (options.hasOwnProperty('remove')) {
        options.remove.forEach((val) => {
          if (/\./.test(val)) {
            const keys = val.split('.')
            const len = keys.length - 1
            let ref
            keys.forEach((val, i) => {
              if (i === 0) ref = pkgJson[val]
              else if (i === len) delete ref[val]
              else ref = ref[val]
            })
          } else delete pkgJson[val]
        })
      }

      if (options.hasOwnProperty('replace')) {
        for (const prop in options.replace) {
          if (typeof options.replace[prop] === 'object' && pkgJson.hasOwnProperty(prop)) {
            for (const i in options.replace[prop]) { pkgJson[prop][i] = options.replace[prop][i] }
          } else pkgJson[prop] = options.replace[prop]
        }
      }

      compilation.assets['package.json'] = {
        source: () => JSON.stringify(pkgJson, null, '\t'),
        size: () => Object.keys(pkgJson).length
      }

      callback()
    })
  }
}

function notFoundError(root) {
  return ` \x1b[41m\x1b[37mCannot find the following package.json path -- \x1b[0m 
 \x1b[33m${root} \x1b[0m
 If your package.json is not in the root directory of the current node process
 - pass the path to where it is located as the second argument to plugin: 
   \x1b[36mnew CopyPkgJsonPlugin({options}, 'path/main')\x1b[0m`
}

module.exports = CopyPkgJsonPlugin
