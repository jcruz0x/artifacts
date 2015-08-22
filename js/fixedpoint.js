"use strict";

// =======================================================
// Constants
// =======================================================

var FIXED_BITS = 8; // for fixed point numbers
var FIXED_SCALE = 1 << 8;

// =======================================================
// Functions
// =======================================================

// -------------------------------------------------------
// fixed point scale
// -------------------------------------------------------
function fxScale(num) {
  return num << FIXED_BITS;
}

// -------------------------------------------------------
// fixed point unscale
// -------------------------------------------------------
function fxUnscale(num) {
  return num >> FIXED_BITS;
}

// -------------------------------------------------------
// float to fixed point
// -------------------------------------------------------
function fxScaleFloat(num) {
  return (num * FIXED_SCALE) | 0;
}

// -------------------------------------------------------
// fixed point multiply
// -------------------------------------------------------
function fxMultiply(factor1, factor2){
    var bigProduct = factor1 * factor2;
    return (bigProduct / FIXED_SCALE) | 0;
}

// -------------------------------------------------------
// fixed point divide
// -------------------------------------------------------
function fxDivide(dividend, divisor) {
    var bigDividend = dividend * FIXED_SCALE;
    return (bigDividend / divisor) | 0;
}
