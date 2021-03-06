#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var common = require("./common.js");

function getFiles(dir, lang) {
    var files = common.getFiles(dir, []);
    files = files.filter(function(item) {
        if (lang === "") {
            lang = "en";
        }
        // TODO: check lang
        return path.extname(item) === ".json" && (item.indexOf(lang) > -1);
    });
    return files;
}

function getText(name) {
    var text = fs.readFileSync(name, "UTF-8");
    var data = JSON.parse(text);

    function iterateData(data, result, prefix) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (common.isObject(data[key])) {
                    iterateData(data[key], result, prefix + ":" + key);
                } else {
                    result[prefix + ":" + key] = data[key];
                }
            }
        }
        return result;
    }
    var obj = iterateData(data, {}, "");
    return obj;
}

function getData(dir, lang) {
    var files = getFiles(dir, lang);
    var obj = {};
    files.map(function(name) {
        var data = getText(name);
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key]) {
                    obj[key] = (data[key]);
                }
            }
        }
    });

    return obj;
}

function setData(newdata, dir, fromLang, toLang) {
    var files = getFiles(dir, fromLang);

    files.map(function(name) {
        var olddata = getText(name);
        var newname = name.replace("/" + fromLang + "/", "/" + toLang + "/");

        common.createParentFolder(newname);

        var data = {};
        for (var key in olddata) {
            if (olddata.hasOwnProperty(key)) {
                var oldvalue = olddata[key];
                var newvalue = newdata[oldvalue];
                if (newvalue && isNaN(newvalue)) {
                    var keyList = key.split(":");
                    var curData = data;
                    var curKey;
                    for (var i = 1; i < keyList.length - 1; i++) {
                        curKey = keyList[i];
                        curData[curKey] = {};
                        curData = curData[curKey];
                    }
                    curKey = keyList[keyList.length - 1];
                    curData[curKey] = newvalue;
                }
            }
        }
        console.log(data);
        fs.writeFileSync(newname, JSON.stringify(data));
    });
}

module.exports = {
    getData,
    setData
};
