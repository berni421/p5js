var img;
var imgEnds;
var planes = 9; // odd number for lighting problem
var gap;

function preload() {
    img = loadImage('../images/rusty-side.jpg');
    imgEnds = loadImage('../images/rusty.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    perspective(PI / 2, width / height);
    noStroke();
    gap = windowWidth / planes;
}

function draw() {
    background(0);
    //rotateX(frameCount * -0.01);
    rotateY(frameCount * -0.01);
    //rotateZ(frameCount * -0.01);
    translate(-windowWidth / 2, 0, 0);
    for (var i = 0; i < planes; i++) {
        push(); // sides
        texture(img);
        translate(gap * i, 0, 0);
        rotateY(PI / 2);
        plane(img.width, img.height, 24, 1, false);
        pop();
        
        push(); // ends
        texture(imgEnds);
        if (i % 2 == 0) {
            translate(gap * i + gap/2, 0, -img.width/2);
        } 
        else {
            translate(gap * i + gap/2, 0, img.width/2);
        }
        plane(gap, img.height, 24, 1, false);
        pop();
    }
}
