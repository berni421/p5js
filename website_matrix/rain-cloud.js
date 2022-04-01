class RainCloud {
  constructor(x) {
    this.cloud = [];
    for (let x = -width / 2; x < width / 2; x += fontSize / 2) {
      const z = random(-width, width);
      const column = new RainColumn(x, z);
      this.cloud.push(column);
      // break; //testing
    }
  }
  update() {
    for (let i = 0; i < this.cloud.length; i++) {
      this.cloud[i].update();
    }
  }
  display() {
    for (let i = 0; i < this.cloud.length; i++) {
      this.cloud[i].display();
    }
  }
}