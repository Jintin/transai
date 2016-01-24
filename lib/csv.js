#!/usr/bin/env node

var fs = require('fs');
var common = require('./common.js');

module.exports = {
  load: load,
  save: save
}

var TITLE = 'from,to\n';
var lastChar = '';
var line = [];
var comma = 0;
var singlequote = false;
var escape = false;

function load(path) {
  var data = fs.readFileSync(path, 'UTF-8');
  var array = [];
  init();
  data = common.replaceAll(data, TITLE, '');
  for (var i = 0; i < data.length; i++) {
    var char = data.charAt(i);
    switch (char) {
      case '\n':
        checkNewline(array);
        break;
      case ',':
        checkComma(array);
        break;
      case '"':
        checkQuote(array);
        break;
      default:
        add(char);
        break;
    }
    lastChar = char;
  }
  return array;
}

function checkNewline(array) {
  if (escape) {
    if (lastChar === '"' && !singlequote) {
      array.push(line);
      init();
    } else {
      add('\n');
    }
  } else {
    array.push(line);
    init();
  }
  return array;
}

function checkComma(array) {
  if (escape) {
    if (lastChar === '"' && !singlequote) {
      comma++;
      escape = false;
    } else {
      add(',');
    }
  } else {
    comma++;
  }
  return array;
}

function checkQuote(array) {
  if (!line[comma]) { //" at beginning
    escape = true;
  }
  if (escape) {
    if (!singlequote && lastChar === '"') {
      add('"');
    }
    singlequote = !singlequote;
  } else { //normal "
    add('"');
  }
}

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

function save(path, data) {
  var string = TITLE;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      string += wraper(key) + ',' + wraper(data[key]) + '\n';
    }
  }
  fs.writeFileSync(path, string);
}

function wraper(data) {
  if (!data) {
    return '';
  }
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
