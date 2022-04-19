let myFont;
let play;

function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  background("black");
  play = false;
}

function draw() {
  if (false == play) {
    Stop();
  }
}

function Stop() {
  play = false;
  noLoop();
  push();
  rotateY(frameCount * 0.01);
  fill("red");
  let s = (width + height) / 50;
  triangle(-s * 4, -s * 2, -s, 0, -s * 4, s * 2);
  pop();
}

function mousePressed() {
  play = !play;
  if (play) {
    loop();
  }
}