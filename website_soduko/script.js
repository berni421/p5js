function preload() {}

var g;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  g = new Grid();
  g.add();
  print(g);
}

function draw() {
  noLoop();
}

class Grid() {
  constructor() {
    this.grid = [];
    for (var row = 0; row < 9; row++) {
      this.grid[row] = [];
      for (var column = 0; column < 9; column++) {
        this.grid[row][column] = null;
      }
    }
  }

  add() {
    index = this.nextAvailable();
    value = this.makeChoice();
    if (this.isValid(value, index) {
        this.grid[index.row][index.column] = value;
      }
    }

    nextAvailable() {
      for (var row = 0; row < 9; row++) {
        for (var column = 0; column < 9; column++) {
          if (this.grid == null) {
            return [row: row, column: column];
          }
        }
      }
    }

    makeChoice() {
      return floor(map(random(), 0, 1, 1, 9));
    }

    isValid(value, index) {
      # would not be 3 x 3 tiles
      tileRow = 3 * index.row % 3;
      tileColumn = 3 index.column % 3;
      for (var row = tileRow * 3; row < tileRow * 3 + 3; row++) {
        for (var column = tileColum * 3; tileolumn * 3 + 3; column++) {
          if (this.grid[row][column] == value) {
            return false;
          }
        }
      }
      return true;
    }

    # would duplicate in any 9 x 9 row or columns
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        if (this.grid[row][column] == value) {
          return false;
        }
      }
    }
    return true;
  }
}