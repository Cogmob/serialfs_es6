'use strict';

var test = require('tape');
var serialfs = require('./serialfs');
var path = require('path');

test('test obj without contents', function (t) {
    t.plan(1);
    serialfs.obj(path.resolve(__dirname, 'data'), { contents: false }, function (err, res) {
        t.deepEqual({ ffff: '' }, res);
    });
});

test('test obj', function (t) {
    t.plan(1);
    serialfs.obj(path.resolve(__dirname, 'data'), function (err, res) {
        t.deepEqual({ ffff: 'fkdjfkajsd\n' }, res);
    });
});

test('test yaml', function (t) {
    t.plan(1);
    serialfs.yaml(path.resolve(__dirname, 'data'), function (err, res) {
        t.deepEqual('ffff: |\n  fkdjfkajsd\n', res);
    });
});