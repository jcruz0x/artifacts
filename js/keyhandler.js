"use strict";

// =======================================================
// Keyhandler Class
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function KeyHandler() {
    this.keyTicks = {};
    var self = this;
    document.addEventListener("keydown", function(event) {
      var keycode = event.keyCode;
      var currVal = self.keyTicks[keycode];
      if (currVal == 0 || currVal == undefined) {
        self.keyTicks[keycode] = 1;
      }
    })
    document.addEventListener("keyup", function(event) {
      var keycode = event.keyCode;
      self.keyTicks[keycode] = 0;
    })
}

// -------------------------------------------------------
// For all the keys that are held down (have ticks > 0),
// increment the ticks (number of game ticks before keyup)
// -------------------------------------------------------
KeyHandler.prototype.incrementTicks = function() {
  for (var keycode in this.keyTicks) {
    if (this.keyTicks[keycode] > 0) {
      this.keyTicks[keycode]++;
    }
  }
}

// -------------------------------------------------------
// Is the key held down
// -------------------------------------------------------
KeyHandler.prototype.isKeyDown = function(keycode) {
  //console.log(this);
  return (this.keyTicks[keycode] > 0);
}

// -------------------------------------------------------
// Was the key just pressed
// -------------------------------------------------------
KeyHandler.prototype.isKeyPressed = function(keycode) {
  // console.log('booyah')
  return (this.keyTicks[keycode] == 1);
}

// -------------------------------------------------------
// Determine if a key is considered pressed given a pattern
// -------------------------------------------------------
KeyHandler.prototype.patternCheck = function(keycode, pattern) {
  var ticks = this.keyTicks[keycode];
  if (ticks == 1 && pattern.instant == true) {
    return true;
  }
  if (ticks > pattern.delay) {
    var postTicks = ticks - pattern.delay
    if (postTicks % pattern.interval == 0) {
      return true;
    }
  }

  return false;
}

// -------------------------------------------------------
// Return the ticks for a given key
// -------------------------------------------------------
KeyHandler.prototype.getTicks = function(keycode) {
  return this.keyTicks[keycode];
}
