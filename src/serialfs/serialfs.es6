const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');

const obj = srcpath =>
{
    const stats = fs.statSync(srcpath);

    if (stats.isDirectory())
    {
        const files = fs.readdirSync(srcpath);
        const f = (acc, basename) =>
        {
            const content = obj(path.resolve(srcpath, basename));
            acc[basename] = content;
            return acc;
        }
        return files.reduce(f, {});
    }

    return fs.readFileSync(srcpath, 'utf8');
}

const yaml = srcpath =>
{
    return jsyaml.safeDump(obj(srcpath));
}

module.exports = {obj, yaml}
