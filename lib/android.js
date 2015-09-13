#!/usr/bin/env node

common = require('./common.js');
fs = require('fs');
xml2js = require('xml2js');
path = require('path')

module.exports = {
  getData: getData,
  setData: setData
}

function setData(newdata, dir, from_lang, to_lang) {
  var files = getFiles(dir, from_lang);
  var fromdata = getData(dir, from_lang);

  console.log('fromdata');
  for (key in fromdata) {
    console.log(key + ':' + fromdata[key]);
  }
  console.log('newdata');
  for (key in newdata) {
    console.log(key + ':' + newdata[key]);
  }

  files.map(function(name) {
    var newname;
    if (from_lang == '') {
      newname = name.replace('/values', '/values-' + to_lang);
    } else {
      newname = name.replace('/values-' + from_lang, '/values-' + to_lang);
    }
    var parentDir = path.dirname(newname);
    try {
      fs.mkdirSync(parentDir);
    } catch (e) {}

    var string = '<resources>\n';
    for (key in fromdata) {
      var oldvalue = fromdata[key];
      if (newdata[oldvalue]) {
        string += '\t<string name="' + key + '">' + newdata[oldvalue] + '</string>\n';
      }else{
        console.log('not found = ' + key);
        console.log(oldvalue);
      console.log(newdata[oldvalue]);
      }
    }
    string += '</resources>'
    fs.writeFileSync(newname, string);
  });

}

function getData(dir, lang) {
  var files = getFiles(dir, lang);

  var obj = {};
  files.map(function(name) {
    var raw = fs.readFileSync(name);
    var parser = new xml2js.Parser();
    parser.parseString(raw, function(err, result) {
      var data = result['resources']['string'];
      if (data != null) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          obj[item['$']['name']] = item['_'].trim();
        }
      }
    });
  });
  console.log(obj);
  return obj;
}

function getFiles(dir, lang) {
  var files = common.getFiles(dir, []);
  files = files.filter(function(item) {
    if (lang == '') {
      matchpath = '/values/strings.xml';
    } else {
      matchpath = '/values-' + lang + '/strings.xml';
    }
    return path.extname(item) == '.xml' && item.indexOf(matchpath) != -1;
  });
  console.log(files);
  return files;
}
