"use strict"

// =======================================================
// Villager Class
// =======================================================

// -------------------------------------------------------
//  Kinds Data 
// -------------------------------------------------------

var kindData = {
	
  "villager": {
    health: 1,
    head1: "vhead1",
    head2: "vhead2",
    bodySprites: [
        ["vbody", "vbody"], 
        ["vbody2", "vbody2"]
      ],
    posOffset:  0,
    headOffsetY: -12,
    headOffsetX: 0,
    speed: 1
  },
  "mofo": {
    health: 10,
    head1: "mfhead1",
    head2: "mfhead2",
    bodySprites: [
        ["mofoleft", "moforight"]
      ],
    posOffset: -4,
    headOffsetY: -12,
    headOffsetX: 0,
    speed: 1
  },
  "baby": {
    health: 1,
    head1: "babyhead1",
    head2: "babyhead2",
    bodySprites: [
        ["babybody1", "babybody1"],
        ["babybody2", "babybody2"],
        ["babybody3", "babybody3"],
        ["babybody4", "babybody4"]
      ],
    posOffset: 0,
    headOffsetY: -8,
    headOffsetX: 2,
    speed: 2
  }
}

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Villager(obj) {
  Entity.call(this);
  this.moveToMapPosRounded(obj.x, obj.y);
  this.direction = (Math.random() * 4) | 0;
  this.changeTick = ((Math.random() * 60) + 20) | 0;
  this.stepsTick = (Math.random() * this.changeTick) | 0;
  this.deathTick = 0;
  this.kind = obj.properties.kind || "villager";
  this.flashTick = 0;

  var data = kindData[this.kind];

  this.speed = data.speed; 
  this.health = data.health;
  this.headSprite = (Math.random() > 0.5) ? data.head1 : data.head2;

  var bodyPick = getRandInt(0, data.bodySprites.length);
  this.bodySpriteLeft = data.bodySprites[bodyPick][0];
  this.bodySpriteRight = data.bodySprites[bodyPick][1];

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
    this.health--;
    this.flashTick = 20;
    if (this.health < 1) {
      this.deathTick = 20;
    }
  }
}

// -------------------------------------------------------
// Villager.update
// -------------------------------------------------------
Villager.prototype.update = function(gamestate) {
  if (this.deathTick == 20)
    gamestate.res.playSound("enemysplat");

  if (this.deathTick == 0 && this.flashTick == 20)
    gamestate.res.playSound("enemydamage");


  if (this.deathTick > 0) {
    this.deathTick--
    if (this.deathTick == 1) {
      this.itemDrop(gamestate);
      this.dead = true;
    }
    return;
  }

  if (this.flashTick > 0) {
    this.flashTick--;
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
      this.currPos.y -= this.speed;
      break;
    case DIR_DOWN:
      this.currPos.y += this.speed;
      break;
    case DIR_LEFT:
      this.currPos.x -= this.speed;
      break;
    case DIR_RIGHT:
      this.currPos.x += this.speed;
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
Villager.prototype.getHitbox = function(collision) {
  if (collision === true) {
    return this.makeHitbox(0, 0, 16, 16);
  }
  else {
    return this.makeHitbox(0, -8, 16, 24);
  }
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
    if (tick < 15) frame = "blood2";
    if (tick < 10) frame = "blood3";
    if (tick < 5) frame = "blood4";
    var at = this.getCoords(deltafraction);
    renderer.drawSprite(frame, at.x - 8, at.y - 8);
    return;
  }

  var damage_suffix = ""
  switch((this.flashTick / 4) % 3) {
    case 1:
      damage_suffix = "-damage"
      break;
    case 2:
      damage_suffix = "-damage2"
      break;
  }

  var bodySprite = (this.stepsTick / 8 | 0) % 2 == 0 ? this.bodySpriteLeft : this.bodySpriteRight;

  var at = this.getCoords(deltafraction);
  var posOffset = kindData[this.kind].posOffset;
  var headBounce = ((this.stepsTick / 4) | 0) % 2;
  var headOffsetX = kindData[this.kind].headOffsetX;
  var headOffsetY = kindData[this.kind].headOffsetY;

  renderer.drawSprite(
    bodySprite + damage_suffix,
    at.x + posOffset, 
    at.y + posOffset
  );

  renderer.drawSprite(
    this.headSprite + damage_suffix, 
    at.x + headOffsetX,
    at.y + headBounce + headOffsetY
  );
}
