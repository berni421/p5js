var size;
var objectsPerRow;
var greyn;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    objectsPerRow = 60;
    size = windowWidth / objectsPerRow;
    greyn = map(random(), 0, 1, 0, 1000);
    frameRate(10);
    noStroke();
    //noLoop();
}

function draw() {
    background(0);
    ambientLight(255);
    rotateY(frameCount * 0.1);
    for (var x = -width / 2; x < width / 2; x = x + size) {
        for (var y = -height / 2; y < height / 2; y = y + size) {
            push();
            translate(x, y, 0);
            grey = 255 * noise(greyn);
            ambientMaterial(grey);
            box(size);
            greyn = greyn + 0.1;
            pop();
        }
    }
}
