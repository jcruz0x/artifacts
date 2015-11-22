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
  playerSprint: 2.7,
  shieldTime: 180,
  shieldCool: 200,
  portalTime: 16,
  shutterHold: 3,
  villagerSpeed: 1,
  startHealth: 5,
  startMana: 2,
  manaRatio: 5,
  hurtTickTime: 20,
  hurtFlashDiff: 10,
  playerDeathTick: 64,
  rockVel: 5,
  villagerSpawnSpacing: 128,
  itemLast: 270,
  itemBlink: 90
}

// =======================================================
// Bitwise Flag Maps
// =======================================================

// -------------------------------------------------------
// Entity flags
// -------------------------------------------------------
var eFlags = {
  special: 1,
  hazard: 2,
  shootable: 4,
  npc: 8
}

// -------------------------------------------------------
// Message flags
// -------------------------------------------------------
var mFlags = {
  kill: 1,
  hitTarget: 2,
}

// =======================================================
// Misc
// =======================================================

var rockVel = [
  {x: 0, y: -tweak.rockVel},
  {x: tweak.rockVel, y: 0},
  {x: 0, y: tweak.rockVel},
  {x: -tweak.rockVel, y: 0}
]

var fireVel = [
  [
    {x: 0, y: -tweak.rockVel},
    {x: -0.5, y: -tweak.rockVel},
    {x: -1, y: -tweak.rockVel},
    {x: 0.5, y: -tweak.rockVel},
    {x: 1, y: -tweak.rockVel},
  ],
  [
    {x: tweak.rockVel, y: 0},
    {x: tweak.rockVel, y: 0.5},
    {x: tweak.rockVel, y: 1},
    {x: tweak.rockVel, y: -0.5},
    {x: tweak.rockVel, y: -1},
  ],
  [

    {x: 0, y: tweak.rockVel},
    {x: 0.5, y: tweak.rockVel},
    {x: 1, y: tweak.rockVel},
    {x: -0.5, y: tweak.rockVel},
    {x: -1, y: tweak.rockVel},
  ],
  [
    {x: -tweak.rockVel, y: 0},
    {x: -tweak.rockVel, y: 0.5},
    {x: -tweak.rockVel, y: 1},
    {x: -tweak.rockVel, y: -0.5},
    {x: -tweak.rockVel, y: -1}
  ]
]
