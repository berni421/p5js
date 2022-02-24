function preload() {}

async function setTexture() {
  const response = await fetch('../images/rusty.jpg');
  print(response);
  const blob = await response.blob();
  print(blob);
  const o = URL.createObjectURL(blob);
  print(o);
  const i = await createImg(o, "rusty");
  i.hide();
  print(i);
  texture(i);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setTexture()
    .then(response => {
      print("OK");
    })
    .catch(error => {
      print("Error:", error);
    });
}

function draw() {
  background("black");
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  noStroke();
  box(400);
}