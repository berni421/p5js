let img;
function preload() {
    img = loadImage('../images/rusty.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
    background(0);
    //rotateZ(frameCount * 0.01);
    //rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    pointLight(255, 255, 255, 0, 0, width);
    noStroke();
    texture(img);
    ellipsoid(width / 3, width / 6, width / 3);
}