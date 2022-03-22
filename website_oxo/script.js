function preload() {
}

let game;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background("black");
    game = new oxo();
    game.displayGrid();
    game.choose(); // computer goes fiest
    game.displayState();
}

function mouseClicked(event) {
    game.set(mouseX, mouseY);
    game.choose();
    game.displayState();
}

function draw() {
    noLoop();
}