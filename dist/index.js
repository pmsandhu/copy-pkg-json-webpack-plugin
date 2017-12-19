'use strict'
var _typeof =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function(a) {
          return typeof a
        }
      : function(a) {
          return a && 'function' == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? 'symbol' : typeof a
        },
  _createClass = (function() {
    function a(b, c) {
      for (var f, d = 0; d < c.length; d++)
        (f = c[d]),
          (f.enumerable = f.enumerable || !1),
          (f.configurable = !0),
          'value' in f && (f.writable = !0),
          Object.defineProperty(b, f.key, f)
    }
    return function(b, c, d) {
      return c && a(b.prototype, c), d && a(b, d), b
    }
  })()
function _classCallCheck(a, b) {
  if (!(a instanceof b)) throw new TypeError('Cannot call a class as a function')
}
var path = require('path'),
  CopyPkgJsonPlugin = (function() {
    function a(b) {
      var c = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null
      _classCallCheck(this, a),
        ('object' !== ('undefined' == typeof b ? 'undefined' : _typeof(b)) || Array.isArray(b)) && (b = {}),
        (this.options = b),
        (this.context = c),
        (this.pkgJsonRegExp = /\/?package.json$/)
    }
    return (
      _createClass(a, [
        {
          key: 'apply',
          value: function apply(b) {
            var c,
              d = this.options,
              f = this.context,
              g = f
                ? f.match(this.pkgJsonRegExp)
                  ? path.resolve(f.replace(this.pkgJsonRegExp, ''), 'package.json')
                  : path.resolve(f, 'package.json')
                : path.resolve(process.cwd(), 'package.json')
            try {
              b.inputFileSystem._statSync(g), (c = JSON.parse(JSON.stringify(require(g))))
            } catch (h) {
              throw new Error(this.notFoundError(g))
            }
            b.plugin('emit', function(h, j) {
              if (
                (d.hasOwnProperty('remove') &&
                  d.remove.forEach(function(k) {
                    if (/\./.test(k)) {
                      var n,
                        l = k.split('.'),
                        m = l.length - 1
                      l.forEach(function(o, p) {
                        0 === p ? (n = c[o]) : p === m ? delete n[o] : (n = n[o])
                      })
                    } else delete c[k]
                  }),
                d.hasOwnProperty('replace'))
              )
                for (var k in d.replace)
                  if ('object' === _typeof(d.replace[k]) && c.hasOwnProperty(k))
                    for (var l in d.replace[k]) c[k][l] = d.replace[k][l]
                  else c[k] = d.replace[k]
              ;(h.assets['package.json'] = {
                source: function source() {
                  return JSON.stringify(c, null, '\t')
                },
                size: function size() {
                  return Object.keys(c).length
                }
              }),
                j()
            })
          }
        },
        {
          key: 'notFoundError',
          value: function notFoundError(b) {
            var f = '\x1B[36m\x1B[1m',
              g = '\x1B[0m'
            return (
              '  ' +
              '\x1B[41m\x1B[37m\x1B[1m' +
              'Cannot find the following package.json path:' +
              g +
              ' ' +
              '\x1B[33m' +
              b +
              g +
              '\n  If your package.json is not in the root directory of the current node process\n  pass the path to where it is located as the second argument to the plugin:\n    ie. ' +
              f +
              'CopyPkgJsonPlugin' +
              g +
              '({options}, ' +
              f +
              "'path/main'" +
              g +
              ')'
            )
          }
        }
      ]),
      a
    )
  })()
module.exports = CopyPkgJsonPlugin
