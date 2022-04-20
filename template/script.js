let myFont; // for WEBGL text
let play; // to control play or pause (true or false)
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
  } else {
    Play();
  }
}

function Play() {}

function Stop() {
  play = false;
  noLoop();
  push();
  translate(0, 0, 0);
  fill("red");
  noStroke();
  beginShape();
  let s = (width + height) / 25;
  vertex(-s / 2, -s, 1);
  vertex(s / 2, 0, 1);
  vertex(-s / 2, s, 1);
  endShape(CLOSE);
  pop();
}

function mousePressed() {
  play = !play;
  if (play) {
    loop();
  }
}