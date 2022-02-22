function preload() {}

async function catchImg() {
  const response = await fetch('../images/rusty.jpg');
  print(response);
  const blob = await response.blob();
  print(blob);
  const imgB = await createImageBitmap(blob);
  print(imgB);
  const img = createImage(width, height);
  img.pixels = imgB;
  img.updatePixels();
  image(imgB, 0, 0);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  catchImg()
    .then(response => {
      print("OK");
    })
    .catch(error => {
      print(error);
    });
}

function draw() {}
