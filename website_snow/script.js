var flakes = [];
var ground;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    ambientLight(255); // white light
    //camera(0, height, width, 0, 0, 0, 0, 1, 0);
}

function draw() {
    background(0);

    for (i = 0; i < flakes.length; i++) {
        flakes[i].display();
        flakes[i].update();

        // Clean up lost flake and replace
        if (flakes[i].lost()) {
            flakes.splice(i, 1);

        }
    }

    // add flakes until some time
    if (frameCount < 50 * 10) {
        flakes.push(new Flake());
    }

    // stop animation after a time
    if (frameCount > 50 * 20) {
        noLoop();
    }
}

class Flake {
    constructor() {
        this.position = createVector(random(-width / 2, width / 2), -height / 2, 0);
        this.velocity = createVector(random(0.01), random(1), random(-0.01, 0.01));
        this.acceleration = createVector(random(0.01), random(0.1), random(-0.1, 0.1));
        this.size = 4;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        if (this.position.y < -height / 2 || this.position.y > height / 2) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.acceleration.z = 0;
        }
    }

    lost() {
        var l = (this.position.x < -width / 2 ||
            this.position.x > width / 2 ||
            this.position.z < -width ||
            this.position.z > width)
        return l;
    }

    display() {
        stroke(0, 0, 255); //blue
        strokeWeight(4 * this.size);
        point(this.position);
    }
}