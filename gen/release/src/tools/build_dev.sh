#!/bin/bash
cp ../npm/gulpfile.js ../../gen/dev
cd ../../gen/dev
cp ../../src/npm/package.json .
node_modules/.bin/gulp build_dev
