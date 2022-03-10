var g; // the Grid

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  fill("white");
  g = new Grid();

  // set some values
  g.grid[0][0] = 9;

  g.display(1);

  g.solve();

  print(g.grid);

  g.display(11);
}

function draw() {
  noLoop();
}