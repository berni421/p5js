let play = false; // to control play or pause (true or false)
let img; // the webcam image
//
function preload() {}
//
function setup() {
  function grabImage() {
    img = capture.get();
    createCanvas(img.width, 2 * img.height);
    background("black");
    stop();
  }
  const capture = createCapture(VIDEO, grabImage);
  capture.hide();
}

function draw() {
  if (false == play) {
    stop();
  } else {
    resume();
  }
}

function resume() {
  image(img, 0, 0);
  translate(0, img.height)
  for (var i = 0; i < 10; i++) {
    var x = floor(random(img.width));
    var y = floor(random(img.height));
    var pix = img.get(x, y);
    fill(pix, 128);
    ellipse(x, y, 5, 5);
  }
}

function stop() {
  play = false;
  noLoop();
  push();
  fill("red");
  const pixelColour = get(width / 2, height / 2, 0);
  if (pixelColour[0] > 200) {
    fill("blue");
  }
  noStroke();
  let s = (width + height) / 25;
  translate(width / 2, height / 4);
  triangle(-s / 2, -s, s / 2, 0, -s / 2, s);
  pop();
}
//
function mousePressed() {
  return touchStarted();
}
//
function touchStarted() {
  play = !play;
  if (play) {
    loop();
  }
  return false;
}