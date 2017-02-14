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
serialfs.obj('subfolder', {contents: false}, (err, res) => {
    console.log(res);}); // ["", ""]"
serialfs.yaml('subfolder', (err, res) => {
    console.log(res);}); // "- file1 \n- file2"
```

If present, the second and third parameter specify whether serialfs should
return the file contents, and whether serialfs should recurse into sub folders.

By default, serialfs does not return the file contents but does recurse into all
subfolders. This behaviour can be overridden but these parameters.

For example if the file structure is:
{a: {b: 'text1', c: 'text2'}, d: {e: 'text3:, f: 'text4'}}
the second parameter is:
{a: {b: true}}
and the third parameter is:
{a: {d: false}}

the result would be:
{a: {b: 'text1', c: ''}, d: null}
