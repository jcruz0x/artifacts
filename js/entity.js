"use strict";

// =======================================================
// Entity Class
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Entity() {
  this.currPos = {x: 0, y: 0 };
  this.prevPos = {x: 0, y: 0 };
  this.dead = false;
}

// -------------------------------------------------------
// Set previous position to the current position (to be
// done before moving)
// -------------------------------------------------------
Entity.prototype.setPrevPos = function() {
  this.prevPos = vec2Copy(this.currPos);
}

// -------------------------------------------------------
// Get interpolated coordinates
// -------------------------------------------------------
Entity.prototype.getCoords = function(deltaFraction) {
  var tweenPos = interpolate(this.currPos, this.prevPos, deltaFraction);
  return {x: tweenPos.x, y: tweenPos.y};
}

// -------------------------------------------------------
// MoveTo (aka teleport, i.e. set current and prev pos)
// -------------------------------------------------------
Entity.prototype.moveTo = function(newPos) {
  this.currPos = vec2Copy(newPos);
  this.prevPos = vec2Copy(newPos);
}

// -------------------------------------------------------
// MoveTo Map Pos
// -------------------------------------------------------
Entity.prototype.moveToMapPos = function(mapPos) {
  var newX = mapPos.x * TILE_SIZE;
  var newY = mapPos.y * TILE_SIZE;
  this.currPos = { x: newX, y: newY };
  this.prevPos = { x: newX, y: newY };
}

// -------------------------------------------------------
// MoveToMapPosRounded
// -------------------------------------------------------
Entity.prototype.moveToMapPosRounded = function(x, y) {
  var mapX = (x / TILE_SIZE) | 0;
  var mapY = (y / TILE_SIZE) | 0;
  this.moveToMapPos({ x: mapX, y: mapY });
}

// -------------------------------------------------------
// Make Hitbox
// -------------------------------------------------------
Entity.prototype.makeHitbox = function(xo, yo, w, h) {
  return {
    x: this.currPos.x + xo,
    y: this.currPos.y + yo,
    w: w,
    h: h
  };
}

// -------------------------------------------------------
// Get Hitbox (default, often will be overriden)
// -------------------------------------------------------
Entity.prototype.getHitbox = function() {
  return this.makeHitbox(0, 0, 16, 16);
}

// -------------------------------------------------------
// Basic Draw (simple form of drawing applicable to many
// objects, can be called by entity specific draw function)
// -------------------------------------------------------
Entity.prototype.basicDraw = function(renderer, deltaFraction, sprite) {
  var at = this.getCoords(deltaFraction);
  renderer.drawSprite(sprite, at.x, at.y);
}

// -------------------------------------------------------
// Colliding
// -------------------------------------------------------
Entity.prototype.collidingWith = function(withBox) {
  return rectOverlap(this.getHitbox(), withBox);
}

// -------------------------------------------------------
// Sense Pop
// -------------------------------------------------------
Entity.prototype.sensePop = function(level, sensorOffset, direction, nopop) {

  var sensorPos = { x: sensorOffset.x + this.currPos.x, y: sensorOffset.y + this.currPos.y };

  var upperTile = level.tileAt(sensorPos, level.upper);
  var lowerTile = level.tileAt(sensorPos, level.lower);

  var upperProps = tileData[upperTile - 1] || {};
  var lowerProps = tileData[lowerTile - 1] || {};

  var tileBox = level.makeTileRect(sensorPos, false);
  var thisBox = this.getHitbox();

  var isSolid = (upperProps["solid"] == "true" || lowerProps["solid"] == "true");

  if (isSolid) {
    if (nopop !== true) {
      switch (direction) {
        case  DIR_LEFT: this.currPos.x = tileBox.x + tileBox.w; break;
        case DIR_RIGHT: this.currPos.x = tileBox.x - thisBox.w; break;
        case    DIR_UP: this.currPos.y = tileBox.y + tileBox.h; break;
        case  DIR_DOWN: this.currPos.y = tileBox.y - thisBox.h; break;
      }
    }
  }
}

// -------------------------------------------------------
// Entity.getFlags (default, returns 0)
// -------------------------------------------------------
Entity.prototype.getFlags = function() {
  return 0;
}

// -------------------------------------------------------
// Entity.message (default, does nothing)
// -------------------------------------------------------
Entity.prototype.message = function() {
  // ignore everything
}

// -------------------------------------------------------
// Entity.update (default, does nothing)
// -------------------------------------------------------
Entity.prototype.update = function() {
  // sit there and look pretty
}

// -------------------------------------------------------
// Entity.draw (default, does nothing)
// -------------------------------------------------------
Entity.prototype.draw = function() {
  // na na, you cant see me
}

// -------------------------------------------------------
// Entity.getCharsetAtlus
// -------------------------------------------------------
Entity.prototype.getCharsetAtlus = function(direction, frame) {
  var y = direction * 32;
  var x = 0;
  if (frame == 1) {
    x = 16;
  } else if (frame == 3) {
    x = 32;
  }

  return { x: x, y: y };
}
