let CANVAS_WIDTH;
let CANVAS_HEIGHT;

let sliderMin = 50;
let sliderMax = 500;

let valueSlider;

const circleA = {
  x: 0,
  y: 0,
  diameter: 50,
  velocityX: 5,
  velocityY: 5
}

const circleB = {
  x: 0,
  y: 0,
  diameter: 50,
  velocityX: 5,
  velocityY: 5
}

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  valueSlider = createSlider(sliderMin, sliderMax, ((sliderMax + sliderMin) / 2));
  valueSlider.position(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT - 100);
  valueSlider.size(200);

  // circle start positions
  circleA.x = CANVAS_WIDTH / 4;
  circleA.y = CANVAS_HEIGHT / 2;
  circleB.x = CANVAS_WIDTH / 4 * 3;
  circleB.y = CANVAS_HEIGHT / 2;
}

function draw() {
  background(220);
  strokeWeight(10);

  circleA.diameter = valueSlider.value();
  circleB.diameter = (sliderMax + sliderMin) - valueSlider.value();

  checkCanvasCollision(circleA, circleB);
  checkCircleCollision(circleA, circleB);

  circleA.x += circleA.velocityX;
  circleA.y += circleA.velocityY;
  circleB.x += circleB.velocityX;
  circleB.y += circleB.velocityY;

  circle(circleA.x, circleA.y, circleA.diameter);
  circle(circleB.x, circleB.y, circleB.diameter);
}

function checkCanvasCollision(...circles) {
  circles.forEach(circle => {
    const nextX = circle.x + circle.velocityX;
    if (nextX - circle.diameter / 2 <= 0 || nextX + circle.diameter / 2 >= CANVAS_WIDTH) {
      circle.velocityX *= -1;
    }
  
    const nextY = circle.y + circle.velocityY;
    if (nextY - circle.diameter / 2 <= 0 || nextY + circle.diameter / 2 >= CANVAS_HEIGHT) {
      circle.velocityY *= -1;
    }
  });
}

function checkCircleCollision(...circles) {
  const veclocityChanges = [];

  circles.forEach((circle, i) => {
    const circleNextX = circle.x + circle.velocityX;
    const circleNextY = circle.y + circle.velocityY;

    circles.forEach((compareCircle, j) => {
      if (i !== j) {
        const compareCircleNextX = compareCircle.x + compareCircle.velocityX;
        const compareCircleNextY = compareCircle.y + compareCircle.velocityY;
       
        if (dist(circleNextX, circleNextY, compareCircleNextX, compareCircleNextY) < (circle.diameter / 2 + compareCircle.diameter / 2)) {
          xDistance = abs(circle.x - compareCircle.x);
          yDistance = abs(circle.y - compareCircle.y);
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
      circle.velocityX *= -1;
    } else {
      circle.velocityY *= -1;
    }
  });
}

function windowResized() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}
