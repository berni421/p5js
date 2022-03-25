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
        winner = game.checkWin();
        if (!winner) {
            if (game.choose()) {
                game.displayState();
            } else {
                game.displayDraw();
                stop();
            }
        } else {
            game.displayWin(winner);
            stop();
        }
    }
}

function draw() {
    noLoop();
}