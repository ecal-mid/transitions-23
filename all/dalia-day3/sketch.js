import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"


let circleRadius = 10; // Radius of the circles
let spacing = 100; // Spacing between circles
let cols = 5; // Number of columns
let rows = 5; // Number of rows
let circles = []; // Array to store circle objects
let angle = 0;
let spinning = false;
let crossCenterX, crossCenterY;
let mySound;
let played = false;
let finished = false;

const State = {
  NotActive: "not_active",
  WaitingForActive: "waiting_for_active",
  Active: "active",
  Finished: "finished",
}


const springScale = new SpringNumber({
  position: 1, // start position
  frequency: 1.5, // oscillations per second (approximate)
  halfLife: 0.1 // time until amplitude is halved
})

window.preload = function () {
  mySound = loadSound("sounds/son1.wav")

}

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  crossCenterX = width / 2;
  crossCenterY = height / 2;
  const sceneSize = min(width, height)

  const centerX = width / 2
  const centerY = height / 2
  const objSize = sceneSize / 2
  const strokeW = 20
  const crossRadius = objSize / 2

  // Loop through rows and columns to create circle objects with random start positions

  const padding = strokeW * 2
  for (let i = 0; i < rows; i++) {

    for (let j = 0; j < cols; j++) {

      const startPosition = getRandomPosition(crossRadius)

      let endX = centerX + map(i, 0, rows - 1, -crossRadius, crossRadius)// Calculate end X position
      let endY = centerY + map(j, 0, cols - 1, -crossRadius, crossRadius); // Calculate end Y position
      let circle = {

        endX: endX,
        endY: endY,
        xSpring: new SpringNumber({
          position: startPosition.x,// Random x position within canvas width
          frequency: 2.5, // oscillations per second (approximate)
          halfLife: 0.015 // time until amplitude is halved
        }),
        ySpring: new SpringNumber({
          position: startPosition.y, // Random y position within canvas height
          frequency: 2.5, // oscillations per second (approximate)
          halfLife: 0.015 // time until amplitude is halved
        }),
        scaleSpring: new SpringNumber({
          position: 0,
          frequency: 7.5, // oscillations per second (approximate)
          halfLife: 0.15 // time until amplitude is halved
        }),
        state: State.NotActive,
        delay: 0
      };
      circles.push(circle);

    }
  }
}

function getRandomPosition(radius) {


  const centerX = width / 2
  const centerY = height / 2

  const realWidth = width - 50
  const realHeight = height - 50
  const offsetVector = createVector(
    random(-realWidth / 2, realWidth / 2),
    random(-realHeight / 2, realHeight / 2))

  if (offsetVector.mag() < radius) // length of vector
  {

    offsetVector.setMag(radius + 100)
  }

  offsetVector.x += centerX
  offsetVector.y += centerY
  return offsetVector
}
window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

let stage = 0;
let count = 0;
window.draw = function () {

  springScale.step(deltaTime / 500)
  let xScale = springScale.position;


  const dt = deltaTime / 1000

  const sceneSize = min(width, height)

  const centerX = width / 2
  const centerY = height / 2
  const objSize = sceneSize / 2
  const strokeW = 20
  const crossRadius = objSize / 2

  for (let circle of circles) {

    if (circle.state === State.WaitingForActive) {

      circle.delay -= dt;
      if (circle.delay <= 0) {
        circle.scaleSpring.target = 1
        circle.state = State.Active
      }
    }

    circle.xSpring.step(dt)
    circle.ySpring.step(dt)
    circle.scaleSpring.step(dt)

  }
  if (spinning) {

    let mouseCircle = findOverlappingCircle(mouseX, mouseY, crossRadius);
    if (mouseCircle) {


      mouseCircle.state = State.Finished
      if (mouseCircle.state = State.Finished) {
        //console.log("test")
        count++
        if (count >= 25) {

          setTimeout(() => {

            stage = 1;
          }, 2500);
        }
      }

      mouseCircle.xSpring.target = mouseCircle.endX
      mouseCircle.ySpring.target = mouseCircle.endY
    }
  }
  background(255); // Clear the canvas on each frame
  fill(0);
  noStroke()
  for (let circle of circles) {


    const size = circleRadius * 2 * circle.scaleSpring.position
    ellipse(circle.xSpring.position, circle.ySpring.position, size, size); // Draw circles at their current positions
  }
  push()


  stroke(0)
  strokeWeight(strokeW);
  translate(crossCenterX, crossCenterY);
  scale(xScale)
  if (spinning) {

    if (mouseIsPressed) {
      if (!played) {
        mySound.play()
        played = true
      }
      if (!mySound.isPlaying()) {
        played = false
      }
      angle += 10; // Change the speed of rotation here
    }
    else {

      angle += 5; // Change the speed of rotation here
    }
    // Update cross center to follow the mouse only when spinning
    crossCenterX = mouseX;
    crossCenterY = mouseY;
  }

  rotate(angle);
  line(-crossRadius, 0, crossRadius, 0);
  line(0, -crossRadius, 0, crossRadius);

  pop()

  if (stage == 1) {
    if (springScale.position <= 0.01) {
      finished = true
      sendSequenceNextSignal()
      noLoop()
      //console.log("done");

    }


    springScale.target = 0;
  }


}

window.mouseMoved = function () {


}

window.mousePressed = function () {
  if (!spinning) {

    spinning = true
    for (let circle of circles) {



      circle.state = State.WaitingForActive
      circle.delay = random(0, 6.0)
    }
  }

}


const findOverlappingCircle = function (x, y, checkRadius) {

  for (let i = 0; i < circles.length; i++) {


    if (circles[i].state === State.Active) {


      let d = dist(x, y, circles[i].xSpring.position, circles[i].ySpring.position);


      if (d < circleRadius + checkRadius) {


        return circles[i]; // Return the hovered circle

      }
    }
  }
  return undefined;
};
