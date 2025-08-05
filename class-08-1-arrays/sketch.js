let x, y, xSpeed, ySpeed, dia;


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");


  x = width / 2;
  y = height / 2;
  xSpeed = random(-3, 3);
  ySpeed = random(-3, 3);
  dia = random(10, 30);
}


function draw() {
  background(220);


  // move
  x += xSpeed;
  y += ySpeed;
  // bounce
  if (x < 0 || x > width) {
    xSpeed *= -1; //xSpeed = xSpeed * -1;
  }
  if (y < 0 || y > height) {
    ySpeed *= -1;
  }
  // display
  circle(x, y, dia);
}
