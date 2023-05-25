// ref https://en.wikipedia.org/wiki/Barnsley_fern
// https://github.com/freshfork/p5.EasyCam

let bg = null;
let accuracy = 2;
let x = 0;
let y = 0;
let cam = null;

function setup() {
  createCanvas(displayWidth, displayHeight, WEBGL);
 
  bg = createGraphics(width * accuracy, height * accuracy);
  bg.background(16);
  bg.stroke("limegreen");
  cam = createEasyCam();

  // suppress right-click context menu
  document.oncontextmenu = function() { return false; }
  cam.setDistanceMin((width + height)/20);
  cam.setDistanceMax(width + height);

  	// swap the handlers
	cam.mouse.mouseDragLeft    = cam.mouseDragPan.bind(cam);    // mouseLeft now pans
}

function setBackground() {
  background(0);
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
  for (let i = 0; i < 1024; i++) {
    nextPoint();
    drawPoint();
  }  
  setBackground();
  image(bg, -width/2, -height/2, width, height);
}

function drawPoint() {
  //range −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983.
  let px = map(x, -2.1820, 2.6558, 0, bg.width);
  let py = map(y, 0, 9.9983, bg.height, 0);
  bg.point(px, py);
}