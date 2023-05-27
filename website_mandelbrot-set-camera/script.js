var cam;
var bg;
const accuracy = 2.0;
var xmin, ymin, maxiterations, xmax, ymax, dx, dy, x, y, i, j;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  bg = createGraphics(width * accuracy, height * accuracy);
  bg.background(32);

  // Camera
  cam = createEasyCam();

  // suppress right-click context menu
  document.oncontextmenu = function () { return false; }

  // Camera Controls
  cam.setDistanceMin((width + height) * 0.05);
  cam.setDistanceMax((width + height) * 1);
  cam.setDistance((width + height) * 0.4);

  // swap the handlers
  cam.mouse.mouseDragLeft = cam.mouseDragPan.bind(cam);    // mouseLeft now pans
  cam.mouse.touchmoveSingle = cam.mouseDragPan.bind(cam);

  setupMS();
}

function setupMS() {
  // Establish a range of values on the complex plane
  // A different range will allow us to "zoom" in or out on the fractal

  // It all starts with the width, try higher or lower values
  const w = 4;
  const h = (w * bg.height) / bg.width;

  // Start at negative half the width and height
  xmin = -w / 2;
  ymin = -h / 2;

  // Maximum number of iterations for each point on the complex plane
  maxiterations = 8;
  // Increment for maxinterations
  dIterations = 32;

  // x goes from xmin to xmax
  xmax = xmin + w;
  // y goes from ymin to ymax
  ymax = ymin + h;

  // Calculate amount we increment x,y for each pixel
  dx = (xmax - xmin) / (bg.width);
  dy = (ymax - ymin) / (bg.height);

  // Start y
  y = ymin;
  j = 0;
}

function draw() {
  if (j < bg.height) {
    // Start x
    x = xmin;
    for (let i = 0; i < bg.width; i++) {
      plotMS(i, j);
      x += dx;
    }
    y += dy;
    j++;
    background(0);
    image(bg, -width / 2, -height / 2, width, height);
  } else {
    // new start
    // Start y
    y = ymin;
    j = 0;
    maxiterations += dIterations;
    print("maxiterations: ", maxiterations);
  }
}

function plotMS(i, j) {
  // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
  let a = x;
  let b = y;
  let n = 0;
  while (n < maxiterations) {
    const aa = a * a;
    const bb = b * b;
    const twoab = 2.0 * a * b;
    a = aa - bb + x;
    b = twoab + y;
    // Infinty in our finite world is simple, let's just consider it 16
    if (dist(aa, bb, 0, 0) > 16) {
      break;  // Bail
    }
    n++;
  }

  // We color each pixel based on how long it takes to get to infinity
  // If we never got there, let's pick the color black
  let bright = 0;
  if (n !== maxiterations) {
    const norm = map(n, 0, maxiterations, 0, 1);
    bright = map(sqrt(norm), 0, 1, 0, 255);
  }
  bg.stroke(0, bright, 0);
  bg.point(i, j);
}