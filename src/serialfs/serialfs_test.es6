const test = require('tape');
const serialfs = require('./serialfs');
const path = require('path');

test('test obj', t => {
    t.plan(1);
    const res = serialfs.obj(path.resolve(__dirname, 'data'));
    t.deepEqual({ffff: 'fkdjfkajsd\n'}, res);
});

test('test yaml', t => {
    t.plan(1);
    const res = serialfs.yaml(path.resolve(__dirname, 'data'));
    t.deepEqual('ffff: |\n  fkdjfkajsd\n', res);
});
