#!/bin/bash
cd ../../gen
npm install --save-dev $1
cp package.json ../src/npm
