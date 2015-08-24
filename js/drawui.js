"use strict"

// -------------------------------------------------------
// DrawUI
// -------------------------------------------------------
function DrawUI(gamestate, renderer) {
  var maxHealth = gamestate.player.maxHealth;
  var health = gamestate.player.health;

  for (var i = 0; i < maxHealth; i++) {
    var graphic = (health > i) ? "health-filled" : "health-empty";
    var offset = i * 7;
    renderer.drawGraphic(graphic, 1+offset, 1);
  }
}
