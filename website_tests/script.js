function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //
  // var x = "1";
  // x -= "2";
  // print(x);
  //
  // var y = 10;
  // delete y;
  // print(y);
  //
  // var z = (1 == 2) ? print(2) : print(3);
  //
  for (var a = 0, b = 2; a + b <= 6; a++, b++) {
    print(a, b);
  }
}

function draw() {
  noLoop();
}