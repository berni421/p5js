class oxo {
    constructor() {
        this.state = [];
        for (let row = 0; row < 3; row++) {
            this.state[row] = [];
            for (let column = 0; column < 3; column++) {
                let node = {};
                node.value = " ";
                let heightSize = height / 3;
                let widthSize = width / 3;
                node.upperLeftX = (column - 1) * widthSize - widthSize / 2 + width / 60;
                node.upperLeftY = (row - 1) * heightSize - heightSize / 2 + height / 60;
                node.widthSize = widthSize - width / 30;
                node.heightSize = heightSize - height / 30;
                this.state[row][column] = node;
            }
        }
        this.gridEmpty = true;
    }

    userChoice(mX, mY) {
        print(mX, mY);
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let node = this.state[row][column];
                let checkX = (mX > node.upperLeftX && mX < node.upperLeftX + node.widthSize);
                let checkY = (mY > node.upperLeftY && mY < node.upperLeftY + node.heightSize);
                if (checkX && checkY) {
                    if (" " == node.value) {
                        node.value = "O";
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    }

    adjacent(row, column) {
        for (let tryRow = row - 1; tryRow <= row + 1; tryRow++) {
            for (let tryColumn = column - 1; tryColumn <= column + 1; tryColumn++) {
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

    lineDirection(row, column) {
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

    checkNext(row, column) {
        // check row, column is valid
        const checkRow = (row >= 0 && row < 3);
        const checkColumn = (column >= 0 && column < 3);
        return (checkRow && checkColumn)
    }

    checkWin() {
        // check for lines
        const pieces = ["X", "O"];
        for (let i = 0; i < pieces.length; i++) {
            let choices = pieces[i] +
                pieces[i] +
                pieces[i];
            // check diaganol from top left to bottom right
            let values = this.state[0][0].value +
                this.state[1][1].value +
                this.state[2][2].value
            if (choices == values) {
                print(choices, " wins");
                return pieces[i];
            }
            // check diagonol from top right to bottom left
            values = this.state[2][0].value +
                this.state[1][1].value +
                this.state[0][2].value
            if (choices == values) {
                print(choices, " wins");
                return pieces[i];
            }
            // check rows
            for (let row = 0; row < 3; row++) {
                values = "";
                for (let column = 0; column < 3; column++) {
                    values = values + this.state[row][column].value;
                }
                if (choices == values) {
                    print(choices, " wins");
                    return pieces[i];
                }
            }
            // check columns
            for (let column = 0; column < 3; column++) {
                values = "";
                for (let row = 0; row < 3; row++) {
                    values = values + this.state[row][column].value;
                }
                print(values);
                if (choices == values) {
                    print(pieces[i], " wins");
                    return pieces[i];
                }
            }
        }
        return false;
    }

    checkDraw() {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let value = this.state[row][column].value;
                if (" " == value) {
                    return false;
                }
            }
        }
        return true;
    }

    choose() {
        // find a line of two "X" make three
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let value = this.state[row][column].value;
                if ("X" == value) {
                    // now find direction of an adjacent "X"
                    let direction = this.lineDirection(row, column);
                    if (false != direction) {
                        // now find final "X" in that direction
                        let { row: directionRow, column: directionColumn } = direction;
                        let completeRow = row + 2 * directionRow;
                        let completeColumn = column + 2 * directionColumn;
                        // check final row, column valid, assign final "X"
                        if (this.checkNext(completeRow, completeColumn)) {
                            let valueNext = this.state[completeRow][completeColumn].value;
                            if (" " == valueNext) {
                                this.state[completeRow][completeColumn].value = "X";
                                return true;
                            }
                        }
                    }
                }
            }
        }

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

        // Choose a random start position
        if (this.gridEmpty) {
            this.gridEmpty = false;
            let row = floor(random(2.99));
            let column = floor(random(2.99));
            this.state[row][column].value = "X";
            return true;
        }

        print("Choose failed");
        return false;
    }

    displayWin(winner) {
        background("black");
        this.displayGrid();
        this.displayState();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill("yellow");
        let y = this.state[1][1].heightSize / 4;
        text(winner + " is the winner", 0, -y);
    }

    displayDraw() {
        background("black");
        this.displayGrid();
        this.displayState();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill("red");
        let y = this.state[1][1].heightSize / 4;
        text("draw", 0, -y);
    }

    displayState() {
        background("black");
        this.displayGrid();
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let mark = this.state[row][column].value;
                this.displayMark(mark, row, column);
            }
        }
        //this.dumpState();
    }

    displayGrid() {
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

    displayMark(type, row, column) {
        let node = this.state[row][column];
        let xPosition = node.upperLeftX;
        let yPosttion = node.upperLeftY;
        let heightSize = node.heightSize;
        let widthSize = node.widthSize;
        push();
        translate(xPosition, yPosttion, 0);
        stroke("white");
        strokeWeight(8);
        let point1 = { x: 0, y: 0, z: 0 };
        let point2 = { x: widthSize, y: 0, z: 0 };
        let point3 = { x: 0, y: heightSize, z: 0 };
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

    dumpState() {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let node = this.state[row][column];
                push();
                translate(node.upperLeftX, node.upperLeftY, 0);
                strokeWeight(16);
                stroke("red");
                point(0, 0, 0);
                text(row + "," + column + ":" + floor(node.upperLeftX) + "," + floor(node.upperLeftY), 0, 0, 0)
                pop();
            }
        }
    }
}