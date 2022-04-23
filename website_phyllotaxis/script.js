// let myFont; // for WEBGL text
let play; // to control play or pause (true or false)
let n = 0;
let c = 6;
let start = 0;
//
// function preload() {
//   myFont = loadFont("../fonts/DejaVuSerif.ttf");
// }
function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(windowWidth, windowHeight);
  // textFont(myFont);
  background("black");
  play = false;
  angleMode(DEGREES);
  colorMode(HSB);
}

function draw() {
  if (false == play) {
    Stop();
  } else {
    Play();
  }
}

function Play() {
  background(0);
  translate(width / 2, height / 2);
  rotate(n * 0.3);
  for (var i = 0; i < n; i++) {
    var a = i * 137.5;
    var r = c * sqrt(i);
    var x = r * cos(a);
    var y = r * sin(a);
    var hu = sin(start + i * 0.1);
    hu = map(hu, -1, 1, 0, 360);
    fill(hu, 255, 255);
    noStroke();
    ellipse(x, y, c + 2, c + 2);
  }
  n += 5;
  start += 0.1;
  if (x > width / 2) {
    n = 0
  }
  if (y > height / 2) {
    n = 0
  }
}

function Stop() {
  play = false;
  noLoop();
  push();
  translate(width / 2, width / 2);
  fill("red");
  const pixelColour = get(width / 2, height / 2);
  if (pixelColour[0] > 200) {
    fill("blue");
  }
  noStroke();
  let s = (width + height) / 25;
  triangle(-s / 2, -s, s / 2, 0, -s / 2, s);
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