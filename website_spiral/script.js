function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

}

function spiral() {
  const maxAngle = 512;
  const aSpeed = 0.2;
  var scalar = 1;
  var scale = 1;
  const sSpeed = 0.01;
  var x, y;
  stroke("white");
  for (var angle = 0; angle < maxAngle; angle += aSpeed) {
    x = cos(angle) * scalar;
    y = sin(angle) * scalar;
    strokeWeight(scale);
    point(x, y, 0);
    scalar += aSpeed;
    scale += sSpeed;
  }
}



function draw() {
  background("black");
  const frameFix = 0.01;
  rotateX(frameCount * frameFix);
  rotateY(frameCount * frameFix);
  rotateZ(frameCount * frameFix);
  spiral();
}