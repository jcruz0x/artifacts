"use strict"

// -------------------------------------------------------
// DrawUI
// -------------------------------------------------------
function DrawUI(gamestate, renderer) {
  var maxHealth = gamestate.player.maxHealth;
  var health = gamestate.player.health;
  var maxMana = (gamestate.player.maxMana / tweak.manaRatio) | 0;
  var mana = Math.ceil(gamestate.player.mana / tweak.manaRatio);

  for (var i = 0; i < maxHealth; i++) {
    var graphic = (health > i) ? "health-filled" : "health-empty";
    var offset = i * 7;
    renderer.drawGraphic(graphic, 1 + offset, 1);
  }

  if (gamestate.player.hasMagic || gamestate.player.hasShield) {
    for (var i = 0; i < maxMana; i++) {
      var graphic = (mana > i) ? "mana-filled" : "mana-empty";
      var offset = i * 7;
      renderer.drawGraphic(graphic, 1 + offset, 10);
    }
  }
    
}
