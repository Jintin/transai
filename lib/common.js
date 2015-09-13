#!/usr/bin/env node

fs = require('fs');

module.exports = {
  getFiles: getFiles,
  trim: trim
}

function getFiles(path, data) {

  var dir = fs.readdirSync(path);
  dir.map(function(item) {
    if (item == '.' || item == '..') {
      return;
    }

    var itempath = path + '/' + item;

    if (fs.statSync(itempath).isDirectory()) {
      getFiles(itempath, data);
    } else {
      data.push(itempath);
    }
  });

  return data;
}

function trim(str){
  return str.replace(/\s/g, "X");
}
