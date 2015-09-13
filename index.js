#!/usr/bin/env node

ios = require('./lib/ios.js');
android = require('./lib/android.js');
fs = require('fs');
jsontocsv = require('to-csv');
csvtojson = require("csvtojson");

module.exports = {
  load: load,
  save: save
}

function load(opts) {
  var data = {};
  if (opts.ios) {
    getData(ios, data, opts.ios, opts.from_ios, opts.to_ios);
  }
  if (opts.android) {
    getData(android, data, opts.android, opts.from_android, opts.to_android);
  }
  var array = [];
  for (key in data) {
    array.push({
      from: key,
      to: data[key]
    });
  }

  if (opts.csv) {
    fs.writeFile(opts.csv, jsontocsv(array).replace('\r', '\n'), function(err) {
      if (err) {
        return console.log(err);
      }
    });
  } else {
    console.log(array);
  }
}

function save(opts) {
  if (opts.csv) {
    var fileStream = fs.createReadStream(opts.csv);
    var converter = new csvtojson.Converter({
      constructResult: true
    });
    converter.on("end_parsed", function(array) {
      var data = {};

      array.forEach(function(item) {
        data[item['from']] = item['to'];
      });

      if (opts.ios) {
        ios.setData(data, opts.ios, opts.from_ios, opts.to_ios);
      }
      if (opts.android) {
        android.setData(data, opts.android, opts.from_android, opts.to_android);
      }
    });

    fileStream.pipe(converter);
  }
}

function getData(os, data, dir, from, to) {
  var fromData = os.getData(dir, from);
  var toData = os.getData(dir, to);
  for (key in fromData) {
    data[fromData[key]] = toData[key];
  }
  return data;
}
