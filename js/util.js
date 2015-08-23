"use strict";

// =======================================================
// Utility Functions
// =======================================================

// -------------------------------------------------------
// Collision Detection: check if rectangles overlap
// a and b should be objects with x, y, w, and h
// -------------------------------------------------------
function rectOverlap(a, b) {
  if (a.x > (b.x + b.w)) return false;
  if (b.x > (a.x + a.w)) return false;
  if (a.y > (b.y + b.h)) return false;
  if (b.y > (a.y + a.h)) return false;

  return true;
}

// -------------------------------------------------------
// Interpolation: c is current, p is previous, alpha is
// between 0 and 1
// -------------------------------------------------------
function interpolate(c, p, alpha) {
  var x = p.x + ((c.x - p.x) * alpha);
  var y = p.y + ((c.y - p.y) * alpha);

  return { x: (x | 0), y: (y | 0) };
}

// -------------------------------------------------------
// Orbit
// -------------------------------------------------------
function plotOrbit(origin, radius, alpha) {
  var rads = (2 * Math.PI) * alpha;

  var x = (Math.cos(rads) * radius) | 0;
  var y = (Math.sin(rads) * radius) | 0;

  return { x: x + origin.x, y: y + origin.y };
}

// -------------------------------------------------------
// get random integer in range
// -------------------------------------------------------
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// -------------------------------------------------------
// Request File -- wrapper for xmlHttpRequest
// -------------------------------------------------------
function requestFile(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    // this isnt quite right yet:
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr);
    }
  }
  xhr.open("get", url, true);
  xhr.send();
}

// -------------------------------------------------------
// ParseCSV
// -------------------------------------------------------
function parseCSV(text) {
  // console.log("text: " + text + typeof text)
  var numstring = "";
  var out = [];
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);
    if (ch == ',') {
      out.push(parseInt(numstring))
      numstring = "";
    } else {
      numstring += ch;
    }
  }
  out.push(parseInt(numstring));
  // console.log(out);
  return out;
}

// -------------------------------------------------------
// Vec2Copy
// -------------------------------------------------------
function vec2Copy(vec2) {
  return { x: vec2.x, y: vec2.y };
}

// -------------------------------------------------------
// Clamp
// -------------------------------------------------------
function Clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
