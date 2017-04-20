import path from 'path';

function isPath(filename) {
  var c = path.resolve(filename);
  return c;
}
var testPath = path.join(__dirname, __filename);
isPath(testPath);

export default isPath;