var myGrid; // the Grid

function preload() { }

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill("white");
  background("black");
  myGrid = new Grid();
  myGrid.displayInitCells();
  myGrid.displaySolveButton();
}

function draw() {
  noLoop();
}