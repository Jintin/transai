#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var common = require("./common.js");
var iosParser = require("./iosParser");

function getData(dir, lang) {
    var files = getFiles(dir, lang);
    var obj = {};
    files.map(function(name) {
        var data = iosParser.getData(name);
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

function setData(newdata, dir, fromLang, toLang) {
    var files = getFiles(dir, fromLang);

    files.map(function(name) {
        var olddata = iosParser.getData(name);
        var newname = name.replace("/" + fromLang + ".lproj/", "/" + toLang + ".lproj/");

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
        iosParser.setData(newname, data);
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
    getData,
    setData
};
