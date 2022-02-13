var ground;
var sky;
var bird;
var score;

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ground = new Ground();
  sky = new Clouds()
  bird = new Bird();
  score = new Score();
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
  score.display();
  score.update();
  score.intersectCloud() || score.intersectGround();
}

function touchStarted() {
  bird.up();
}

function keyPressed() {
  if (key == ' ') {
    bird.up();
  }
}