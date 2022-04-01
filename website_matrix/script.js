const fontSize = 64;
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
  pointLight("white", 0, height, 0);
  frameRate(2);
}

function draw() {
  background("black");
  cloud.display();
  cloud.update();
  camera(mouseX - width / 2, mouseY - height / 2, 0, 0, 0, 0, 0, 1, 0)
}