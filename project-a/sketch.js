/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/
let x1 = 0;
let y1 = 0;
let x2;
let y2;

let stage = "worms";
let poffinX = 400;
let poffinY = 300;
let flowers = [];

let clouds = [];
let grasses = [];
let butterflies = [];

let heartCheckpoints = [];
let heartHits = 0;
let heartFinished = false;
let heartGenerated = false;

let flowerBursts = [];
let explosionStartedAt = null;
let explosionDuration = 1500;
let maxBurstPerFrame = 20;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
    x2 = width;
    y2 = height;
    angleMode(DEGREES);

    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: random(width),
            y: random(50, 150),
            speed: random(0.2, 0.5),
        });
    }
    for (let i = 0; i < width; i += 5) {
        grasses.push({ x: i, h: random(30, 60), offset: random(1000) });
    }
    for (let i = 0; i < 6; i++) {
        butterflies.push({
            x: random(width),
            y: random(height / 2, height - 100),
            speed: random(0.5, 1),
            wingOffset: random(1000),
            color: color(random(200, 255), random(100, 200), random(200, 255)),
        });
    }
}

function generateHeartCheckpoints() {
    heartCheckpoints = [];
    heartHits = 0;
    heartFinished = false;

    let centerX = width / 2;
    let centerY = height / 2;
    let scale = 10;

    for (let t = 0; t <= 360; t += 10) {
        let x = 16 * pow(sin(t), 3);
        let y = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);

        heartCheckpoints.push({
            x: centerX + x * scale,
            y: centerY - y * scale,
            hit: false,
        });
    }
}

function draw() {
    background(255, 245, 255);

    if (stage === "worms") {
        moveTowardMouse();
        drawFlowerWorm(x1, y1, color(255, 200, 230));
        drawFlowerWorm(x2, y2, color(200, 200, 255));

        if (dist(x1, y1, x2, y2) < 5 && !heartGenerated) {
            stage = "toddler";
            poffinX = (x1 + x2) / 2;
            poffinY = (y1 + y2) / 2;
            generateHeartCheckpoints();
            heartGenerated = true;
        }
    }

    if (stage === "toddler" || stage === "adult") {
        drawFlowerTrail();
        movePoffin();

        if (stage === "toddler") {
            drawHeartCheckpoints();

            let allHit = true;
            for (let pt of heartCheckpoints) {
                let d = dist(poffinX, poffinY, pt.x, pt.y);
                if (!pt.hit && d < 15) {
                    pt.hit = true;
                    heartHits++;
                }
                if (!pt.hit) allHit = false;
            }

            if (allHit && !heartFinished) {
                heartFinished = true;
                triggerFlowerExplosion();
            }

            if (heartFinished) {
                drawFlowerExplosion();
                if (millis() - explosionStartedAt > explosionDuration) {
                    stage = "adult";
                    poffinX = 400;
                    poffinY = 300;
                    flowerBursts = [];
                }
            }
        }

        push();
        translate(poffinX, poffinY);
        if (stage === "toddler") drawToddlerPoffin();
        else drawAdultPoffin(frameCount % 180 < 10);
        pop();

        if (stage === "adult") {
            drawBackgroundElements();
        }
    }
}

function moveTowardMouse() {
    if (x1 < mouseX) x1 += 2;
    else if (x1 > mouseX) x1 -= 2;
    if (y1 < mouseY) y1 += 2;
    else if (y1 > mouseY) y1 -= 2;
    if (x2 < mouseX) x2 += 2;
    else if (x2 > mouseX) x2 -= 2;
    if (y2 < mouseY) y2 += 2;
    else if (y2 > mouseY) y2 -= 2;
}

function movePoffin() {
    let dx = mouseX - poffinX;
    let dy = mouseY - poffinY;
    let d = dist(mouseX, mouseY, poffinX, poffinY);
    if (d > 1) {
        poffinX += dx * 0.05;
        poffinY += dy * 0.05;

        if (stage === "adult" && frameCount % 8 === 0) {
            flowers.push({
                x: poffinX,
                y: poffinY + 40,
                color: color(random(200, 255), random(100, 200), random(200, 255)),
            });
        }
    }
}

function drawHeartCheckpoints() {
    stroke(255, 150, 150, 150);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of heartCheckpoints) {
        vertex(pt.x, pt.y);
    }
    endShape(CLOSE);

    for (let pt of heartCheckpoints) {
        drawFlower(
            pt.x,
            pt.y,
            pt.hit ? color(100, 255, 150) : color(255, 100, 150)
        );
    }
}

function drawFlower(x, y, c) {
    push();
    translate(x, y);
    noStroke();
    fill(c);
    for (let a = 0; a < 360; a += 72) {
        let px = cos(a) * 6;
        let py = sin(a) * 6;
        ellipse(px, py, 8, 8);
    }
    fill(255, 220, 100);
    ellipse(0, 0, 6, 6);
    pop();
}

function drawFlowerTrail() {
    for (let f of flowers) {
        drawFlower(f.x, f.y, f.color);
    }
}

function drawFlowerWorm(x, y, colorTone) {
    push();
    translate(x, y);
    drawFlower(0, 0, colorTone);
    drawFlower(-25, 5, colorTone);
    drawFlower(-45, 10, colorTone);

    fill(255);
    ellipse(-8, -5, 10, 10);
    ellipse(8, -5, 10, 10);
    fill(30);
    ellipse(-8, -5, 4, 4);
    ellipse(8, -5, 4, 4);
    fill(255, 180, 200, 180);
    ellipse(-12, 5, 6, 4);
    ellipse(12, 5, 6, 4);
    stroke(100);
    strokeWeight(1.2);
    noFill();
    arc(0, 6, 12, 6, 0, 180);
    pop();
}

