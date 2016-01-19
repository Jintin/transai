#!/usr/bin/env node

var ios = require('./lib/ios.js');
var android = require('./lib/android.js');
var csv = require('./lib/csv.js');

module.exports = {
  load: load,
  save: save
}

function load(opts) {
  var data = {};

  //load
  if (opts.ios) {
    getData(ios, opts.ios, opts.from_ios, opts.to_ios);
  }
  if (opts.android) {
    getData(android, opts.android, opts.from_android, opts.to_android);
  }

  function getData(os, dir, from, to) {
    var fromData = os.getData(dir, from);
    var toData = os.getData(dir, to);
    for (var key in fromData) {
      data[fromData[key]] = toData[key];
    }
  }

  //save data
  if (opts.csv) {
    csv.save(opts.csv, data);
  } else {
    console.log(data);
    console.log('csv file path not specified');
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
}
