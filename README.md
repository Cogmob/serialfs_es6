creates an object / string representation of files and folders

# usage

```javascript
const serialfs = require('serialfs');

// callback style
serialfs.obj('subfolder', (err, res) => {
    console.log(res);}); // {"file1": "contents", "file2": "contents"}

serialfs.obj('subfolder', {should_read_file_contents: false}, (err, res) => {
    console.log(res);}); // {"file1": "", "file2":""}

serialfs.yaml('subfolder', (err, res) => {
    console.log(res);}); // "file1: '' \nfile2: ''"

// promise style
serialfs.obj('subfolder').then((res) => {
    console.log(res);}).catch((err) => true);
```

## options

the second parameter is the options object. specify behvior with the following:

### should_recurse

if this is true, will recurse into all subfolders\
if this is false, will not recurse into any subfolders\
if this is an object, will look for the current folder's name
- if found, will recurse into the folder in the object and the file system and repeat
- if not found, will recurse into the folder

### should_read_file_contents

if this is true, will read the contents of the files\
if this is false, will not read the contents of the files\
if this is an object, will look for the current folder's name
- if found, will recurse into the folder in the object and the file system and repeat
- if not found, will recurse into the folder

### example
if the file structure is:
```json
{"a": {"b": "text1", "c": "text2"}, "d": {"e": "text3:, "f": "text4"}}
```
the recurse object is:
```json
{"a": {"b": true}}
```
and the read file object is:
```json
{"a": {"d": false}}
```
the result would be:
```json
{"a": {"b": "text1", "c": ""}, "d": null}
```

### should_print_debug

will send extra information to standard out, to help understand what's happening

## installation

```shell
npm install --save serialfs
```
