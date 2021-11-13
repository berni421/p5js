function setup() {
    createCanvas(windowWidth, windowHeight);
    background("black");
}

function splat(x, y) {
    // the first blob of paint
    red = random(0, 255);
    green = random(0, 255);
    blue = random(0, 255);
    width = random(0, 10);
    height = random(0, 10);

    fill(red, green, blue);
    drag(x, y, width, height)
}

function drag(x, y, width, height) {
    // drag the blob of paint
    dx = random(0 - width, width);
    dy = random(0 - height, height);
    dwidth = random(0 - width, width);
    dheight = random(0 - height, height);
    for (var i = 0; i < 10; i++) {
        noStroke();
        ellipse(x, y, width, height);
        x = x + dx;
        y = y + dy;
        width = width + dwidth;
        height = height + dheight;
    }
}


function draw() {
    var x = random(0, windowWidth);
    var y = random(0, windowHeight);
    splat(x, y);

    if (frameCount >= 1000) {
        noLoop();
    }
}