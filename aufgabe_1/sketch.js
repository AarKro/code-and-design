let CANVAS_WIDTH;
let CANVAS_HEIGHT;

const sliderMin = 50;
const sliderMax = 500;
const sliderSize = 200;

let valueSlider;

const circles = [];

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  valueSlider = createSlider(sliderMin, sliderMax, ((sliderMax + sliderMin) / 2));
  valueSlider.position(CANVAS_WIDTH / 2 - (sliderSize / 2), CANVAS_HEIGHT - 100);
  valueSlider.size(sliderSize);
  
  circles.push({
    pos: createVector(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2),
    velocity: createVector(5, 5),
    diameter: 50,
    mass: 1,
    fill: 255,
    strokeColor: 0,
  });
  circles.push({
    pos: createVector(CANVAS_WIDTH / 4 * 3, CANVAS_HEIGHT / 2),
    velocity: createVector(5, 5),
    diameter: 50,
    mass: 1,
    fill: 0,
    strokeColor: 255,
  });

  angleMode(DEGREES);
}

function draw() {
  background(map(valueSlider.value(), sliderMin, sliderMax, 5, 250));
  strokeWeight(0);

  updateCircleDimensions(circles);

  checkCanvasCollision(circles);
  checkCircleCollision(circles);

  circles.forEach(c => {
    fill(c.fill);

    c.pos.add(c.velocity);
    circle(c.pos.x, c.pos.y, c.diameter);
  });
}

function updateCircleDimensions(circles) {
  circles[0].diameter = valueSlider.value();
  circles[1].diameter = (sliderMax + sliderMin) - valueSlider.value();

  circles.forEach(circle => circle.mass = circle.diameter * 0.1);
}

function checkCanvasCollision(circles) {
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

function checkCircleCollision(circles) {
  circles.forEach((circle, i) => {
    const circleNextPos = p5.Vector.add(circle.pos, circle.velocity);

    circles.forEach((compareCircle, j) => {
      if (i !== j) {
        const compareCircleNextPos = p5.Vector.add(compareCircle.pos, compareCircle.velocity);

        if (dist(circleNextPos.x, circleNextPos.y, compareCircleNextPos.x, compareCircleNextPos.y) < (circle.diameter / 2 + compareCircle.diameter / 2)) {
          const normal = p5.Vector.sub(circle.pos, compareCircle.pos).normalize();
          const relativeVelocity = p5.Vector.sub(circle.velocity, compareCircle.velocity);
          const velocityAlongNormal = p5.Vector.dot(relativeVelocity, normal);

          if (velocityAlongNormal > 0) {
            return;
          }

          const impulse = (2 * velocityAlongNormal) / (circle.mass + compareCircle.mass);
          const circleImpulse = normal.copy().mult(impulse * compareCircle.mass);
          const compareCircleImpulse = normal.copy().mult(impulse * circle.mass);
          
          circle.velocity.sub(circleImpulse);
          compareCircle.velocity.add(compareCircleImpulse);
        }
      }
    });
  });
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}
