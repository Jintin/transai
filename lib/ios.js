#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var common = require('./common.js');
var ios_parser = require('./ios_parser');

module.exports = {
  getData: getData,
  setData: setData
}

function getData(dir, lang) {
  var files = getFiles(dir, lang);
  var obj = {};
  files.map(function(name) {
    var data = ios_parser.getData(name);
    for (var key in data) {
      if (data[key]) {
        obj[key] = data[key];
      }
    }
  });
  return obj;
}

function setData(newdata, dir, from_lang, to_lang) {
  var files = getFiles(dir, from_lang);

  files.map(function(name) {
    var olddata = ios_parser.getData(name);
    var newname = name.replace('/' + from_lang + '.lproj/', '/' + to_lang + '.lproj/');
    var parentDir = path.dirname(newname);

    try {
      fs.mkdirSync(parentDir);
    } catch (e) {}

    var data = [];
    for (key in olddata) {
      var oldvalue = olddata[key];
      if (newdata[oldvalue] && isNaN(newdata[oldvalue])) {
        data[key] = newdata[oldvalue];
      }
    }
    if (Object.keys(data).length > 0) {
      ios_parser.setData(newname, data);
    }
  });
}

function getFiles(dir, lang) {
  var files = common.getFiles(dir, []);

  files = files.filter(function(item) {
    if (lang == '') {
      lang = 'Base';
    }
    return path.extname(item) == '.strings' && item.indexOf('/' + lang + '.lproj/') > -1;
  });
  return files;
}
