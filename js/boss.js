// =======================================================
// Boss Class
// =======================================================

// // -------------------------------------------------------
// // Bossdata
// // -------------------------------------------------------

var bossFrames = ["heroking", "heroking2", "heroking", "heroking3"];

// // -------------------------------------------------------
// // Constructor
// // -------------------------------------------------------
function Boss(obj) {
  Entity.call(this);
  this.moveToMapPosRounded(obj.x, obj.y);
  this.direction = (Math.random() * 4) | 0;
  this.changeTick = ((Math.random() * 60) + 20) | 0;
  this.stepsTick = (Math.random() * this.changeTick) | 0;
  this.deathTick = 0;

  this.hurtTick = 0;

  this.health = 35;

  this.sensors = [
    {x: 0, y: 4, dir: DIR_LEFT},
    {x: 0, y: 28, dir: DIR_LEFT},
    {x: 4, y: 0, dir: DIR_UP},
    {x: 28, y: 0, dir: DIR_UP},
    {x: 32, y: 4, dir: DIR_RIGHT},
    {x: 32, y: 28, dir: DIR_RIGHT},
    {x: 4, y: 32, dir: DIR_DOWN},
    {x: 28, y: 32, dir: DIR_DOWN},
  ]
}

Boss.prototype = Object.create(Entity.prototype);

// -------------------------------------------------------
// Boss.getFlags
// -------------------------------------------------------
Boss.prototype.getFlags = function() {
  if (this.dead == false) {
    return (eFlags.hazard | eFlags.shootable);
  } else {
    return 0;
  }
}

// -------------------------------------------------------
// Boss.message
// -------------------------------------------------------
Boss.prototype.message = function(flags) {
  if (((flags & mFlags.kill) != 0) && this.deathTick == 0 && this.dead == false && this.hurtTick == 0) {
    this.health--;
    this.hurtTick = 25;
    if (this.health == 0) {
      this.deathTick = 20;
    }
  }
}

// -------------------------------------------------------
// Boss.update
// -------------------------------------------------------
Boss.prototype.update = function(gamestate) {
  if (this.deathTick == 20)
    gamestate.res.playSound("enemysplat");

  if (this.deathTick == 0 && this.hurtTick == 25) {
    var roll = Math.random();
    if (roll < 0.8)
      gamestate.res.playSound("enemydamage");
    else if (roll < 0.9)
      gamestate.res.playSound("bossmoan1");
    else
      gamestate.res.playSound("bossmoan2");
  }

  if (this.deathTick > 0) {
    this.deathTick--
    if (this.deathTick == 1) {
      this.dead = true;
      gamestate.endTick = 60;
    }
    return;
  }

  if (this.hurtTick > 0) {
    this.hurtTick--;
  }

  // == changeTick
  if (this.changeTick > 0) {
    this.changeTick--
  } else {
    if (Math.random() > 0.2) {
      var dirs = [];
      if (gamestate.player.currPos.y <= this.currPos.y) dirs.push(DIR_UP);
      if (gamestate.player.currPos.y > this.currPos.y) dirs.push(DIR_DOWN);
      if (gamestate.player.currPos.x <= this.currPos.x) dirs.push(DIR_LEFT);
      if (gamestate.player.currPos.x > this.currPos.x) dirs.push(DIR_RIGHT);
      
      var pick = (Math.random() * dirs.length) | 0;
      this.direction = dirs[pick];
    } else {
      this.direction = (Math.random() * 4) | 0;
    }
    this.changeTick = ((Math.random() * 60) + 20) | 0;
    this.stepsTick = (Math.random() * this.changeTick) | 0;
  }

  if (this.stepsTick > 0) {
    this.stepsTick--;
    switch(this.direction) {
    case DIR_UP:
      this.currPos.y -= tweak.bossSpeed;
      break;
    case DIR_DOWN:
      this.currPos.y += tweak.bossSpeed;
      break;
    case DIR_LEFT:
      this.currPos.x -= tweak.bossSpeed;
      break;
    case DIR_RIGHT:
      this.currPos.x += tweak.bossSpeed;
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
// Boss.draw
// -------------------------------------------------------
Boss.prototype.draw = function(renderer, deltafraction) {
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

  var index = (((this.stepsTick / 4) | 0) % 4);
  var frame = bossFrames[index];

  if (this.hurtTick > 0) {
    var flashmode = ((this.hurtTick / 2) | 0) % 3
    if (flashmode == 1) frame += "-damage";
    if (flashmode == 2) frame += "-damage2";
  }

  renderer.drawSprite(frame, at.x, at.y);
}

// -------------------------------------------------------
// Get Hitbox (default, often will be overriden)
// -------------------------------------------------------
Boss.prototype.getHitbox = function() {
  return this.makeHitbox(0, 0, 32, 32);
}
