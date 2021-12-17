// http://localhost/github/p5js/website_water/
var size;
var objectsPerRow;
var bluen;
var undulateZ;
var fix;
var fixinc;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    objectsPerRow = 64;
    size = windowWidth / objectsPerRow;
    bluen = random(1000, 2000);
    undulateZ = 16;
    fix = 0;
    fixinc = 0.06;
    frameRate(10);

    //noLoop();
}

function draw() {

    background(0, 0, 64);
    pointLight(255, 255, 255, 0, -2 * height, 2 * (width + height));
    shininess(1000000);
    blendMode(ADD);
    noStroke();

    // Sun
    push();
    translate(0, -height / 2, 0);
    pointLight(255, 255, 255, 0, height, 2 * (width + height));
    specularMaterial(color(255, 204, 0));
    sphere(width / 10);
    pop();

    // land
    rotateX(PI / 4);
    for (var x = -width * 1.25; x <= width * 1.25; x = x + size) {
        for (var y = -height / 2; y <= height / 2; y = y + size) {

            push();
            translate(x, y + fix, 0);
            blue = 255 * noise(bluen);
            specularMaterial(color(0, 0, blue, 200));
            bluen += 0.5;
            plane(size * 1.5);
            pop();

            fix += fixinc;
            if (fix > undulateZ || fix < -undulateZ) {
                fixinc = -fixinc;
            }
        }
    }
}
