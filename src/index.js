const path = require('path')

class CopyPkgJsonPlugin {
  constructor(options, context = null) {
    if (typeof options !== 'object' || Array.isArray(options)) options = {}
    this.options = options
    this.context = context
  }

  apply(compiler) {
    const { options, context } = this
    const pkgJsonPath = context
      ? require(path.resolve(context, 'package.json'))
      : require(path.resolve(compiler.context, 'package.json'))

    const pkgJson = JSON.parse(JSON.stringify(pkgJsonPath))

    compiler.plugin('emit', (compilation, callback) => {
      if (options.hasOwnProperty('remove')) {
        options.remove.forEach(val => {
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
          if (typeof options.replace[prop] === 'object' && pkgJson.hasOwnProperty(prop))
            for (const i in options.replace[prop])
              pkgJson[prop][i] = options.replace[prop][i]
          else pkgJson[prop] = options.replace[prop]
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

module.exports = CopyPkgJsonPlugin
