// Based on https://thecodingtrain.com/CodingChallenges/025-spheregeometry.html

const globe = [];
const r = 256;
const total = 64;

function setup() {

  createCanvas(512, 512, WEBGL);
  colorMode(HSB);
  noFill();
  noStroke();

  for (let i = 0; i < total + 1; i++) {
    globe[i] = [];
    const lat = map(i, 0, total, 0, PI);
    for (let j = 0; j < total + 1; j++) {
      const lon = map(j, 0, total, 0, TWO_PI);
      const x = r * sin(lat) * cos(lon);
      const y = r * sin(lat) * sin(lon);
      const z = r * cos(lat);
      globe[i][j] = createVector(x, y, z);
    }
  }
}

function draw() {
  background(51);

  camera(
    map(mouseX, 0, 512, 256, -256), map(mouseY, 0, 512, 256, -256), 512,
    0, 0, 0,
    0, 1, 0);

  for (let i = 0; i < total; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < total + 1; j++) {
      var hu = map(j, 0, total + 1, 0, 255 * 6);
      fill(hu % 255, 255, 255);
      const v1 = globe[i][j];
      vertex(v1.x, v1.y, v1.z);
      const v2 = globe[i + 1][j];
      vertex(v2.x, v2.y, v2.z);
    }
    endShape();
  }
}