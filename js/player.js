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

  // this.deathFrames = [
  //   "mdeath1", "mdeath2", "mdeath3", "mdeath4", "mdeath5"
  // ]

  this.health = tweak.startHealth;
  this.maxHealth = tweak.startHealth;

  this.mana = tweak.startMana * tweak.manaRatio;
  this.maxMana = tweak.startMana * tweak.manaRatio;

  this.hurtTick = 0;
  this.deathTick = 0;

  this.shieldTick = 0;
  this.shieldCoolTick = 0;

  this.hasMagic = false;
  this.hasSprint = false;
  this.hasShield = false;

  this.artifacts = 0;
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

    if (this.hurtTick > 0) {
      this.hurtTick--;
    }

    if (this.deathTick > 1) {
      this.deathTick--;
      if (this.deathTick == 1) {
        this.dead = true;
      }
      return;
    }

    if (this.shieldTick > 0) this.shieldTick--;
    if (this.shieldCoolTick > 0) this.shieldCoolTick--;



    this.velocity.x = 0;
    this.velocity.y = 0;

    if (gamestate.vpad.pressed('shield') && this.shieldCoolTick == 0 && this.hasShield && this.mana > tweak.manaRatio) {
      this.mana -= tweak.manaRatio;
      this.shieldTick = tweak.shieldTime;
      this.shieldCoolTick = tweak.shieldCool;
    }

    var vSpeed = (gamestate.vpad.down('sprint') && this.hasSprint) ? tweak.playerSprint : tweak.playerSpeed;

    // if (gamestate.vpad.pressed('test')) {
    //   // gamestate.level.fillWithVillagers();
    //   // console.log("yo")
    //   gamestate.level.replaceId(135, 0, 'upper')
    // }

    // var changeDir = true;

    var changeDir = true;
    if (gamestate.vpad.down('shoot') || gamestate.vpad.down('magic')) {
      changeDir = false;
    }

    // if (
    //   (gamestate.vpad.down('up') || gamestate.vpad.down('down')) &&
    //   (gamestate.vpad.down('left') || gamestate.vpad.down('right'))
    // ) {
    //   changeDir = false;
    // }

    var newDirection = null;
    var mostTicks = 0

    var changeNewDir = function(ticks, newdir) {
      if (ticks > mostTicks && changeDir) {
        mostTicks = ticks;
        newDirection = newdir;
      }
    }


    if (gamestate.vpad.down('up')) {
      // if (changeDir) this.direction = DIR_UP;
      changeNewDir(gamestate.vpad.ticks('up'), DIR_UP);
      this.velocity.y = -vSpeed
    } else if (gamestate.vpad.down('down')) {
      // if (changeDir) this.direction = DIR_DOWN;
      changeNewDir(gamestate.vpad.ticks('down'), DIR_DOWN);
      this.velocity.y = vSpeed
    }

    if (gamestate.vpad.down('left')) {
      // if (changeDir) this.direction = DIR_LEFT;
      changeNewDir(gamestate.vpad.ticks('left'), DIR_LEFT);
      this.velocity.x = -vSpeed
    } else if (gamestate.vpad.down('right')) {
      // if (changeDir) this.direction = DIR_RIGHT;
      changeNewDir(gamestate.vpad.ticks('right'), DIR_RIGHT);
      this.velocity.x = vSpeed
    }

     if (newDirection != null) {
       this.direction = newDirection;
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

    // spawn projectiles

    if (gamestate.vpad.autofire('shoot', 0, 12)) {
        gamestate.level.entities.push(
          new Bullet({x: this.currPos.x + 8, y: this.currPos.y}, rockVel[this.direction], 'rock', 'evil')
        )
    }

    if (gamestate.vpad.autofire('magic', 0, 12) && this.mana > 0 && this.hasMagic) {
        this.mana--;
        var firelist = fireVel[this.direction];
        for (var i = 0; i < firelist.length; i++) {
          var fireballvec = firelist[i];
          gamestate.level.entities.push(
            new Bullet({x: this.currPos.x + 8, y: this.currPos.y}, fireballvec, 'fireball', 'evil')
          )
        }
    }


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
          if (special.type == 'pickup') {
            this.powerUp(special.pickup, entity, gamestate);
          }
        }
        if (((flags & eFlags.hazard) != 0) && this.hurtTick == 0 && this.deathTick == 0 && this.shieldTick == 0) {
          // console.log("ow")
          this.health--;
          if (this.health == 0) {
            this.deathTick = tweak.playerDeathTick;
          } else {
            this.hurtTick = tweak.hurtTickTime;
          }
        }
        if ((flags & eFlags.npc) != 0 && gamestate.vpad.pressed('interact')) {
          entity.talkTo(gamestate);
        }
      }
    }
}

