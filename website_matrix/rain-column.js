class RainColumn {
  constructor(x, z) {
    this.column = [];
    for (let y = -height / 2; y < height / 2; y += fontSize) {
      const drop = new RainDrop(x, y, z);
      this.column.push(drop);
    }
  }
  update() {
    for (let i = 0; i < this.column.length; i++) {
      this.column[i].update();
    }
  }
  display() {
    const height = this.column.length;
    for (let i = 0; i < height; i++) {
      this.column[i].display();
    }
  }
}