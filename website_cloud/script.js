var size;
var rn = 100;
var bn = 200;
var gn = 300;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    size = windowWidth / 20;
    background(0);
    scale(size);
    noStroke();
    frameRate(10);
    //noLoop();
}

function draw() {
    background(0);
    //pointLight(150, 150, 150, 0, -2 * height, 2 * (width + height));
    //directionalLight(255, 255, 255, 0, height, width + height);
    ambientLight(255);
    rotateY(frameCount * 0.1);
    //rotateX(frameCount * 0.1);
    for (var x = -width / 2; x < width / 2; x = x + size) {
        for (var y = -height / 2; y < height / 2; y = y + size) {
            push();
            translate(x, y, 0);
            var red = 255 * noise(rn);
            var blue = 255 * noise(bn);
            var green = 255 * noise(gn);
            ambientMaterial(red, green, blue);
            //specularMaterial(red, green, blue);
            box(size);
            rn = rn + 0.1;
            bn = bn + 0.1;
            gn = gn + 0.1;
            pop();
        }

    }
}
