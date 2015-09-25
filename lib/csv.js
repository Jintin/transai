#!/usr/bin/env node

var fs = require('fs');
var common = require('./common.js');

module.exports = {
  load: load,
  save: save
}

function load(path) {
  var data = fs.readFileSync(path, 'UTF-8');
  var array = [];
  init();

  function init() {
    lastChar = '';
    line = [];
    comma = 0;
    singlequote = false;
    escape = false;
  }

  function add(char) {
    if (!line[comma]) {
      line[comma] = '';
    }
    line[comma] += char;
  }

  for (var i = 0; i < data.length; i++) {
    var char = data.charAt(i);

    switch (char) {
      case '\n':
        if (escape) {
          if (lastChar == '"' && !singlequote) {
            array.push(line);
            init();
          } else {
            add(char);
          }
        } else {
          array.push(line);
          init();
        }
        break;
      case ',':
        if (escape) {
          if (lastChar == '"' && !singlequote) {
            comma++;
            escape = false;
          } else {
            add(char);
          }
        } else {
          comma++;
        }
        break;
      case '"':
        if (!line[comma]) { //" at beginning
          escape = true;
        }
        if (escape) {
          if (!singlequote && lastChar == '"') {
            add(char);
          }
          singlequote = !singlequote;
        } else { //normal "
          add(char);
        }
        break;

      default:
        add(char);
        break;
    }
    lastChar = char;
  }
  return array;
}

function save(path, data) {
  var string = '';
  for (key in data) {
    if(key && data[key]){
      string += wraper(key) + ',' + wraper(data[key]) + '\n';
    }
  }
  fs.writeFileSync(path, string);

  function wraper(data) {
    var quote = false;
    if (data.indexOf('"') > -1) {
      data = common.replaceAll(data, '"', '""');
      quote = true;
    } else if (data.indexOf(',') > -1) {
      quote = true;
    } else if (data.indexOf('\n') > -1) {
      quote = true;
    }
    if (quote) {
      data = '"' + data + '"';
    }
    return data;
  }
}
