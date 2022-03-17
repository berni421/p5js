class Grid {
  constructor() {
    this.grid = [];
    this.avail = [];
    this.cells = [];
    for (let row = 0; row < 9; row++) {
      this.grid[row] = [];
      this.cells[row] = [];
      for (let column = 0; column < 9; column++) {
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
    for (let n = 0; n < 9; n++) {
      this.avail.push(n + 1);
    }
    this.textSize = 24;
    const progress = createDiv('progress')
    progress.size("1000", "10");
    progress.position(this.textSize * 0, this.textSize * 12.2);
    progress.html('<progress id="file"></progress>');
    progress.hide();
    this.progress = progress;
  }

  prepGrid() {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        this.grid[row][column].value = this.cells[row][column].value;
      }
    }
  }


  cloneGrid(g) {
    const n = [];
    for (let row = 0; row < 9; row++) {
      n[row] = [];
      for (let column = 0; column < 9; column++) {
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
    for (let i = 0; i < 9; i++) {
      n[i] = a[i];
    }
    return n;
  }

  async doSolve(me) {
    async function wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
    let backtracks = 0;
    let finished = false;
    while (!finished) {
      const sg = me.cloneGrid(me.grid);
      const sa = me.cloneAvail(me.avail);
      if (me.solve(8 * 8 * 10)) {
        finished = true;
      } else {
        //backtrack
        print("backtrack:", backtracks++);
        me.logResultCells();
        me.grid = me.cloneGrid(sg);
        me.avail = me.cloneAvail(sa);
        const skipped = me.makeChoice();
        print("pause for screen update");
        await wait(500);
      }
    }
    background("black");
    me.progress.hide();
    me.solveButton.show();
    me.displayInitCells();
    if (finished) {
      me.displayResultCells();
    } else {
      me.displayFailed();
    }
    print("Solved");
  }

  solveButtonPressed() {
    background("black");
    this.solveButton.hide();
    this.progress.show();
    //hide result buttons
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        this.grid[row][column].button.hide();
      }
    }
    this.displayInitCells();
    this.prepGrid();
    this.doSolve(this);
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
    let choiceMade = false;
    let value;
    for (let i = 0; i < 9; i++) {
      value = this.makeChoice();
      if (this.isValid(this.grid, value, index)) {
        this.grid[index.row][index.column].value = value;
        choiceMade = true;
        break;
      }
    }
    if (choiceMade) {
      return this.solve(n - 1);
    } else {
      // backtrack
      //print("backtrack");
      return false;
    }
  }

  makeChoice() {
    const choice = this.avail.shift();
    this.avail.push(choice);
    return choice;
  }

  nextAvailable() {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
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

  isValid(grid, value, index) {
    const tileRow = 3 * floor(index.row / 3);
    const tileColumn = 3 * floor(index.column / 3);
    for (let row = tileRow; row < tileRow + 3; row++) {
      for (let column = tileColumn; column < tileColumn + 3; column++) {
        if (grid[row][column].value == value) {
          return false;
        }
      }
    }
    for (let column = 0; column < 9; column++) {
      if (grid[index.row][column].value == value) {
        return false;
      }
    }
    for (let row = 0; row < 9; row++) {
      if (grid[row][index.column].value == value) {
        return false;
      }
    }
    return true;
  }

  updateCell(cell) {
    let {
      row,
      column
    } = cell;
    let value = this.cells[row][column].value;
    if (value == null) {
      value = 1
    } else if (value == 9) {
      value = null;
    } else {
      value++;
    }
    const index = {
      row: row,
      column: column
    };
    while (!this.isValid(this.cells, value, index)) {
      //advance to next value
      if (value == 9) {
        value = null;
      } else {
        value++;
      }
    }
    this.cells[row][column].value = value;
    this.cells[row][column].button.html(value);
  }

  displayInitCells() {
    const s = this.textSize;
    textSize(s);
    text("Initial Grid", s * 0, s * 1);
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        let valueText = this.cells[row][column].value;
        if (valueText == null) {
          valueText = " ";
        }
        const button = this.cells[row][column].button;
        button.html(valueText);
        button.position(column * s, 2 * s + row * s);
        button.size(s, s);
        const cellInfo = {
          row: row,
          column: column
        };
        button.mousePressed(() => this.updateCell(cellInfo));
        button.show();
      }
    }
  }

  displayResultCells() {
    const s = this.textSize;
    textSize(s);
    text("Solved Grid", s * 0, s * 15);
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const value = this.grid[row][column].value;
        const button = this.grid[row][column].button;
        button.html(value);
        button.position(column * s, 16 * s + row * s);
        button.size(s, s);
        button.show();
      }
    }
  }

  logResultCells() {
    let rowText;
    let value;
    for (let row = 0; row < 9; row++) {
      rowText = row + ": ";
      for (let column = 0; column < 9; column++) {
        value = this.grid[row][column].value;
        if (value == null) {
          value = " "
        }
        rowText = rowText + value;
      }
      print(rowText);
    }
  }

  displayFailed() {
    const s = this.textSize;
    textSize(s * 2);
    text("Unsolved!", s * 0, s * 15);
    //hide result buttons
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        this.grid[row][column].button.hide();
      }
    }
  }

  displaySolveButton() {
    const s = this.textSize;
    textSize(s * 2);
    const button = createButton();
    button.html("SOLVE ME");
    button.position(0 * s, 12 * s);
    button.size(s * 9, s);
    button.mousePressed(() => this.solveButtonPressed(this));
    this.solveButton = button;
  }
}