#!/bin/bash
cp ../npm/gulpfile.js ../../gen/dev
cd ../../gen/dev
node_modules/.bin/gulp build_dev
