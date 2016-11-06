#!/bin/bash
cd ../../gen/dev
clear
node_modules/.bin/tape src/**/*test.js | node_modules/.bin/tap-difflet
