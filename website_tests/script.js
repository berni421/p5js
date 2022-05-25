let myFont; // for WEBGL text
const fontSize = 36;

function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  textSize(fontSize)
  fill("black");
  x = -width / 2;
  text("width: " + width, x, 0);
  text("height: " + height, x, fontSize);
}

function draw() {
  noLoop();
}