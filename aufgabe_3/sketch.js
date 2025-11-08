let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let trackingHistory;

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  trackingHistory = new TrackingHistory(50);
  
  fill(255);

  webgazer.begin();
  webgazer.showVideo(false);
  webgazer.showPredictionPoints(false);

  webgazer.setGazeListener((data) => {
    if (data === null) {
        return;
    }

    trackingHistory.add(data);
  });
}

function draw() {
  background(0);

  if (trackingHistory.hasHistory()) {
    const gazePrediction = trackingHistory.getRecent();
    circle(gazePrediction.x, gazePrediction.y, 20);
  }
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

  hasHistory() {
    return this.history.length > 0;
  }
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}