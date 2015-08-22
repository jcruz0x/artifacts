# =======================================================
# Finds images in /gfx folder and puts paths to them
# in a json, keyed by the filenames minus path and
# extension
# =======================================================

require 'json/pure'

def stripname(filename)
  short = filename.split('/').last
  short.split('.').first
end

def addImages(srchash, path)
  find = path + "*.png"
  found = Dir.glob(find)
  found.each do |filename|
    shortname = stripname(filename)
    srchash[shortname] = filename
  end
end

paths = ['gfx/']
sourcehash = {}

paths.each do |path|
  addImages(sourcehash, path)
end

jdoc  = JSON sourcehash
jsdoc = "var imageSources = " + jdoc

File.open("jsdata/imagesources.js", 'w') { |f| f.write(jsdoc) }
