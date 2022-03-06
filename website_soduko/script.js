function preload() {}

var g;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  g = new Grid();
  g.add();
  print(g);
}

function draw() {
  noLoop();
}