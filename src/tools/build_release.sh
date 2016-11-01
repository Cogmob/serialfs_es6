#!/bin/bash
cp ../npm/gulpfile.js ../../gen/release
cd ../../gen/release
cp ../../src/npm/package.json .
npm install
clear
node_modules/.bin/gulp build_release
clear
sudo node_modules/.bin/tape src/**/*test.js | sudo node_modules/.bin/tap-difflet
