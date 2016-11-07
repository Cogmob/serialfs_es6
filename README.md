Creates an object / string representation of a file system recursively. Useful
for writing unit tests for a utility that modifies files.

# usage

```shell
npm install --save serialfs
```

```javascript
const serialfs = require('serialfs');

console.log(serialfs.obj('subfolder')); // ["file1", "file2"]
console.log(serialfs.yaml('subfolder')); // "- file1 \n- file2"
```
