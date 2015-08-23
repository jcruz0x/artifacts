"use strict";

// =======================================================
// Game Object
// =======================================================

// -------------------------------------------------------
// Game Constructor
// -------------------------------------------------------
function Game() {
  // instantiate engine classes
  this.res = new Res();
  this.renderer = new Renderer(this.res);

  this.keyHandler = new KeyHandler();
  this.vpad = new Vpad(this.keyHandler);

  // timing related stuff
  this.oldTime = new Date();
  this.deltaRemaining = 0;
  this.deltaFraction = 0;

  this.player = new Player(5,5);

  this.loadLevels();

  // console.log(levelData.testlevel)
  this.level = this.levels["testlevel"]

  // gameStateRef contains references to various
  // aspects of the gamestate, and special variables
  // passed to entity.update, etc
  this.gameStateRef = {
    level: this.level,
    player: this.player,
    vpad: this.vpad,
    portalTick: 0,
    unPortalTick: 0
  }

  var self = this;
  this.intervalId = window.setInterval(function() { self.logicTick(); }, FRAME_MS);
  window.requestAnimationFrame(function() { self.renderTick(); });
}

// -------------------------------------------------------
// Game.logicTick (main game loop)
// -------------------------------------------------------
Game.prototype.logicTick = function() {
  if (this.res.everythingReady() == true) {
    this.updateDelta();

    while (this.deltaRemaining >= FRAME_MS) {
      this.runLogic();
      this.deltaRemaining -= FRAME_MS;
    }
  }
  else {
    this.oldTime = new Date();
  }
}

// -------------------------------------------------------
// Game.renderTick (renderingupdate)
// -------------------------------------------------------
Game.prototype.renderTick = function() {
  if (this.res.everythingReady() == true) {
    this.updateDelta();
    this.deltaFraction = this.deltaRemaining / FRAME_MS;

    this.renderer.cls();

    this.renderer.setCameraPos(this.gameStateRef, this.deltaFraction);

    // old stuff from my other game:

     drawMap(this.renderer, this.level, "tilesheet");
    //
    // for (var entity of this.level.entities) {
    //   entity.draw(this.renderer, this.deltaFraction);
    // }
    //
    this.player.draw(this.renderer, this.deltaFraction);

    // this.renderer.mosaicEffect(4)

    var pTick = this.gameStateRef.portalTick;
    var unpTick = this.gameStateRef.unPortalTick;
    if (pTick > 0) {
      this.renderer.drawShutterPortalTick(pTick);
    } else if (unpTick > 0) {
      this.renderer.drawShutterPortalTick(tweak.portalTime - unpTick);
    }

    this.renderer.flip();
  }

  var self = this;
  window.requestAnimationFrame(function() { self.renderTick(); });
}

// -------------------------------------------------------
// Game.runLogic (main logic update)
// -------------------------------------------------------
Game.prototype.runLogic = function() {
  this.renderer.animTick++;


  // stuff from my other game I might use:

  // var anyDead = false;
  //
  // for (var entity of this.level.entities) {
  //   entity.setPrevPos();
  //   if (entity.dead == false) {
  //     entity.update(this.gameStateRef);
  //   } else {
  //     anyDead = true;
  //   }
  // }
  //
  // if (anyDead) {
  //   var newlist = [];
  //   for (var entity of this.level.entities) {
  //     if (entity.dead == false) {
  //       newlist.push(entity);
  //     }
  //   }
  //   this.level.entities = newlist;
  // }
  //
   this.player.setPrevPos();
   this.player.update(this.gameStateRef);
  //
  // this.level.animateTiles(this.renderer.animTick);
   this.keyHandler.incrementTicks();


   if (this.gameStateRef.portalTick > 0 && this.gameStateRef.unPortalTick == 0) {
     this.gameStateRef.portalTick--;
   }

   if (this.gameStateRef.unPortalTick > 0) {
     this.gameStateRef.unPortalTick--;
   }

   if (this.gameStateRef.portalTick == 1) {
     //  console.log("booyah")
     this.level = this.levels[this.gameStateRef.portalDest];
     this.gameStateRef.level = this.level;
     this.player.moveToMapPos(this.gameStateRef.portalPos);
     this.gameStateRef.portalTick = 0;
     this.gameStateRef.unPortalTick = tweak.portalTime;
   }

}

// -------------------------------------------------------
// Game.updateDelta
// -------------------------------------------------------
Game.prototype.updateDelta = function() {
  // calculate elapsed milliseconds
  var newTime = new Date();
  var elapsed = newTime - this.oldTime;
  this.oldTime = newTime;
  this.deltaRemaining += elapsed;
}

// -------------------------------------------------------
// Game.loadLevels
// -------------------------------------------------------
Game.prototype.loadLevels = function() {
  this.levels = {}
  var levelnames = Object.keys(levelData);
  for (var i = 0; i < levelnames.length; i++) {
    var name = levelnames[i];
    this.levels[name] = new Level(levelData[name]);
  }
}

// =======================================================
// Initialization (on window load)
// =======================================================

var game // make game global for access while debugging
window.onload = function() {
  game = new Game();
}
