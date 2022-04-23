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

function spiral() {
  const maxAngle = 512;
  const aSpeed = 0.2;
  var scalar = 1;
  var scale = 1;
  const sSpeed = 0.01;
  var x, y;
  stroke("white");
  for (var angle = 0; angle < maxAngle; angle += aSpeed) {
    x = cos(angle) * scalar;
    y = sin(angle) * scalar;
    strokeWeight(scale);
    point(x, y, 0);
    scalar += aSpeed;
    scale += sSpeed;
  }
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
  const frameFix = 0.01;
  rotateX(frameCount * frameFix);
  rotateY(frameCount * frameFix);
  rotateZ(frameCount * frameFix);
  spiral();
}

function Stop() {
  play = false;
  noLoop();
  push();
  translate(0, 0, 0);
  fill("red");
  const pixelColour = get(width / 2, height / 2);
  if (pixelColour[0] > 200) {
    fill("blue");
  }
  noStroke();
  beginShape();
  let s = (width + height) / 25;
  vertex(-s / 2, -s, 1);
  vertex(s / 2, 0, 1);
  vertex(-s / 2, s, 1);
  endShape(CLOSE);
  pop();
}
//
function mousePressed() {
  return touchStarted();
}
//
function touchStarted() {
  play = !play;
  if (play) {
    loop();
  }
  return false;
}