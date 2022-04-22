class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    let angle = random(0, 2 * PI);
    this.xspeed = random(2, 5) * Math.cos(angle);
    this.yspeed = random(2, 5) * Math.sin(angle);
  }
  update(w, h) {
    this.x += this.xspeed;
    this.y += this.yspeed;
    if (this.x > width || this.x < 0) this.xspeed *= -1;
    if (this.y > height || this.y < 0) this.yspeed *= -1;
  }
}