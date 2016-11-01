#!/bin/bash
cp ../npm/gulpfile.js ../../gen/dev
cd ../../gen/dev
node_modules/.bin/gulp build_dev
clear
sudo node_modules/.bin/tape src/**/*test.js | sudo node_modules/.bin/tap-difflet
