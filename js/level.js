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
