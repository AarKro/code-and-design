let CANVAS_WIDTH = 400;
let CANVAS_HEIGHT = 400;

let diameter = 50;
let strokeColor = 0;
let rotation = 0;

let skewFactorA = 1;
let skewFactorB = 1;
let skewFactorC = 1;
let skewFactorD = 1;

let valueSlider;

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  valueSlider = createSlider(0, 100, 80);
  valueSlider.position(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT - 50);
  valueSlider.size(200);
}

function draw() {
  colorMode(HSB);

  fill(map(mouseX, 0, CANVAS_WIDTH, 0, 360), map(mouseY, 0, CANVAS_HEIGHT, 0, 100), valueSlider.value());

  strokeColor++;
  if (strokeColor > 360) {
    strokeColor = 0;
  }
  stroke(strokeColor, 100, 100);

  strokeWeight(2);
  diameter = map(mouseY, 0, CANVAS_HEIGHT, 10, 300) + map(mouseX, 0, CANVAS_WIDTH, 10, 300);

  rotation += 0.01;
  if (rotation > 360) {
    rotation = 0;
  }

  push();
  translate(mouseX, mouseY);
  rotate(rotation);

  quad(
    (0 - diameter / 2) * skewFactorA, 
    (0 - diameter / 2) * skewFactorA, 
    (0 + diameter / 2) * skewFactorB, 
    (0 - diameter / 2) * skewFactorB, 
    (0 + diameter / 2) * skewFactorC, 
    (0 + diameter / 2) * skewFactorC, 
    (0 - diameter / 2) * skewFactorD, 
    (0 + diameter / 2) * skewFactorD
  );

  pop();
}

function mouseClicked() {
  // skewFactorA = random(0, 2);
  // skewFactorB = random(0, 2);
  // skewFactorC = random(0, 2);
  // skewFactorD = random(0, 2);
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}
