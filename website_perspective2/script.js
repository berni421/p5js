
var img;
var step = 200;
function preload() {
    img = loadImage('../images/rusty-side.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

}

function draw() {
    background(0);
    perspective(PI / 2, width / height);
    noStroke();
    texture(img);
    translate(-width, 0, 0);
    for (var i = 0; i < width * 2 / step; i++) {
        push();
        translate(step * i, 0, 0);
        rotateX(frameCount * -0.01);
        rotateY(frameCount * 0.01);
        rotateZ(frameCount * 0.01);
        plane(width / 1.1, height / 1.1, 24, 1, false);
        pop();
    }
    //exit(1);
}