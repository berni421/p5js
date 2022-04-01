class RainDrop {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    if (random() < 0.5) {
      this.font = fontIpag;
      this.c = floor(random(0xFF60, 0xFF9F));
    } else {
      this.font = fontDejaVuSerif
      this.c = floor(random(33, 64));
    }
  }
  reset() {
    this.y = -height / 2;
  }
  display() {
    textSize(fontSize);
    textFont(this.font);
    push();
    const y = this.y;
    specularMaterial("green");
    if (y > -height / 2 * 0.33) {
      specularMaterial("lime");
    }
    if (y > height / 2 * 0.66) {
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