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
  this.prevPos = this.currPos;
}

// -------------------------------------------------------
// Get interpolated coordinates
// -------------------------------------------------------
Entity.prototype.getCoords = function(deltaFraction) {
  var tweenPos = interpolate(this.currPos, this.prevPos, deltaFraction);
  return {x: fxUnscale(tweenPos.x), y: fxUnscale(tweenPos.y)};
}

// -------------------------------------------------------
// MoveTo (aka teleport, i.e. set current and prev pos)
// -------------------------------------------------------
Entity.prototype.moveTo = function(newPos) {
  this.currPos = newPos;
  this.prevPos = newPos;
}

// -------------------------------------------------------
// MoveTo Map Pos
// -------------------------------------------------------
Entity.prototype.moveToMapPos = function(mapPos) {
  var newX = mapPos.x << TILE_AND_FIXED_SHIFT_BITS;
  var newY = mapPos.y << TILE_AND_FIXED_SHIFT_BITS;
  var newPos = { x: newX, y: newY };
  this.currPos = newPos;
  this.prevPos = newPos;
}

// -------------------------------------------------------
// Make Hitbox
// -------------------------------------------------------
Entity.prototype.makeHitbox = function(xo, yo, w, h) {
  return {
    x: this.currPos.x + fxScale(xo),
    y: this.currPos.y + fxScale(yo),
    w: fxScale(w),
    h: fxScale(h)
  };
}

// -------------------------------------------------------
// Get Hitbox (default, usually will be overriden)
// -------------------------------------------------------
Entity.prototype.getHitbox = function() {
  return this.makeHitbox(0, 0, 0, 0);
}

// -------------------------------------------------------
// Basic Draw
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
// Sense Pop -- ALL NEEDS TO BE REDONE
// -------------------------------------------------------
Entity.prototype.sensePop = function(level, sensorOffset, direction, nopop) {

  var sensorScaled = { x: fxScale(sensorOffset.x), y: fxScale(sensorOffset.y) };
  var sensorPos = { x: sensorScaled.x + this.currPos.x, y: sensorScaled.y + this.currPos.y };

  var tileName = level.tileAt(sensorPos);

  if (tileName == null) {
    return { popped: false, flags: 0 };
  }

  var flags = tileProps[tileName].type;

  var isHalfSize = ((flags & tFlags.half)  != 0);
  var isSolid    = ((flags & tFlags.solid) != 0);
  var isPlat     = ((flags & tFlags.plat)  != 0);

  var tileBox = level.makeTileRect(sensorPos, isHalfSize);
  var thisBox = this.getHitbox();

  if (isHalfSize) {
    if (rectOverlap(tileBox, thisBox) == false) {
      return { popped: false, flags: 0 };
    }
  }

  var popped = false;

  if (isSolid == true || (isPlat && oldfoot <= tileBox.y && direction == 'down')) {
    // console.log('noodle');
    popped = true;
    if (nopop !== true) {
      this.currPos = { x: this.currPos.x, y: this.currPos.y };
      switch (direction) {
        case  'left': this.currPos.x = tileBox.x + tileBox.w; break;
        case 'right': this.currPos.x = tileBox.x - thisBox.w; break;
        case    'up': this.currPos.y = tileBox.y + tileBox.h; break;
        case  'down': this.currPos.y = tileBox.y - thisBox.h; break;
      }
    }
  }

  return { popped: popped, flags: flags };
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
