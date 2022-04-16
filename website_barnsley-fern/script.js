// ref https://en.wikipedia.org/wiki/Barnsley_fern
let myFont;
let x;
let y;
let zoom;

function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  background("black");
  frameRate(50);
  x = 0;
  y = 0;
  zoom = 1;
  title();
}
//range −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983.
function drawPoint() {
  let px = map(x, -2.1820 / zoom, 2.6558 / zoom, 0, width);
  let py = map(y, 0, 9.9983 / zoom, height, 0);
  push();
  translate(-width / 2, -height / 2);
  stroke("green");
  strokeWeight(0.25);
  point(px, py);
  pop();
}

function nextPoint() {
  let nextX;
  let nextY;
  let r = random(1);
  if (r < 0.01) {
    //1
    nextX = 0;
    nextY = 0.16 * y;
  } else if (r < 0.86) {
    //2
    nextX = 0.85 * x + 0.04 * y;
    nextY = -0.04 * x + 0.85 * y + 1.60;
  } else if (r < 0.93) {
    //3
    nextX = 0.20 * x + -0.26 * y;
    nextY = 0.23 * x + 0.22 * y + 1.60;
  } else {
    //4
    nextX = -0.15 * x + 0.28 * y;
    nextY = 0.26 * x + 0.24 * y + 0.44;
  }
  x = nextX;
  y = nextY;
  let node = {
    x: x,
    y: y
  };
}

function draw() {
  for (let i = 0; i < 1000; i++) {
    nextPoint();
    drawPoint();
  }
  if (frameCount > 50 * 60 * 2) {
    print("done")
    noLoop();
  }
}

function mousePressed() {
  zoom += 0.2;
  background("black");
  title();
}

function title() {
  textSize(24);
  text("Click mouse or touch screen to zoom into fractal", -width / 2 + 24, -height / 2 + 24)
}