#!/bin/bash
cd ../../gen/release
clear
node_modules/.bin/tape src/**/*test.js | node_modules/.bin/tap-difflet
