var ground;
var sky;

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ground = new Ground();
  sky = new Clouds()
  frameRate(10);
}

function draw() {
  background("black");
  ground.display();
  ground.update();
  sky.display();
  sky.update();
}