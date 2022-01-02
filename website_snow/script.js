var flakes = [];
var spin = 0.0;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    ambientLight('white'); // white light
    //camera(0, height, width, 0, 0, 0, 0, 1, 0);
}

function draw() {
    background(0);

    // Rotate after some time
    if (frameCount > 50 * 5) {
        rotateY(spin);
        spin += 0.01;
    }

    push(0);
    noStroke();
    fill(0, 0, 50);
    translate(0, height / 2, 0);
    rotateX(PI / 2);
    plane(width * 4);
    pop();

    // add flakes until some time
    if (frameCount < 50 * 10) {
        for (i = 0; i < 5; i++) {
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

    // stop animation after a time
    // if (frameCount > 50 * 20) {
    //     noLoop();
    // }
}

class Flake {
    constructor() {
        this.position = createVector(random(-width / 2, width / 2), -height / 2, random(-width / 2, width / 2));
        this.velocity = createVector(random(-0.01, 0.01), random(1), random(0.01));
        this.acceleration = createVector(random(-0.01, 0.01), random(1), random(-0.1, 0.1));
        this.size = 2;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        if (this.position.y < -height / 2 || this.position.y > height / 2 - 2 * this.size) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.acceleration.z = 0;
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
        strokeWeight(4 * this.size);
        point(this.position);
    }
}