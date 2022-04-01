class RainCloud {
  constructor(x) {
    this.cloud = [];
    for (let x = -width / 2; x < width / 2; x += fontSize / 2) {
      for (let z = -width / 2; z < width / 2; z += fontSize) {
        if (random() < 0.1) {
          const column = new RainColumn(x, z);
          this.cloud.push(column);
          // break; //testing
        }
      }
    }
    print(this.cloud.length);
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