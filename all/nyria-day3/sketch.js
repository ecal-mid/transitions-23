import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";
import { SpringNumber } from "../../shared/spring.js";

let sound1;
let sound2;

window.preload = function () {
  sound1 = loadSound("./song/croix-pet.mp3");
  // sound2 = loadSound("./song/tombe.mp3");
};

const springCross = new SpringNumber({
  position: 10, // start position
  frequency: 4.5, // oscillations per second (approximate)
  halfLife: 0.15, // time until amplitude is halved
});

let isMousePressed = false;
let convergeSpeed = 2;

let addition = 0;
let targetSize = 20;
let currentRounds = 1;

let stage = 0;

const circles = [];
const gridCount = 5;

function getCircle(x, y) {
  if (x < 0 || x >= gridCount || y < 0 || y >= gridCount) return undefined;
  return circles[x * gridCount + y];
}

window.setup = function () {
  createCanvas(windowWidth, windowHeight);

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const strokeW = objSize / 20;

  const circleCount = gridCount * gridCount;

  for (let i = 0; i < circleCount; i++) {
    const c = new Circle(0, 0, strokeW / 2);
    circles.push(c);
  }
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      const circle = getCircle(x, y);
      circle.x = map(
        x,
        0,
        gridCount - 1,
        centerX - objSize / 2,
        centerX + objSize / 2
      );
      circle.y = map(
        y,
        0,
        gridCount - 1,
        centerY - objSize / 2,
        centerY + objSize / 2
      );

      const neighbourRight = getCircle(x + 1, y);
      if (neighbourRight) circle.neighbours.push(neighbourRight);
      const neighbourLeft = getCircle(x - 1, y);
      if (neighbourLeft) circle.neighbours.push(neighbourLeft);
      const neighbourBottom = getCircle(x, y + 1);
      if (neighbourBottom) circle.neighbours.push(neighbourBottom);
      const neighbourTop = getCircle(x, y - 1);
      if (neighbourTop) circle.neighbours.push(neighbourTop);
    }
  }

  angleMode(DEGREES);
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.mousePressed = function () {
  isMousePressed = true;
  currentRounds = min(currentRounds + 1, 5);
};

window.mouseReleased = function () {
  isMousePressed = false;
};

window.draw = function () {
  background(255);

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const strokeW = objSize / 20;

  switch (stage) {
    case 0:
      // Cross logic
      springCross.step(deltaTime / 1000);
      var crossSize = springCross.position;

      fill(0);
      noStroke();
      rectMode(CENTER);
      strokeWeight(strokeW);
      stroke(0);

      line(
        centerX - objSize / 2 - addition,
        centerY,
        centerX + objSize / 2 + addition,
        centerY
      );
      line(
        centerX,
        centerY - objSize / 2 - addition,
        centerX,
        centerY + objSize / 2 + addition
      );

      if (isMousePressed) {
        addition -= 1;
        sound1.play();
      } else {
        addition += 1;
      }

      addition = min(0, addition);

      if (addition <= -objSize / 2) {
        stage = 1;
      }

      break;

    case 1:
      // Circle logic

      const centerCircle = getCircle(2, 2);

      centerCircle.scaleSpring.target = 1;

      for (const circle of circles) {
        const d = dist(circle.x, circle.y, mouseX, mouseY);
        const padding = 30;
        if (d < circle.radius * circle.scaleSpring.position + padding) {
          circle.scaleSpring.velocity += 10;
          for (const neighbour of circle.neighbours) {
            neighbour.scaleSpring.velocity += 3;
            neighbour.scaleSpring.target = 1;
          }
        }
      }

      const allActive = circles.every(function (circle) {
        return circle.scaleSpring.position >= 0.97;
      });
      if (allActive) {
        stage = 2;
        setTimeout(function () {
          noLoop();
          sendSequenceNextSignal();
        }, 1000);
      }

      // for (let x = 1; x <= currentRounds; x++) {
      //   const xPos = centerX;
      //   const yPos =
      //     centerY - objSize + (x * objSize * 2) / (currentRounds + 1);

      //   //circle(xPos, yPos, springCircle.position);
      // }
      break;
    case 2:
      break;
  }

  for (const circle of circles) {
    circle.update();
    circle.draw();

    // if (!soundPlayed) {
    //   sound1.play();
    //   soundPlayed = true;
    // } else {
    //   sound1.stop();
    //   soundPlayed = false;
    // }
  }
};

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.scaleSpring = new SpringNumber({
      position: 0, // start position
      frequency: 4.5, // oscillations per second (approximate)
      halfLife: 0.15, // time until amplitude is halved
    });
    this.neighbours = [];
  }

  update() {
    this.scaleSpring.step(deltaTime / 1000);
  }

  draw() {
    fill(0);
    noStroke();
    circle(this.x, this.y, this.radius * this.scaleSpring.position * 2);
  }
}
