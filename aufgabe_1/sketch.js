let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let sliderMin = 50;
let sliderMax = 500;
let sliderSize = 200;

let valueSlider;

let circleA;
let circleB;

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  valueSlider = createSlider(sliderMin, sliderMax, ((sliderMax + sliderMin) / 2));
  valueSlider.position(CANVAS_WIDTH / 2 - (sliderSize / 2), CANVAS_HEIGHT - 100);
  valueSlider.size(sliderSize);

  circleA = {
    pos: createVector(0, 0),
    velocity: createVector(5, 5),
    diameter: 50
  }

  circleB = {
    pos: createVector(0, 0),
    velocity: createVector(5, 5),
    diameter: 50
  }

  // circle start positions
  circleA.pos.x = CANVAS_WIDTH / 4;
  circleA.pos.y = CANVAS_HEIGHT / 2;
  circleB.pos.x = CANVAS_WIDTH / 4 * 3;
  circleB.pos.y = CANVAS_HEIGHT / 2;
}

function draw() {
  background(220);
  strokeWeight(10);

  circleA.diameter = valueSlider.value();
  circleB.diameter = (sliderMax + sliderMin) - valueSlider.value();

  checkCanvasCollision(circleA, circleB);
  checkCircleCollision(circleA, circleB);

  circleA.pos.add(circleA.velocity);
  circleB.pos.add(circleB.velocity);

  circle(circleA.pos.x, circleA.pos.y, circleA.diameter);
  circle(circleB.pos.x, circleB.pos.y, circleB.diameter);
}

function checkCanvasCollision(...circles) {
  circles.forEach(circle => {
    const nextPos = p5.Vector.add(circle.pos, circle.velocity);

    if (nextPos.x - circle.diameter / 2 <= 0 || nextPos.x + circle.diameter / 2 >= CANVAS_WIDTH) {
      circle.velocity.x *= -1;
    }
    if (nextPos.y - circle.diameter / 2 <= 0 || nextPos.y + circle.diameter / 2 >= CANVAS_HEIGHT) {
      circle.velocity.y *= -1;
    }
  });
}

function checkCircleCollision(...circles) {
  const veclocityChanges = [];

  circles.forEach((circle, i) => {
    const circleNextPos = p5.Vector.add(circle.pos, circle.velocity);

    circles.forEach((compareCircle, j) => {
      if (i !== j) {
        const compareCircleNextPos = p5.Vector.add(compareCircle.pos, compareCircle.velocity);

        if (dist(circleNextPos.x, circleNextPos.y, compareCircleNextPos.x, compareCircleNextPos.y) < (circle.diameter / 2 + compareCircle.diameter / 2)) {
          xDistance = abs(circleNextPos.x - compareCircleNextPos.x);
          yDistance = abs(circleNextPos.y - compareCircleNextPos.y);

          if (xDistance < yDistance) {
            veclocityChanges.push([circle, 'y']);
          } else {
            veclocityChanges.push([circle, 'x']);
          }
        }
      }
    });
  });

  veclocityChanges.forEach(([circle, axis]) => {
    if (axis === 'x') {
      circle.velocity.x *= -1;
    } else {
      circle.velocity.y *= -1;
    }
  });
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}
