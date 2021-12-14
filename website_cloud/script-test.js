function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    //noLoop();
}

function draw() {
    background(0);
    rotateY(frameCount * 0.01);

    pointLight(255, 255, 255, 0, -2 * height, width + height);
    //ambientLight(255);
    blendMode(SCREEN);
    noStroke();
    shininess(50);

    push();
    translate(-100, 0, 0);
    var c1 = color(255, 0, 0, 200);
    //ambientMaterial(c1);
    specularMaterial(c1);
    sphere(200);
    pop();

    push();
    translate(100, 0, 0);
    var c2 = color(0, 255, 0, 200);
    //ambientMaterial(c2);
    specularMaterial(c2);
    sphere(200);
    pop();

}