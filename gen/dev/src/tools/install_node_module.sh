#!/bin/bash
cd ../../gen/dev
npm install --save-dev $1
cp package.json ../../src/npm
