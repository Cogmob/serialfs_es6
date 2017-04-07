const async = require('async');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');
const vargs = require('vargs-callback');

//    if (options) {
//        if ('should_read_file_contents' in options) {
//            contents = options.should_read_file_contents;}
//        if ('should_recurse' in options) {
//            recurse = options.should_recurse;}
//        if ('should_print_debug_statements') {
//            should_print_debug = options.should_print_debug_statements;}}

const obj_r = vargs((srcpath, options, cb) => {
    if (options.should_print_debug) {
        console.log('- options:');
        console.log(options);
        console.log(' ');}
    if (options.should_read_file_contents === undefined)
        options.should_read_file_contents = true;
    if (options.should_recurse === undefined) options.should_recurse = true;
    fs.stat(srcpath, (err, stats) => {
        if (err) {
            return cb(err);}
        if (!stats.isDirectory()) {
            if (options.should_read_file_contents === false) {
                return cb(null, '');}
            return fs.readFile(srcpath, 'utf8', (err, res) => {
                if (err) {
                    return cb(err);}
                return cb(null, res.toString());});}
        fs.readdir(srcpath, (err, files) => {
            if (err) {
                return cb(err);}
            if (options.should_recurse) {
                async.reduce(
                    files,
                    {},
                    (memo, basename, reduce_cb) => {
                        const new_options = {
                            should_read_file_contents: sub_contents(
                                options.should_read_file_contents,
                                basename),
                            should_recurse: sub_recurse(
                                options.should_recurse,
                                basename),
                            should_print_debug: options.should_print_debug};
                        obj_r(
                            path.resolve(srcpath, basename),
                            new_options,
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

const tree_to_list = (tree, path) => {
    if (typeof tree === 'string') {
        return [{
            'path': path.join('/'),
            'contents': tree}];}
    var ret = [];
    for (var key in tree) {
        ret = ret.concat(tree_to_list(tree[key], path.concat(key)));}
    return ret;}

const obj = (srcpath, options, cb) => {
    if (cb) {
        return obj_r(srcpath, options, (err, res) => {
            if (err) {
                return cb(err);}
            cb(null, res);});}
    return new Promise((resolve, reject) => {
        obj_r(srcpath, options, (err, data) => {
            if (err !== null) return reject(err);
            resolve(data);});});};

const yaml = (srcpath, options, cb) => {
    if (cb) {
        return obj_r(srcpath, options, (err, res) => {
            if (err) {
                return cb(err);}
            cb(null, jsyaml.safeDump(res));});}
    return obj(srcpath, options).then((res) => {
        return Promise.resolve(jsyaml.safeDump(res));});};

const list = (srcpath, options, cb) => {
    if (cb) {
        return obj_r(srcpath, options, (err, res) => {
            if (err) {
                return cb(err);}
            cb(null, tree_to_list(res, []));});}
    return obj(srcpath, options).then((res) => {
        return Promise.resolve(tree_to_list(res, []));});};

module.exports = {obj, yaml, list}
