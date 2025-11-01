
function setup() {
  createCanvas(windowWidth, windowHeight);

}

function draw() {
  background(0, 50);
  noFill();
  stroke(255);

  //Studiere mal den Code ab hier. Welche Blöcke wiederholen sich?
  //Welche Werte verändern sich?
  for (i = 0; i < 10; i++) {
    ellipse(i * 200, height / 2, 200, 200);
  }
}
