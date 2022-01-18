var rain = [];
var angle = 0;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    for (i = 0; i < 128; i++) {
        rain[i] = new Drip();
    }
    //print(1, rain[0]);

    ambientLight(255); // white light
    //pointLight(255, 255, 255, 0, 0, width);

    frameRate(10);
    //noLoop();
}

function draw() {
    background(0);
    rotateX(PI / 2);
    // if (angle < PI / 2) {
    //     angle += PI / 2 / 256;
    // }
    rotateX(angle);

    //print(2, rain[0]);
    for (i = 0; i < rain.length; i++) {
        //print(3, i);
        rain[i].update();
        rain[i].display();
    }


}


class Drip {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(-width / 2, width / 2);
        this.y = random(-height / 2, height / 2);
        this.z = random(-width / 2, width / 2);
        this.diameter = random(2);
    }

    update() {
        if (this.y < 0) {
            this.y += random(10);
            this.diameter *= 1.02;
        } else {
            this.reset();
        }
    }

    display() {
        //push();
        //translate(this.x, this.y, this.z);
        //ambientLight(0, 0, 255);
        //noStroke();
        //sphere(this.diameter, 12, 12); too slow
        //plane(this.diameter, 2 * this.diameter);
        stroke(0, 0, 255);
        strokeWeight(4 * this.diameter);
        point(this.x, this.y, this.z);
        //pop();
    }
}