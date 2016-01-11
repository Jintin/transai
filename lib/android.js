#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var common = require('./common.js');

module.exports = {
  getData: getData,
  setData: setData
}

function getData(dir, lang) {
  var files = getFiles(dir, lang);
  var obj = {};
  files.map(function(name) {
    var raw = fs.readFileSync(name);
    var parser = new xml2js.Parser();
    parser.parseString(raw, function(err, result) {
      var data = result['resources']['string'];
      if (data) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          //no need to translate
          if (item['$']['translatable'] === 'false') {
            continue;
          }
          var value = item['_'];
          if (value) {
            value = removeFormat(value);
            obj[item['$']['name']] = value;
          }
        }
      }
    });
  });
  return obj;
}

function setData(newdata, dir, from_lang, to_lang) {
  var files = getFiles(dir, from_lang);
  var olddata = getData(dir, from_lang);

  files.map(function(name) {
    var newname;
    if (from_lang === '') {
      newname = name.replace('/values', '/values-' + to_lang);
    } else {
      newname = name.replace('/values-' + from_lang, '/values-' + to_lang);
    }
    var parentDir = path.dirname(newname);
    try {
      fs.mkdirSync(parentDir);
    } catch (e) {}

    var string = '<resources>\n';
    for (var key in olddata) {
      var oldvalue = olddata[key];
      var value = newdata[oldvalue];
      if (value) {
        value = addFormat(value);
        string += '\t<string name="' + key + '">' + value + '</string>\n';
      }
    }
    string += '</resources>\n'
    fs.writeFileSync(newname, string);
  });
}

function removeFormat(value) {
  value = common.replaceAll(value, '&amp;', '&');
  value = common.replaceAll(value, '&gt;', '>');
  value = common.replaceAll(value, '&lt;', '<');
  value = common.replaceAll(value, '\\\'', '\'');
  value = common.replaceAll(value, '\\n', '\n');

  return value;
}

function addFormat(value) {
  value = common.replaceAll(value, '&', '&amp;');
  value = common.replaceAll(value, '>', '&gt;');
  value = common.replaceAll(value, '<', '&lt;');
  value = common.replaceAll(value, '\'', '\\\'');
  value = common.replaceAll(value, '\n', '\\n');

  return value;
}

function getFiles(dir, lang) {
  var files = common.getFiles(dir, []);
  files = files.filter(function(item) {
    var matchpath;
    if (lang === '') {
      matchpath = '/values/strings.xml';
    } else {
      matchpath = '/values-' + lang + '/strings.xml';
    }
    return path.extname(item) === '.xml' && item.indexOf(matchpath) !== -1;
  });
  return files;
}
