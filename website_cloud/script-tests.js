function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(10);
    //noLoop();
}

function draw() {
    background(0);
    rotateY(frameCount * 0.01);

    pointLight(255, 255, 255, 0, -height, width + height);
    //shininess(50);
    //ambientLight(255);
    
    noStroke();

    //blendMode(ADD);    
    //blendMode(DARKEST);
    //blendMode(LIGHTEST);
    blendMode(DIFFERENCE);
    //blendMode(EXCLUSION);
    
    push();
    translate(-100, 0, 0);
    var c1 = color(255, 0, 0, 200);
    //ambientMaterial(c1);
    specularMaterial(c1);
    plane(400, 400);
    pop();

    push();
    translate(100, 0, 1);
    var c2 = color(0, 255, 0, 200);
    //ambientMaterial(c2);
    specularMaterial(c2);
    plane(400, 400);
    pop();
}
