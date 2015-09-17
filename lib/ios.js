#!/usr/bin/env node

common = require('./common.js');
parser = require('i18n-strings-files');
path = require('path')

module.exports = {
  getData: getData,
  setData: setData
}

function setData(newdata, dir, from_lang, to_lang) {
  var files = getFiles(dir, from_lang);

  files.map(function(name) {
    var olddata = parser.readFileSync(name, 'UTF-8');
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
    if(Object.keys(data).length > 0){
      parser.writeFileSync(newname, data, 'UTF-8');
    }
  });
}

function getData(dir, lang) {
  var files = getFiles(dir, lang);

  var obj = {};
  files.map(function(name) {
    var data = parser.readFileSync(name, 'UTF-8');
    for (var key in data) {
      obj[key] = data[key].trim();
    }
  });
  return obj;
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
