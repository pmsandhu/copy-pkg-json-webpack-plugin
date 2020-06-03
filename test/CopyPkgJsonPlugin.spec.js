const path = require('path')
const expect = require('expect')
const rimraf = require('rimraf')
const { mock, fileExists, getFile } = require('./util')
const run = require('./test-app/config')

const APP_DIR = path.join(__dirname, 'test-app')
const BUILD_DIR = path.join(APP_DIR, 'build')

describe('when using new CopyPckJsonPlugin({option}) -> your build/package.json should ...', () => {
  afterEach(() => {
    rimraf.sync(BUILD_DIR)
  })

  describe('exist in build directory', () => {
    it('__dirname + BUILD_DIR + package.json = true', done => {
      run({})
        .then(() => {
          expect(fileExists(BUILD_DIR, 'package.json')).toEqual(true)
          expect(fileExists(BUILD_DIR, 'bundle.js')).toEqual(true)
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('throw error when package.json not found', () => {
    it('should throw an error when package.json is not found', () => {
      let err
      try {
        run({}, 'src/test')
      } catch (e) {
        err = e
      }
      expect(err instanceof Error).toBe(true)
      expect(err.message.slice(err.message.indexOf(':') + 1, err.message.indexOf('\n'))).toEqual(expect.stringMatching(/copy-pkg-json-webpack-plugin[\\/]src[\\/]test[\\/]package.json/))
    })

    it('allow passing paths directly to the context options', done => {
      run({}, 'test/test-app')
        .then(() => {
          expect(fileExists(BUILD_DIR, 'package.json')).toEqual(true)
          expect(fileExists(BUILD_DIR, 'bundle.js')).toEqual(true)
          done()
        })
        .catch(e => done(e))
    })

    it('still work when context is filename path instead of directory path to package.json', done => {
      run({}, 'test/test-app/package.json')
        .then(() => {
          expect(fileExists(BUILD_DIR, 'package.json')).toEqual(true)
          expect(fileExists(BUILD_DIR, 'bundle.js')).toEqual(true)
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('it should create a new package json', () => {
    it('if passed in object has key of new should create new package.json', done => {
      run({ new: {
        name: 'brand-new-pkg-json',
        version: '1.0',
        description: 'testing creating brand new package json',
        main: 'index.js',
        license: 'MIT',
        dependencies: { react: 'latest' },
        devDependencies: { babel: 'latest' }
      } })
        .then(() => {
          const output = getFile(BUILD_DIR)
          expect(output.name).toEqual('brand-new-pkg-json')
          expect(output.version).toEqual('1.0')
          expect(output.license).toEqual('MIT')
          expect(typeof output.dependencies).toEqual('object')
          expect(output.devDependencies.hasOwnProperty('babel')).toEqual(true)
          done()
        })
        .catch(e => done(e))

      it('remove properties from nested object using dot notation to specify the depth of prop', done => {
        run({ remove: ['scripts', 'nestedKeys.nest1.nest2.notNest2'] })
          .then(() => {
            const output = getFile(BUILD_DIR)
            expect(output.nestedKeys).toEqual(mock.nestedKeys)
            expect(output.scripts).toBe(undefined)
            done()
          })
          .catch(e => done(e))
      })
    })
  })
  describe('remove properties given to new CopyPckJsonPlugin({remove: []})', () => {
    it('package.json should not have devDependencies or scripts props', done => {
      run({ remove: ['devDependencies', 'scripts'] })
        .then(() => {
          const output = getFile(BUILD_DIR)
          expect(output.hasOwnProperty('devDependencies')).toEqual(false)
          expect(output.hasOwnProperty('scripts')).toEqual(false)
          expect(output.hasOwnProperty('author')).toEqual(true)
          done()
        })
        .catch(e => done(e))

      it('remove properties from nested object using dot notation to specify the depth of prop', done => {
        run({ remove: ['scripts', 'nestedKeys.nest1.nest2.notNest2'] })
          .then(() => {
            const output = getFile(BUILD_DIR)
            expect(output.nestedKeys).toEqual(mock.nestedKeys)
            expect(output.scripts).toBe(undefined)
            done()
          })
          .catch(e => done(e))
      })
    })
  })

  describe('replace properties given to new CopyPckJsonPlugin({replace: {}})', () => {
    it('simple key value string pairs', done => {
      run({ replace: { author: 'Mario Lopez' } })
        .then(() => {
          const output = getFile(BUILD_DIR)
          expect(output.author).toBe('Mario Lopez')
          done()
        })
        .catch(e => done(e))
    })

    it('nested objects', done => {
      run({ replace: { scripts: mock.scripts } })
        .then(() => {
          const shouldMatch = Object.assign(getFile(APP_DIR).scripts, mock.scripts)
          const output = getFile(BUILD_DIR).scripts
          expect(output).toEqual(shouldMatch)
          done()
        })
        .catch(e => done(e))
    })

    it('simple key value pairs and  nested objects should be both work', done => {
      run({ replace: { author: 'Mario Lopez', scripts: mock.scripts } })
        .then(() => {
          const scriptsShouldEql = Object.assign(getFile(APP_DIR).scripts, mock.scripts)
          const output = getFile(BUILD_DIR)
          expect(output.scripts).toEqual(scriptsShouldEql)
          expect(output.author).toEqual('Mario Lopez')
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('new CopyPckJsonPlugin({ exclude: [], replace: {}}) should...', () => {
    it('remove both properties and replace properties', done => {
      run({
        remove: ['scripts', 'devDependencies', 'author'],
        replace: { author: 'Mario Lopez', scripts: mock.scripts }
      })
        .then(() => {
          const output = getFile(BUILD_DIR)
          expect(output.scripts).toEqual(mock.scripts)
          expect(output.author).toEqual('Mario Lopez')
          done()
        })
        .catch(e => done(e))
    })

    it('remove replace nested and not nested properties', done => {
      run({
        remove: ['nestedKeys.nest1.nest2', 'devDependencies', 'license'],
        replace: { dependencies: mock.dependencies, scripts: mock.scripts, version: '0.0.1' }
      })
        .then(() => {
          const output = getFile(BUILD_DIR)
          const original = getFile(APP_DIR)
          expect(output.nestedKeys).toEqual(mock.nestedKeys2)
          expect(output.devDependencies).toBe(undefined)
          expect(output.license).toBe(undefined)
          expect(output.dependencies).toEqual(mock.dependencies)
          expect(output.scripts).toEqual(Object.assign(original.scripts, mock.scripts))
          expect(output.version).toBe('0.0.1')
          expect(output.author).toEqual(original.author)
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('new CopyPckJsonPlugin() with no args should...', () => {
    it('return a clone copy of original package.json', done => {
      run()
        .then(() => {
          const output = getFile(BUILD_DIR)
          const original = getFile(APP_DIR)
          expect(output).toEqual(original)
          done()
        })
        .catch(e => done(e))
    })
  })
})
