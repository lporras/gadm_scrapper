gadm_scrapper
=============

Scripts to convert shapefiles from gadm.org to geojson

## Using country script

node country -i COL -c colombia

This will download a zip file called COL_adm.zip, then will unzip that file extracting just the .shp files, then

it will convert those shapefiles in geojson.
