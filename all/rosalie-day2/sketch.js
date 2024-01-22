import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let startTime;
let mySound, mySound2;

let firstAnimation = false;

const circles = [];
class Circle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.size = size;
    this.isActive = false;
    this.isOver = false;
  }

  draw() {
    this.x = lerp(this.x, this.targetX, 0.1);
    this.y = lerp(this.y, this.targetY, 0.1);

    let size = this.size;
    if (this.isOver) size += 10;

    if (this.isActive) circle(this.x, this.y, size);
  }
}
const gridCount = 5;
const circleSize = 20;
let bigCircleSize;
let bigCircleTargetSize;
let centerCircle;

window.preload = function () {
  soundFormats("mp3");
  mySound = loadSound("sounds/pop.mp3");
  mySound2 = loadSound("sounds/whoosh.mp3");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  startTime = millis(); // Initialiser le temps de départ

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  bigCircleSize = objSize;
  bigCircleTargetSize = objSize;
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      const xPos = map(
        x,
        0,
        gridCount - 1,
        centerX - objSize / 2,
        centerX + objSize / 2
      );
      const yPos = map(
        y,
        0,
        gridCount - 1,
        centerY - objSize / 2,
        centerY + objSize / 2
      );

      const c = new Circle(xPos, yPos, circleSize);
      circles.push(c);

      if (x === 2 && y === 2) centerCircle = c;
    }
  }
};

let mouseWasPressed;
window.draw = function () {
  background(255);

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;

  for (const c of circles) {
    const distance = dist(mouseX, mouseY, c.x, c.y);
    const isOver = distance < c.size / 2 && c.isActive;
    c.isOver = isOver;
  }

  if (circles.find((c) => c.isOver)) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  const allCirclesAreActive = circles.every((c) => c.isActive);

  if (!allCirclesAreActive) {
    for (const c of circles) {
      if (c.isOver && mouseIsPressed && !mouseWasPressed) {
        mySound.play();
        const inactiveCircles = circles.filter((c) => !c.isActive);
        const randomId = floor(random(0, inactiveCircles.length));
        const randomInactiveCircle = inactiveCircles[randomId];

        if (randomInactiveCircle) {
          randomInactiveCircle.isActive = true;
          randomInactiveCircle.x = c.x;
          randomInactiveCircle.y = c.y;
        }
        break;
      }
    }
  } else {
    //console.log("All circles are active");
    setTimeout(() => {
      sendSequenceNextSignal();
    }, 1000);
  }

  // const spacing = objSize / gridCount;

  // const elapsedTime = (millis() - startTime) / 1000; // Temps écoulé en secondes
  // const animationDuration = 5; // Durée de l'animation en secondes
  // let currentPointSize;

  // if (elapsedTime < animationDuration) {
  //   // Calcul de la taille actuelle du cercle
  //   currentPointSize = lerp(
  //     objSize,
  //     spacing / 2,
  //     elapsedTime / animationDuration
  //   );
  // } else {
  //   currentPointSize = spacing / 2; // Taille finale après la fin de l'animation
  // }

  bigCircleSize = lerp(bigCircleSize, bigCircleTargetSize, 0.1);

  fill(0);
  noStroke();
  fill(0, 0, 0);
  circle(centerX, centerY, bigCircleSize);

  fill(0);
  for (const c of circles) {
    c.draw();
  }

  mouseWasPressed = mouseIsPressed;
};

window.mousePressed = function () {
  const distance = dist(mouseX, mouseY, width / 2, height / 2);
  if (distance < bigCircleSize / 2 && !firstAnimation) {
    firstAnimation = true;
    bigCircleTargetSize = circleSize;
    mySound2.play();

    centerCircle.isActive = true;
  }
};
