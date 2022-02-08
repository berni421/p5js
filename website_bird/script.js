var ground;
var sky;
var bird;

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ground = new Ground();
  sky = new Clouds()
  bird = new Bird();
  frameRate(10);
}

function draw() {
  background("black");
  ground.display();
  ground.update();
  sky.display();
  sky.update();
  bird.display();
  bird.update();

  if (touches.length > 0) {
    bird.up;
  }
}

function keyPressed() {
  if (key == ' ') {
    bird.up();
  }
}