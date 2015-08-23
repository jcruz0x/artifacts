"use strict";

// =======================================================
// Constants
// =======================================================

// -------------------------------------------------------
// Misc constants
// -------------------------------------------------------
var TILE_SIZE = 16;
//var TILE_SIZE_SCALED = fxScale(16);
var TILESET_SIZE_PIXELS = 256;
var TILESET_SIZE_TILES = 16;

var RES_X = 240;
var RES_Y = 160;
var TILE_RES_X = parseInt(RES_X / TILE_SIZE)
var TILE_RES_Y = parseInt(RES_Y / TILE_SIZE)
var FRAME_MS = 1000 / 60;

var DIR_UP = 0;
var DIR_RIGHT = 1;
var DIR_DOWN = 2;
var DIR_LEFT = 3;


// -------------------------------------------------------
// gameplay constants
// -------------------------------------------------------
var tweak = {
  playerSpeed: 1.8,
  portalTime: 16,
  shutterHold: 3
}

// =======================================================
// Bitwise Flag Maps
// =======================================================

// -------------------------------------------------------
// Entity flags
// -------------------------------------------------------
var eFlags = {
  special: 1,
}

// -------------------------------------------------------
// Message flags
// -------------------------------------------------------
var mFlags = {

}
