let img;


function preload() {
  img = loadImage("assets/emoji.png");
}


function setup() {
  let canvas = createCanvas(500, 281);
  canvas.parent("p5-canvas-container");


  noCursor();
}


function draw() {
  background(100);


  imageMode(CENTER);
  image(img, mouseX, mouseY, 30, 30); //(img, x, y, (w), (h));
}
