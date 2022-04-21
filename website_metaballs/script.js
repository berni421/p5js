let myFont; // for WEBGL text
let play; // to control play or pause (true or false)
let balls; // store metaballs
let bg; // compute image to offscreen store
let windowScale;
//
function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  colorMode(HSB);
  background("black");
  play = false;
  //
  windowScale = 8;
  bg = createGraphics(width / windowScale, height / windowScale, WEBGL);
  bg.colorMode(HSB);
  balls = [];
  for (let i = 0; i < 5; i++) {
    const ball = new Ball(
      random(0, bg.width),
      random(0, bg.height),
      random(bg.width + bg.height, windowScale * (bg.width + bg.height))
    )
    balls.push(ball);
  }
}

function draw() {
  if (false == play) {
    Stop();
  } else {
    Play();
  }
}
async function Play() {
  background("black");
  for (let x = 0; x < bg.width; x++) {
    for (let y = 0; y < bg.height; y++) {
      let sum = 0;
      for (let i = 0; i < balls.length; i++) {
        const {
          x: bx,
          y: by,
          r: br
        } = balls[i];
        const xdif = x - bx;
        const ydif = y - by;
        const d = sqrt(xdif * xdif + ydif * ydif);
        sum += br / d;
      }
      bg.push();
      bg.translate(-bg.width / 2, -bg.height / 2);
      bg.stroke(color(sum, 255, 255));
      bg.point(x, y);
      bg.pop();
    }
  }
  image(bg, -width / 2, -height / 2, width, height);
  await new Promise(resolve => setTimeout(resolve, 1));
  for (let i = 0; i < balls.length; i++) {
    balls[i].update(bg.width, bg.height);
  }
}

function Stop() {
  play = false;
  noLoop();
  push();
  translate(0, 0, 0);
  fill("red")
  const pixelColour = get(width / 2, height / 2);
  if (pixelColour[0] > 200) {
    fill("blue");
  }
  noStroke();
  beginShape();
  const s = (width + height) / 25;
  vertex(-s / 2, -s, 1);
  vertex(s / 2, 0, 1);
  vertex(-s / 2, s, 1);
  endShape(CLOSE);
  pop();
}

function mousePressed() {
  play = !play;
  if (play) {
    loop();
  }
}