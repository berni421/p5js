function preload() {}

async function catchImg() {
  const response = await fetch('../images/rusty.jpg');
  print(response);
  const blob = await response.blob();
  print(blob);
  const o = URL.createObjectURL(blob);
  print(o);
  const i = createImg(o, "an image of rusty");
  print(i);
  i.position(50, 50);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("black");
  catchImg()
    .then(response => {
      print("OK");
    })
    .catch(error => {
      print("Error:", error);
    });
}

function draw() {}