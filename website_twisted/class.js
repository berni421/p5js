class Strip {
  constructor(x, y, z, width, length, amplitude) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.length = length;
    this.amplitude = amplitude;
    this.red = random(0, 255);
    this.blue = random(0, 255);
    this.green = random(0, 255);
  }
  logthis() {
    print("x: ", this.x);
    print("y: ", this.y);
    print("z: ", this.z);
    print("width: ", this.width);
    print("length: ", this.length);
    print("amplitude: ", this.amplitude);
  }
  display() {
    // print("start display")
    push();
    // this.logthis();
    translate(this.x, this.y - this.width, this.z);
    // print("this.y: ", this.y);
    fill(this.red, this.blue, this.green);
    noStroke();
    var increment = 10;
    for (var x = this.x; x < this.x + this.length; x += increment) {
      plane(increment, this.width * this.amplitude * sin(this.y));
      translate(increment, 0, 0);
    }
    pop();
    // print("end display")
  }
  update() {
    this.red--;
    if (this.red < 0) this.red = 255;
    this.blue--;
    if (this.blue < 0) this.blue = 255;
    this.red--;
    if (this.green < 0) this.green = 255;
  }
}
class Strips {
  constructor() {
    this.strips = [];
    let myWidth = 100;
    for (var y = -height / 2; y < height + myWidth / 2; y += myWidth) {
      // constructor(x, y, z, width, length, amplitude)
      this.strips.push(new Strip(-width / 2, y, 0, myWidth, width, width / 10));
    }
  }
  display() {
    for (var i = 0; i < this.strips.length; i++) {
      this.strips[i].display();
    }
  }
  update() {
    for (var i = 0; i < this.strips.length; i++) {
      this.strips[i].update();
    }
  }
}