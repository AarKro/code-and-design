let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let snake;

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  snake = new Snake(200, 200);
}

function draw() {
  background(255);

  snake.update(getNextPosition());
  snake.display();
}

function getNextPosition() {  
  const currentVelocity = snake.velocity;
  const randomAngleChange = random(-15, 15);
  const newVelocity = currentVelocity.copy().rotate(randomAngleChange);
  
  const head = snake.getHead();
  const nextPos = head.copy().add(newVelocity);

  return nextPos;
}

class Snake {
  constructor(x, y) {
    this.segments = [];
    this.segmentLength = 20;
    this.numSegments = 10;
    this.velocity = createVector(5, 0);

    for (let i = 0; i < this.numSegments; i++) {
      this.segments.push(createVector(x, y + i * this.segmentLength));
    }
  }

  getHead() {
    return this.segments[0];
  }

  update(targetVector) {
    this.segments[0].x = targetVector.x;
    this.segments[0].y = targetVector.y;

    for (let i = 1; i < this.segments.length; i++) {
      const currSegment = this.segments[i];
      const prevSegment = this.segments[i - 1];

      const direction = p5.Vector.sub(prevSegment, currSegment);
      direction.setMag(this.segmentLength);
      currSegment.x = prevSegment.x - direction.x;
      currSegment.y = prevSegment.y - direction.y;
    }
  }

  display() {
    noStroke();

    this.segments.forEach((segment, i) => {
      if (i === 0) {
        fill(0);
      } else {
        fill(150);
      }

      circle(segment.x, segment.y, this.segmentLength);
    });
  }
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}