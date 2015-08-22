"use strict";

// =======================================================
// Renderer Object
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Renderer(res) {
  // store the resource manager
  this.res = res;

  // set up front and backbuffers, and get their contexts
  this.frontbuffer = document.getElementById("game-canvas");
  this.backbuffer = document.createElement('canvas');

  this.backbuffer.width = this.frontbuffer.width;
  this.backbuffer.height = this.frontbuffer.height;

  this.context = this.backbuffer.getContext('2d');
  this.frontContext = this.frontbuffer.getContext('2d');

  // disable image smoothing on both the contexts
  this.context.imageSmoothingEnabled = false;
  this.frontContext.imageSmoothingEnabled = false;

  // clear the screen
  this.cls("black");

  // track number of frames passed
  this.animTick = 0;
}

// -------------------------------------------------------
// Renderer.flip (backbuffer to frontbuffer)
// -------------------------------------------------------
Renderer.prototype.flip = function() {
  this.frontContext.drawImage(this.backbuffer, 0, 0);
}

// -------------------------------------------------------
// Renderer.cls - clears the screen with given color
// -------------------------------------------------------
Renderer.prototype.cls = function(color) {
  this.context.fillstyle = color;
  this.context.fillRect(0, 0, RES_X, RES_Y);
  this.flip();
}

// -------------------------------------------------------
// Get camera Pos, just a stub for now, returns 0,0
// -------------------------------------------------------
Renderer.prototype.getCameraPos = function() {
  return { x: 0, y: 0 };
}

// -------------------------------------------------------
// Get screen size
// -------------------------------------------------------
Renderer.prototype.getScreenSize = function() {
  return {
    width: RES_X,
    height: RES_Y,
    tilesWidth: TILE_RES_X,
    tilesHeight: TILE_RES_Y
  };
}


// -------------------------------------------------------
// drawSprite
// -------------------------------------------------------
Renderer.prototype.drawSprite = function(name, x, y, xFlip) {
  var offset = this.getCameraPos();

  if (xFlip) {
    name += "_flipped";
  }

  var img = this.res.getImage(name);

  if (img === undefined) {
    console.log("Error drawing " + name);
    return;
  }

  this.context.drawImage(img, x - offset.x, y - offset.y);
}

// -------------------------------------------------------
// drawGraphic
// Draw an image given its name, in screen space
// -------------------------------------------------------
Renderer.prototype.drawGraphic = function(name, x, y) {
  var img = this.res.getImage(name);
  this.context.drawImage(img, x, y);
}

// -------------------------------------------------------
// Draw Tile, in global levelspace
// -------------------------------------------------------
Renderer.prototype.drawTile = function(tileset, tilesetX, tilesetY, x, y) {
  var img = this.res.getImage(tileset);
  var atlusX = tilesetX * TILE_SIZE;
  var atlusY = tilesetY * TILE_SIZE;
  var offset = this.getCameraPos();

  this.context.drawImage(
    img, atlusX, atlusY,
    TILE_SIZE, TILE_SIZE,
    x - offset.x, y - offset.y,
    TILE_SIZE, TILE_SIZE
  );
}
