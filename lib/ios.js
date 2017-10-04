#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var common = require('./common.js');
var ios_parser = require('./ios_parser');

function getData(dir, lang) {
    var files = getFiles(dir, lang);
    var obj = {};
    files.map(function(name) {
        var data = ios_parser.getData(name);
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key]) {
                    obj[key] = removeFormat(data[key]);
                }
            }
        }
    });
    return obj;
}

function setData(newdata, dir, from_lang, to_lang) {
    var files = getFiles(dir, from_lang);

    files.map(function(name) {
        var olddata = ios_parser.getData(name);
        var newname = name.replace("/" + from_lang + ".lproj/", "/" + to_lang + ".lproj/");

        common.createParentFolder(newname);

        var data = [];
        for (var key in olddata) {
            if (olddata.hasOwnProperty(key)) {
                var oldvalue = olddata[key];
                var newvalue = newdata[removeFormat(oldvalue)];
                if (newvalue && isNaN(newvalue)) {
                    data[key] = addFormat(newvalue);
                }
            }
        }
        ios_parser.setData(newname, data);
    });
}

function removeFormat(value) {
    value = common.replaceAll(value, "\\n", "\n");
    return value;
}

function addFormat(value) {
    value = common.replaceAll(value, "\n", "\\n");
    return value;
}

function getFiles(dir, lang) {
    var files = common.getFiles(dir, []);

    files = files.filter(function(item) {
        if (lang === "") {
            lang = "Base";
        }
        return path.extname(item) === ".strings" && item.indexOf("/" + lang + ".lproj/") > -1;
    });
    return files;
}

module.exports = {
    getData: getData,
    setData: setData
}
