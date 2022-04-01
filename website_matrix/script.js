const fontSize = 36;
const dY = fontSize * .75;
let fontIpag;
let fontDejaVuSerif;
let cloud;
//
function preload() {
  fontIpag = loadFont("../fonts/ipag0208_for_legacy_compatibility.ttf");
  fontDejaVuSerif = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("black");
  cloud = new RainCloud();
  pointLight("white", 0, height, width);
  camera(0, 0, width / 2, 0, 0, 0, 0, 1, 0)
  frameRate(24);
}

function draw() {
  rotateY(frameCount * 0.01);
  background("black");
  cloud.display();
  cloud.update();
}