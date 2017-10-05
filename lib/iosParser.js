#!/usr/bin/env node

var fs = require("fs");
var common = require("./common.js");

var lastChar = "";
var tag = "";
var value = "";
var quote = 0;
var equalChar = false;
var commentLine = false;
var commentBlock = false;
var escape = false;
var word = false;

function init() {
    lastChar = "";
    tag = "";
    value = "";
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

function checkQuote() {
    if (commentLine || commentBlock) {
        return;
    } else if (escape) {
        add("\"");
    } else {
        quote++;
        if (quote === 1 || quote === 3) {
            word = true;
        } else {
            word = false;
        }
    }
}

function checkSlash() {
    if (word) {
        add("/");
    } else {
        if (lastChar === "/" && !commentBlock) {
            commentLine = true;
        } else if (lastChar === "*" && commentBlock) {
            commentBlock = false;
        }
    }
}

function checkStar() {
    if (word) {
        add("*");
    } else if (lastChar === "/" && !commentLine) {
        commentBlock = true;
    }
}

function checkEqual() {
    if (word) {
        add("=");
    } else if (quote === 2 && !commentLine && !commentBlock) {
        equalChar = true;
    }
}

function checkSemicolon(obj) {
    if (word) {
        add(";");
    } else if (commentLine || commentBlock) {
        return;
    } else if (quote === 4 && equalChar) {
        value = common.replaceAll(value, "\\\"", "\"");
        obj[tag] = value;
        init();
    }
}

function checkNewline() {
    if (commentLine) {
        commentLine = false;
    } else {
        add("\n");
    }
}

function getData(path) {
    var obj = {};
    var data = fs.readFileSync(path, "UTF-8");
    init();

    for (var i = 0; i < data.length; i++) {
        var char = data.charAt(i);
        if (lastChar === "\\" && !escape) {
            escape = true;
        } else {
            escape = false;
        }
        switch (char) {
            case "\"":
                checkQuote();
                break;
            case "/":
                checkSlash();
                break;
            case "*":
                checkStar();
                break;
            case "=":
                checkEqual();
                break;
            case ";":
                checkSemicolon(obj);
                break;
            case "\n":
                checkNewline();
                break;
            default:
                add(char);
                break;
        }
        lastChar = char;
    }
    return obj;
}

function setData(path, data, olddata) {
    var string = "";
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var value = data[key];
            if (value) {
                value = common.replaceAll(value, "\"", "\\\"");
                string += "\"" + key + "\" = \"" + value + "\";\n";
            }
        }
    }
    fs.writeFileSync(path, string);
}

module.exports = {
    getData,
    setData
};
