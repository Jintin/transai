#!/usr/bin/env node

sys = require('sys');
exec = require('child_process').execSync;
fs = require('fs');

function puts(error, stdout, stderr) {
  console.log(stdout);
}

exec('node bin/transai load -a . -i . --from en --to de -c test/load.csv', puts);
exec('node bin/transai save -a . -i . --from en --to xx -c test/load.csv', puts);

compare('./test/android/values-de/strings.xml', './test/android/values-xx/strings.xml')
compare('./test/ios/de.lproj/TestViewController.strings', './test/ios/xx.lproj/TestViewController.strings')
compare('./test/ios/de.lproj/Test2ViewController.strings', './test/ios/xx.lproj/Test2ViewController.strings')

function compare(oldpath, newpath) {
  var oldvalue = fs.readFileSync(oldpath).toString();
  var newvalue = fs.readFileSync(newpath).toString();

  console.log(oldvalue);
  console.log(newvalue);
  if (oldvalue == newvalue) {
    console.log('success');
  } else {
    console.log('fail');
  }
}
