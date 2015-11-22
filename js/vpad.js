"use strict";

// =======================================================
// Vpad Class
// =======================================================

// -------------------------------------------------------
// Constructor
// -------------------------------------------------------
function Vpad(keyHandler) {
  this.keyHandler = keyHandler;
}

// -------------------------------------------------------
// Get keyboard code from virtual button name
// -------------------------------------------------------
Vpad.prototype.getCode = function(button) {
  switch(button) {
    case 'up':
      return 38;
    case 'down':
      return 40;
    case 'left':
      return 37;
    case 'right':
      return 39;
    case 'shoot':
      return 90;
    case 'magic':
      return 88;
    case 'sprint':
      return 67;
    case 'shield':
      return 86;
    case 'interact':
      return 32;
    case 'test':
      return 84;
    default:
      return null;
  }
}

// -------------------------------------------------------
// Check if virtual button is down
// -------------------------------------------------------
Vpad.prototype.down = function(button) {
  var code = this.getCode(button);
  if (code != null) {
    return this.keyHandler.isKeyDown(code);
  }
}

// -------------------------------------------------------
// Check if virtual button was just pressed
// -------------------------------------------------------
Vpad.prototype.pressed = function(button) {
  var code = this.getCode(button);
  if (code != null) {
    return this.keyHandler.isKeyPressed(code);
  }
}

// -------------------------------------------------------
// Check if virtual autofire button is held down and firing
// -------------------------------------------------------
Vpad.prototype.autofire = function(button, delay, interval) {
  var code = this.getCode(button);
  if (code != null) {
    return this.keyHandler.patternCheck(
      code, {instant: true, delay: delay, interval: interval}
    );
  }
}

// -------------------------------------------------------
// get the ticks a button has been held down
// -------------------------------------------------------
Vpad.prototype.ticks = function(button) {
  var code = this.getCode(button);
  if (code != null) {
    return this.keyHandler.getTicks(code);
  }

}
