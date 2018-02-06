const path = require('path')

class CopyPkgJsonPlugin {
  constructor(options, context = null) {
    if (typeof options !== 'object' || Array.isArray(options)) options = {}
    this.options = options
    this.context = context
    this.pkgJsonRegExp = /\/?package.json$/
  }

  apply(compiler) {
    let pkgJson
    const { options, context } = this

    const root = context
      ? context.match(this.pkgJsonRegExp)
        ? path.resolve(context.replace(this.pkgJsonRegExp, ''), 'package.json')
        : path.resolve(context, 'package.json')
      : path.resolve(process.cwd(), 'package.json')

    try {
      compiler.inputFileSystem._statSync(root)
      pkgJson = JSON.parse(JSON.stringify(require(root)))
    } catch (e) {
      if (options.hasOwnProperty('new')) pkgJson = {}
      else throw new Error(this.notFoundError(root))
    }

    compiler.plugin('emit', (compilation, callback) => {
      if (options.hasOwnProperty('new')) {
        for (const prop in options.new) {
          pkgJson[prop] = options.new[prop]
        }
      }

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
          } else {
            delete pkgJson[val]
          }
        })
      }

      if (options.hasOwnProperty('replace')) {
        for (const prop in options.replace) {
          if (typeof options.replace[prop] === 'object' && pkgJson.hasOwnProperty(prop))
            for (const i in options.replace[prop]) pkgJson[prop][i] = options.replace[prop][i]
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

  notFoundError(root) {
    const BG_RED = '\u001b[41m\x1b[37m\u001b[1m'
    const YELLOW = '\u001b[33m'
    const CYAN = '\u001b[36m\u001b[1m'
    const RESET = '\u001b[0m'
    return `  ${BG_RED}Cannot find the following package.json path:${RESET} ${YELLOW}${root}${RESET}
  If your package.json is not in the root directory of the current node process
  pass the path to where it is located as the second argument to the plugin:
    ie. ${CYAN}CopyPkgJsonPlugin${RESET}({options}, ${CYAN}'path/main'${RESET})`
  }
}

module.exports = CopyPkgJsonPlugin
