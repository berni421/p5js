let fontSize;
let dY;
let fontIpag;
let fontDejaVuSerif;
let cloud;
let play;
//
function preload() {
  fontIpag = loadFont("../fonts/ipag0208_for_legacy_compatibility.ttf");
  fontDejaVuSerif = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("black");
  fontSize = (width + height) / 32;
  dY = fontSize * .75;
  cloud = new RainCloud();
  pointLight("white", 0, height, width);
  camera(0, 0, (height + width) / 2, 0, 0, 0, 0, 1, 0)
  // frameRate(24);
  play = false;
}

function draw() {
  if (false == play) {
    Stop();
  } else {
    Play();
  }
}

function Play() {
  background("black");
  rotateY(frameCount * 0.01);
  cloud.display();
  cloud.update();
}

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
  return false;
}
//
function touchStarted() {
  return mousePressed();
}