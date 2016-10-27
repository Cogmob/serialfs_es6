#!/bin/bash
cp -rf ../../src ../../gen
cd ../../gen
node_modules/.bin/babel-node src/tools/repl_test.js
