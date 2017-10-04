#!/usr/bin/env node

var ios = require('./lib/ios.js');
var android = require('./lib/android.js');
var web = require('./lib/web.js');
var csv = require('./lib/csv.js');

function load(opts) {
    var data = {};

    function getData(os, dir, from, to) {
        if (!dir) {
            return
        }
        var fromData = os.getData(dir, from);
        var toData = os.getData(dir, to);
        for (var key in fromData) {
            if (fromData.hasOwnProperty(key)) {
                data[fromData[key]] = toData[key];
            }
        }
    }

    //load
    getData(ios, opts.ios, opts.from_ios, opts.to_ios);
    getData(android, opts.android, opts.from_android, opts.to_android);
    getData(web, opts.web, opts.from_web, opts.to_web);

    //save data
    if (opts.csv) {
        csv.save(opts.csv, data);
    } else {
        console.log(data);
    }
}

function save(opts) {
    var data = {};

    // load
    var array = csv.load(opts.csv);
    for (var i = 0; i < array.length; i++) {
        var line = array[i];
        data[line[0]] = line[1];
    }

    //save
    if (opts.ios) {
        ios.setData(data, opts.ios, opts.from_ios, opts.to_ios);
    }
    if (opts.android) {
        android.setData(data, opts.android, opts.from_android, opts.to_android);
    }
    if (opts.web) {
        web.setData(data, opts.web, opts.from_web, opts.to_web);
    }
}

module.exports = {
    load,
    save
}
