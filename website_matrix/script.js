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
  camera(0, 0, width / 2, 0, 0, 0, 0, 1, 0)
  // frameRate(24);
  play = false;
}

function draw() {
  rotateY(frameCount * 0.01);
  background("black");
  cloud.display();
  cloud.update();
  if (false == play) {
    Stop();
  }
}

function Stop() {
  play = false;
  noLoop();
  push();
  rotateY(-frameCount * 0.01);
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