'use strict';

var test = require('tape');
var serialfs = require('./serialfs');
var path = require('path');

test('test obj', function (t) {
    t.plan(1);
    var res = serialfs.obj(path.resolve(__dirname, 'data'));
    t.deepEqual({ ffff: 'fkdjfkajsd\n' }, res);
});

test('test yaml', function (t) {
    t.plan(1);
    var res = serialfs.yaml(path.resolve(__dirname, 'data'));
    t.deepEqual('ffff: |\n  fkdjfkajsd\n', res);
});