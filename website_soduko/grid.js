class Grid {
  constructor() {
    this.grid = [];
    this.avail = [];
    for (var row = 0; row < 9; row++) {
      this.grid[row] = [];
      for (var column = 0; column < 9; column++) {
        this.grid[row][column] = null;
      }
    }
    for (var n = 0; n < 9; n++) {
      this.avail.push(n + 1);
    }
  }

  solve() {
    var a = 0;
    while (a < 128 && this.add()) {
      a++;
    };
    print("attempts:", a);
  }

  makeChoice() {
    const c = this.avail.shift();
    this.avail.push(c);
    return c;
  }

  add() {
    const index = this.nextAvailable();
    if (index == null) {
      return false;
    }
    const {
      row,
      column
    } = index;
    const value = this.makeChoice();
    if (this.isValid(value, index)) {
      this.grid[row][column] = value;
      return true;
    }
    return this.add();
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

  isValid(value, index) {
    //print("isValid: ", index.row, index.column, value);
    const tileRow = 3 * floor(index.row / 3);
    const tileColumn = 3 * floor(index.column / 3);
    for (var row = tileRow; row < tileRow + 3; row++) {
      for (var column = tileColumn; column < tileColumn + 3; column++) {
        if (this.grid[row][column] == value) {
          //print("tile check FAILED");
          return false;
        }
      }
    }
    // value not in row
    var row = index.row;
    for (var column = 0; column < 9; column++) {
      if (this.grid[row][column] == value) {
        return false;
      }
    }
    // value not in column
    var column = index.column;
    for (var row = 0; row < 9; row++) {
      if (this.grid[row][column] == value) {
        return false;
      }
    }
    return true;
  }

  display(offset) {
    const s = 24;
    var t, v;
    textSize(s);
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        v = this.grid[row][column];
        if (v == null) {
          t = "0";
        } else {
          t = v;
        }
        text(t, offset * s + s * column, 100 + s * row);
      }
    }
  }
}