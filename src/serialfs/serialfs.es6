const async = require('async');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');
const vargs = require('vargs-callback');

const obj = vargs((srcpath, options, cb) => {
    if (!options) {
        options = {contents: true};}

    fs.stat(srcpath, (err, stats) => {
        if (err) {
            return cb(err);}
        if (!stats.isDirectory()) {
            console.log(srcpath);
            if (!options.contents) {
                return cb(null, '');}
            return fs.readFile(srcpath, 'utf8', (err, res) => {
                if (err) {
                    cb(err);}
                console.log(res);
                cb(null, res.toString());});}
        fs.readdir(srcpath, (err, files) => {
            if (err) {
                return cb(err);}
            async.reduce(files, {}, (acc, basename, reduce_cb) => {
                obj(
                    path.resolve(srcpath, basename),
                    options,
                    (err, content) => {
                        if (err) {
                            return reduce_cb(err);}
                        acc[basename] = content;
                        reduce_cb(null, acc);});}, cb);});});});

const yaml = vargs((srcpath, options, cb) => {
    if (!options) {
        options = {contents: true};}
        
    obj(srcpath, options, (err, res) => {
        if (err) {
            return cb(err);}
        cb(null, jsyaml.safeDump(res));});});

module.exports = {obj, yaml}
