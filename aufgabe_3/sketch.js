let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let gazePredictionHistory;
let gazeFieldIndexHistory;

const NUM_ROWS = 2;
const NUM_COLS = 4;

let fieldWidth;
let fieldHeight;

let currentField;

let transitionInstructions = {};

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  gazePredictionHistory = new History(10);
  gazeFieldIndexHistory = new History(getTargetFrameRate() / 3);

  fill(255);

  webgazer.begin();
  webgazer.showVideo(false);
  webgazer.showPredictionPoints(false);

  webgazer.setGazeListener((data) => {
    if (data === null) {
        return;
    }

    const inBoundsPrediction = webgazer.util.bound(data);
    gazePredictionHistory.write(inBoundsPrediction);
  });

  fieldWidth = CANVAS_WIDTH / NUM_COLS;
  fieldHeight = CANVAS_HEIGHT / NUM_ROWS;
}

function draw() {
  background(0);

  if (!gazePredictionHistory.hasHistory()) {
    return;
  }
   
  const gazePrediction = gazePredictionHistory.getRecent();
  const nextFieldPosition = getFieldFromPredictionHistory(gazePrediction);

  if (currentField === undefined) {
    currentField = nextFieldPosition;
  }

  if ((transitionInstructions.progress === transitionInstructions.duration) && (currentField && !currentField.equals(nextFieldPosition))) {
    currentField = transitionInstructions.to || currentField;
    transitionInstructions = createTransitionInstructions(currentField, nextFieldPosition);
  }

  if (transitionInstructions.progress < transitionInstructions.duration) {
    transitionInstructions.progress++;
    nextPos = createVector(
      transitionInstructions.from.x + (transitionInstructions.to.x - transitionInstructions.from.x) * (transitionInstructions.progress / transitionInstructions.duration),
      transitionInstructions.from.y + (transitionInstructions.to.y - transitionInstructions.from.y) * (transitionInstructions.progress / transitionInstructions.duration)
    );

    circle(nextPos.x, nextPos.y, 40);
  } else {
    currentField = transitionInstructions.to || currentField;

    circle(currentField.x, currentField.y, 40);
  }
}

function createTransitionInstructions(from, to) {
  return {
    from: from.copy(),
    to: to.copy(),
    duration: 10,
    progress: 0,
  }
}

function getFieldFromPredictionHistory(position) {
  // using Math.min just for safety as there seem to be edgcases when looking at the very right or bottom edges
  const colIndex = Math.min(
    Math.floor(position.x / fieldWidth),
    NUM_COLS - 1
  );
  const rowIndex = Math.min(
    Math.floor(position.y / fieldHeight),
    NUM_ROWS - 1
  );

  gazeFieldIndexHistory.write({ rowIndex, colIndex });

  const indexesAdjustedForHistory = gazeFieldIndexHistory.getMajorityEvent();

  return createVector(
    indexesAdjustedForHistory.colIndex * fieldWidth + fieldWidth / 2,
    indexesAdjustedForHistory.rowIndex * fieldHeight + fieldHeight / 2
  );
}

class History {
  constructor(limit) {
    this.history = [];
    this.limit = limit;
  }

  write(position) {
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

  getMajorityEvent() {
    const counts = this.history.reduce((acc, entry) => {
      const key = JSON.stringify(entry);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const majorityKey = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    return JSON.parse(majorityKey);
  }
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  fieldWidth = CANVAS_WIDTH / NUM_COLS;
  fieldHeight = CANVAS_HEIGHT / NUM_ROWS;
}