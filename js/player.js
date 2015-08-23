"use strict";

// =======================================================
// Player Class
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Player(mapX, mapY) {
  Entity.call(this);
  this.reset(mapX, mapY); // inits all the properties

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

Player.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// Player.rest
// -------------------------------------------------------
Player.prototype.reset = function(mapX, mapY) {
    this.moveToMapPos( { x: mapX, y: mapY } );

    this.velocity = { x: 0, y: 0 };
    this.walkTick = 0;

    this.direction = DIR_DOWN;
}

// -------------------------------------------------------
// Player.update
// -------------------------------------------------------
Player.prototype.update = function(gamestate) {

    if (gamestate.portalTick != 0) {
      // console.log(gamestate.portalTick)
      // console.log("oops portaling")
      return;
    }

    this.velocity.x = 0;
    this.velocity.y = 0;

    if (gamestate.vpad.down('up')) {
      this.direction = DIR_UP;
      this.velocity.y = -tweak.playerSpeed
    } else if (gamestate.vpad.down('down')) {
      this.direction = DIR_DOWN;
      this.velocity.y = tweak.playerSpeed
    }

    if (gamestate.vpad.down('left')) {
      this.direction = DIR_LEFT;
      this.velocity.x = -tweak.playerSpeed
    } else if (gamestate.vpad.down('right')) {
      this.direction = DIR_RIGHT;
      this.velocity.x = tweak.playerSpeed
    }

    if (this.velocity.x == 0 && this.velocity.y == 0) {
      this.walkTick = 0
    } else {
      this.walkTick++;
    }
    // apply velocity to the player:
    this.currPos.x += this.velocity.x;
    this.currPos.y += this.velocity.y;

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


    // do collision
    for (var entity of gamestate.level.entities) {
        if (this.collidingWith(entity.getHitbox())) {
          // console.log("colliding")
          var flags = entity.getFlags();
          if ((flags & eFlags.special) != 0) {
            // console.log("special")
            var special = entity.getSpecial();
            if (special.type == 'portal' && gamestate.portalTick == 0) {
              // console.log("its happening");
              gamestate.portalTick = tweak.portalTime;
              gamestate.portalDest = special.dest;
              gamestate.portalPos = special.destpos;
            }
          }
        }
    }
}

// -------------------------------------------------------
// Player.draw
// -------------------------------------------------------
Player.prototype.draw = function(renderer, deltaFraction) {
  var coords = this.getCoords(deltaFraction);

  var walkFrame = (this.walkTick >> 3 ) % 4;

  var atlus = this.getCharsetAtlus(this.direction, walkFrame);

  renderer.drawAtlus("monstersheet", atlus.x, atlus.y, coords.x, coords.y - 16, 16, 32);
}

// -------------------------------------------------------
// Get Hitbox
// -------------------------------------------------------
Player.prototype.getHitbox = function() {
  return this.makeHitbox(0, 0, 16, 16);
}
