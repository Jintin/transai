#!/usr/bin/env node

var fs = require('fs');
var common = require('./common.js');

module.exports = {
  getData: getData,
  setData: setData
}

function getData(path) {
  var obj = {};
  var data = fs.readFileSync(path, 'UTF-8');
  init();

  for (var i = 0; i < data.length; i++) {
    var char = data.charAt(i);
    if (lastChar == '\\' && !escape) {
      escape = true;
    } else {
      escape = false;
    }
    switch (char) {
      case '"':
        if (commentLine || commentBlock) {
          break;
        } else if (escape) {
          add(char);
        } else {
          quote++;
          if (quote == 1 || quote == 3) {
            word = true;
          } else {
            word = false;
          }
        }
        break;
      case '/':
        if (word) {
          add(char);
        } else {
          if (lastChar == '/' && !commentBlock) {
            commentLine = true;
          } else if (lastChar == '*' && commentBlock) {
            commentBlock = false;
          }
        }
        break;
      case '*':
        if (word) {
          add(char);
        } else if (lastChar == '/' && !commentLine) {
          commentBlock = true;
        }
        break;
      case '=':
        if (word) {
          add(char);
        } else if (quote == 2 && !commentLine && !commentBlock) {
          equalChar = true;
        }
        break;
      case ';':
        if (word) {
          add(char);
        } else if (commentLine || commentBlock) {
          break;
        } else if (quote == 4 && equalChar) {
          value = common.replaceAll(value, '\\"', '\"');
          obj[tag] = value;
          init();
        }
        break;
      case '\n':
        if (commentLine) {
          commentLine = false;
        } else {
          add(char);
        }
        break;
      default:
        add(char);
        break;
    }
    lastChar = char;
  }
  return obj;
}

function init() {
  lastChar = '';
  tag = '';
  value = '';
  quote = 0;
  equalChar = false;
  commentLine = false;
  commentBlock = false;
  escape = false;
  word = false;
}

function add(char) {
  if (commentLine || commentBlock || !word) {
    return;
  }
  if (equalChar) { //add value
    value += char;
  } else if (!equalChar) { //add tag
    tag += char;
  }
}

function setData(path, data, olddata) {
  var string = '';
  for (key in data) {
    var value = data[key];
    if (value) {
      value = common.replaceAll(value, '"', '\\"');
      string += '"' + key + '" = "' + value + '";\n';
    }
  }
  fs.writeFileSync(path, string);
}
