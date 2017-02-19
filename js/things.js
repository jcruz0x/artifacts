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


// =======================================================
// Bullet Class
// =======================================================

// -------------------------------------------------------
// FrameVars
// -------------------------------------------------------

var rockFrames = [
  "rock1","rock2","rock3","rock4"
]

var boomFrames = [
  "boom1","boom2","boom3","boom4"
]

var fballFrames = [
  "fball1","fball2","fball3","fball4"
]

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Bullet(pos, velocity, bType, side) {
  Entity.call(this);
  this.moveTo(pos);
  this.velocity = velocity;
  this.bType = bType;
  this.side = side; // 'good' or 'evil', player is 'evil', haha
  this.splosionTick = 0;
}

Bullet.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// Bullet.update
// -------------------------------------------------------
Bullet.prototype.update = function(gamestate) {

  this.currPos.x += this.velocity.x;
  this.currPos.y += this.velocity.y;

  // if evil, is players projectile
  if (this.side == 'evil') {
    var thisBox = this.getHitbox();
    for (var entity of gamestate.level.entities) {
      if (entity.collidingWith(thisBox)) {
        entity.message(mFlags.kill);
        // if (this.bType == 'fireball') {
        //   this.splosionTick = 32;
        // }
        var flags = entity.getFlags();
        if ((flags & eFlags.shootable) != 0) {
          this.dead = true;
        }
        if (this.dead == true) {
          return;
        }
      }
    }
  }

  if (this.currPos.x < -16)
    this.dead = true;
  if (this.currPos.x > (gamestate.level.width * 16) + 16)
    this.dead = true;
  if (this.currPos.y < -16)
    this.dead = true;
  if (this.currPos.y > (gamestate.level.height * 16) + 16)
    this.dead = true;

  // if (this.dead == true) {
  //   console.log("died")
  // }
}

// -------------------------------------------------------
// Bullet.draw
// -------------------------------------------------------
Bullet.prototype.draw = function(renderer, deltaFraction) {
  // if (this.dyingTick > 0) {
  //   var frame = 'boom1';
  //   if (this.dyingTick < 20) frame = 'boom2';
  //   if (this.dyingTick < 16) frame = 'boom3';
  //   if (this.dyingTick < 12) frame = 'boom4';
  //   if (this.dyingTick < 8) frame = 'boom5';
  //   if (this.dyingTick < 4) frame = 'boom6';
  //
  //   var coords = this.getCoords(deltaFraction);
  //   renderer.drawSprite(frame, coords.x - 8, coords.y - 8);
  //
  //   return;
  // }

  var index = ((renderer.animTick / 4) % 4) | 0;

  var frame = rockFrames[index];
  if (this.bType == 'boomerang') frame = boomFrames[index];
  if (this.bType == 'fireball') frame = fballFrames[index];

  var coords = this.getCoords(deltaFraction);
  renderer.drawSprite(frame, coords.x - 4, coords.y - 4);
}

// -------------------------------------------------------
// Bullet.getHitbox
// -------------------------------------------------------
Bullet.prototype.getHitbox = function() {
    return this.makeHitbox(-4, -4, 8, 8)
}


// -------------------------------------------------------
// Bullet.getFlags
// -------------------------------------------------------
Bullet.prototype.getFlags = function() {
  if (this.dyingTick == 0 && this.dead == false && this.side == 'good') {
    return eFlags.hazard;
  } else {
    return 0;
  }
}

// -------------------------------------------------------
// Bullet.message
// -------------------------------------------------------
Bullet.prototype.message = function(message) {
  if (message == eFlags.hitTarget) {
    dead = true;
  }
}

// =======================================================
// NPC Class
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------

function NPC(obj) {
  Entity.call(this);
  this.moveToMapPosRounded(obj.x, obj.y);
  this.say = obj.properties.say || ""
  this.lines = this.say.split(';')
  this.big = (obj.properties.big == "true")
  this.tall = (obj.properties.tall == "true")
}

NPC.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// NPC.getHitbox
// -------------------------------------------------------
NPC.prototype.getHitbox = function() {
  if (this.big) {
    return this.makeHitbox(-8, -8, 48, 48);
  } else if (this.tall) {
    return this.makeHitbox(-8, -16, 32, 48);
  } else {
    return this.makeHitbox(-8, -8, 32, 32);
  }
}

// -------------------------------------------------------
// NPC.talkTo
// -------------------------------------------------------
NPC.prototype.talkTo = function(gamestate) {
  gamestate.say = this.lines;
}

// -------------------------------------------------------
// NPC.getFlags
// -------------------------------------------------------
NPC.prototype.getFlags = function() {
  return eFlags.npc;
}
