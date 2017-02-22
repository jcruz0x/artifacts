# =======================================================
# Finds images/sounds in specified folders and puts paths
# to them in a json, keyed by the filenames minus path and
# extension. (sounds handled manually now)
# =======================================================

require 'json/pure'

def stripname(filename)
  short = filename.split('/').last
  short.split('.').first
end

def addFiles(srchash, path)
  find = path
  found = Dir.glob(find)
  found.each do |filename|
    shortname = stripname(filename)
    srchash[shortname] = filename
  end
end

imgpath = 'gfx/*.png'
imghash = {}

# sndpath = 'snd/*.wav'
# sndhash = {}

addFiles(imghash, imgpath)

# addFiles(sndhash, sndpath)

img_jdoc  = JSON imghash
img_jsdoc = "var imageSources = " + img_jdoc
File.open("jsdata/imagesources.js", 'w') { |f| f.write(img_jsdoc) }

# snd_jdoc = JSON sndhash
# snd_jsdoc = "var soundSources = " + snd_jdoc
# File.open("jsdata/soundsources.js", 'w') { |f| f.write(snd_jsdoc) }
