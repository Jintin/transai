#!/usr/bin/env node

var sys = require('util');
var fs = require('fs');
var assert = require('assert');
var execSync = require('child_process').execSync;

execSync('node bin/transai load -a . -i . -w . --from en --to de -c test/strings.csv', puts);
execSync('node bin/transai save -a . -i . -w . --from en --to xx -c test/strings.csv', puts);

compareJSON('./test/web/de/string.json', './test/web/xx/string.json');
compareFolder('./test/android/values-de', './test/android/values-xx');
compareFolder('./test/ios/de.lproj', './test/ios/xx.lproj');
compare('./test/test.csv', './test/strings.csv');

function puts(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log(error);
}

function compareJSON(path1, path2) {
    var obj1 = getJSON(path1);
    var obj2 = getJSON(path2);
    assert.deepEqual(obj1, obj2, "json not equal");
}

function getJSON(path) {
    var text = fs.readFileSync(path, 'UTF-8');
    return JSON.parse(text);
}

function compareFolder(path1, path2) {
    fs.readdirSync(path1).forEach(function(file) {
        var file1 = path1 + '/' + file;
        var file2 = path2 + '/' + file;
        compare(file1, file2);
    });
}

function compare(file1, file2) {
    var value1 = fs.readFileSync(file1).toString();
    var value2 = fs.readFileSync(file2).toString();

    console.log(value1);
    console.log(value2);
    assert.equal(value1, value2, 'result not equal');
}
