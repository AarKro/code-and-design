let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let snake;

let goalPos;
const goalSize = 10;

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  angleMode(DEGREES);

  snake = new Snake(200, 200);
  goalPos = createVector(random(CANVAS_WIDTH), random(CANVAS_HEIGHT));
  snake.updateVelocity(goalPos);
}

function draw() {
  background(255);

  drawGoal();

  snake.update();
  snake.display();
}

function drawGoal() {
  fill(0, 255, 0);
  circle(goalPos.x, goalPos.y, goalSize);
}

class Snake {
  constructor(x, y) {
    this.segments = [];
    this.segmentLength = 20;
    this.velocity = createVector(5, 0);

    for (let i = 0; i < 10; i++) {
      this.segments.push(createVector(x, y + i * this.segmentLength));
    }
  }

  update() {
    this.updateVelocity();

    this.segments[0].add(this.velocity);

    this.checkCanvasCollision();

    for (let i = 1; i < this.segments.length; i++) {
      const currSegment = this.segments[i];
      const prevSegment = this.segments[i - 1];

      const direction = p5.Vector.sub(prevSegment, currSegment);
      direction.setMag(this.segmentLength);
      currSegment.x = prevSegment.x - direction.x;
      currSegment.y = prevSegment.y - direction.y;
    }

    this.checkGoalCollision();
  }

  getHead() {
    return this.segments[0];
  }

  getTail() {
    return this.segments[this.segments.length - 1];
  }

  grow() {
    const tail = this.getTail();
    const newSegment = tail.copy().sub(this.velocity);
    this.segments.push(newSegment);
  }

  checkGoalCollision() {
    const head = this.getHead();
    const distanceToGoal = dist(head.x, head.y, goalPos.x, goalPos.y);

    if (distanceToGoal < this.segmentLength / 2 + goalSize / 2) {
      goalPos.set(random(CANVAS_WIDTH), random(CANVAS_HEIGHT));
      this.grow();
    }
  }

  checkCanvasCollision() {
    const head = this.getHead();

    if (head.x - this.segmentLength / 2 <= 0 || head.x + this.segmentLength / 2 >= CANVAS_WIDTH) {
      this.velocity.x *= -1;
    }
    if (head.y - this.segmentLength / 2 <= 0 || head.y + this.segmentLength / 2 >= CANVAS_HEIGHT) {
      this.velocity.y *= -1;
    }
  }

  updateVelocity() {
    const head = this.getHead();
    let directionToGoal = p5.Vector.sub(goalPos, head);
    directionToGoal.setMag(5);

    const angleBetweenSnakeAndGoal = this.velocity.angleBetween(directionToGoal);

    if (abs(angleBetweenSnakeAndGoal) > 3) {
      directionToGoal = this.velocity.copy().rotate(angleBetweenSnakeAndGoal < 0 ? -3 : 3);
    };

    this.velocity.set(directionToGoal);
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