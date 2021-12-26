var rain = [];

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    for (i = 0; i < 100; i++) {
        rain[i] = new Drip();
    }
    //print(1, rain[0]);

    ambientLight(255); // white light

    frameRate(10);
    //noLoop();
}

function draw() {
    background(0);

    //print(2, rain[0]);
    for (i = 0; i < rain.length; i++) {
        //print(3, i);
        rain[i].update();
        rain[i].display();
    }
}


class Drip {
    constructor() {
        this.x = random(-width / 2, width / 2);
        this.y = random(-2 * height, -height);
        this.z = random(-width, 0);
        this.diameter = random(8);
    }

    update() {
        if (this.y > 0) {
            this.y += random(10);
        } else {
            this.x = random(-width / 2, width / 2);
            this.y = random(-2 * height, -height);
            this.z = random(-width, width);
            this.diameter = random(8);
        }
    }

    display() {
        push();
        translate(this.x, this.y, this.z);
        noStroke();
        ambientMaterial(0, 0, 255); // blue material
        sphere(this.diameter);
        pop();
    }
}