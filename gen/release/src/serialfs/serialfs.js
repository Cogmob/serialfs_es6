'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var async = require('async');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var vargs = require('vargs-callback');

var obj = vargs(function (srcpath, contents, should_print_debug, cb) {
    if (should_print_debug) {
        console.log('obj');
        console.log(contents);
        return cb();
    }
    if ((typeof contents === 'undefined' ? 'undefined' : _typeof(contents)) === undefined) contents = true;
    fs.stat(srcpath, function (err, stats) {
        if (err) {
            return cb(err);
        }
        if (!stats.isDirectory()) {
            if (contents === false) {
                return cb(null, '');
            }
            return fs.readFile(srcpath, 'utf8', function (err, res) {
                if (err) {
                    return cb(err);
                }
                return cb(null, res.toString());
            });
        }
        fs.readdir(srcpath, function (err, files) {
            if (err) {
                return cb(err);
            }
            async.reduce(files, {}, function (memo, basename, reduce_cb) {
                var c = sub_contents(contents, basename);
                if (should_print_debug) {
                    console.log(basename + ' contents: ' + (c !== false));
                    console.log(c);
                }
                obj(path.resolve(srcpath, basename), c, function (err, content) {
                    if (err) {
                        return reduce_cb(err);
                    }
                    memo[basename] = content;
                    reduce_cb(null, memo);
                });
            }, cb);
        });
    });
});

var sub_contents = function sub_contents(contents, basename) {
    if ((typeof contents === 'undefined' ? 'undefined' : _typeof(contents)) !== 'object') return contents;
    if (basename in contents) return contents[basename];
    return false;
};

var yaml = vargs(function (srcpath, contents, cb) {
    if ((typeof contents === 'undefined' ? 'undefined' : _typeof(contents)) === undefined) contents = true;
    obj(srcpath, contents, function (err, res) {
        if (err) {
            return cb(err);
        }
        cb(null, jsyaml.safeDump(res));
    });
});

module.exports = { obj: obj, yaml: yaml };