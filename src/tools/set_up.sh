#!/bin/bash
cd ../..
rm -rf gen
mkdir gen
cp -r src gen
cp src/npm/package.json gen
cd gen
npm install npm
npm install
npm install gulpjs/gulp#4.0
