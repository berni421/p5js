function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

let wave = 0;
function draw() {
    skyBlue = color(100, 100, 200);
    background(skyBlue);
    pointLight(255, 255, 255, 0, -2 * height, 2 * (width + height));
    shininess(1000000);
    noStroke();

    // Sun
    push();
    translate(0, -height / 2, 0);
    pointLight(255, 255, 255, 0, height, 2 * (width + height));
    specularMaterial(color(255, 204, 0));
    sphere(width / 10);
    pop();

    // land
    pointLight(255, 204, 0, 0, -height / 2, 0);
    noStroke();
    let waveinc = 0.05;
    for (let x = -width; x < width; x++) {
        push();
        let y = sin(wave);
        translate(x, y * 20, 0);
        rotateX(PI / 3);
        if (y < -0.99) {
            specularMaterial(color("white"));
        } else {
            specularMaterial(color("blue"));
        }
        plane(4, 2 * height);
        pop();
        wave += waveinc;
    }
}
