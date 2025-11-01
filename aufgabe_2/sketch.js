let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let snake;

let goalPos;
const goalSize = 20;

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  angleMode(DEGREES);
  colorMode(HSL);

  goalPos = createVector(0, 0);
  setNewGoalPos();
  
  snake = new Snake(200, 200);
  snake.updateVelocity(goalPos);

  background(255);
}

function draw() {

  // drawGoal();

  snake.update();
  snake.display();
}

// function drawGoal() {
//   fill(100, 100, 50);
//   circle(goalPos.x, goalPos.y, goalSize);
// }

function setNewGoalPos() {
  let newGoalPos;

  do {
    newGoalPos = createVector(random(100, CANVAS_WIDTH - 100), random(100, CANVAS_HEIGHT - 100));
  } while (newGoalPos.dist(goalPos) < 150);

  goalPos.set(newGoalPos);
}

class Snake {
  constructor(x, y) {
    this.segments = [];
    this.segmentLength = 20;
    this.velocity = createVector(0, 0);

    for (let i = 0; i < 10; i++) {
      this.segments.push(createVector(x, y + i * this.segmentLength));
    }
  }

  update() {
    this.updateVelocity();

    this.checkCanvasCollision();
    
    // this.checkSelfCollision();

    this.getHead().add(this.velocity);

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

  // checkSelfCollision() {
  //   const head = this.getHead();
  //   const nextPos = p5.Vector.add(head, this.velocity);

  //   // dont bother checking collision for first 4 segments right after the head
  //   for (let i = 4; i < this.segments.length; i++) {
  //     const segment = this.segments[i];
  //     const prevSegment = this.segments[i - 1];

  //     const distanceToSegment = dist(nextPos.x, nextPos.y, segment.x, segment.y);

  //     if (distanceToSegment < this.segmentLength * 2) {
  //       // rotate velocity in the reverse direction of the segments vector
  //       const segmentDirection = p5.Vector.sub(segment, prevSegment).mult(-1).normalize();
  //       const angleBetween = this.velocity.angleBetween(segmentDirection);
  //       // rotate velocity by a 4th of the angle to smoothen the turn. We add 1 degree to avoid getting stuck in an infinite loop
  //       this.velocity.rotate((angleBetween / 4 + 1) * -1);
  //       break;
  //     }
  //   }
  // }

  checkGoalCollision() {
    const head = this.getHead();
    const distanceToGoal = dist(head.x, head.y, goalPos.x, goalPos.y);

    if (distanceToGoal < this.segmentLength / 2 + goalSize / 2) {
      setNewGoalPos();
      this.grow();
    }
  }

  checkCanvasCollision() {
    const head = this.getHead();
    const nextPos = p5.Vector.add(head, this.velocity);

    if (nextPos.x - this.segmentLength / 2 <= 0 || nextPos.x + this.segmentLength / 2 >= CANVAS_WIDTH) {
      this.velocity.x *= -1;
    }
    if (nextPos.y - this.segmentLength / 2 <= 0 || nextPos.y + this.segmentLength / 2 >= CANVAS_HEIGHT) {
      this.velocity.y *= -1;
    }
  }

  updateVelocity() {
    const head = this.getHead();
    let directionToGoal = p5.Vector.sub(goalPos, head);
    directionToGoal.setMag(10);

    const angleBetweenSnakeAndGoal = this.velocity.angleBetween(directionToGoal);

    if (abs(angleBetweenSnakeAndGoal) > 5) {
      directionToGoal = this.velocity.copy().rotate(angleBetweenSnakeAndGoal < 0 ? -5 : 5);
    };

    this.velocity.set(directionToGoal);
  }

  display() {
    noStroke();

    this.segments.forEach((segment, i) => {
      fill(10 * i, 100, 50);
      circle(segment.x, segment.y, this.segmentLength);
    });
  }
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}