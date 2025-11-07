let CANVAS_WIDTH;
let CANVAS_HEIGHT;

const LEFT_EYE = 32;
const LEFT_EYE_BOUNDS = [67, 68, 69, 70];

let capture;

// clmtrackr tracker instance -- try MediaPipe FaceMesh -- or https://webgazer.cs.brown.edu/
let tracker;

let trackingHistory;

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
  
  trackingHistory = new TrackingHistory(50);
  
  fill(255);
}

function draw() {
  // background(0);

  const currentPos = tracker.getCurrentPosition();

  if (!currentPos) {
    return;
  }

  trackingHistory.add(currentPos);

  if (trackingHistory.getAll().length > 0) {
    const leftEye = getPoint(LEFT_EYE);

    beginShape();

    LEFT_EYE_BOUNDS
      .map(getPoint)
      .forEach((point) => vertex(point.x, point.y));

    endShape(CLOSE);

    circle(leftEye.x, leftEye.y, 5);
  }
}

function getPoint(maskIndex) {
  const mask = trackingHistory.getRecent();
  return createVector(mask[maskIndex][0], mask[maskIndex][1]);
}

class TrackingHistory {
  constructor(limit) {
    this.history = [];
    this.limit = limit;
  }

  add(position) {
    this.history.push(position);
    
    if (this.history.length > this.limit) {
      this.history.shift();
    }
  }

  getAll() {
    return this.history;
  }

  getRecent() {
    return this.history[this.history.length - 1];
  }
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}