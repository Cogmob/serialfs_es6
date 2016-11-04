#!/bin/bash
cd ../../gen
rm -rf dev
mkdir dev
cp -r ../src dev
cp ../src/npm/package.json dev
cd dev
npm install
