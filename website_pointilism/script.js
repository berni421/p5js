let play; // to control play or pause (true or false)
let img; // the webcam image
let capture; // the vidio device
//
function preload() {}
//
function grabImage() {
  img = capture.get();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // pixelDensity(1);
  background("grey");
  capture = createCapture(VIDEO, grabImage);
  capture.hide();
  play = true;
}

function draw() {
  if (false == play) {
    stop();
  } else {
    resume();
  }
}

function resume() {
  if (undefined === img) return;
  const xscale = width / (img.width * 2);
  const yscale = height / (img.height * 2);
  push();
  translate(width, 0);
  scale(-1, 1);
  image(img, width / 2 - yscale * img.width / 2, 0, yscale * img.width, yscale * img.height);
  translate(0, yscale * img.height);
  for (var i = 0; i < 32; i++) {
    const x = floor(random(img.width));
    const y = floor(random(img.height));
    const pix = img.get(x, y);
    pix[3] = 255;
    fill(pix);
    // noStroke();
    strokeWeight(0.25);
    const s = (width + height) / 256;
    ellipse(width / 2 - yscale * img.width / 2 + yscale * x, yscale * y, s, s);
  }
  pop();
}

function stop() {
  noLoop();
  push();
  fill("red");
  const pixelColour = get(width / 2, height / 2, 0);
  if (pixelColour[0] > 200) {
    fill("blue");
  }
  noStroke();
  const s = (width + height) / 25;
  translate(width / 2, height / 4);
  triangle(-s / 2, -s, s / 2, 0, -s / 2, s);
  pop();
}

function mousePressed() {
  return touchStarted();
}

function touchStarted() {
  play = !play;
  if (touches.length > 1) {
    background("grey");
    grabImage();
  }
  if (play) {
    loop();
  }
  return false;
}

function keyPressed() {
  background("grey");
  grabImage();
  play = true;
  loop();
  return false;
}