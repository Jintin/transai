#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var xml2js = require("xml2js");
var common = require("./common.js");

var specialChars = {
    "&amp;": "&",
    "&gt;": ">",
    "&lt;": "<",
    "\\\'": "\'",
    "\\n": "\n"
};

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
        if (lang === "") {
            matchpath = "/values/strings.xml";
        } else {
            matchpath = "/values-" + lang + "/strings.xml";
        }
        return path.extname(item) === ".xml" && item.indexOf(matchpath) !== -1;
    });
    return files;
}

function parse(data) {
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        //no need to translate
        if (item["$"]["translatable"] === "false") {
            continue;
        }
        var value = item["_"];
        if (value) {
            value = removeFormat(value);
            obj[item["$"]["name"]] = value;
        }
    }
    return obj;
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
            var data = result["resources"]["string"];
            if (data) {
                obj = parse(data);
            }
        });
    });
    return obj;
}

function setData(newdata, dir, fromLang, toLang) {
    var files = getFiles(dir, fromLang);
    var olddata = getData(dir, fromLang);

    files.map(function(name) {
        var newname;
        if (fromLang === "") {
            newname = name.replace("/values", "/values-" + toLang);
        } else {
            newname = name.replace("/values-" + fromLang, "/values-" + toLang);
        }

        common.createParentFolder(newname);

        var string = "<resources>\n";
        for (var key in olddata) {
            if (olddata.hasOwnProperty(key)) {
                var oldvalue = olddata[key];
                var value = newdata[oldvalue];
                if (value) {
                    value = addFormat(value);
                    string += "\t<string name=\"" + key + "\">" + value + "</string>\n";
                }
            }
        }
        string += "</resources>\n";
        fs.writeFileSync(newname, string);
    });
}

module.exports = {
    getData,
    setData
};
