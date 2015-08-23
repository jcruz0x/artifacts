"use strict";

// =======================================================
// Draw Map Functions
// =======================================================

// -------------------------------------------------------
// Draw Map
// -------------------------------------------------------
function drawMap(renderer, level, tileset) {
  var cameraPos = renderer.getCameraPos();
  var screenSize = renderer.getScreenSize();

  var startX = Math.max(parseInt(cameraPos.x / TILE_SIZE), 0);
  var startY = Math.max(parseInt(cameraPos.y / TILE_SIZE), 0);
  var endX   = Math.min(startX + screenSize.tilesWidth + 1, level.width);
  var endY   = Math.min(startY + screenSize.tilesHeight + 1, level.height);

  for (var layer = 0; layer < 2; layer++) {
    var grid = (layer == 0) ? level.lower : level.upper
    for (var x = startX; x < endX; x++) {
      for (var y = startY; y < endY; y++) {

        //console.log(grid.gridData);
        var tile = grid.at(x, y);

        if (tile == 0) {
          continue;
        }

        var tilesetX = (tile-1) % TILESET_SIZE_TILES;
        var tilesetY = ((tile-1) / TILESET_SIZE_TILES) | 0;

        var atlusX = tilesetX * TILE_SIZE;
        var atlusY = tilesetY * TILE_SIZE;

        renderer.drawAtlus (
          tileset, atlusX, atlusY,
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE
        );
      }
    }
  }

}
