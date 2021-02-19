let webSiteName = "https://coronavirus.data.gov.uk/details(tests)";
let b;

function preload() {
  b = loadBytes("../data/data_2021-Feb-08-tests.csv");
}

function setup() {
  createCanvas(512, 512);
  background(0); // black
  frameRate(60); // default 
  noLoop(); // Draw once
}

function draw() {
  let POINTSIZE = 32;
  let MAXX = 512;
  let MAXY = MAXX;
  let POINTS = MAXX * MAXY / POINTSIZE * POINTSIZE;
  let TEXTSIZE = POINTSIZE / 2;

  let x = 0;
  let y = TEXTSIZE;
  let i = 0;
  let p = 0;


  // Title in Center
  textSize(TEXTSIZE);
  textAlign(CENTER, TOP);
  fill("white");
  text(webSiteName, MAXX / 2, 0);
  //text('TOP', MAXX/2, 0);

  // Size of point
  // strokeWeight(POINTSIZE);
  // strokeCap(SQUARE); // Square // didnt work

  // plot number of POINTS
  for (p = 0; p < POINTS; p++) {
    if (i < b.bytes.length - 3) {
      // bytes are from -128 to 127, & 0xff converts to 0 to 255 
      red = b.bytes[i] & 0xff;
      green = b.bytes[i + 2] & 0xff;
      blue = b.bytes[i + 3] & 0xff;

      // Plot point
      //print("p=", p, "x=", x, "y=", y, "colour=", red, green, blue);
      fill(red, green, blue);
      noStroke();
      square(x, y, POINTSIZE);

      // next point
      i = i + 3;

      // one point to right, until end of line  
      x = x + POINTSIZE;
      if (x > MAXX - POINTSIZE) {
        // one down, fill screen and stop
        x = 0;
        y = y + POINTSIZE;
        if (y > MAXY - POINTSIZE) {
          p = POINTS;
        }
      }
    } else {
      i = 0;
    }
  }
}
