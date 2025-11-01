function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  for (let i = 0; i < 10; i++) {
    ellipse(100 * i, height / 2, 50, 50);
  }
}