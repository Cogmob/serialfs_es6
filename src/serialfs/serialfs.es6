const async = require('async');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');
const vargs = require('vargs-callback');

const obj = vargs((srcpath, contents, recurse, should_print_debug, cb) => {
    if (should_print_debug) {
        console.log('- contents:');
        console.log(contents);
        console.log('- recurse:');
        console.log(jsyaml.safeDump(recurse) );
        console.log(' ');}
    if (contents === undefined) contents = true;
    if (recurse === undefined) recurse = true;
    fs.stat(srcpath, (err, stats) => {
        if (err) {
            return cb(err);}
        if (!stats.isDirectory()) {
            if (contents === false) {
                return cb(null, '');}
            return fs.readFile(srcpath, 'utf8', (err, res) => {
                if (err) {
                    return cb(err);}
                return cb(null, res.toString());});}
        fs.readdir(srcpath, (err, files) => {
            if (err) {
                return cb(err);}
            if (recurse) {
                async.reduce(
                    files,
                    {},
                    (memo, basename, reduce_cb) => {
                        obj(
                            path.resolve(srcpath, basename),
                            sub_contents(contents, basename),
                            sub_recurse(recurse, basename),
                            should_print_debug,
                            (err, content) => {
                                if (err) {
                                    return reduce_cb(err);}
                                memo[basename] = content;
                                reduce_cb(null, memo);});},
                    cb);}
            else {
                cb(null, null);}});});});

const sub_contents = (contents, basename) => {
    if (typeof contents !== 'object') return contents;
    if (basename in contents) return contents[basename];
    return false;};

const sub_recurse = (contents, basename) => {
    if (typeof contents !== 'object') return contents;
    if (basename in contents) return contents[basename];
    return true;};

const yaml = vargs((srcpath, contents, recurse, should_print_debug, cb) => {
    obj(srcpath, contents, recurse, should_print_debug, (err, res) => {
        if (err) {
            return cb(err);}
        cb(null, jsyaml.safeDump(res));});});

module.exports = {obj, yaml}
