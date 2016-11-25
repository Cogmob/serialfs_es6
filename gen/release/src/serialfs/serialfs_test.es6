const test = require('tape');
const serialfs = require('./serialfs');
const path = require('path');

test('test obj without contents', t => {
    t.plan(1);
    serialfs.obj(
        path.resolve(__dirname, 'data'),
        {contents: false},
        (err, res) => {
                t.deepEqual({a: {b: {c: {d: ''}}}, ffff: ''}, res);});});

test('test obj', t => {
    t.plan(1);
    serialfs.obj(path.resolve(__dirname, 'data'), (err, res) => {
        t.deepEqual({a: {b: {c: {d: ''}}}, ffff: 'fkdjfkajsd\n'}, res);});});

test('test yaml', t => {
    t.plan(1);
    serialfs.yaml(path.resolve(__dirname, 'data'), (err, res) => {
        t.deepEqual('a:\n  b:\n    c:\n      d: \'\'\nffff: |\n  fkdjfkajsd\n', res);});});
