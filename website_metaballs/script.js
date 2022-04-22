let play; // to control play or pause (true or false)
let balls; // store metaballs
let density; // pixel zoom
//
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSB);
  background("black");
  play = false;
  //
  balls = [];
  density = 4;
  for (let i = 0; i < 5; i++) {
    const ball = new Ball(
      random(0, width),
      random(0, height),
      random(2 * (width + height), 16 * (width + height))
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
  loadPixels();
  //
  for (let x = 0; x < width; x += density) {
    for (let y = 0; y < height; y += density) {
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
        for (let dx = x; dx < x + density && dx < width; dx++) {
          for (let dy = y; dy < y + density && dy < height; dy++) {
            const p = (dy * width + dx) * 4;
            pixels[p] = colour.levels[0];
            pixels[p + 1] = colour.levels[1];
            pixels[p + 2] = colour.levels[2];
            pixels[p + 3] = colour.levels[3];
          }
        }
      }
    }
  }
  //
  updatePixels();
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
  translate(width / 2, height / 2);
  triangle(-s / 2, -s, s / 2, 0, -s / 2, s)
  pop();
  fill("white");
  const tr = get(textSize(), height - textSize())[0];
  if (tr > 200) {
    fill("black");
  }
  text(",", textSize(), height - textSize());
}
//
function mousePressed() {
  play = !play;
  if (play) {
    loop();
  }
}