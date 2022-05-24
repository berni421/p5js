class Mouse {
  constructor(mImage, name) {
    const mr = int(width / 12);
    let r = int(random(mr, 2 * mr));
    this.x = int(random(0, width - r));
    this.y = int(random(0, height - r));
    let vx = int(random(12, 18));
    let vy = int(random(12, 18));
    if (random(1) > 0.5) {
      vx = -vx;
    }
    if (random(1) > 0.5) {
      vy = -vy;
    }
    this.mImage = mImage;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.sr = r;
    this.name = name;
  }
  update() {
    let x = this.x;
    let y = this.y;
    let vx = this.vx;
    let vy = this.vy;
    const sr = this.sr;
    x += vx;
    y += vy;
    if (x < sr || x > width - sr) {
      if (x < sr) x = sr;
      if (x > width - sr) x = width - sr;
      vx = -vx;
    }
    if (y < sr || y > height - sr) {
      if (y < sr) y = sr;
      if (y > height - sr) y = height - sr;
      vy = -vy;
    }
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
  reverse() {
    this.vx = -this.vx;
    this.vy = -this.vy;
  }
  display() {
    const x = this.x;
    const y = this.y;
    const r = this.r;
    const mImage = this.mImage.get();
    const sr = int(r + r * sin(frameCount / (r / 8)) / 4);
    mImage.resize(sr, 0);
    push();
    translate(x - width / 2, y - height / 2);
    for (let a = 0; a < TWO_PI; a += TWO_PI / sr) {
      rotateZ(a);
      const r = random(255);
      const g = random(255);
      const b = random(255);
      fill(r, g, b);
      noStroke();
      cylinder(16, 3 * sr * random());
    }
    pop();
    push();
    translate(x - width / 2, y - height / 2);
    rotateY(PI / 1.5);
    noStroke();
    texture(mImage);
    sphere(sr);
    pop();
    this.sr = sr;
  }
}