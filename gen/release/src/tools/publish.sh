#!/bin/bash
cd ../npm
npm version patch
cd ../../gen/dev
npm version patch
cd ../release
npm version patch
npm publish ./
