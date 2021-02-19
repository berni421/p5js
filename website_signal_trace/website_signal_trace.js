/*
Each block is colours according to three data Values as red, 
green and blue from the website code. A mouse click will change
the website displayed.
*/

var MAXX = 512;
var MAXY = MAXX;
var POINTSIZE = 8;
var TEXTSIZE = 16;

function preload() {
  items = new Data(); // load data structures
}

function setup() {
  createCanvas(MAXX, MAXY);
}

function draw() {
  background(0); // fill screen black
  site = items.site;
  display = new Display(items.names[site], items.data[site]);
  display.title();
  /******************
  // Plot each data point
  while (!display.IsFinished()) {
    display.plotItem();
    display.nextItem();
  }
  *******************/
  // Trace each data point
  while (!display.IsTraceFinished()) {
    display.traceItem();
    display.nextTraceItem();
  }
  noLoop();
}

function mousePressed() {
  // Move to next website on mouse click  
  items.next();
  redraw();
} // function

class Data {
  constructor() {
    this.names = []; // arrary of data names
    this.data = [];  // array of site data
    this.sites = 0;
    this.site = 0;
    this.loadItems();
  }

  loadItems() {
    // this.names array of site names
    // this.data array of byte data for each site
    // this.sites number of sites

    var me = this;

    loadTable('../data/site-names.csv', 'csv', 'header', loadedSites, errorSites);

    function loadedSites(names) {
      print("loadedSites success", names);
      me.sites = names.getRowCount(); // one less for header line

      for (var site = 0; site < me.sites; site++) {
        var fileName = names.getString(site, "filename");
        me.names[site] = names.getString(site, "name");
        loadData("../data/" + fileName, site);
      }

      function loadData(fileName, site) {
        loadBytes(fileName, loadedData, errorData);

        function loadedData(d) {
          print("loadData success", d, site);
          me.data[site] = d;
        }
      }

      function errorData(e) {
        print("loadedData failed", e);
        exit("loadedData");
      }
    }

    function errorSites(e) {
      print("loadedSite failed", e);
      exit("loadedSite");
    }
  }

  next() {
    // change website
    this.site++;
    if (this.site >= this.sites) {
      this.site = 0;
    }
  }

} // class

class Display {
  constructor(name, data) {
    this.point = 0; // current data point
    this.x = 0;     // current x
    this.y = 0;  // current y
    this.data = data; // the data
    this.name = name; // the titile for data
    this.range = {}; // the ranges of values in the data
    this.start();
  }

  start() {
    function bin2String(array) {
      var result = "";
      for (var i = 0; i < array.length; i++) {
        result += (String.fromCharCode(array[i]));
      }
      return result;
    }

    // start at some interesting place
    var tag = "<body>";
    this.point = bin2String(this.data.bytes).indexOf(tag) + tag.length;

    // Scan data to find ranges [0]=minimum [1]=maximum
    var range = {
      red: [255, 0],
      green: [255, 0],
      blue: [255, 0],
      raw: [255, -255]
    };
    var limit = this.data.bytes.length;

    for (var i = this.point; i < limit; i += 3) {
      var redValue = this.data.bytes[i];
      var greenValue = this.data.bytes[i + 1];
      var blueValue = this.data.bytes[i + 2];

      if (redValue === 0 || greenValue === 0 || blueValue === 0) {
        print("null at ", i);
        exit("null found");
      }

      if (redValue < range.red[0]) { range.red[0] = redValue; }
      if (redValue > range.red[1]) { range.red[1] = redValue; }

      if (greenValue < range.green[0]) { range.green[0] = greenValue; }
      if (greenValue > range.green[1]) { range.green[1] = greenValue; }

      if (blueValue < range.blue[0]) { range.blue[0] = blueValue; }
      if (blueValue > range.blue[1]) { range.blue[1] = blueValue; }
    }

    for (i = this.point; i < limit; i++) {
      var Value = byte(this.data.bytes[i]);

      if (Value < range.raw[0]) { range.raw[0] = Value; }
      if (Value > range.raw[1]) { range.raw[1] = Value; }
    }

    this.range = range;
    print(range);
  }

  title() {
    // Title in Center at Top
    textSize(TEXTSIZE);
    textAlign(CENTER, TOP);
    fill("white");
    text(this.name, MAXX / 2, 0);
    this.y = TEXTSIZE;  // position y below the title
  }

  plotItem() {
    // Display data point with red green blue colours, over entire screen
    var redValue = this.data.bytes[this.point] & 0xff;
    var greenValue = this.data.bytes[this.point + 1] & 0xff;
    var blueValue = this.data.bytes[this.point + 2] & 0xff;

    red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
    green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
    blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);

    fill(red, green, blue);
    noStroke();
    circle(this.x + POINTSIZE / 2, this.y + POINTSIZE / 2, POINTSIZE);
    if (this.x === 0) {
      print("x=", x, "y=", this.y, "red=", red, "green=", green, "blue=", blue);
    }
  }

  traceItem() {
    var flip;
    // Display data as a single trace accross the screen middle
    // website data is mostly positive so adding alternate flip
    // to be more interesting.
    var Value = byte(this.data.bytes[this.point]); // & 0xff;
    stroke("white");
    if (this.x % 2 == 0) {
      flip = 1;
    } else {
      flip = -1;
    }
    line(
      this.x,
      height / 2,
      this.x,
      height / 2 + flip * map(Value, this.range.raw[0], this.range.raw[1], -200, 200)
    );
    if (this.x === 0) { print("x=", this.x, "value=", Value); }
  }

  nextItem() {
    // Move one data point foward
    // one point to right, until end of line
    this.x = this.x + POINTSIZE;
    if (this.x > MAXX - POINTSIZE) {
      // one down, fill screen and stop
      this.x = 0;
      this.y = this.y + POINTSIZE;
    }
    this.point += 3;
  }

  nextTraceItem() {
    // Move one pont to right
    this.x++;
    this.point++;
  }

  IsFinished() {
    // Finished when at end of data, or screen
    var dataConsumed = (this.point > this.data.bytes.length - 3);
    var screenFilled = (this.y > MAXY - POINTSIZE);

    if (dataConsumed || screenFilled) {
      return true;
    }
    return false;
  }

  IsTraceFinished() {
    var screenFilled = (this.x > MAXX);

    if (screenFilled) {
      return true;
    }
    return false;
  }
} //class
