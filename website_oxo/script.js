let myFont;
let game;

function preload() {
    myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(myFont);
    game = new oxo();
    game.choose(); // computer goes fiest
    game.displayState();
}

function mouseClicked(event) {
    const valid = game.userChoice(mouseX - width / 2, mouseY - height / 2);
    if (valid) {
        let winner = game.checkWin();
        if (!winner) {
            let choice = game.choose();
        }
    }
    winner = game.checkWin();
    if (!winner) {
        game.displayState();
    } else {
        game.displayWin(winner);
        stop();
    }
    if (game.checkDraw()) {
        game.displayDraw();
        stop();
    }
}

function draw() {
    noLoop();
}