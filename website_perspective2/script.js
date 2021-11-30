
var img;
var step = 400;
function preload() {
    img = loadImage('../images/rusty-side.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    background(0);
    perspective(PI / 2, width / height);
    noStroke();
    texture(img);
    translate(-width, 0, 0);

    for (var i = 0; i < width * 2 / step; i++) {
        push();
        translate(step * i, 0, -width / 1.1);
        rotateY(PI / 2);
        plane(width / 1.1, height / 1.1, 24, 1, false);
        pop();
        if (i % 2 == 0) {
            push();
            translate(step * i, 0, -2 * width / 1.1);
            rotateY(PI);
            plane(step, height / 1.1, 24, 1, false);
            pop();
        }
        //  else {
        //     translate(0, 0, -step);
        //     rotateY(PI / 2);
        //     plane(step, height / 1.1, 24, 1, false);
        // }
        pop();
    }

}

function draw() {
    rotateY(frameCount * 0.01);
}