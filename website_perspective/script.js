let img;
function preload() {
    img = loadImage('../images/rusty-side.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

}

function draw() {
    background(0);

    perspective(PI / 3, width / height);
    //rotateZ(frameCount * 0.01);
    rotateX(frameCount * -0.01);
    rotateY(frameCount * -0.01);
    noStroke();
    texture(img);
    cylinder(width / 4, height / 1.5, 24, 1, false, false);
}