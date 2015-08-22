"use strict";

// =======================================================
// Constants
// =======================================================

// -------------------------------------------------------
// Misc constants
// -------------------------------------------------------
var TILE_SIZE = 16;
var TILE_SIZE_SCALED = fxScale(16);
var TILE_SHIFT_BITS = 4;
var TILE_AND_FIXED_SHIFT_BITS = TILE_SHIFT_BITS + FIXED_BITS;

var RES_X = 240;
var RES_Y = 160;
var TILE_RES_X = parseInt(RES_X / TILE_SIZE)
var TILE_RES_Y = parseInt(RES_Y / TILE_SIZE)
var FRAME_MS = 1000 / 60;

// -------------------------------------------------------
// gameplay constants
// -------------------------------------------------------
var tweak = {

}

// =======================================================
// Bitwise Flag Maps
// =======================================================

// -------------------------------------------------------
// Entity flags
// -------------------------------------------------------
var eFlags = {

}

// -------------------------------------------------------
// Message flags
// -------------------------------------------------------
var mFlags = {

}

// -------------------------------------------------------
// Tiletype Flags - might not use these
// -------------------------------------------------------
var tFlags = {

}
