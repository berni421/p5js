let myFont; // for WEBGL text
let play; // to control play or pause (true or false)
//
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
    stop();
  } else {
    resume();
  }
}

function resume() {
  //
}

function stop() {
  play = false;
  noLoop();
  push();
  fill("red");
  const pixelColour = get(width / 2, height / 2, 0);
  if (pixelColour[0] > 200) {
    fill("blue");
  }
  noStroke();
  let s = (width + height) / 25;
  translate(width / 2, height / 4);
  triangle(-s / 2, -s, s / 2, 0, -s / 2, s);
  // beginShape();
  // vertex(-s / 2, -s, 1);
  // vertex(s / 2, 0, 1);
  // vertex(-s / 2, s, 1);
  // endShape(CLOSE);
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