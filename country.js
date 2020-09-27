#!/usr/bin/env node

var country = "";
var country_name = "";
var format = "";
var zip_path = "";
var zip_file = "";

function downloadCountryData(){
  var http = require('http');
  var fs = require('fs');
  var url = "http://data.biogeo.ucdavis.edu/data/gadm2/" + format + "/" + country + "_adm.zip";
  zip_path = "data/" + country + "_adm";
  zip_file = zip_path + '.zip';

  var file = fs.createWriteStream(zip_path + ".zip");
  var request = http.get(url, function(response) {
    console.log("downloading file: " + zip_file);
    response.pipe(file);
    file.on('finish', function() {
      console.log("finished download")
      file.close(unzipCountryData);
    });
  });
}

function unzipCountryData(){
  var AdmZip = require('adm-zip');
  console.log("unzip country-iso: " + country + " country_name: " + country_name + " data");
  var zip = new AdmZip(zip_file);
  var zipEntries = zip.getEntries();
  zipEntries.forEach(function(zipEntry) {
    if(zipEntry.entryName.match(/\w+\.shp/)){
      zip.extractEntryTo(zipEntry.entryName, zip_path, false, true);
    }
  });
  console.log("finished unzip");
  convertCountryDataToGeojson();
}

function convertCountryDataToGeojson (){
  console.log("converting country: " + country + " shapefiles to geojson");
  var sys = require('sys')
  var exec = require('child_process').exec;
  var fs = require('fs');

  fs.readdir(zip_path, function (err, files) {
    if (err) throw err;
    files.forEach( function (file) {
      console.log("converting " + file + " to geojson");
      var command = "mapshaper -p 0.1 " + zip_path + "/" +  file
      command = command + " -f geojson -o " + zip_path + "/" + file.replace(".shp", ".geojson")
      command = command + " --auto-snap --encoding utf8"
      console.log("command: "+ command)
      exec(command, function(error, stdout, stderr){
        if (error !== null) {
         console.log('exec error: ' + error);
         sys.print('stderr: ' + stderr);
        }else{
          sys.print('stdout: ' + stdout);
        }
      });
    });
  });
}


var program = require('commander');

program
  .version('0.0.1')
  .option('-i, --iso <code>', 'Specify ISO Country Code', 'COL')
  .option('-c, --country <code>', 'Specify Country Name', 'colombia')
  .option('-f, --format <type>', 'Specify Format', 'shp')
  .parse(process.argv);

if (program.iso && program.format){
  console.log('  - %s ISO', program.iso);
  console.log('  - %s Country', program.country);
  console.log('  - %s format', program.format);
  country = program.iso;
  country_name = program.country;
  format = program.format;
  downloadCountryData();
}
