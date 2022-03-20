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
        print(mX, mY);
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

    choose() {
        this.state[1][1].value = "X";
    };


    displayState() {
        this.displayGrid();
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                let mark = this.state[row][column].value;
                this.displayMark(mark, row, column);
            }
        }
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