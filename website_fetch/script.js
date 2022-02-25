var img;
var speed = 0.001;

function preload() {
  img = loadImage('../images/rusty.jpg');
}

// async function setTexture() {
//   const response = await fetch('../images/rusty.jpg');
//   print(response);
//   const blob = await response.blob();
//   print(blob);
//   const o = URL.createObjectURL(blob);
//   print(o);
//   const i = await createImg(o, "rusty");
//   i.hide();
//   print(i);
//   texture(i);
// }

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // setTexture()
  //   .then(response => {
  //     print("OK");
  //   })
  //   .catch(error => {
  //     print("Error:", error);
  //   });
  texture(img);
}

function draw() {
  background("black");
  rotateX(frameCount * speed);
  rotateY(frameCount * speed);
  rotateZ(frameCount * speed);
  noStroke();
  box(height * 3);
}
