class oxo {
    constructor() {
        this.state = [];
        for (let row = 0; row < 3; row++) {
            this.state[row] = [];
            for (let column = 0; column < 3; column++) {
                let node = {};
                node.value = " ";
                let heightSize = height / 7;
                let widthSize = width / 7;
                node.upperLeftX = 2.3 * widthSize * (row - 1) - widthSize / 2 + width / 2;
                node.upperLeftY = 2.4 * heightSize * (column - 1) - heightSize / 2 + height / 2;
                node.widthSize = widthSize;
                node.heightSize = heightSize;
                this.state[row].push(node);
            }
        }
    }

    set(mX, mY) {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let node = this.state[row][column];
                let checkX = (mX > node.upperLeftX && mX < node.upperLeftX + node.widthSize);
                let checkY = (mY > node.upperLeftY && mY < node.upperLeftY + node.heightSize);
                if (checkX && checkY) {
                    node.value = "O";
                }
            }
        }
    }

    adjacent(row, column) {
        for (let tryRow = row - 1; tryRow <= row + 1; tryRow++) {
            for (let tryColumn = column - 1; tryColumn < column + 1; tryColumn++) {
                let checkRow = (tryRow >= 0 && tryRow < 3);
                let checkColumn = (tryColumn >= 0 && tryColumn < 3);
                if (checkRow && checkColumn) {
                    let value = this.state[tryRow][tryColumn].value;
                    if (" " == value) {
                        return { row: tryRow, column: tryColumn };
                    }
                }
            }
        }
        return false;
    }

    lineChoice(row, column) {
        for (let tryRow = row - 1; tryRow <= row + 1; tryRow++) {
            for (let tryColumn = column - 1; tryColumn < column + 1; tryColumn++) {
                let checkRow = (tryRow >= 0 && tryRow < 3);
                let checkColumn = (tryColumn >= 0 && tryColumn < 3);
                if (checkRow && checkColumn) {
                    let value = this.state[tryRow][tryColumn].value;
                    if ("X" == value) {
                        if (tryRow == row && tryColumn > 0 && tryColumn == column - 1) {
                            return { row: 0, column: -1 }; // left
                        } else if (tryRow == row && tryColumn < 2 && tryColumn == column + 1) {
                            return { row: 0, column: 1 };  // right
                        } else if (tryColumn == column && tryRow < 2 && tryRow == row - 1) {
                            return { row: -1, column: 0 }; // up
                        } else if (tryColumn == column && tryRow < 2 && tryRow == row + 1) {
                            return { row: 1, column: 0 };  // down
                        } else if (tryRow > 0 && tryRow == row - 1 && tryColumn > 0 && tryColumn == column - 1) {
                            return { row: 1, column: 1 };  // left up
                        } else if (tryRow > 0 && tryRow == row + 1 && tryColumn > 0 && tryColumn == column + 1) {
                            return { row: -1, column: -1 };  // left down
                        } else if (tryRow > 0 && tryRow == row - 1 && tryColumn < 2 && tryColumn == column + 1) {
                            return { row: 1, column: 1 };  // right up
                        } else if (tryRow > 0 && tryRow == row - 1 && tryColumn > 0 && tryColumn == column - 1) {
                            return { row: -1, column: -1 };  // right down
                        }
                    }
                }
            }
        }
        return false;
    }

    lineComplete(row, column, direction) {
        // check direction applied to row, column is valid
        let { dX, dY } = direction;
        nextRow = row + dX;
        nextColum = row + dY;
        checkRow = (nextRow >= 0 && nextRow < 3);
        checkColumn = (nextColumn >= 0 && nextColumn < 3);
        if (checkRow && checkColumn) {
            return { row: checkRow, column: checkColumn };
        }
        return false;
    }

    start() {
        // Choose a random start position
        let row = floor(random(2.99));
        let column = floor(random(2.99));
        this.state[row][column].value = "X";
    }

    choose() {
        // find an "X", make a line of two
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let value = this.state[row][column].value;
                if ("X" == value) {
                    // chose an adjacent empty node
                    let choice = this.adjacent(row, column);
                    if (false != choice) {
                        let { row: rowAdjacent, column: columnAdjacent } = choice;
                        let value = this.state[rowAdjacent][columnAdjacent].value;
                        if (" " == value) {
                            this.state[rowAdjacent][columnAdjacent].value = "X";
                            return true;
                        }
                    }
                }
            }
        }

        // find a line of two "X" make three
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let value = this.state[row][column].value;
                if ("X" == value) {
                    let choice = this.lineChoice(row, column);
                    if (false != choice) {
                        let { row: choiceRow, column: choiceColumn, direction: choiceDirection } = choice;
                        if (!false == choice) {
                            let choice = this.lineComplete(choiceRow, choiceColumn, choiceDirection);
                            let value = this.state[choiceRow][choiceColumn].value;
                            if (" " == value) {
                                this.state[choiceRow][choiceColumn].value = "X";
                                this.displayWin();
                                return true;
                            }
                        }
                    }
                }
            }
        }

        print("choose failed");
        return false;
    }

    displayWin() {
        background("black");
        this.displayGrid();
        this.displayState();
        text("Winner", 0, 0);
    }

    displayState() {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let mark = this.state[row][column].value;
                this.displayMark(mark, row, column);
            }
        }
    }

    displayGrid() {
        background("black");
        // horizontal lines
        let heightSize = height / 3;
        for (let row = -0.5; row <= 0.5; row++) {
            stroke("white");
            strokeWeight(8);
            let point1 = { x: -width / 2, y: row * heightSize, z: 0 };
            let point2 = { x: width / 2, y: row * heightSize, z: 0 };
            line(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z);
        }
        // vertical lines
        let widthSize = width / 3;
        for (let column = -0.5; column <= 0.5; column++) {
            stroke("white");
            strokeWeight(8);
            let point1 = { x: column * widthSize, y: -height / 2, z: 0 };
            let point2 = { x: column * widthSize, y: height / 2, z: 0 };
            line(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z);
        }
    }

    displayMark(type, x, y) {
        let heightSize = height / 7;
        let widthSize = width / 7;
        let xPosition = 2.3 * widthSize * (x - 1);
        let yPosttion = 2.4 * heightSize * (y - 1);
        push();
        translate(xPosition, yPosttion, 0);
        stroke("white");
        strokeWeight(8);
        let point1 = { x: -widthSize, y: -heightSize, z: 0 };
        let point2 = { x: widthSize, y: -heightSize, z: 0 };
        let point3 = { x: -widthSize, y: heightSize, z: 0 };
        let point4 = { x: widthSize, y: heightSize, z: 0 };
        if (type == "X") {
            line(point1.x, point1.y, point1.z, point4.x, point4.y, point4.z);
            line(point2.x, point2.y, point2.z, point3.x, point3.y, point3.z);
        }
        if (type == "O") {
            line(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z);
            line(point2.x, point2.y, point2.z, point4.x, point4.y, point4.z);
            line(point4.x, point4.y, point4.z, point3.x, point3.y, point3.z);
            line(point3.x, point3.y, point3.z, point1.x, point1.y, point1.z);
        }
        pop();
    }
}