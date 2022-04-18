// ref https://en.wikipedia.org/wiki/Barnsley_fern
let myFont;
let bg;
let zoom;
let bgscale;
let dx, dy, dw, dh;
let sx, sy, sw, sh;
let slider;

function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(
    windowWidth,
    windowHeight,
    WEBGL);
  background("black");
  textFont(myFont);
  //
  bgScale = 4;
  bg = createGraphics(
    width * bgScale,
    height * bgScale,
    WEBGL);
  bg.background("black");
  //
  x = 0;
  y = 0;
  dx = 0;
  dy = 0
  dw = width;
  dh = height;
  sx = 0;
  sy = 0;
  sw = bg.width;
  sh = bg.height;
  //
  zoom = 1;
  //
  slider = createSlider(1, bgScale, 1, 0);
  slider.position(24, 24);
  slider.style('width', (width - 24 * 2) + 'px');
  title();
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
  for (let i = 0; i < 2048; i++) {
    nextPoint();
    drawPoint();
  }
  background("black");
  push();
  rotateY(frameCount * 0.01);
  zoom = slider.value();
  image(
    bg,
    dx - dw / 2,
    dy - dh / 2,
    dw,
    dh,
    sx + (sw - sw / zoom) / 2,
    sy + (sh - sh / zoom) / 2,
    sw / zoom,
    sh / zoom
  );
  pop();
  // title();
  if (frameCount > 50 * 60 * 10) {
    print("done")
    noLoop();
  }
}

function title() {
  push();
  translate(-width / 2, -height / 2);
  textSize(24);
  fill("white");
  text("Use slider to zoom fractal", 24, 24);
  text("zoom: " + zoom.toFixed(2), 24, 48);
  pop();
}

function drawPoint() {
  //range −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983.
  let px = map(x, -2.1820, 2.6558, 0, bg.width);
  let py = map(y, 0, 9.9983, bg.height, 0);
  bg.push();
  bg.stroke("limegreen");
  bg.translate(-bg.width / 2, -bg.height / 2);
  bg.point(px, py);
  bg.pop();
}