function drawToddlerPoffin() {
    noStroke();
    ellipseMode(CENTER);
    let floatY = sin(frameCount * 0.05) * 2;
    translate(0, floatY);

    fill(255, 230, 250);
    ellipse(0, 30, 70, 60);
    fill(255, 200, 230);
    ellipse(-30, 30, 20, 35);
    ellipse(30, 30, 20, 35);
    fill(255, 180, 160);
    ellipse(-15, 60, 12, 8);
    ellipse(15, 60, 12, 8);

    fill(255, 245, 255);
    ellipse(0, -10, 55, 55);
    fill(255);
    ellipse(-12, -15, 18, 18);
    ellipse(12, -15, 18, 18);
    fill(30, 30, 60);
    ellipse(-12, -15, 10, 10);
    ellipse(12, -15, 10, 10);
    fill(255);
    ellipse(-15, -18, 4, 4);
    ellipse(-9, -12, 2, 2);
    ellipse(9, -12, 4, 4);
    ellipse(15, -18, 2, 2);
    fill(255, 180, 200, 160);
    ellipse(-20, -5, 8, 5);
    ellipse(20, -5, 8, 5);
    stroke(120);
    strokeWeight(1.5);
    noFill();
    arc(0, 0, 20, 10, 0, 180);

    fill(160, 200, 150);
    rect(-1, -38, 2, 10, 2);
    drawFlower(0, -45, color(255, 180, 200));
}

function drawAdultPoffin(blink) {
    noStroke();
    ellipseMode(CENTER);
    rectMode(CENTER);
    let floatY = sin(frameCount * 0.05) * 4;
    translate(0, floatY);
    fill(255, 220, 240);
    ellipse(0, 50, 60, 80);
    fill(240, 180, 200);
    ellipse(-15, 90, 16, 10);
    ellipse(15, 90, 16, 10);
    fill(255, 200, 230);
    ellipse(-35, 50, 15, 25);
    ellipse(35, 50, 15, 25);
    for (let i = 0; i < 3; i++) {
        fill(255, 220 - i * 10, 250, 70);
        ellipse(0, 0, 100 - i * 10, 80 - i * 10);
    }
    drawFlower(-35, -45, color(255, 180, 200));
    drawFlower(35, -45, color(255, 180, 200));
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
    fill(255, 150, 200, 120);
    ellipse(-30, 10, 10, 6);
    ellipse(30, 10, 10, 6);
    stroke(80);
    strokeWeight(1.5);
    noFill();
    arc(0, 10, 20, 10, 0, 180);
}

function drawBackgroundElements() {
    drawSun();
    drawClouds();
    drawGrass();
    drawButterflies();
}

function drawSun() {
    push();
    translate(width - 100, 100);
    noStroke();
    for (let r = 80; r > 30; r -= 10) {
        fill(255, 220, 100, 30);
        ellipse(0, 0, r * 2);
    }
    fill(255, 240, 120);
    ellipse(0, 0, 60);
    pop();
}

function drawClouds() {
    noStroke();
    fill(255, 255, 255, 180);
    for (let c of clouds) {
        ellipse(c.x, c.y, 60, 40);
        ellipse(c.x + 20, c.y + 10, 50, 30);
        ellipse(c.x - 20, c.y + 10, 50, 30);
        c.x += c.speed;
        if (c.x > width + 60) c.x = -60;
    }
}

function drawGrass() {
    stroke(100, 200, 100);
    strokeWeight(2);
    for (let g of grasses) {
        let sway = sin(frameCount * 0.1 + g.offset) * 5;
        line(g.x, height, g.x + sway, height - g.h);
    }
}

function drawButterflies() {
    for (let b of butterflies) {
        let bob = sin(frameCount * 0.03 + b.wingOffset) * 1.5;
        push();
        translate(b.x, b.y + bob);
        stroke(80, 50);
        strokeWeight(0.6);
        line(0, -3, -2, -6);
        line(0, -3, 2, -6);
        noStroke();
        fill(b.color);
        ellipse(-5, 0, 12, 16);
        ellipse(5, 0, 12, 16);
        fill(255, 240);
        ellipse(-6, 0, 6, 10);
        ellipse(6, 0, 6, 10);
        fill(80, 50, 100);
        ellipse(0, 0, 3, 8);
        pop();
        b.x += b.speed;
        if (b.x > width + 20) {
            b.x = -20;
            b.y = random(height / 2, height - 100);
        }
    }
}

function triggerFlowerExplosion() {
    explosionStartedAt = millis();
    flowerBursts = [];
}

function drawFlowerExplosion() {
    if (millis() - explosionStartedAt < explosionDuration) {
        for (let i = 0; i < maxBurstPerFrame; i++) {
            flowerBursts.push({
                x: width / 2 + random(-30, 30),
                y: height / 2 + random(-30, 30),
                angle: random(0, 360),
                speed: random(5, 20),
                color: color(random(200, 255), random(100, 200), random(200, 255)),
            });
        }
    }

    for (let f of flowerBursts) {
        drawFlower(f.x, f.y, f.color);
        f.x += cos(f.angle) * f.speed;
        f.y += sin(f.angle) * f.speed;
        f.speed *= 0.98;
    }
}