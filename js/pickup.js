"use strict";

// =======================================================
// Pickup Class
// =======================================================

//graphics

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Pickup(x, y, type, decay) {
  Entity.call(this);
  this.moveTo({x: x, y: y});
  this.type = type;
  this.decayTick = decay;
}

Pickup.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// Get Hitbox
// -------------------------------------------------------
Pickup.prototype.getHitbox = function() {
  return this.makeHitbox(0, 0, 16, 16);
}

// -------------------------------------------------------
// Get Special
// -------------------------------------------------------
Pickup.prototype.getSpecial = function() {
  return {
    type: "pickup",
    pickup: this.type
  }
}

// -------------------------------------------------------
//GetFlags
// -------------------------------------------------------
Pickup.prototype.getFlags = function() {
  return eFlags.special;
}

// -------------------------------------------------------
// Update
// -------------------------------------------------------
Pickup.prototype.update = function(gamestate) {
  if (this.decayTick > 0) {
    this.decayTick--;
    if (this.decayTick == 1) {
      this.dead = true;
    }
  }
}

// -------------------------------------------------------
// Draw
// -------------------------------------------------------
Pickup.prototype.draw = function(renderer, deltaFraction) {
  var shouldDraw = true;

  if (this.decayTick > 0 && this.decayTick < tweak.itemBlink) {
    shouldDraw = (((this.decayTick / 4) | 0) % 2 == 0)
  }

  if (shouldDraw) {
    this.basicDraw(renderer, deltaFraction, this.type)
  }
}
