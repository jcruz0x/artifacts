require 'json/pure'

source = "lvl-work/tset.json"

level = JSON.parse(File.new(source, "r").read)

tilesets = level['tilesets']
tileset = tilesets[0]
tileprops = tileset['tileproperties']

jdoc = JSON.pretty_generate tileprops
jsdoc = "var tileData = " + jdoc

File.open("jsdata/tiledata.js", 'w') { |f| f.write(jsdoc) }
