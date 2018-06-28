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

    this.current_song = null;
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

  this.soundCount = 0;
  for (var key in sources) {
    this.soundCount += sources[key].duplicates;
  }
  this.soundsLoaded = 0;
  this.soundLoadDone = false;

  this.sounds = {};

  for (var key in sources) {
    var duplicates = sources[key].duplicates || 1;
    var looping = sources[key].looping || false;
    //var volume = sources[key].
    var soundlist = []
    for (var i = 0; i < duplicates; i++) {
      var snd = new Audio();
      soundlist[i] = snd;

      var self = this;
      snd.addEventListener('canplay', function() {
        self.soundsLoaded++;
        if (self.soundsLoaded >= self.soundCount) {
          self.soundLoadDone = true;
        }
      });

      snd.src = sources[key].file;
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
  var soundlist = this.sounds[sound];
  if (soundlist == undefined)
    return;

  for(var i = 0; i < soundlist.length; i++) {
    var snd = soundlist[i];
    if (snd.duration == 0 || snd.paused == true) {
      snd.play();
      return;
    }
  }
}

// -------------------------------------------------------
// LoopSound
// -------------------------------------------------------
Res.prototype.loopSound = function(sound) {
  var soundlist = this.sounds[sound];
  if (soundlist == undefined)
    return;

  soundlist[0].loop = true;
  soundlist[0].play();
}

// -------------------------------------------------------
// StopSound
// -------------------------------------------------------
Res.prototype.stopSound = function(sound) {
  var soundlist = this.sounds[sound];
  if (soundlist == undefined)
    return;

  soundlist[0].pause();
}

// -------------------------------------------------------
// PlayMusic
// -------------------------------------------------------
Res.prototype.playMusic = function(song) {

  var soundlist = this.sounds[song];
  if (soundlist == undefined)
    return;

  var new_song = soundlist[0];

  if (this.current_song == new_song)
    return;

  if (this.current_song != null)
    this.current_song.pause();

  new_song.currentTime = 0;
  new_song.play();

  this.current_song = new_song;
}

// -------------------------------------------------------
// PauseMusic
// -------------------------------------------------------
Res.prototype.pauseMusic = function() {
  if (this.current_song != null)
    this.current_song.pause();
}