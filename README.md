creates an object / string representation of a file system recursively. useful for writing unit tests for a utility that modifies files

# usage

```shell
npm install --save serialfs
```

```javascript
const serialfs = require('serialfs');

serialfs.obj('subfolder', (err, res) => {
    console.log(res);}); // ["file1", "file2"]
serialfs.obj('subfolder', {should_read_file_contents: false}, (err, res) => {
    console.log(res);}); // ["", ""]"
serialfs.yaml('subfolder', (err, res) => {
    console.log(res);}); // "- file1 \n- file2"

serialfs.obj('subfolder').then((res) => {
    console.log(res);}).catch((err) => true);
```

## options

the second parameter is the options object. specify behvior with the following:

### should_recurse

if this is true, will recurse into all subfolders
if this is false, will not recurse into any subfolders
if this is an object, will look for the current folder's name
- if found, will recurse into the folder in the object and the file system and repeat
- if not found, will recurse into the folder

### should_read_file_contents

if this is true, will read the contents of the files
if this is false, will not read the contents of the files
if this is an object, will look for the current folder's name
- if found, will recurse into the folder in the object and the file system and repeat
- if not found, will recurse into the folder

### example
if the file structure is:
{a: {b: 'text1', c: 'text2'}, d: {e: 'text3:, f: 'text4'}}
the recurse object is:
{a: {b: true}}
and the read file object is:
{a: {d: false}}

the result would be:
{a: {b: 'text1', c: ''}, d: null}

### should_print_debug

will send extra information to standard out, to help understand what's happening
