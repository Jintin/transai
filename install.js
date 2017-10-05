#!/usr/bin/env node

var execSync = require("child_process").execSync;

execSync("sudo npm uninstall -g");
execSync("sudo npm install -g");
