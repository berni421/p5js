let img;
function preload() {
    img = loadImage('../images/rusty.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
    background(0);
    rotateZ(frameCount * 0.01);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    //pass image as texture
    texture(img);
    box(width / 2);
}