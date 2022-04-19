//
// TURTLE STUFF:
let x, y; // the current position of the turtle
let currentangle = 0; // which way the turtle is pointing
let step; // how much the turtle moves with each 'F'
let angle = 90; // how much the turtle turns with a '-' or '+'
//
// LINDENMAYER STUFF (L-SYSTEMS)
let thestring = 'A'; // "axiom" or start of the string
let numloops = 5; // how many iterations to pre-compute
let therules = []; // array for rules
therules[0] = ['A', '-BF+AFA+FB-']; // first rule
therules[1] = ['B', '+AF-BFB-FA+']; // second rule
let whereinstring = 0; // where in the L-system are we?
//
// Animantion
let nodes = []; // record of points so far
let play; // play or pause button
//
//
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("black");
  x = 0;
  y = height - 1;
  step = (width + height) / 32;
  // COMPUTE THE L-SYSTEM
  for (let i = 0; i < numloops; i++) {
    thestring = lindenmayer(thestring);
  }
  camera(
    0, 0, (width + height) / 2,
    0, 0, 0,
    0, 1, 0);
  play = false;
}
//
function draw() {
  // plot the current character in the string:
  if (nodes.length < 256) {
    plotIt(thestring[whereinstring]);
  }
  // increment the point for where we're reading the string.
  // wrap around at the end.
  whereinstring++;
  if (whereinstring > thestring.length - 1) whereinstring = 0;
  //
  // show current nodes
  displayIt();
  if (false == play) {
    Stop();
  }
}

function Stop() {
  play = false;
  noLoop();
  push();
  // rotateY(frameCount * 0.01);
  rotateY(-frameCount / 256);
  ambientLight("white");
  fill("red");
  let s = (width + height) / 50;
  triangle(-s * 4, -s * 2, -s, 0, -s * 4, s * 2);
  pop();
}
//
// interpret an L-system
function lindenmayer(s) {
  let outputstring = ''; // start a blank output string
  // iterate through 'therules' looking for symbol matches:
  for (let i = 0; i < s.length; i++) {
    let ismatch = 0; // by default, no match
    for (let j = 0; j < therules.length; j++) {
      if (s[i] == therules[j][0]) {
        outputstring += therules[j][1]; // write substitution
        ismatch = 1; // we have a match, so don't copy over symbol
        break; // get outta this for() loop
      }
    }
    // if nothing matches, just copy the symbol over.
    if (ismatch == 0) outputstring += s[i];
  }
  return outputstring; // send out the modified string
}
//
// this is a custom function that processes the turtle commands
function plotIt(k) {
  if (k == 'F') { // draw forward
    // polar to cartesian based on step and currentangle:
    let x1 = x + step * cos(radians(currentangle));
    let y1 = y + step * sin(radians(currentangle));
    let node = {
      x: x,
      y: y,
      x1: x1,
      y1: y1,
    };
    // update the turtle's position:
    x = x1;
    y = y1;
    // give me some random color values:
    let red = random(128, 255);
    let green = random(0, 192);
    let blue = random(0, 50);
    let c = color(red, green, blue);
    node.c = c;
    let radius = random(step / 4, step / 2)
    node.r = radius;
    nodes.push(node);
  } else if (k == '+') {
    currentangle += angle; // turn left
  } else if (k == '-') {
    currentangle -= angle; // turn right
  }
}

function mousePressed() {
  // Camera position
  camX = map(mouseX, 0, width, -width / 2, width / 2);
  camY = map(mouseY, 0, height, -height / 2, height / 2);
  camera(
    camX, camY, (width + height) / 2,
    0, 0, 0,
    0, 1, 0);
  displayIt();
  play = !play;
  if (play) {
    loop();
  }
}

function displayIt() {
  background("black");
  ambientLight(64, 64, 64);
  pointLight(255, 255, 255, 0, -(width + height), (width + height));
  rotateY(frameCount / 256);
  for (let i = 0; i < nodes.length; i++) {
    let {
      x: x,
      y: y,
      x1: x1,
      y1: y1,
      c: c,
      r: r
    } = nodes[i];
    push();
    stroke(c);
    translate(-width / 2 + x, -height / 2 + y);
    strokeWeight(step / 16);
    line(0, 0, x1 - x, y1 - y); // connect the old and the new
    //
    translate(x1 - x, y1 - y);
    specularMaterial(c);
    shininess(256);
    noStroke();
    sphere(r, 16, 16);
    pop();
  }
}