const MAXX = 512;
const MAXY = MAXX;


function setup() {
    createCanvas(MAXX, MAXY);
    background("black");
}

function splat(x, y) {
    // blob of paint
    var red = random(255);
    var green = random(255);
    var blue = random(255);
    var width = random(100);
    var height = random(100);
    var seedx = width / 4;
    var seedy = height / 4;
    var dx, dy;
    var dwidth, dheight;

    fill(red, green, blue);
    noStroke();
    for (var i = 0; i < 10; i++) {
        ellipse(x, y, width, height);
        dx = random(0 - seedx, seedx);
        dy = random(0 - seedy, seedy);
        dwidth = random(0 - seedx, seedx);
        dheight = random(0 - seedy, seedy);
        x = x + dx;
        y = y + dy;
        width = width + dwidth;
        height = height + dheight;
    }
}

function spill(x, y) {
    // drops of paint
    var red = random(255);
    var green = random(255);
    var blue = random(255);
    var width = random(10);
    var height = random(10);
    var spread = 1.5;

    fill(red, green, blue);
    noStroke();
    for (var i = 0; i < 20; i++) {
        ellipse(x, y, width, height);
        var dx = random(-1 * spread * width, spread * width);
        var dy = random(-1 * spread * height, spread * height);
        x = x + dx;
        y = y + dy;
    }
}

function drag(x, y) {
    // thin line
    var red = random(255);
    var green = random(255);
    var blue = random(255);
    var width;
    var length = random(100);
    var dx, dy;

    stroke(red, green, blue);
    for (var i = 0; i < 10; i++) {
        dx = random(-1 * length, length);
        dy = random(-1 * length, length);
        width = random(4, 10);
        strokeWeight(width);
        line(x, y, x + dx, y + dy);
        x = x + dx;
        y = y + dy;
    }
}

function draw() {
    var x = random(0, MAXX);
    var y = random(0, MAXY);
    splat(x, y);
    x = random(0, MAXX);
    y = random(0, MAXY);
    drag(x, y);
    x = random(0, MAXX);
    y = random(0, MAXY);
    spill(x, y);
    if (frameCount >= 100) {
        noLoop();
    }
}