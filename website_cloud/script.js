// http://localhost/github/p5js/website_cloud/
var size;
var objectsPerRow;
var greyn;
var redn, bluen, greenn;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    objectsPerRow = 40;
    size = windowWidth / objectsPerRow;
    redn = random(1000, 2000);
    bluen = random(2000, 3000);
    greenn = random(3000, 4000);
    frameRate(10);
    noStroke();
    //noLoop();
}

function draw() {
    var fixZ = 0;
    var c1;

    background(100);
    pointLight(255, 255, 255, 0, -2 * height, 2 * (width + height));
    shininess(1000000);
    blendMode(REPLACE);
    rotateY(frameCount * 0.1);

    for (var x = -width / 2; x < width / 2; x = x + size) {
        for (var y = -height / 2; y < height / 2; y = y + size) {

            red = 255 * noise(redn);
            blue = 255 * noise(bluen);
            green = 255 * noise(greenn);
            c1 = color(red, blue, green, 200);

            push();
            translate(x, y, fixZ);
            specularMaterial(c1);
            plane(size * 1.5);
            pop();

            push();
            rotateY(PI);
            translate(x, y, fixZ);
            specularMaterial(c1);
            plane(size * 1.5);
            pop();

            redn += 0.5;
            bluen += 0.5;
            greenn += 0.5;
            fixZ += 0.001;
        }
    }
}
