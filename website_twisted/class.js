class Strip {
  constructor(x, y, z, width, length) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.length = length;
    this.rotation = random(TWO_PI);
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
    print("rotation: ", this.rotation);
  }
  display() {
    // print("start display")
    let rotation = this.rotation;
    push();
    // this.logthis();
    translate(this.x, this.y - this.width, this.z);
    rotateX(rotation);
    //
    // Lighting
    // let locX = mouseX - width / 2;
    // let locY = mouseY - height / 2;
    ambientLight(128, 128, 128);
    pointLight(255, 255, 255, -width / 2, -height / 2, width + height);
    pointLight(255, 255, 255, width / 2, height / 2, width + height);
    // directionalLight(128, 128, 128, locX, locY, -1);
    // spotLight(128, 128, 128, locX, locY, width + height, 0, 0, -1, PI / 8);
    // Material
    // normalMaterial(); //debugging
    // ambientMaterial(this.red, this.blue, this.green); // black
    // emissiveMaterial(this.red, this.blue, this.green); // black
    specularMaterial(this.red, this.blue, this.green);
    shininess(128);
    // fill(this.red, this.blue, this.green);
    noStroke();
    const resolution = 512;
    const incrementX = this.length / resolution;
    const rotations = 0.5;
    const rotationStep = (incrementX * rotations * TWO_PI / this.length);
    for (var x = this.x; x < this.x + this.length; x += incrementX) {
      plane(incrementX, this.width); // no ligting options
      box(incrementX, this.width, 1);
      translate(incrementX, 0, 0);
      rotateX(rotationStep);
      rotation += rotationStep;
    }
    pop();
    this.rotation = rotation;
    const rotationSpeed = this.width;
    this.rotation += rotationSpeed * rotationStep; // animation
    // print("end display")
  }
  update() {}
}
class Strips {
  constructor() {
    let myWidth = height / 32;
    this.strips = [];
    let y = -height / 2;
    while (y < height + myWidth / 2) {
      const inc = random(myWidth / 2, myWidth)
      // constructor(x, y, z, width, length)
      this.strips.push(new Strip(-width / 2, y, 0, inc, width));
      y += inc;
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