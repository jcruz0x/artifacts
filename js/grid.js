"use strict";

// ===============================================
// General purpose Grid object (2d array wrapper)
// ===============================================

// -----------------------------------------------
//   *Contructor* (Grid)
// Creates a 2d grid object with the specified x
// and y size using an internal array of arrays.
// Can be passed an initializer function at
// creation time that is applied to the grid.
// -----------------------------------------------
function Grid(xSize, ySize, initializer) {
  this.xSize = xSize;
  this.ySize = ySize;
  this.gridData = [];
  for (var x = 0; x < xSize; x++) {
    this.gridData[x] = [];
    for (var y = 0; y < ySize; y++) {
        this.gridData[x][y] = null;
    }
  }
  if (initializer) {
    this.foreach(initializer);
  }
}

// -----------------------------------------------
// Grid.foreach takes a function and applies it
// to each element in the grid, passing the
// function the x and y position of that element
// -----------------------------------------------
Grid.prototype.foreach = function (func) {
  for (var x in this.gridData) {
    for (var y in this.gridData[x]) {
      this.gridData[x][y] = func(x, y, this.gridData[x][y]);
    }
  }
}

// -----------------------------------------------
// Grid.at returns the value stored in the
// grid element at the x and y postions passed in
// -----------------------------------------------
Grid.prototype.at = function(x,y) {
  return this.gridData[x][y];
}

// -----------------------------------------------
// Grid.set sets the value of the grid at the
// specified position to the specified value
// -----------------------------------------------
Grid.prototype.set = function(x,y, val) {
  this.gridData[x][y] = val;
}

// -----------------------------------------------
// Grid.set1d sets the value of the grid based on
// a single offset value rather than x and y
// -----------------------------------------------
Grid.prototype.set1d = function(offset, val) {
  // console.log(offset);
  var x = offset % this.xSize;
  var y = (offset / this.xSize) | 0;
  // console.log("x: " + x + " y: " + y)
  this.gridData[x][y] = val;
}
