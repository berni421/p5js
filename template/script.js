let myFont;

function preload() {
    myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(myFont);
    background("black");
}

function draw() {
    noLoop();
}
