#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');

program
  .version('0.0.1')
  .parse(process.argv);

function downloadCountryData(data){
  console.log("line: " + data);
  var matched = data.match(/(.+)\_(.+)/);
  if(matched){
    var iso = matched[1];
    var country = matched[2].toLowerCase();
    country = country.replace(/\s/g, "_").replace(/\.|\,/g, "")
    console.log("downloading data from country: " + country + " ISO: " + iso);
    var sys = require('sys')
    var exec = require('child_process').exec;
    var command = "node country -i " + iso + " -c " + country;
    console.log("exec: "+ command);
    exec(command, function(error, stdout, stderr){
      sys.print('stdout: ' + stdout);
      sys.print('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }else{
    throw "not matched "+ data
  }
}

function downloadAllCountriesData(){
  var LineByLineReader = require('line-by-line');
  var countries = new LineByLineReader('data/countries.txt');

  countries.on('error', function (err) {
    console.log(err);
  });

  countries.on('line', function (line) {
    downloadCountryData(line);
  });

  countries.on('end', function () {
    console.log('end')
  });
}

downloadAllCountriesData();
