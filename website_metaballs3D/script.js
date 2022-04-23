let play; // to control play or pause (true or false)
let balls; // store metaballs
let density; // pixel zoom
let bg; // texture workspace
//
function preload() {
  myFont = loadFont("../fonts/DejaVuSerif.ttf");
}
//
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);
  // pixealDensity(1);
  colorMode(HSB);
  background("black");
  play = false;
  density = 8;
  bg = createGraphics(windowWidth / density, windowHeight / density);
  bg.colorMode(HSB);
  balls = [];
  for (let i = 0; i < 5; i++) {
    const ball = new Ball(
      random(0, bg.width),
      random(0, bg.height),
      random(4 * (bg.width + bg.height), 16 * (bg.width + bg.height))
    )
    balls.push(ball);
  }
}
//
function draw() {
  if (false == play) {
    Stop();
  } else {
    Play();
  }
}
//
function Play() {
  background("black");
  //
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
        colour = color(sum, 255, 255);
        bg.stroke(colour);
        bg.point(x, y);
      }
    }
  }
  //
  push();
  rotateY(-PI / 2);
  noStroke();
  translate(0, 0, 0);
  texture(bg);
  const radius = min(height, width) / 3;
  // print(radius);
  sphere(radius, 24, 24);
  pop();
  //
  for (let i = 0; i < balls.length; i++) {
    balls[i].update(width, height);
  }
}
//
function Stop() {
  play = false;
  noLoop();
  push();
  fill("red")
  const pr = get(width / 2, height / 2)[0];
  if (pr > 200) {
    fill("blue");
  }
  noStroke();
  const s = (width + height) / 25;
  // translate(width / 2, height / 2);
  triangle(-s / 2, -s, s / 2, 0, -s / 2, s)
  pop();
  fill("white");
  const tr = get(textSize(), height - textSize())[0];
  if (tr > 200) {
    fill("black");
  }
  text("=", textSize(), height - textSize());
}
//
function mouseClicked() {
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