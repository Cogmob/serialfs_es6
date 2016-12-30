const test = require('tape');
const serialfs = require('./serialfs');
const path = require('path');

test('test obj without contents', t => {
    const cb = make_test_cb(t, (generated) => {
        t.deepEqual(
            {1: {2: {3: {4: ''}}}, a: {b: {c: {d: {e: {f: {g: {h: ''}}}}}}}, ffff: ''},
            generated);
        t.end();});

    serialfs.obj(path.resolve(__dirname, 'data'), false, cb);});

test('test obj', t => {
    const cb = make_test_cb(t, (generated) => {
        t.deepEqual({1: {2: {3: {4: 'new\n'}}}, a: {b: {c: {d: {e: {f: {g: {h: 'second file contents\n'}}}}}}}, ffff: 'fkdjfkajsd\n'}, generated);
        t.end();});

    serialfs.obj(path.resolve(__dirname, 'data'), true, cb);});

test('test yaml', t => {
    const cb = make_test_cb(t, (generated) => {
        t.deepEqual(
            '\'1\':\n  \'2\':\n    \'3\':\n      \'4\': |\n        new\na:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: |\n  fkdjfkajsd\n',
            generated);
        t.end();});

    serialfs.yaml(path.resolve(__dirname, 'data'), true, cb);});

test('test subset', t => {
    const cb = make_test_cb(t, (generated) => {
        t.deepEqual(
            '\'1\':\n  \'2\':\n    \'3\':\n      \'4\': \'\'\na:\n  b:\n    c:\n      d:\n        e: null\nffff: \'\'\n',
            generated);
        t.end();});

    serialfs.yaml(
        path.resolve(__dirname, 'data'),
        false,
        {a:{b:{c:{d:{e: false}}}}},
        cb);});

test('test subset contents', t => {
    const cb = make_test_cb(t, (generated) => {
        t.deepEqual(
            '\'1\':\n  \'2\':\n    \'3\':\n      \'4\': \'\'\na:\n  b:\n    c:\n      d:\n        e:\n          f:\n            g:\n              h: |\n                second file contents\nffff: \'\'\n',
            generated);
        t.end();});

    serialfs.yaml(
        path.resolve(__dirname, 'data'),
        {a:{b:{c:{d:{e:{f:{g:{h: true}}}}}}}},
        cb);});

const make_test_cb = (t, compare_func) => {
    return (err, generated) => {
        if (err) {
            console.log(word_wrap(err.stack.replace(/\\/g, '\\ '), {
                trim: true,
                width: 80})
            .split('\n').forEach((stack_line) => {
                console.log(stack_line
                    .replace(/\\ /g, '\\')
                    .replace(/ at/g, '\nat')
                    .replace(/Error:/g, '\nError:'));}));
            t.fail();
            return t.end();}
        
        return compare_func(generated);};};
