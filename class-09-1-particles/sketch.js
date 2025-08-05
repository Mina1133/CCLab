let particles = []; // empty array!


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");


  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(-150, -50);
    particles[i] = new Particle(x, y);
  }


}


function draw() {
  background(50);




  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    // p.zigzag();
    p.reappear();
    p.display();
  }
}


//


class Particle {
  constructor(initX, initY) {
    this.x = initX;
    this.y = initY;
    this.len = random(20, 80);
    this.xSpeed = 0;
    this.ySpeed = random(5, 12);
    this.thickness = random(1, 3);

    this.type = random() < 0.5 ? "cat" : "dog";
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  zigzag() {
    this.x += random(-1, 1);
  }
  reappear() {
    if (this.y > height) {
      this.y = 0;
    }
  }
  display() {
    push();
    stroke(255, 60);
    strokeWeight(this.thickness)
    if (this.type === "cat") {

      // Cat head
      fill(200);
      ellipse(this.x, this.y, 10 * 2);

      // Cat ears
      triangle(this.x - 4 * 2, this.y - 4 * 2, this.x - 6 * 2, this.y - 10 * 2, this.x - 2 * 2, this.y - 6 * 2);
      triangle(this.x + 4 * 2, this.y - 4 * 2, this.x + 6 * 2, this.y - 10 * 2, this.x + 2 * 2, this.y - 6 * 2);

      // Cat eyes
      fill(0);
      ellipse(this.x - 2 * 2, this.y, 1.5 * 2, 1.5 * 2);
      ellipse(this.x + 2 * 2, this.y, 1.5 * 2, 1.5 * 2);

    } else if (this.type === "dog") {
      // Dog head
      fill(160, 120, 80);
      ellipse(this.x, this.y, 12 * 2);

      // Dog ears (droopy)
      ellipse(this.x - 6 * 2, this.y, 3 * 2, 6 * 2);
      ellipse(this.x + 6 * 2, this.y, 3 * 2, 6 * 2);

      // Dog eyes
      fill(0);
      ellipse(this.x - 2 * 2, this.y - 1 * 2, 1.5 * 2, 1.5 * 2);
      ellipse(this.x + 2 * 2, this.y - 1 * 2, 1.5 * 2, 1.5 * 2);

      // Dog nose
      ellipse(this.x, this.y + 2 * 2, 2 * 2, 1.5 * 2);
    }

    pop();
  }
}