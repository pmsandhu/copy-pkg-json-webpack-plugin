const fs = require('fs')
const path = require('path')

function fileExists(dir, file = '') {
  try {
    fs.statSync(path.join(dir, file))
    return true
  } catch (e) { return false }
}

function getFile(dir, file = 'package.json') {
  return JSON.parse(fs.readFileSync(path.join(dir, file)))
}

const mock = {
  scripts: { build: 'build', test: 'test' } ,
  dependencies: { react: 'v1', redux: 'latest' },
  nestedKeys: {
    nest1: {
      notNest1: 'pck> nestKeys > nest1 > notNest1 = this string',
      nest2: { nest3: { nest4: 'pck> nestKeys > nest1 > nest2 > nest3 > nest4 = this string' } }
    }
  },
  nestedKeys2: {
    nest1: { notNest1: 'pck> nestKeys > nest1 > notNest1 = this string' }
  }
}

module.exports = {
  fileExists,
  getFile,
  mock
}