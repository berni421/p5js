class Clouds {
  constructor() {
    this.clouds = [];
    this.loops = 0;
  }

  update() {
    if (this.clouds.length > 1) {
      if (this.clouds[0].x < -400) {
        this.clouds.splice(0, 1);
      }
    }
    for (var i = 0; i < this.clouds.length; i++) {
      this.clouds[i].update();
    }
    if (this.loops % 30 * floor(random(60)) == 0) {
      this.clouds.push(new Cloud());
    }
    this.loops++;
  }

  display() {
    for (var i = 0; i < this.clouds.length; i++) {
      this.clouds[i].display();
    }
  }
}

class Cloud {
  constructor() {
    this.x = width;
    this.y = noise(frameCount * .02) * height / 4;
  }

  update() {
    this.x -= 10;
  }

  display() {
    fill("white");
    noStroke();
    var x = this.x;
    var y = this.y;
    // bottom
    for (var blob = 0; blob <= 100; blob += 50) {
      circle(x + blob, y, 75);
    }
    // middle
    for (var blob = 0; blob <= 50; blob += 25) {
      circle(x + blob + 50, y - 50, 50);
    }
    // top
    for (var blob = 0; blob <= 25; blob += 12.5) {
      circle(x + blob + 75, y - 75, 12.5);
    }
  }
}