const async = require('async');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');

const obj = (srcpath, cb) => {
    fs.stat(srcpath, (err, stats) => {
        if (err) {
            return cb(err);}
        if (!stats.isDirectory()) {
            return fs.readFile(srcpath, 'utf8', cb);}
        fs.readdir(srcpath, (err, files) => {
            if (err) {
                return cb(err);}
            async.reduce(files, {}, (acc, basename, reduce_cb) => {
                obj(path.resolve(srcpath, basename), (err, content) => {
                    if (err) {
                        return cb(err);}
                    acc[basename] = content;
                    reduce_cb(null, acc);});}, cb);});});};

const yaml = (srcpath, cb) => {
    obj(srcpath, (err, res) => {
        if (err) {
            return cb(err);}
        cb(null, jsyaml.safeDump(res));});};

module.exports = {obj, yaml}
