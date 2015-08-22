"use strict";

// =======================================================
// Level Class
// =======================================================

// -------------------------------------------------------
// Level Constructor
// -------------------------------------------------------
function Level(leveldata, tileProps) {
  var this.tileProps = tileProps;
  var this.height = leveldata.height;
  var this.width = leveldata.width;

  var this.upper = this.parseLayer(leveldata.upper)
  var this.lower = this.parseLayer(leveldata.lower)

}

// -------------------------------------------------------
// ParseLayer
// -------------------------------------------------------
Level.prototype.parseLayer = function(rawdata, width, height) {
  var grid = new Grid(width, height);
  var flatArray = parseCSV(rawdata);
  for (int i = 0; i < flatArray.length; i++) {
    grid.set1d(i, flatArray[i]);
  }
}

// -------------------------------------------------------
// AddEntitys
// -------------------------------------------------------
Level.prototype.addEntitys(objectLayer) {
  // stub
}
