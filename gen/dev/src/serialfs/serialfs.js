'use strict';

var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');

var obj = function obj(srcpath) {
    var stats = fs.statSync(srcpath);

    if (stats.isDirectory()) {
        var files = fs.readdirSync(srcpath);
        var f = function f(acc, basename) {
            var content = obj(path.resolve(srcpath, basename));
            acc[basename] = content;
            return acc;
        };
        return files.reduce(f, {});
    }

    return fs.readFileSync(srcpath, 'utf8');
};

var yaml = function yaml(srcpath) {
    return jsyaml.safeDump(obj(srcpath));
};

module.exports = { obj: obj, yaml: yaml };