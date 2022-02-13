class Ground {
  constructor() {
    this.slabs = [];
    this.tick = 0;
    this.update()
    while (this.slabs[0].x > 0) {
      this.update();
    }

  }

  display() {
    for (var i = 0; i < this.slabs.length; i++) {
      this.slabs[i].display();
    }
  }

  update() {
    if (this.slabs.length > 1) {
      if (this.slabs[0].x < 0) {
        this.slabs.splice(0, 1);
      }
    }
    for (var i = 0; i < this.slabs.length; i++) {
      this.slabs[i].update();
    }
    this.slabs.push(new Slab(this.tick));
    this.tick += 0.02;

  }
}

class Slab {
  constructor(tick) {
    this.depth = noise(tick) * height / 4 + height / 16;
    this.width = 10;
    this.x = width;
    this.y = height - this.depth;
  }

  update() {
    this.x -= this.width;
  }

  display() {
    var d = this.depth;
    var w = this.width;
    var x = this.x;
    var y = this.y;
    fill("green");
    noStroke();
    rect(x, y, w, d);
  }
}