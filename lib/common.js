#!/usr/bin/env node

var fs = require('fs');

module.exports = {
    getFiles: getFiles,
    replaceAll: replaceAll,
    isObject: isObject
}

function getFiles(path, data) {
    var dir = fs.readdirSync(path);
    dir.map(function(item) {
        if (item === '.' || item === '..') {
            return;
        }

        var itempath = path + '/' + item;
        var stat = fs.statSync(itempath);
        if (stat.isDirectory()) {
            getFiles(itempath, data);
        } else {
            data.push(itempath);
        }
    });
    return data;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    if (string) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    return string;
}

function isObject(item) {
    return (typeof item === "object" && !Array.isArray(item) && item !== null);
}
