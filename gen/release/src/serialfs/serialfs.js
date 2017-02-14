'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var async = require('async');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var vargs = require('vargs-callback');

var obj = vargs(function (srcpath, contents, recurse, should_print_debug, cb) {
    if (should_print_debug) {
        console.log('- contents:');
        console.log(contents);
        console.log('- recurse:');
        console.log(jsyaml.safeDump(recurse));
        console.log(' ');
    }
    if (contents === undefined) contents = true;
    if (recurse === undefined) recurse = true;
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
            if (recurse) {
                async.reduce(files, {}, function (memo, basename, reduce_cb) {
                    obj(path.resolve(srcpath, basename), sub_contents(contents, basename), sub_recurse(recurse, basename), should_print_debug, function (err, content) {
                        if (err) {
                            return reduce_cb(err);
                        }
                        memo[basename] = content;
                        reduce_cb(null, memo);
                    });
                }, cb);
            } else {
                cb(null, null);
            }
        });
    });
});

var sub_contents = function sub_contents(contents, basename) {
    if ((typeof contents === 'undefined' ? 'undefined' : _typeof(contents)) !== 'object') return contents;
    if (basename in contents) return contents[basename];
    return false;
};

var sub_recurse = function sub_recurse(contents, basename) {
    if ((typeof contents === 'undefined' ? 'undefined' : _typeof(contents)) !== 'object') return contents;
    if (basename in contents) return contents[basename];
    return true;
};

var yaml = vargs(function (srcpath, contents, recurse, should_print_debug, cb) {
    obj(srcpath, contents, recurse, should_print_debug, function (err, res) {
        if (err) {
            return cb(err);
        }
        cb(null, jsyaml.safeDump(res));
    });
});

var tree_to_list = function tree_to_list(tree, path) {
    if (typeof tree === 'string') {
        return [{
            'path': path.join('/'),
            'contents': tree }];
    }
    var ret = [];
    for (var key in tree) {
        ret = ret.concat(tree_to_list(tree[key], path.concat(key)));
    }
    return ret;
};

var list = vargs(function (srcpath, contents, recurse, should_print_debug, cb) {
    obj(srcpath, contents, recurse, should_print_debug, function (err, res) {
        if (err) {
            return cb(err);
        }
        cb(null, tree_to_list(res, []));
    });
});

module.exports = { obj: obj, yaml: yaml, list: list };