require 'json/pure'

def stripname(filename)
  short = filename.split('/').last
  short.split('.').first
end

def cleanlevel(level)
  cleaned = {}
  level.each do |key, value|
    case key
    when 'width'
      cleaned['width'] = value
    when 'height'
      cleaned['height'] = value
    when 'layers'
      cleanlayers(value, cleaned)
    end
  end
  return cleaned
end

def cleanlayers(layers, cleaned)
  layers.each do |layer|
    if layer['name'] == 'lower'
      cleaned['lower'] = layer['data']
    elsif layer['name'] == 'upper'
      cleaned['upper'] = layer['data']
    elsif layer['name'] == 'objects'
      cleaned['objects'] = cleanobjects(layer['objects'])
    end
  end
end

def cleanobjects(objects)
  cleanobjs = []
  objects.each do |object|
    newobj = {
      'name' => object['name'],
      'properties' => object['properties'],
      'type' => object['type'],
      'x' => object['x'],
      'y' => object['y']
    }
    cleanobjs.push newobj
  end
  return cleanobjs
end

paths = ['lvl/']
masterhash = {}

paths.each do |path|
  find = path + "*.json"
  found = Dir.glob(find)
  found.each do |filename|
    shortname = stripname(filename)
    level = JSON.parse(File.new(filename, "r").read)
    cleaned = cleanlevel(level)
    masterhash[shortname] = cleaned;
  end
end

jdoc  = JSON.pretty_generate masterhash
jsdoc = "var levelData = " + jdoc

File.open("jsdata/leveldata.js", 'w') { |f| f.write(jsdoc) }
