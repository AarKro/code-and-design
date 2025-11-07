let CANVAS_WIDTH;
let CANVAS_HEIGHT;

const RIGHT_EYE = 27;
const LEFT_EYE = 32;

let capture;
let tracker;

const maskPositions = [];

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  capture = createCapture(VIDEO);
  capture.size(CANVAS_WIDTH, CANVAS_HEIGHT);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
  
  fill(255);
}

function draw() {
  background(0);

  const currentPos = tracker.getCurrentPosition();
  console.log(currentPos)
  if (!currentPos) {
    return;
  }

  maskPositions.push(currentPos);

  if (maskPositions.length > 0) {
    console.log(maskPositions)
    const leftEye = getPoint(LEFT_EYE);
    circle(leftEye.x, leftEye.y, 100);
  }
}

function getPoint(maskIndex) {
  return createVector(maskPositions[maskPositions.length - 1][maskIndex][0], maskPositions[maskPositions.length - 1][maskIndex][1]);
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}