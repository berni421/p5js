var g; // the Grid

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  fill("white");
  g = new Grid();
  g.solve();
  print(g.grid);
  print(g.avail);
  g.display();
}

function draw() {
  noLoop();
}