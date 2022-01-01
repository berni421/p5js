var flake;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    ambientLight(255); // white light
    flake = new Flake();
}

function draw() {
    background(0);
    flake.display();
}



class Flake {
    constructor() {
        this.position = createVector(0, 0, 0);
        this.velocity = createVector(random(-1, 1), random(1), random(1));
        this.acceleration = createVector(0, 1, 0);
        this.size = 16;
    }

    update() {
    }

    display() {
        stroke(0, 0, 255); //blue
        strokeWeight(4 * this.size);
        point(this.position);
    }
}