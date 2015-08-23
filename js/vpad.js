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
    case 'foo':
      return 90;
    case 'bar':
      return 88;
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
