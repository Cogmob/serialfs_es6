const async = require('async');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');
const vargs = require('vargs-callback');

const obj = vargs((srcpath, contents, cb) => {
    if (typeof contents === undefined) contents = true;
    fs.stat(srcpath, (err, stats) => {
        if (err) {
            return cb(err);}
        if (!stats.isDirectory()) {
            if (!contents) {
                return cb(null, '');}
            return fs.readFile(srcpath, 'utf8', (err, res) => {
                if (err) {
                    return cb(err);}
                return cb(null, res.toString());});}
        fs.readdir(srcpath, (err, files) => {
            if (err) {
                return cb(err);}
            async.reduce(files, {}, (acc, basename, reduce_cb) => {
                obj(
                    path.resolve(srcpath, basename),
                    sub_contents(contents, basename),
                    (err, content) => {
                        if (err) {
                            return reduce_cb(err);}
                        acc[basename] = content;
                        reduce_cb(null, acc);});}, cb);});});});

const sub_contents = (contents, basename) => {
    if (typeof contents !== 'object') return contents;
    if (basename in contents) return contents[basename];
    return false;};

const yaml = vargs((srcpath, contents, cb) => {
    if (typeof contents === undefined) contents = true;
    obj(srcpath, contents, (err, res) => {
        if (err) {
            return cb(err);}
        cb(null, jsyaml.safeDump(res));});});

module.exports = {obj, yaml}
