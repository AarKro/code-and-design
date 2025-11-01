let CANVAS_WIDTH;
let CANVAS_HEIGHT;

const snakes = [];

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  background(255);

  angleMode(DEGREES);
  colorMode(HSL);

  snakes.push(
    new Snake(50, 50, 30, 20, 20, 145),
    new Snake(50, 50, 30, 20, 20, 220),
    new Snake(50, 50, 30, 20, 20, 340),
  );

  // let amount = 30;
  // for (let i = 0; i < amount; i++) {
  //   snakes.push(
  //     // x, y, initialSnakeLength, snakeSegmentLength, speed, color
  //     // new Snake(50, 50, 15, random(15, 50), random(10, 20), random(0, 360))
  //     new Snake(50, 50, 15, 20, 20, 360 / amount * i)
  //   );
  // }

  textSize(64);
}

function draw() {
  displayAverageSnakeLength();

  if (mouseIsPressed) {
    focusSnakes();
  }

  snakes.forEach(snake => {
    snake.update();
    snake.display();
  });
}

function focusSnakes() {
  snakes.forEach(snake => {
    snake.setGoalPos(mouseX, mouseY);
  });
}

function displayAverageSnakeLength() {
  const averageSnakeLength = snakes.reduce((sum, snake) => sum + snake.segments.length, 0) / snakes.length;
  
  fill(255);
  rect(11, 13, 90, 70);
  fill(0);
  text(int(averageSnakeLength), 20, 70);
}

class Snake {
  constructor(x, y, initialSnakeLength, snakeSegmentLength, speed, color) {
    this.segments = [];
    this.segmentLength = snakeSegmentLength;
    this.velocity = createVector(0, 0);
    this.color = color;
    this.speed = speed;
    this.goalSize = 20;
    this.goalPos = createVector(0, 0);

    this.setNewGoalPos();

    for (let i = 0; i < initialSnakeLength; i++) {
      this.segments.push(createVector(x - i * this.segmentLength, y));
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

  checkSelfCollision() {
    const head = this.getHead();
    const nextPos = p5.Vector.add(head, this.velocity);

    // dont bother checking collision for first 4 segments right after the head
    for (let i = 4; i < this.segments.length; i++) {
      const segment = this.segments[i];
      const prevSegment = this.segments[i - 1];

      const distanceToSegment = dist(nextPos.x, nextPos.y, segment.x, segment.y);

      if (distanceToSegment < this.segmentLength * 2) {
        // rotate velocity in the reverse direction of the segments vector
        const segmentDirection = p5.Vector.sub(segment, prevSegment).mult(-1).normalize();
        const angleBetween = this.velocity.angleBetween(segmentDirection);
        // rotate velocity by a 4th of the angle to smoothen the turn. We add 1 degree to avoid getting stuck in an infinite loop
        this.velocity.rotate((angleBetween / 4 + 1) * -1);
        break;
      }
    }
  }

  checkGoalCollision() {
    const head = this.getHead();
    const distanceToGoal = dist(head.x, head.y, this.goalPos.x, this.goalPos.y);

    if (distanceToGoal < this.segmentLength / 2 + this.goalSize / 2) {
      this.setNewGoalPos();
      this.grow();
    } else {
      this.increaseGoalSize();
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
    let directionToGoal = p5.Vector.sub(this.goalPos, head);
    directionToGoal.setMag(this.speed);

    const angleBetweenSnakeAndGoal = this.velocity.angleBetween(directionToGoal);

    if (abs(angleBetweenSnakeAndGoal) > 5) {
      directionToGoal = this.velocity.copy().rotate(angleBetweenSnakeAndGoal < 0 ? -5 : 5);
    };

    this.velocity.set(directionToGoal);
  }

  increaseGoalSize() {
    // increase goal size over time to prevent the snake from getting stuck
    this.goalSize += 0.8;
  }

  setNewGoalPos() {
    this.goalSize = 20;
    this.goalPos.set(createVector(random(50, CANVAS_WIDTH - 50), random(50, CANVAS_HEIGHT - 50)));
  }

  setGoalPos(x, y) {
    this.goalPos.set(createVector(x, y));
  }

  display() {
    noStroke();
    let lightness = 40;
    let factor = 2;
    // we subtract 2 to not render the last segment (tail) of the snake
    // it kinda messes up the pattern when spawning in
    for (let i = this.segments.length - 2; i >= 0; i--) {
      const segment = this.segments[i];
      lightness += factor;
      
      if (lightness > 80 || lightness < 20) {
        factor *= -1;
      }

      fill(this.color, 100, lightness);
      circle(segment.x, segment.y, this.segmentLength);
    }
  }
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}