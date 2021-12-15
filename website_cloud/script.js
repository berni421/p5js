var size;
var objectsPerRow;
var greyn;
var redn, bluen, greenn;

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    objectsPerRow = 50;
    size = windowWidth / objectsPerRow;
    redn = random(1000);
    bluen = redn + 1000;
    greenn = bluen + 1000;
    //frameRate(1);
    noStroke();
    //noLoop();
}

function draw() {
    var fixZ=0;
    var c1; 
    
    background(10);
    pointLight(255, 255, 255, 0, -height, width + height);
    shininess(50);

    rotateY(frameCount * 0.1);

    for (var x = -width / 2; x < width / 2; x = x + size) {
        for (var y = -height / 2; y < height / 2; y = y + size) {
            push();
            
            translate(x, y, fixZ);
            
            red = 255 * noise(redn);
            blue = 255 * noise(bluen);
            green = 255 * noise(greenn);
            c1 = color(red, blue, green);
            specularMaterial(c1);

            plane(size * 1.5);
            
            redn = redn + 0.6;
            bluen = bluen + 0.6;
            greenn = greenn + 0.6;
            
            pop();
            
            fixZ =+ 0.001
        }
    }
}
