class Score {
  constructor() {
    this.score = 0;
  }

  update() {
    this.score++;
  }

  intersect() {
    var x = bird.x;
    var y = bird.y;
    bird.colour = bird.colourSaved;
    for (var i = 0; i < ground.slabs.length; i++) {
      var minX = ground.slabs[i].x;
      var maxX = ground.slabs[i].x + ground.slabs[i].width;
      if (x > minX && x < maxX) {
        var groundY = ground.slabs[i].y;
        if (y > groundY) {
          this.score -= 10;
          bird.colourSaved = bird.colour;
          bird.colour = "red";
          break;
        }
      }
    }
    for (var i = 0; i < sky.clouds.length; i++) {
      var minX = sky.clouds[i].x - 25;
      var maxX = sky.clouds[i].x + 125;
      if (x > minX && x < maxX) {
        var cloudY = sky.clouds[i].y;
        if (y > cloudY - 75 - 12.5 && y < cloudY + 25) {
          this.score -= 10;
          bird.colourSaved = bird.colour;
          bird.colour = "red";
          break;
        }
      }
    }
  }

  display() {
    var score = this.score;
    fill("yellow");
    textSize(32);
    text(score, 3 * width / 4, height / 2);
  }
}