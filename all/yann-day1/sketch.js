// let shapeId = 0

import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";
import { SpringNumber } from "../../shared/spring.js";

const spring = new SpringNumber({
  position: 0, // start position
  frequency: 0.7, // oscillations per second (approximate)
  halfLife: 0.1, // time until amplitude is halved
});

let clickX = 0;
let clickY = 0;
let dragging = false;
let centerX;
let centerY;
let objSize;
let insideCircle;
let Sound;
let prevGridState = "";

let isFinished = false;

window.preload = function () {
  Sound = loadSound("./sound/blob.wav");
  //console.log("Sound loaded");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.mousePressed = function () {
  clickX = mouseX;
  clickY = mouseY;

  if (insideCircle) dragging = true;
};

window.mouseReleased = function () {
  dragging = false;
};

window.draw = function () {
  background(255);

  const sceneSize = min(width, height);

  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  insideCircle = dist(mouseX, mouseY, centerX, centerY) < objSize / 2;
  const halfWidth = objSize / tan(60);
  let strokeW = 20;
  const firstCircleSize = 20;

  let offsetX = 0;
  let offsetY = 0;
  if (dragging) {
    offsetX = mouseX - clickX;
    offsetY = mouseY - clickY;
  }

  if (isFinished) {
    fill(255, 255, 0);
    noLoop();
    setTimeout(() => {
      sendSequenceNextSignal();
    }, 500);
    // circle(centerX, centerY, objSize);
  }

  fill(0);
  noStroke();
  const gridCountX = ceil(map(abs(offsetX), 1, objSize / 2, 1, 5, true));
  const gridCountY = ceil(map(abs(offsetY), 1, objSize / 2, 1, 5, true));
  // 1 + floor((mouseX / width) * 5);

  const pointSizeX = map(gridCountX, 1, 5, objSize, 5);
  const pointSizeY = map(gridCountY, 1, 5, objSize, 5);

  let pointSize = 20;

  if (gridCountX === 5 && gridCountY === 5) {
    isFinished = true;
    //console.log("Finished");
    pointSize = firstCircleSize; // Replace with the size of your first circle
  } else if (gridCountX > 1 && gridCountY > 1) {
    pointSize = pointSize; // Replace with the size you want when the grid is bigger than 1x1
  } else {
    pointSize = min(pointSizeX, pointSizeY);
  }

  // const initialCircleSize = 20; // Set the desired size for the initial circle
  // const pointSize = initialCircleSize;

  // Create a string representation of the current grid state
  const currentGridState = `${gridCountX}-${gridCountY}`;

  // Check if the current grid state is different from the previous one
  if (currentGridState !== prevGridState) {
    Sound.play();
    // Update the previous grid state
    prevGridState = currentGridState;
  }

  spring.target = pointSize;
  spring.step(deltaTime / 150); // deltaTime is in milliseconds, we need it in seconds

  let count = 0;

  for (let x = 1; x <= gridCountX; x++) {
    for (let y = 1; y <= gridCountY; y++) {
      const xPos = map(
        x,
        0,
        gridCountX + 1,
        centerX - objSize * 0.75,
        centerX + objSize * 0.75
      );
      const yPos = map(
        y,
        0,
        gridCountY + 1,
        centerY - objSize * 0.75,
        centerY + objSize * 0.75
      );

      // fill(0);
      // if (x == 1 && y == 1) {
      //   console.log(xPos);
      //   fill(255, 0, 0);
      // }
      circle(xPos, yPos, spring.position);
    }
  }

  // Debug
  // push();
  // strokeW = 20;

  // fill(255, 0, 0);
  // noStroke();
  // const gridCount = 5;
  // pointSize = strokeW;

  // for (let x = 0; x < gridCount; x++) {
  //   for (let y = 0; y < gridCount; y++) {
  //     const xPos = map(
  //       x,
  //       0,
  //       gridCount - 1,
  //       centerX - objSize / 2,
  //       centerX + objSize / 2,
  //       x
  //     );
  //     const yPos = map(
  //       y,
  //       0,
  //       gridCount - 1,
  //       centerY - objSize / 2,
  //       centerY + objSize / 2,
  //       y
  //     );
  //     circle(xPos, yPos, pointSize);
  //   }
  // }
  // pop();

  if (dragging) {
    cursor("grabbing");
  } else {
    cursor(insideCircle ? "grab" : "default");
  }
};
