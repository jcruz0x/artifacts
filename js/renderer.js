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

  // camera position
  this.cameraPos = { x: 0, y: 0 };
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
  return this.cameraPos;
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
// Draw an image given its name, in global levelspace
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
// Draw Atlus
// Draw an image from a graphicset given the tileset name,
// and atlus coords, draws in global levelspace
// -------------------------------------------------------
Renderer.prototype.drawAtlus = function(tileset, atlusX, atlusY, x, y, w, h) {
  var img = this.res.getImage(tileset);
  var offset = this.getCameraPos();

  this.context.drawImage(
    img, atlusX, atlusY,
    w, h,
    x - offset.x, y - offset.y,
    w, h
    );
}

// -------------------------------------------------------
// setCameraPos
// -------------------------------------------------------
Renderer.prototype.setCameraPos = function(gameStateRef, deltafraction) {

  var playerPos = gameStateRef.player.getCoords(deltafraction)
  var centeredPos = { x: playerPos.x - (RES_X / 2), y: playerPos.y - (RES_Y /2) };

  var worldWidth = gameStateRef.level.width * TILE_SIZE;
  var worldHeight = gameStateRef.level.height * TILE_SIZE;
  var xMax = worldWidth - RES_X;
  var yMax = worldHeight - RES_Y;

  this.cameraPos.x = Clamp(centeredPos.x, 0, xMax);
  this.cameraPos.y = Clamp(centeredPos.y, 0, yMax);
}
