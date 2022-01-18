var myFont;

function preload() {
    myFont = loadFont('../fonts/DejaVuSerif.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    ambientLight('white'); // white light
    frameRate(1);
    textFont(myFont);
    textAlign(CENTER, CENTER);
    textSize(height / 4);
    fill('white')
}

function draw() {
    background(0);

    var time = hour() + ":" + minute() + ":" + second();
    var date = day() + "/" + month() + "/" + year();

    text(time, 0, - height / 4);
    text(date, 0, + height / 4);
}