// http://localhost/github/p5js/website_water/
var size;
var objectsPerRow;
var bluen;
var undulate;
var fix;
var fixinc;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    objectsPerRow = 64;
    size = windowWidth / objectsPerRow;
    bluen = random(1000, 2000);
    undulate = 16;
    fix = 0;
    fixinc = 0.06;
    frameRate(10);

    //noLoop();
}

function draw() {

    skyBlue = color(100, 100, 200);
    background(skyBlue);
    pointLight(255, 255, 255, 0, -2 * height, 2 * (width + height));
    shininess(1000000);
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
            sm = color(150, 150, blue, 150);
            specularMaterial(sm);
            bluen += 0.5;
            plane(size * 1.5);
            pop();

            fix += fixinc;
            if (fix > undulate || fix < -undulate) {
                fixinc = -fixinc;
            }
        }
    }
}
