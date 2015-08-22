"use strict";

// =======================================================
// Resource Manager
// =======================================================

// -------------------------------------------------------
// constructor
// -------------------------------------------------------
function Res() {
    this.loadImages();
}

// -------------------------------------------------------
// Load Images
// -------------------------------------------------------
Res.prototype.loadImages = function() {
  var sources = imageSources;

  this.imageCount = Object.keys(sources).length;
  this.imagesLoaded = 0;
  this.imgLoadDone = false;

  this.images = {};

  for (var key in sources) {
    var img = new Image();

    var self = this;
    img.addEventListener('load', function() {
      self.imagesLoaded++;
      if (self.imagesLoaded >= self.imageCount) {
        self.imgLoadDone = true;
      }
    });

    img.src = sources[key];
    this.images[key] = img;
  }
}

// -------------------------------------------------------
// Return true if all resources are loaded
// -------------------------------------------------------
Res.prototype.everythingReady = function() {
  return (this.imgLoadDone == true)
}

// -------------------------------------------------------
// Get an image by name
// -------------------------------------------------------
Res.prototype.getImage = function(name) {
  return this.images[name];
}
