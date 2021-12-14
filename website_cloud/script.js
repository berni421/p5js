var size;
var objectsPerRow;
var greyn;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    objectsPerRow = windowWidth;
    size = windowWidth / objectsPerRow;
    greyn = random(1000);
    //frameRate(1);
    noStroke();
    noLoop();
}

function draw() {
    //background(0);
    ambientLight(255);
    //blendMode(ADD);
    //rotateX(frameCount * 0.1);
    for (var x = -width / 2; x < width / 2; x = x + size) {
        for (var y = -height / 2; y < height / 2; y = y + size) {
            push();
            translate(x, y, 0);
            grey = 255 * noise(greyn);
            ambientMaterial(grey, 200);
            sphere(size);
            greyn = greyn + 0.6;
            pop();
        }
    }
}
