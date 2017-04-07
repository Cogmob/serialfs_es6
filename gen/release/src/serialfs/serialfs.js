'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var async = require('async');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var vargs = require('vargs-callback');

//    if (options) {
//        if ('should_read_file_contents' in options) {
//            contents = options.should_read_file_contents;}
//        if ('should_recurse' in options) {
//            recurse = options.should_recurse;}
//        if ('should_print_debug_statements') {
//            should_print_debug = options.should_print_debug_statements;}}

var obj_r = vargs(function (srcpath, options, cb) {
    if (options.should_print_debug) {
        console.log('- options:');
        console.log(options);
        console.log(' ');
    }
    if (options.should_read_file_contents === undefined) options.should_read_file_contents = true;
    if (options.should_recurse === undefined) options.should_recurse = true;
    fs.stat(srcpath, function (err, stats) {
        if (err) {
            return cb(err);
        }
        if (!stats.isDirectory()) {
            if (options.should_read_file_contents === false) {
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
            if (options.should_recurse) {
                async.reduce(files, {}, function (memo, basename, reduce_cb) {
                    var new_options = {
                        should_read_file_contents: sub_contents(options.should_read_file_contents, basename),
                        should_recurse: sub_recurse(options.should_recurse, basename),
                        should_print_debug: options.should_print_debug };
                    obj_r(path.resolve(srcpath, basename), new_options, function (err, content) {
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

var obj = function obj(srcpath, options, cb) {
    if (cb) {
        return obj_r(srcpath, options, function (err, res) {
            if (err) {
                return cb(err);
            }
            cb(null, res);
        });
    }
    return new Promise(function (resolve, reject) {
        obj_r(srcpath, options, function (err, data) {
            if (err !== null) return reject(err);
            resolve(data);
        });
    });
};

var yaml = function yaml(srcpath, options, cb) {
    if (cb) {
        return obj_r(srcpath, options, function (err, res) {
            if (err) {
                return cb(err);
            }
            cb(null, jsyaml.safeDump(res));
        });
    }
    return obj(srcpath, options).then(function (res) {
        return Promise.resolve(jsyaml.safeDump(res));
    });
};

var list = function list(srcpath, options, cb) {
    if (cb) {
        return obj_r(srcpath, options, function (err, res) {
            if (err) {
                return cb(err);
            }
            cb(null, tree_to_list(res, []));
        });
    }
    return obj(srcpath, options).then(function (res) {
        return Promise.resolve(tree_to_list(res, []));
    });
};

module.exports = { obj: obj, yaml: yaml, list: list };