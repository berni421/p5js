class Grid {
  constructor() {
    this.grid = [];
    this.avail = [];
    for (var row = 0; row < 9; row++) {
      this.grid[row] = [];
      for (var column = 0; column < 9; column++) {
        this.grid[row][column] = null;
        this.avail.push(column + 1);
      }
    }
    this.avail.push(null);
  }

  solve() {
    var a = 0;
    while (a < 100 && this.add(0)) {
      a++;
    };
    print("attempts:", a)
  }

  makeChoice() {
    return this.avail[0];
  }

  choiceUsed() {
    const value = this.avail.shift();
  }

  add(offset) {
    const index = this.nextAvailable(offset);
    if (index == null) {
      return false;
    }
    const {
      row,
      column
    } = index;
    const value = this.makeChoice();
    if (value == null) {
      return false;
    }
    if (this.isValid(value, index)) {
      this.grid[row][column] = value;
      this.choiceUsed();
      return true;
    } else {
      return this.add(offset + 1);
    }
  }

  nextAvailable(offset) {
    const offsetRow = floor(offset / 9);
    const offsetColumn = offset % 9;
    for (var row = offsetRow; row < 9; row++) {
      for (var column = offsetColumn; column < 9; column++) {
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

  display() {
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
        text(t, 100 + s * column, 100 + s * row);
      }

    }
  }
}