var cam;
var bg;
const accuracy = 1.0;

var angle, maxiterations = 100, colorsRed = [], colorsGreen = [], colorsBlue = [];

function setup() {
  // pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);

  bg = createGraphics(width * accuracy, height * accuracy);
  bg.background(32);
  bg.loadPixels();

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

  setupJulia();
}

function setupJulia() {
  angle = 0;

  // Maximum number of iterations for each point on the complex plane
  maxiterations = 100;

  colorMode(HSB, 1);

  // Create the colors to be used for each possible iteration count
  for (let i = 0; i < maxiterations; i++) {
    let hu = sqrt(i / maxiterations);
    let col = color(hu, 255, 150);
    colorsRed[i] = red(col);
    colorsGreen[i] = green(col);
    colorsBlue[i] = blue(col);
  }
}

function calculateJulia() {
  let ca = cos(angle * 3.213); //sin(angle);
  let cb = sin(angle);

  angle += 0.02;

  // Establish a range of values on the complex plane
  // A different range will allow us to "zoom" in or out on the fractal

  // It all starts with the width, try higher or lower values
  //let w = abs(sin(angle)) * 5;
  let w = 5;
  let h = (w * bg.height) / bg.width;

  // Start at negative half the width and height
  let xmin = -w / 2;
  let ymin = -h / 2;

  // x goes from xmin to xmax
  let xmax = xmin + w;
  // y goes from ymin to ymax
  let ymax = ymin + h;

  // Calculate amount we increment x,y for each pixel
  let dx = (xmax - xmin) / bg.width;
  let dy = (ymax - ymin) / bg.height;

  // Start y
  let y = ymin;
  for (let j = 0; j < bg.height; j++) {
    // Start x
    let x = xmin;
    for (let i = 0; i < bg.width; i++) {
      // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
      let a = x;
      let b = y;
      let n = 0;
      while (n < maxiterations) {
        let aa = a * a;
        let bb = b * b;
        // Infinity in our finite world is simple, let's just consider it 16
        if (aa + bb > 4.0) {
          break; // Bail
        }
        let twoab = 2.0 * a * b;
        a = aa - bb + ca;
        b = twoab + cb;
        n++;
      }
      plot(i, j, n);
      x += dx;
    }
    y += dy;
  }

}

function draw() {
  background(0);
  calculateJulia();
  bg.updatePixels();
  image(bg, -width / 2, -height / 2, width, height);
  print(frameRate());
}

function plot(i, j, n) {
  // We color each pixel based on how long it takes to get to infinity
  // If we never got there, let's pick the color black
  let pix = (i + j * bg.width) * 4;
  if (n < maxiterations) {
    // use the colors that we made in setup()
    bg.pixels[pix + 0] = colorsRed[n];
    bg.pixels[pix + 1] = colorsGreen[n];
    bg.pixels[pix + 2] = colorsBlue[n];
  } else {
    bg.pixels[pix + 0] = 0;
    bg.pixels[pix + 1] = 0;
    bg.pixels[pix + 2] = 0;
  }
}