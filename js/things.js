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
// Villager Class
// =======================================================

// // -------------------------------------------------------
// // Constructor
// // -------------------------------------------------------
function Villager(obj) {
  Entity.call(this);
  this.moveToMapPosRounded(obj.x, obj.y);
  this.direction = (Math.random() * 4) | 0;
  this.changeTick = ((Math.random() * 60) + 20) | 0;
  this.stepsTick = (Math.random() * this.changeTick) | 0;
  this.deathTick = 0;

  this.headSprite = (Math.random() > 0.5) ? "vhead1" : "vhead2";
  this.bodySprite = (Math.random() > 0.5) ? "vbody" : "vbody2";

  this.sensors = [
    {x: 0, y: 4, dir: DIR_LEFT},
    {x: 0, y: 12, dir: DIR_LEFT},
    {x: 4, y: 0, dir: DIR_UP},
    {x: 12, y: 0, dir: DIR_UP},
    {x: 16, y: 4, dir: DIR_RIGHT},
    {x: 16, y: 12, dir: DIR_RIGHT},
    {x: 4, y: 16, dir: DIR_DOWN},
    {x: 12, y: 16, dir: DIR_DOWN},
  ]
}

Villager.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// Villager.getFlags
// -------------------------------------------------------
Villager.prototype.getFlags = function() {
  if (this.dead == false && this.deathTick == 0) {
    return (eFlags.hazard | eFlags.shootable);
  } 
  else {
    return 0;
  }
}

// -------------------------------------------------------
// Villager.message
// -------------------------------------------------------
Villager.prototype.message = function(flags) {
  if (((flags & mFlags.kill) != 0) && this.deathTick == 0 && this.dead == false) {
    this.deathTick = 20;
  }
}

// -------------------------------------------------------
// Villager.update
// -------------------------------------------------------
Villager.prototype.update = function(gamestate) {
  // == death tick
  if (this.deathTick > 0) {
    this.deathTick--
    if (this.deathTick == 1) {
      this.itemDrop(gamestate);
      this.dead = true;
    }
    return;
  }

  // == changeTick
  if (this.changeTick > 0) {
    this.changeTick--
  } else {
    this.direction = (Math.random() * 4) | 0;
    this.changeTick = ((Math.random() * 60) + 20) | 0;
    this.stepsTick = (Math.random() * this.changeTick) | 0;
  }

  if (this.stepsTick > 0) {
    this.stepsTick--;
    switch(this.direction) {
    case DIR_UP:
      this.currPos.y -= tweak.villagerSpeed;
      break;
    case DIR_DOWN:
      this.currPos.y += tweak.villagerSpeed;
      break;
    case DIR_LEFT:
      this.currPos.x -= tweak.villagerSpeed;
      break;
    case DIR_RIGHT:
      this.currPos.x += tweak.villagerSpeed;
      break;
    }
  }

  // sense and pop
  for (var i = 0; i < this.sensors.length; i++) {
    var sensor = {x: this.sensors[i].x, y: this.sensors[i].y};
    var dir = this.sensors[i].dir
    this.sensePop(gamestate.level, sensor, dir, false);
  }

  // pop into level
  this.currPos.x = Math.max(0, this.currPos.x);
  this.currPos.x = Math.min((gamestate.level.width-1) * 16, this.currPos.x);
  this.currPos.y = Math.max(0, this.currPos.y);
  this.currPos.y = Math.min((gamestate.level.height-1) * 16, this.currPos.y);
}

// -------------------------------------------------------
// Get Hitbox
// -------------------------------------------------------
Villager.prototype.getHitbox = function() {
  return this.makeHitbox(0, -8, 16, 24);
}

// -------------------------------------------------------
// Villager.itemDrop
// -------------------------------------------------------
Villager.prototype.itemDrop = function(gamestate) {
  var xAt = this.currPos.x;
  var yAt = this.currPos.y

  var odds = Math.random();
  if (odds < 0.05) {
    gamestate.level.entities.push(new Pickup(xAt, yAt, "lilheart", tweak.itemLast));
  }
  if (odds > 0.95) {
    gamestate.level.entities.push(new Pickup(xAt, yAt, "potion", tweak.itemLast));
  }
}


// -------------------------------------------------------
// Villager.draw
// -------------------------------------------------------
Villager.prototype.draw = function(renderer, deltafraction) {
  if (this.dead) {
    return;
  }

  if (this.deathTick > 0) {
    var frame = "blood1";
    var tick = this.deathTick;
    if (tick < 15) frame = "blood2"
    if (tick < 10) frame = "blood3"
    if (tick < 5) frame = "blood4"
    var at = this.getCoords(deltafraction);
    renderer.drawSprite(frame, at.x - 8, at.y - 8);
    return;
  }

  var at = this.getCoords(deltafraction);

  var headoffset = (((this.stepsTick / 4) | 0) % 2) * 1;

  renderer.drawSprite(this.bodySprite, at.x, at.y);
  renderer.drawSprite(this.headSprite, at.x, at.y - 12 + headoffset);
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
