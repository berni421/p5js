var flakes = [];
var spin = 0.0;
var fRate = 10;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    ambientLight('white'); // white light
    frameRate(fRate);
}

function draw() {
    background(0);

    rotateY(spin);
    spin += 0.01;

    push(0);
    noStroke();
    fill(0, 100, 0);
    translate(0, height / 2, 0);
    rotateX(PI / 2);
    plane(width * 4);
    pop();

    // add flakes until some time
    if (frameCount < fRate * 10) {
        for (i = 0; i < 10; i++) {
            flakes.push(new Flake());
            flakes.push(new Flake());
        }
    }

    for (i = 0; i < flakes.length; i++) {
        flakes[i].display();
        flakes[i].update();

        // Clean up lost flake
        if (flakes[i].lost()) {
            flakes.splice(i, 1);
        }
    }
}

class Flake {
    constructor() {
        this.position = createVector(random(-width / 2, width / 2), -height / 2, random(-width / 2, width / 2));
        this.velocity = createVector(random(-0.01, 0.01), random(1), random(0.01));
        this.acceleration = createVector(random(-0.01, 0.01), random(1), random(-0.1, 0.1));
        this.size = 4;
        this.landed = false;
    }

    update() {
        if (!this.landed) {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            if (this.position.y < -height / 2 || this.position.y >= height / 2 - this.size) {
                this.position.y = height / 2 - this.size;
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.velocity.z = 0;
                this.acceleration.x = 0;
                this.acceleration.y = 0;
                this.acceleration.z = 0;
                this.landed = true;
                this.size = this.size * 2;
            }
        }
    }

    lost() {
        var l = (this.position.x < -width * 2 ||
            this.position.x > width * 2 ||
            this.position.z < -width * 2 ||
            this.position.z > width * 2)
        return l;
    }

    display() {
        stroke('white');
        strokeWeight(this.size);
        point(this.position);
    }
}