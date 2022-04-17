// ref https://en.wikipedia.org/wiki/Barnsley_fern
let myFont;
let x;
let y;
let zoom;

function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
  let px = map(x * zoom, -2.1820, 2.6558, 0, width);
  let py = map(y * zoom, 0, 9.9983, height, 0);
  stroke("limegreen");
  point(px, py);
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
}

function draw() {
  for (let i = 0; i < 1000; i++) {
    nextPoint();
    drawPoint();
  }
  if (frameCount > 50 * 60 * 10) {
    print("done")
    noLoop();
  }
}

function mousePressed() {
  zoom *= 2;
  x = mouseX;
  y = mouseY;
  background("black");
  title();
}

function title() {
  textSize(24);
  fill("white");
  text("Click mouse or touch screen to zoom into fractal", 24, 24);
}