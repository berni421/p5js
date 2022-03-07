class Grid {
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
    const index = this.nextAvailable();
    if (index == null) {
      return;
    }
    const value = this.makeChoice();
    if (this.isValid(value, index)) {
      this.grid[index.row][index.column] = value;
    }
  }

  nextAvailable() {
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        if (this.grid[row][column] == null) {
          const index = {
            row: row,
            column: column
          };
          return index;
        }
      }
    }
    return null;
  }

  makeChoice() {
    return floor(map(random(), 0, 1, 1, 9));
  }

  isValid(value, index) {
    // value not in 3 x 3 tiles
    const tileRow = 3 * index.row % 3;
    const tileColumn = 3 * index.column % 3;
    for (var row = tileRow * 3; row < tileRow * 3 + 3; row++) {
      for (var column = tileColumn * 3; tileColumn * 3 + 3; column++) {
        if (this.grid[row][column] == value) {
          return false;
        }
      }
    }
    print(row, column);
    exit(a);
    // value in any 9 x 9 row or columns
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