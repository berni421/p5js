var img;
var speed = 0.01;

function preload() {
  img = loadImage('../images/rusty.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  texture(img);
}

function draw() {
  background("black");
  rotateX(frameCount * speed);
  rotateY(frameCount * speed);
  rotateZ(frameCount * speed);
  noStroke();
  box(height * 3);
}