class RainDrop {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.c = floor(random(0xFF60, 0xFF9F));
  }
  reset() {
    this.y = -height / 2;
  }
  display() {
    textSize(fontSize);
    textFont(fontIpag);
    push();
    const y = this.y;
    specularMaterial("green");
    if (y > -height / 2 * 0.33) {
      specularMaterial("lime");
    }
    if (y > height / 2 - dY) {
      specularMaterial("white");
    }
    translate(this.x, this.y, this.z);
    text(String.fromCharCode(this.c), 0, 0);
    pop();
  }
  update() {
    this.y += dY;
    if (this.y > height / 2) {
      this.reset();
    }
  }
}