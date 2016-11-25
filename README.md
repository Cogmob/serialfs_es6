Creates an object / string representation of a file system recursively. Useful
for writing unit tests for a utility that modifies files.

# usage

```shell
npm install --save serialfs
```

```javascript
const serialfs = require('serialfs');

serialfs.obj('subfolder', (err, res) => {
    console.log(res);}); // ["file1", "file2"]
serialfs.yaml('subfolder', (err, res) => {
    console.log(res);}); // "- file1 \n- file2"
```
