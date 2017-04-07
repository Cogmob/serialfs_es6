'use strict';

var test = require('tape');
var serialfs = require('./serialfs');
var path = require('path');

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

var run_test_promise = function run_test_promise(t, compare_func, promise) {
    promise.catch(function (err) {
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
    }).then(function (res) {
        return compare_func(res);
    });
};

test('test obj without contents', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual({ 1: { 2: { 3: { 4: '' } } }, a: { b: { c: { d: { e: { f: { g: { h: '' } } } } } } }, ffff: '' }, generated);
        t.end();
    });

    serialfs.obj(path.resolve(__dirname, 'data'), { should_read_file_contents: false }, cb);
});

test('test obj', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual({ 1: { 2: { 3: { 4: 'new\n' } } }, a: { b: { c: { d: { e: { f: { g: { h: 'second file contents\n' } } } } } } }, ffff: 'fkdjfkajsd\n' }, generated);
        t.end();
    });

    serialfs.obj(path.resolve(__dirname, 'data'), {}, cb);
});

test('test yaml', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('\'1\':\n  \'2\':\n    \'3\':\n      \'4\': |\n        new\na:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: |\n  fkdjfkajsd\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), {}, cb);
});

test('test subset', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('\'1\':\n  \'2\':\n    \'3\':\n      \'4\': \'\'\na:\n  b:\n    c:\n      d:\n        e: null\nffff: \'\'\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), {
        should_read_file_contents: false,
        should_recurse: { a: { b: { c: { d: { e: false } } } } } }, cb);
});

test('test subset contents', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('\'1\':\n  \'2\':\n    \'3\':\n      \'4\': \'\'\na:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: \'\'\nffff: \'\'\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), {
        should_recurse: { a: { b: { c: { d: { e: { f: { g: { h: true } } } } } } } },
        should_read_file_contents: false }, cb);
});

test('test list', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual([{ path: '1/2/3/4', contents: 'new\n' }, { path: 'a/b/c/d/e/f/g/h', contents: 'second file contents\n' }, { path: 'ffff', contents: 'fkdjfkajsd\n' }], generated);
        t.end();
    });

    serialfs.list(path.resolve(__dirname, 'data'), {}, cb);
});

test('test yaml', function (t) {
    var cb = make_test_cb(t, function (generated) {
        t.deepEqual('\'1\':\n  \'2\':\n    \'3\':\n      \'4\': |\n        new\na:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: |\n  fkdjfkajsd\n', generated);
        t.end();
    });

    serialfs.yaml(path.resolve(__dirname, 'data'), {}, cb);
});

test('test yaml promise', function (t) {
    run_test_promise(t, function (generated) {
        t.deepEqual('\'1\':\n  \'2\':\n    \'3\':\n      \'4\': |\n        new\na:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: |\n  fkdjfkajsd\n', generated);
        t.end();
    }, serialfs.yaml(path.resolve(__dirname, 'data'), {}));
});

test('test list promise', function (t) {
    run_test_promise(t, function (generated) {
        t.deepEqual([{ path: '1/2/3/4', contents: 'new\n' }, { path: 'a/b/c/d/e/f/g/h', contents: 'second file contents\n' }, { path: 'ffff', contents: 'fkdjfkajsd\n' }], generated);
        t.end();
    }, serialfs.list(path.resolve(__dirname, 'data'), {}));
});