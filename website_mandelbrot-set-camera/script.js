var cam = null;
var bg = null;
var accuracy = 1.0;

function setup() {
  createCanvas(displayWidth, displayHeight, WEBGL);

  bg = createGraphics(width * accuracy, height * accuracy);
  bg.background(16);

  // Camera
  cam = createEasyCam();

  // suppress right-click context menu
  document.oncontextmenu = function () { return false; }
  cam.setDistanceMin((width + height) / 20);
  cam.setDistanceMax(width + height);

  // swap the handlers
  cam.mouse.mouseDragLeft = cam.mouseDragPan.bind(cam);    // mouseLeft now pans

  // Establish a range of values on the complex plane
  // A different range will allow us to "zoom" in or out on the fractal

  // It all starts with the width, try higher or lower values
  const w = 4;
  const h = (w * height) / width;

  // Start at negative half the width and height
  const xmin = -w / 2;
  const ymin = -h / 2;

  // Make sure we can write to the pixels[] array.
  // Only need to do this once since we don't do any other drawing.
  // loadPixels();

  // Maximum number of iterations for each point on the complex plane
  const maxiterations = 100;

  // x goes from xmin to xmax
  const xmax = xmin + w;
  // y goes from ymin to ymax
  const ymax = ymin + h;

  // Calculate amount we increment x,y for each pixel
  const dx = (xmax - xmin) / (width);
  const dy = (ymax - ymin) / (height);

  // Start y
  let y = ymin;
  for (let j = 0; j < height; j++) {
    // Start x
    let x = xmin;
    for (let i = 0; i < width; i++) {

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
      bg.stroke(bright);
      bg.point(i, j);
      x += dx;
    }
    y += dy;
  }
}

function draw() {
  ;
  background(0);
  image(bg, -width / 2, -height / 2, width, height);
}