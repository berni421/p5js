function preload() {
}

let game;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    game = new oxo();
    game.displayGrid();
    game.start(); // computer goes fiest
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