// -------------------------------------------------------
// Player.draw
// -------------------------------------------------------
Player.prototype.draw = function(renderer, deltaFraction) {

  if (this.deathTick > 0) {
    this.drawDeath(renderer, deltaFraction);
    return;
  }



  var coords = this.getCoords(deltaFraction);

  var walkFrame = (this.walkTick >> 3 ) % 4;

  var atlus = this.getCharsetAtlus(this.direction, walkFrame);

  var sheet = "monstersheet";
  var hurtFlashTick = this.hurtTick - tweak.hurtFlashDiff;
  if (hurtFlashTick > 0) {
    sheet = (((hurtFlashTick / 2) | 0) % 2) ? "monstersheet-damage1" : "monstersheet-damage2";
  }

  renderer.drawAtlus(sheet, atlus.x, atlus.y, coords.x, coords.y - 16, 16, 32);

  if (this.shieldTick > 0 && (((this.shieldTick / 3) | 0) % 3) == 0) {
    renderer.drawSprite('shield2', coords.x - 16, coords.y - 24, false)
  }

}

// -------------------------------------------------------
// Player.drawDeath
// ------------------------------------------------------
Player.prototype.drawDeath = function(renderer, deltaFraction) {
    var coords = this.getCoords(deltaFraction);

    // var deathFrame = (((tweak.playerDeathTick - this.deathTick) / 5) | 0)
    // var deathSprite = this.deathFrames[deathFrame];

    var deathSprite = "mdeath1"
    if (this.deathTick < 56) deathSprite = "mdeath2";
    if (this.deathTick < 48) deathSprite = "mdeath3";
    if (this.deathTick < 40) deathSprite = "mdeath4";
    if (this.deathTick < 32) deathSprite = "mdeath5";
    if (this.deathTick < 25) return;

    renderer.drawSprite(deathSprite, coords.x - 8, coords.y -8, false)
}

// -------------------------------------------------------
// Get Hitbox
// -------------------------------------------------------
Player.prototype.getHitbox = function() {
  return this.makeHitbox(0, 0, 16, 16);
}

// -------------------------------------------------------
// Die
// -------------------------------------------------------
Player.prototype.die = function() {
  this.moveToMapPos({x: 5, y: 5});
  this.dead = false;
  this.deathTick = 0;
  this.hurtTick = 0;
  this.health = this.maxHealth;
  this.mana = this.maxMana;
}

// -------------------------------------------------------
// powerUP
// -------------------------------------------------------
Player.prototype.powerUp = function(powerup, entity, gamestate) {
  var makedead = true;
  switch(powerup) {
    case 'necklace':
      gamestate.artifacts++;
      gamestate.say = [
        'got necklace of demonic',
        'rage.  press x to use',
        'firey death magic',
      ];
      this.hasMagic = true;
    break;
    case 'codpiece':
      gamestate.artifacts++;
      gamestate.say = [
        'got codpiece of unholy',
        'shielding. press v to',
        'use magic shield',
      ];
      this.hasShield = true;
    break;
    case 'garment':
      gamestate.artifacts++;
      gamestate.say = [
        'got dirty garment of',
        'devilish quickness.',
        'hold c to sprint',
      ];
      this.hasSprint = true;
    break;
    case 'cross':
      gamestate.artifacts++;
      gamestate.say = [
        'got useless artifact',
        'it has no real power',
      ]
    break;
    case 'potion':
      if (this.mana < this.maxMana)
        this.mana += tweak.manaRatio;
      else
        makedead = false;
    break;
    case 'lilheart':
      if (this.health < this.maxHealth)
        this.health++;
      else
        makedead = false;
    break;
    case 'brain':
      gamestate.say = [
        'found bloodied brain',
        'max mana points increased',
        'by one bar'
      ];
      this.maxMana += tweak.manaRatio;
      this.mana += tweak.manaRatio;
    break;
    case 'bigheart':
      gamestate.say = [
        'found beating heart',
        'max health increased',
        'by one bar'
      ];
      this.maxHealth++;
      this.health++;
    break;
    case 'baby':
       gamestate.say = [
         'ate baby. got full',
         'health and manas'
       ];
      this.health = this.maxHealth;
      this.mana = this.maxMana;
    break;
  }

  if (gamestate.artifacts >= 4) {
    //console.log("did it")
    gamestate.levels.castle.replaceId(135, 0, 'upper');
  }

  if (makedead)
    entity.dead = true;
}
