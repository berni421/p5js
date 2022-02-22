function preload() {}

async function catchImg() {
  const response = await fetch('../images/rusty.jpg');
  print(response);
  const blob = await response.blob();
  print(blob);
  const img = await blob.text();
  image(img, 0, 0);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  catchImg()
    .then(response => {
      print("OK");
    })
    .catch(error => {
      print(error);
    });
}

function draw() {}