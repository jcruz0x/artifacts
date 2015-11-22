"use strict";

// =======================================================
// Level Class
// =======================================================

// -------------------------------------------------------
// Level Constructor
// -------------------------------------------------------
function Level(leveldata) {
  // console.log(leveldata)
  this.height = leveldata.height;
  this.width = leveldata.width;

  this.upper = this.parseLayer(leveldata.upper);
  this.lower = this.parseLayer(leveldata.lower);

  this.entities = [];

  this.addEntitys(leveldata.objects)
}

// -------------------------------------------------------
// ParseLayer
// -------------------------------------------------------
Level.prototype.parseLayer = function(flatData) {
  var grid = new Grid(this.width, this.height);
  for (var i = 0; i < flatData.length; i++) {
    grid.set1d(i, flatData[i]);
  }
  return grid;
}

// -------------------------------------------------------
// AddEntitys
// -------------------------------------------------------
Level.prototype.addEntitys = function(objects) {
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    switch(obj.type) {
      case "portal":
        this.entities.push(new Portal(obj));
        break;
      case "villager":
        this.entities.push(new Villager(obj));
        break;
      case "npc":
        this.entities.push(new NPC(obj));
        break;
      case "boss":
        this.entities.push(new Boss(obj));
        break;
      case "pickup":
        var x = ((obj.x / TILE_SIZE) | 0) * TILE_SIZE;
        var y = ((obj.y / TILE_SIZE) | 0) * TILE_SIZE;
        var type = obj.properties.type;
        this.entities.push(new Pickup(x, y, type, 0))
        break;
    }
  }
}

// -------------------------------------------------------
// TileAt
// -------------------------------------------------------
Level.prototype.tileAt = function(sensorPos, layer) {
  var tileX = (sensorPos.x / TILE_SIZE) | 0
  var tileY = (sensorPos.y / TILE_SIZE) | 0

  if (tileX < 0 || tileY < 0 || tileX >= this.width || tileY >= this.height) {
    return 0;
  } else {
    return layer.at(tileX, tileY);
  }
}

// -------------------------------------------------------
// CoordsAt returns the map x and y position of the tile
// at the position specified in fixed point subpixels
// -------------------------------------------------------
Level.prototype.tileCoordsAt = function(pos) {
  var tileX = (pos.x / 16) | 0;
  var tileY = (pos.y / 16) | 0;

  return { x: tileX, y: tileY };
}

// -------------------------------------------------------
// Makes a collision rect from a sensor position
// -------------------------------------------------------
Level.prototype.makeTileRect = function(sensorPos, isSmall) {
  var tileX = (sensorPos.x / 16) | 0;
  var tileY = (sensorPos.y / 16) | 0;

  var posShift = isSmall? TILE_SIZE / 4 : 0;
  var size     = isSmall? TILE_SIZE / 2 : TILE_SIZE;

  return {
    x: (tileX * 16) + posShift,
    y: (tileY * 16) + posShift,
    w: size,
    h: size
  }
}

// -------------------------------------------------------
// replaceId
// -------------------------------------------------------
Level.prototype.replaceId = function(original, replacement, layer) {
  var data = layer == 'upper' ? this.upper : this.lower;
  data.foreach(function(x,y,val) {
    return val == original ? replacement : val;
  });
  // for (var x = 0; x < this.upper.width; x++) {
  //   for (var y = 0; y < this.upper.height; y++) {
  //     if (this.upper.at(x, y) == original) {
  //       this.upper.set(x, y, replacement)
  //     }
  //   }
  // }

}

// -------------------------------------------------------
// fillWithVillagers
// -------------------------------------------------------
Level.prototype.fillWithVillagers = function() {
  var spacing = tweak.villagerSpawnSpacing
  for (var x = 0; x < this.width; x += spacing) {
    for (var y = 0; y < this.height; y += spacing) {
      var xWiggle = ((Math.random() * 8) | 0) - 4;
      var yWiggle = ((Math.random() * 8) | 0) - 4;
      var mapX = ((x + xWiggle) / TILE_SIZE) | 0;
      var mapY = ((y + yWiggle) / TILE_SIZE) | 0;
      if (this.checkSolid(mapX, mapY) == false) {
        this.entities.push(new Villager({
          x: mapX * TILE_SIZE,
          y: mapY * TILE_SIZE
        }));
      }
    }
  }
}

// -------------------------------------------------------
// checkSolid
// -------------------------------------------------------
Level.prototype.checkSolid = function(mapX, mapY) {
  var uppertile = this.upper.at(mapX, mapY);
  var lowertile = this.lower.at(mapX, mapY);

  var upperProps = tileData[uppertile] || {};
  var lowerProps = tileData[lowertile] || {};

  return (lowerProps['solid'] == 'true' || upperProps['solid'] == 'true');
}
