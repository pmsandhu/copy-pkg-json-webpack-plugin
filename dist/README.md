<h3>CopyPackageJsonPlugin</h3>
This is a plugin to copy and edit your package.json file when building your webpack bundle for production/distribution. This is useful for removing the devDependencies that will automatically install when a consumer of your package installs it via npm. It allows you to remove or edit any of the keys in your root projects package.json.

<b>**</b>
<small>This is not the copy-webpack-plugin. This plugin is specifically for copying a modified version of you package.json to your webpack distribution bundle.</small>

To use run: <br/>

<pre>
npm install copy-pkg-json-webpack-plugin --save-dev
</pre>

<b>USAGE</b>
<pre>
    // webpack.config.js
    const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin");
    module.exports = {
      entry: //...,
      output: //...,
      plugins: [
        new CopyPkgJsonPlugin({
          remove: ['devDependencies'],
          replace: {scripts: {start: 'node index.js'}}
          })
      ]
}
</pre>

<b>OPTIONS</b>
___
 Options are passed as arguments to the `new CopyPkgJsonPlugin({options})` constructor and must be an object containing either a <b>remove</b> key with an array of properties to `{remove:[]}` and  <b>replace</b> key with an object of key/value pairs you wish to replace your original package.json with `{replace:{}}

<b>REMOVE</b>
___
The remove key expects an array with property names from your original package.json file that you wish to not be included in the copied package.json file:
<pre>
    plugins : [ 
      new CopyPackageJsonPlugin({
        remove: ["scripts", "jest", "devDependcies]"]
      })
    ]
</pre>
  
<b>REPLACE</b>
___
The replace key expects an object with property names from your original package.json file that you wish to replace with different properties: <br/>
<pre>
    new CopyPackageJsonPlugin({
      replace: { 
        author: "Mario Lopez", 
        scripts: {start: "node index.js",  test: "echo \"Error: no test specified\" && exit 1"}
      }
    })
</pre>

<li>By default this will merge keys by one level deep</li>
<li>So if your original package.json has a scripts key with the following properties:</li>
<pre>
    scripts: {
      start: "node src/index.js",  
      test: "jest", 
      lint: "eslint ."
    }
</pre>
<li>The output using the configuration from the above example will return a package.json with</li>
<pre>
      scripts: {
        start: "node index.js",  
        test: "echo \"Error: no test specified\" && exit 1",
        lint: "eslint ."
    }
</pre>
<li>If you do not want the a key that is object to be merged with those from the original package.json and wish to overwrite it completely you can `remove` that property and then `replace` it with the new desired object</li>
<pre>
    new CopyPackageJsonPlugin({
      remove: ['scripts', 'dependencies'],
      replace: { 
        scripts: {start: "node index.js",  test: "echo \"Error: no test specified\" && exit 1"},
        dependencies: {react: "latest"}
      }
    })
</pre>

<h3>Note</h3>

<li>If you wish to simply copy package.json to the dist file without any modifications simply call constructor w/out arguments:</li>
<pre>
    CopyPkgJsonPlugin()
</pre>
<li>If you which to remove an item but not replace any just pass in this key:</li>
<pre>
    CopyPckJsonPlugin({remove: ["engines","devDependencies"]})
</pre>
<li>And vice-versa if you wish to replace but not remove any items: </li>
<pre>
    CopyPckJsonPlugin({replace: {author: "Mario Lopez"}})
</pre>