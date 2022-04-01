let myFont;

function preload() {
  // myFont = loadFont("../fonts/DejaVuSerif.ttf");
  myFont = loadFont("../fonts/ipag0208_for_legacy_compatibility.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  background("black");
  //display codes
  let s = 24;
  textSize(s);
  fill("green");
  let x = -width / 2;
  let y = -height / 2;
  for (let c = 0xFF60; c < 0xFF9F; c++) {
    text(c + ":" + String.fromCharCode(c), x, y);
    y += s;
    if (y > 0) {
      y = -height / 2;
      x = x + 5 * 24;
    }
  }
  // display character set spacing
  s = 96;
  let xs = 0.4;
  let ys = 0.8;
  x = -width / 2;
  y = 100;
  textSize(s);
  for (let c = 0xFF66; c < 0xFF9E; c++) {
    text(String.fromCharCode(c), x, y);
    x += s * xs;
    if (x > width / 2 - s * xs) {
      y += s * ys;
      x = -width / 2;
    }
  }
  print("end");
}

function draw() {
  noLoop();
}