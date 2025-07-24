let poffinX = 400;
let poffinY = 300;
let flowers = [];

function setup() {
  createCanvas(800, 500);
}

function draw() {
  background(245, 245, 255);

  // Blink every few seconds
  let blink = frameCount % 180 < 10;

  // Draw flower trail
  for (let f of flowers) {
    drawFlower(f.x, f.y, f.color);
  }

  // Move Poffin toward the mouse
  let speed = 2;
  let dx = mouseX - poffinX;
  let dy = mouseY - poffinY;
  let distToMouse = dist(mouseX, mouseY, poffinX, poffinY);

  if (distToMouse > 1) {
    poffinX += dx * 0.05;
    poffinY += dy * 0.05;

    // Add flower every few frames while moving
    if (frameCount % 8 === 0) {
      let f = {
        x: poffinX,
        y: poffinY + 80, // beneath poffin
        color: color(random(200, 255), random(100, 200), random(200, 255))
      };
      flowers.push(f);
    }
  }

  // Draw Poffin
  push();
  translate(poffinX, poffinY);
  drawPoffin(blink);
  pop();
}

//  flower 
function drawFlower(x, y, c) {
  push();
  translate(x, y);
  noStroke();
  fill(c);
  for (let a = 0; a < TWO_PI; a += PI / 2.5) {
    let px = cos(a) * 6;
    let py = sin(a) * 6;
    ellipse(px, py, 8, 8);
  }
  fill(255, 220, 100); // flower center
  ellipse(0, 0, 6, 6);
  pop();
}

// Poffin creature
function drawPoffin(blink) {
  noStroke();
  ellipseMode(CENTER);
  rectMode(CENTER);

  // FLOATING EFFECT
  let floatY = sin(frameCount * 0.05) * 4;
  translate(0, floatY);

  // Body
  fill(255, 220, 240);
  ellipse(0, 50, 60, 80); // body

  // Feet
  fill(240, 180, 200);
  ellipse(-15, 90, 16, 10);
  ellipse(15, 90, 16, 10);

  // Arms
  fill(255, 200, 230);
  ellipse(-35, 50, 15, 25);
  ellipse(35, 50, 15, 25);

  // Fluffy head
  for (let i = 0; i < 3; i++) {
    fill(255, 220 - i * 10, 250, 70);
    ellipse(0, 0, 100 - i * 10, 80 - i * 10);
  }

  // Ears / tufts
  fill(255, 200, 240, 180);
  ellipse(-40, -30, 30, 25);
  ellipse(40, -30, 30, 25);

  // Eyes
  fill(255);
  ellipse(-15, -10, 16, 16);
  ellipse(15, -10, 16, 16);

  fill(30);
  if (blink) {
    ellipse(-15, -10, 6, 4);
    ellipse(15, -10, 6, 4);
  } else {
    ellipse(-15, -10, 6, 6);
    ellipse(15, -10, 6, 6);
  }

  // Blush
  fill(255, 150, 200, 120);
  ellipse(-30, 10, 10, 6);
  ellipse(30, 10, 10, 6);

  // Smile
  stroke(80);
  strokeWeight(1.5);
  noFill();
  arc(0, 10, 20, 10, 0, PI);
}

