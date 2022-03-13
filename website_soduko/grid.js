class Grid {
  constructor() {
    this.grid = [];
    this.avail = [];
    this.cells = [];
    for (var row = 0; row < 9; row++) {
      this.grid[row] = [];
      this.cells[row] = [];
      for (var column = 0; column < 9; column++) {
        const button = createButton(" ");
        button.hide();
        this.grid[row][column] = {
          button: button,
          value: null
        };
        const buttonCell = createButton(" ");
        buttonCell.hide();
        this.cells[row][column] = {
          button: buttonCell,
          value: null
        };
      }
    }
    for (var n = 0; n < 9; n++) {
      this.avail.push(n + 1);
    }
  }

  prepGrid() {
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        this.grid[row][column].value = this.cells[row][column].value;
      }
    }
  }

  displaySolveButton() {
    const s = 24;
    textSize(s * 2);
    const button = createButton();
    button.html("SOLVE ME");
    button.position(8 * s, 12 * s);
    button.size(AUTO, s);
    button.mousePressed(() => this.solveButton(this));
  }

  cloneGrid(g) {
    const n = [];
    for (var row = 0; row < 9; row++) {
      n[row] = [];
      for (var column = 0; column < 9; column++) {
        n[row][column] = {
          button: g[row][column].button,
          value: g[row][column].value
        };
      }
    }
    return n;
  }

  cloneAvail(a) {
    const n = [];
    for (var i = 0; i < 9; i++) {
      n[i] = a[i];
    }
    return n;
  }

  solveButton() {
    this.prepGrid();
    var finished = false;
    while (!finished) {
      const sg = this.cloneGrid(this.grid);
      const sa = this.cloneAvail(this.avail);
      if (this.solve(128)) {
        finished = true;
      } else {
        //backtrack
        this.displayResultCells();
        this.grid = this.cloneGrid(sg);
        this.avail = this.cloneAvail(sa);
        //const skipped = this.makeChoice();
      }
    }
    background("black");
    this.displayTitles();
    this.displayInitCells();
    if (finished) {
      this.displayResultCells();
    } else {
      this.displayFailed();
    }
  }

  solve(n) {
    if (n < 0) {
      // not finnished in steps available, backtrack
      return false;
    }
    const index = this.nextAvailable();
    if (index == null) {
      //finished
      return true;
    }
    var choiceMade = false;
    var value;
    for (var i = 0; i < 9; i++) {
      value = this.makeChoice();
      if (this.isValid(value, index)) {
        this.grid[index.row][index.column].value = value;
        choiceMade = true;
        break;
      }
    }
    if (choiceMade) {
      return this.solve(n - 1);
    } else {
      // backtrack
      print("backtrack");
      return false;
    }
  }

  makeChoice() {
    const choice = this.avail.shift();
    this.avail.push(choice);
    return choice;
  }

  nextAvailable() {
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        const value = this.grid[row][column].value;
        if (value == null) {
          const index = {
            row: row,
            column: column
          };
          return index;
        }
      }
    }
    // finished
    return null;
  }

  isValid(value, index) {
    const tileRow = 3 * floor(index.row / 3);
    const tileColumn = 3 * floor(index.column / 3);
    for (var row = tileRow; row < tileRow + 3; row++) {
      for (var column = tileColumn; column < tileColumn + 3; column++) {
        if (this.grid[row][column].value == value) {
          return false;
        }
      }
    }
    for (var column = 0; column < 9; column++) {
      if (this.grid[index.row][column].value == value) {
        return false;
      }
    }
    for (var row = 0; row < 9; row++) {
      if (this.grid[row][index.column].value == value) {
        return false;
      }
    }
    return true;
  }

  updateCell(cell) {
    var {
      row,
      column
    } = cell;
    var value = this.cells[row][column].value;
    if (value == null) {
      value = 1
    } else if (value == 9) {
      value = null;
    } else {
      value++;
    }
    this.cells[row][column].value = value;
    const button = this.cells[row][column].button;
    button.html(value);
  }

  displayTitles() {
    const s = 24
    textSize(s);
    text("Initial Grid", s * 0, s * 1);
    text("Solved Grid", s * 12, s * 1);
    text("click the initial grid cells to load initial pattern", s * 0, s * 14);
  }

  displayInitCells() {
    const s = 24;
    textSize(s);
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        var valueText = this.cells[row][column].value;
        if (valueText == null) {
          valueText = " ";
        }
        const button = this.cells[row][column].button;
        button.html(valueText);
        button.position(column * s, 2 * s + row * s);
        button.size(s, s);
        const cellInfo = {
          me: this,
          row: row,
          column: column
        };
        button.mousePressed(() => this.updateCell(cellInfo));
        button.show();
      }
    }
  }

  displayResultCells() {
    const s = 24;
    textSize(s);
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        const value = this.grid[row][column].value;
        const button = this.grid[row][column].button;
        button.html(value);
        button.position(12 * s + column * s, 2 * s + row * s);
        button.size(s, s);
        button.show();
      }
    }
  }

  displayFailed() {
    const s = 24;
    textSize(s * 2);
    text("Unsolved!", s * 24, s * 6);
    //hide result buttons
    for (var row = 0; row < 9; row++) {
      for (var column = 0; column < 9; column++) {
        const button = this.grid[row][column].button;
        //button.hide();
      }
    }
    this.displayResultCells();
  }
}