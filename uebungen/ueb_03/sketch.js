let posX = 0;
let posY = 0;

let threshold = 100;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220, 10);

  if (posX == threshold) { 
    fill(255, 0, 0);
  }

  posY = random(-5, 5);

  rect(posX, posY, 50, 50);

  if (posX + 50 < width) {
    posX++;
  }
}