'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var vargs = require('vargs-callback');

var obj = vargs(function (srcpath, options, cb) {
    if (!options) {
        options = { contents: true };
    }

    fs.stat(srcpath, function (err, stats) {
        if (err) {
            return cb(err);
        }
        if (!stats.isDirectory()) {
            if (!options.contents) {
                return cb(null, '');
            }
            return fs.readFile(srcpath, 'utf8', function (err, res) {
                if (err) {
                    cb(err);
                }
                cb(null, res.toString());
            });
        }
        fs.readdir(srcpath, function (err, files) {
            if (err) {
                return cb(err);
            }
            async.reduce(files, {}, function (acc, basename, reduce_cb) {
                obj(path.resolve(srcpath, basename), options, function (err, content) {
                    if (err) {
                        return reduce_cb(err);
                    }
                    acc[basename] = content;
                    reduce_cb(null, acc);
                });
            }, cb);
        });
    });
});

var yaml = vargs(function (srcpath, options, cb) {
    if (!options) {
        options = { contents: true };
    }

    obj(srcpath, options, function (err, res) {
        if (err) {
            return cb(err);
        }
        cb(null, jsyaml.safeDump(res));
    });
});

module.exports = { obj: obj, yaml: yaml };