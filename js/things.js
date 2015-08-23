"use strict";

// =======================================================
// Portal Class
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------

function Portal(obj) {
  Entity.call(this);
  this.moveToMapPosRounded(obj.x, obj.y);
  this.dest = obj.properties.level;
  this.destpos = {x: obj.properties.x, y: obj.properties.y };
}

Portal.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// Get Hitbox
// -------------------------------------------------------
Portal.prototype.getHitbox = function() {
  return this.makeHitbox(5, 5, 4, 4);
}

// -------------------------------------------------------
// Get Special
// -------------------------------------------------------
Portal.prototype.getSpecial = function() {
  return {
    type: "portal",
    dest: this.dest,
    destpos: vec2Copy(this.destpos)
  }
}

// -------------------------------------------------------
//GetFlags
// -------------------------------------------------------
Portal.prototype.getFlags = function() {
  return eFlags.special;
}
