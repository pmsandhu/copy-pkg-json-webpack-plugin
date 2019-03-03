# CopyPackageJsonPlugin

> This is a plugin to copy and edit your package.json file to your webpack distribution/production bundle. This is useful for updating the version number of your package and only including the necessary information in your package.json bundle that consumer of your application/package need.

## Install

```sh
$ npm install copy-pkg-json-webpack-plugin --save-dev
```

## Usage

```javascript
// webpack.config.js
const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin")
module.exports = {
  entry: '//...',
  output: '//...',
  plugins: [
    new CopyPkgJsonPlugin({
      remove: ['devDependencies'],
      replace: {scripts: {start: 'node index.js'}}
    })
  ]
}
```
```javascript
// webpack.config.js
const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin")
const pkg = require('./package.json')
module.exports = {
  entry: '//...',
  output: '//...',
  plugins: [
    new CopyPkgJsonPlugin({      
      new: {
        name: pkg.name,
        version: '1.2.0',
        description: pkg.description,
        repository: pkg.repository,
        peerDependencies: {
          react: 'latest',
          'react-dom': 'latest'
        },
        devDependencies: {
          colors: 'latest'
        } 
      }
    })
  ]
}
```


## Options
Options are passed as arguments to the `new CopyPkgJsonPlugin({ options })` constructor and must be an object containing either a **new** key with an object containing the key/value pairs you wish to populate your new package.json with, a **remove** key with an array containing properties you want to remove from your existing package.json as strings and/or a **replace** key with an object containing the key/value pairs you wish to replace from your original package.json with. You may optionally pass in the absolute path string to the ***directory*** containing your package.json file. The plugin defaults to process.cwd() path. See the NOTE section below for more information on specifying the package.json directory path.

```javascript
new CopyPkgJsonPlugin(
  { new: {/*...*/} },
  /* OR */
  {  remove: [/*...*/], replace: {/*...*/} }, 
  /* 'OPTIONAL/PATH/TO/pckJSON/DIRECTORY' */
 )
```

### New
The new key expects an object with the standard package.json fields that you wish to be made available in your final bundle's package.json
```javascript
plugins : [
  new CopyPackageJsonPlugin({
    new: {
      name: 'my-package',
      version: '3.0.1',
      description: 'my package to publish to npm',
      author: 'Mario Lopez',
      license: 'MIT',
      private: false,
      peerDependencies: { d3: 'latest'}
    }
  })
] 
```

### Remove
The remove key expects an array with property names from your original package.json file that you wish to not be included in the copied package.json 
```javascript
plugins : [
  new CopyPackageJsonPlugin({
    remove: ['scripts', 'jest', 'devDependencies]']
  })
] 
```
### Replace
The replace key expects an object with property names from your original package.json file that you wish to replace with different properties
```javascript
plugins : [
  new CopyPackageJsonPlugin({
    replace: {
      version: '1.2.1',
      author: 'Mario Lopez',
      scripts: { start: 'node index.js', test: 'echo' }    
    }
  })
] 
```
By default this will merge keys by one level deep. So using the example above if your original package.json also included other scripts such as `build` command that script will be included in the copied package.json
```json
{
  "scripts": {
    "start": "node index.js", 
    "test":"echo", 
    "build": "webpack src" 
  }
}   
```
If you do not want the existing keys to be merged and want to overwrite them you must add the the key to the remove option first 
```javascript
plugins : [
  new CopyPackageJsonPlugin({
    remove: ['scripts'],
    replace: {
      scripts: { start: 'node index.js', test: 'echo' }    
    }
  })
] 
```

### Note 
This plugin assumes that your package.json is in the root directory of the node processes current working directory ie. 
process.cwd(). If your package.json is located elsewhere, you may optionally pass the absolute path of the directory where your package.json resides, as a second argument to new CopyPkgJsonPlugin constructor. NOTE: that you must pass in a first argument in order to pass in the context; if you wish to simply copy your existing package.json you can pass in an empty object :
```javascript
plugins: [ 
  new CopyPkgJsonPlugin({}, 'src/app/hello') 
]

```
If you wish to create a brand new package.json to be copied to the final dist bundle folder, pass an object with the key `new` which contains the key value pairs that you would like to be in your package.json: 
```javascript
plugins: [
  new CopyPkgJsonPlugin({ new: {
    name: 'state-manager-lib',
    description: 'state management library',
    main: 'index.js',
    version: '2.0',
    license: 'MIT',
    dependencies: { lodash: 'latest', redux: 'latest' },
    devDependencies: { 'chalk': 'latest', 'state-invariant': 'latest' }
  }}) 
]
```  
If you wish to simply copy your existing package.json your to the final dist bundle folder without any modifications and your package.json is located in the node processes current working directory ie process.cwd(), simply call the constructor without arguments and your package.json is located at the root : 
```javascript
plugins: [
  new CopyPkgJsonPlugin() 
]
```
If you which to remove an item from your existing package.json but not replace any just pass in this key:
```javascript
plugins: [ 
  new CopyPkgJsonPlugin({ remove: ['engines','devDependencies'] }) 
]
```
And vice-versa if you wish to replace in an existing package.json but not remove any items:
```javascript
plugins: [ 
  new CopyPkgJsonPlugin({ replace: { author: 'Mario Lopez' } }) 
]
```
