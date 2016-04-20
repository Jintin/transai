#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var common = require('./common.js');

module.exports = {
  getData: getData,
  setData: setData
}

var specialChars = {
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '\\\'': '\'',
  '\\n': '\n'
}

function getData(dir, lang) {
  var files = getFiles(dir, lang);
  var obj = {};
  files.map(function(name) {
    var raw = fs.readFileSync(name);
    var parser = new xml2js.Parser();
    parser.parseString(raw, function(err, result) {
      if (err) {
        console.error(name + " file has syntax error");
        return;
      }
      var data = result['resources']['string'];
      if (data) {
        obj = parse(data);
      }
    });
  });
  return obj;
}

function parse(data) {
  var obj = {};
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

    if (!fs.lstatSync(parentDir).isDirectory()) {
      try {
        fs.mkdirSync(parentDir);
      } catch (e) {
        console.log("create folder fail:" + parentDir);
      }
    }

    var string = '<resources>\n';
    for (var key in olddata) {
      if (olddata.hasOwnProperty(key)) {
        var oldvalue = olddata[key];
        var value = newdata[oldvalue];
        if (value) {
          value = addFormat(value);
          string += '\t<string name="' + key + '">' + value + '</string>\n';
        }
      }
    }
    string += '</resources>\n'
    fs.writeFileSync(newname, string);
  });
}

function removeFormat(value) {
  for (var key in specialChars) {
    if (specialChars.hasOwnProperty(key)) {
      value = common.replaceAll(value, key, specialChars[key]);
    }
  }

  return value;
}

function addFormat(value) {
  for (var key in specialChars) {
    if (specialChars.hasOwnProperty(key)) {
      value = common.replaceAll(value, specialChars[key], key);
    }
  }

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
