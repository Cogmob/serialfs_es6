'use strict';

var test = require('tape');
var serialfs = require('./serialfs');
var path = require('path');

test('test obj without contents', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual({ a: { b: { c: { d: { e: { f: { g: { h: '' } } } } } } }, ffff: '' }, generated);
        t.end();
    });

    serialfs.obj(path.resolve(__dirname, 'data'), false, cb);
});

test('test obj', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual({ a: { b: { c: { d: { e: { f: { g: { h: 'second file contents\n' } } } } } } }, ffff: 'fkdjfkajsd\n' }, generated);
        t.end();
    });

    serialfs.obj(path.resolve(__dirname, 'data'), true, cb);
});

test('test yaml', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('a:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: |\n  fkdjfkajsd\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), true, cb);
});

test('test subset', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('a:\n  b:\n    c:\n      d:\n        e: null\nffff: \'\'\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), false, { a: { b: { c: { d: { e: false } } } } }, true, cb);
});

test('test subset contents', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('a:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: \'\'\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), { a: { b: { c: { d: { e: { f: { g: { h: true } } } } } } } }, cb);
});

var make_test_cb = function make_test_cb(t, compare_func) {
    return function (err, generated) {
        if (err) {
            console.log(word_wrap(err.stack.replace(/\\/g, '\\ '), {
                trim: true,
                width: 80 }).split('\n').forEach(function (stack_line) {
                console.log(stack_line.replace(/\\ /g, '\\').replace(/ at/g, '\nat').replace(/Error:/g, '\nError:'));
            }));
            t.fail();
            return t.end();
        }

        return compare_func(generated);
    };
};