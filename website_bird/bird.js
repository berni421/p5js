class Bird {
  constructor() {
    this.x = width / 4;
    this.y = height / 2;
    this.lift = -12;
    this.gravity = 0.5;
    this.velocity = 0;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  up() {
    this.velocity += this.lift;
  };

  display() {
    var x = this.x;
    var y = this.y;

    fill("blue");
    noStroke();
    circle(x, y, 30)
    triangle(
      x + 5, y - 10,
      x + 5, y + 10,
      x + 35, y);
    triangle(
      x - 10, y - 10,
      x - 10, y + 10,
      x - 25, y);
  }
}