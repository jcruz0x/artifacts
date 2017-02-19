"use strict";

// =======================================================
// Resource Manager
// =======================================================

// -------------------------------------------------------
// constructor
// -------------------------------------------------------
function Res() {
    this.loadImages();
    this.loadSounds();

    this.soundmapping = {
      "throwrock": "zoot",
      "talk": "babop",
      "talkdone": "wom",
      "powerup": "womble",
      "restore": "dalup"
    }
}

// -------------------------------------------------------
// Load Images
// -------------------------------------------------------
Res.prototype.loadImages = function() {
  var sources = imageSources;

  this.imageCount = Object.keys(sources).length;
  this.imagesLoaded = 0;
  this.imgLoadDone = false;

  this.images = {};

  for (var key in sources) {
    var img = new Image();

    var self = this;
    img.addEventListener('load', function() {
      self.imagesLoaded++;
      if (self.imagesLoaded >= self.imageCount) {
        self.imgLoadDone = true;
      }
    });

    img.src = sources[key];
    this.images[key] = img;
  }
}

// -------------------------------------------------------
// Load Sounds
// -------------------------------------------------------
Res.prototype.loadSounds = function() {
  var sources = soundSources;

  this.soundCount = Object.keys(sources).length * 3;
  this.soundsLoaded = 0;
  this.soundLoadDone = false;

  this.sounds = {};

  for (var key in sources) {
    var soundlist = []
    for (var i = 0; i < 3; i++) {
      var snd = new Audio();
      soundlist[i] = snd;

      var self = this;
      snd.addEventListener('canplay', function() {
        self.soundsLoaded++;
        if (self.soundsLoaded >= self.soundCount) {
          self.soundLoadDone = true;
        }
      });

      snd.src = sources[key];
    }

    this.sounds[key] = soundlist;
  }
}

// -------------------------------------------------------
// Return true if all resources are loaded
// -------------------------------------------------------
Res.prototype.everythingReady = function() {
  return (this.imgLoadDone && this.soundLoadDone)
}

// -------------------------------------------------------
// Get an image by name
// -------------------------------------------------------
Res.prototype.getImage = function(name) {
  return this.images[name];
}

// -------------------------------------------------------
// playSound
// -------------------------------------------------------
Res.prototype.playSound = function(sound) {
  var mapping = this.soundmapping[sound];
  if (mapping == undefined)
    return;

  var soundlist = this.sounds[mapping];
  if (soundlist == undefined)
    return;

  for(var i = 0; i < 3; i++) {
    var snd = soundlist[i];
    if (snd.duration == 0 || snd.paused == true) {
      snd.play();
      return;
    }
  }
}
