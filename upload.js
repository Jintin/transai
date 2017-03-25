#!/usr/bin/env node

var execSync = require('child_process').execSync;

execSync('npm publish');
