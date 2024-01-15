import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let shapeId = 0;
let shapeType = "circle"; // Initial shape type
let shapeSizeX = 300; // Initial size of the shape
let shapeSizeY = 300; // Initial size of the shape
let targetSize = 300; // Target size when not expanding
let expanding = false; // Flag to track if the shape is expanding
let borderRadius = 9999;
let mySound;
let mySound2;
let played = false;
let finished = false;

window.preload = function () {
  soundFormats("mp3", "ogg", "wav");
  mySound = loadSound("sounds/son1.wav");
  mySound2 = loadSound("sounds/son2.wav");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  background(255);

  let sceneSize = min(width, height);

  let centerX = width / 2; // Calculate the x-coordinate of the center
  let centerY = height / 2; // Calculate the y-coordinate of the center
  let objSize = sceneSize / 2;
  let strokeW = objSize / 20;

  let rectLeft = centerX - objSize / 2;
  let rectRight = centerX + objSize / 2;
  let rectTop = centerY - objSize / 2;
  let rectBottom = centerY + objSize / 2;

  if (
    /* mouseX > rectLeft &&
    mouseX < rectRight &&
    mouseY > rectTop &&
    mouseY < rectBottom*/ true
  )
    if (mouseIsPressed /*&& shapeType === 'circle'*/) {
      // Gradually increase the size to 500 when expanding is true for circle
      shapeSizeX += 5; //(windowWidth - shapeSize) * 0.1;
      shapeSizeY += 5; //(windowWidth - shapeSize) * 0.1;
    } else {
      // For rectangle or when not expanding, keep the size constant at 100
      // shapeSize = 300;
      shapeSizeX = lerp(shapeSizeX, objSize, 0.2);
      shapeSizeY = lerp(shapeSizeY, objSize, 0.2);
    }

  shapeSizeX = max(shapeSizeX, objSize);
  shapeSizeY = max(shapeSizeY, objSize);

  // Draw a shape at the center
  fill(0); // Set fill color to black

  //if (shapeType === 'circle') {
  rectMode(CENTER);
  const realShapeSizeX = min(shapeSizeX, width);
  const realShapeSizeY = min(shapeSizeY, height);

  let xPressure = 0;
  let yPressure = 0;
  if (borderRadius > 0) {
    xPressure = shapeSizeX - realShapeSizeX;
    yPressure = shapeSizeY - realShapeSizeY;
    borderRadius = (max(shapeSizeX, shapeSizeY) - yPressure - xPressure) / 2;
    borderRadius = max(0, borderRadius);
  } else {
    shapeSizeX = min(shapeSizeX, width);
    shapeSizeY = min(shapeSizeY, height);
  }
  rect(centerX, centerY, realShapeSizeX, realShapeSizeY, borderRadius);

  const sizeForSound = min(height, width);

  const volume = map(realShapeSizeX, objSize, sizeForSound, 0, 1, true);
  mySound.setVolume(volume);
  const rate = map(realShapeSizeX, objSize, sizeForSound, 0, 1, true);
  mySound.rate(rate);

  const maxPressure = max(xPressure, yPressure);

  const volume2 = map(maxPressure, 0, 200, 0, 0.3, true);
  mySound2.setVolume(volume2);
  const rate2 = map(maxPressure, 0, 200, 0, 2, true);
  mySound2.rate(rate2);

  //console.log("x: " + realShapeSizeX + " radius " + borderRadius + "objsize " + objSize)

  if (realShapeSizeX <= objSize + 1 && borderRadius == 0 && !finished) {
    finished = true;
    sendSequenceNextSignal();
    noLoop();
    console.log("done");
  }

  // if (shapeSize >= windowWidth-1) {
  // If the size becomes 500 or more, switch to drawing a rectangle
  //shapeType = 'rectangle';
  //shapeSize = 300; // Reset size for the rectangle
  // }
  // }// else if (shapeType === 'rectangle') {
  // rectMode(CENTER);
  // rect(centerX, centerY, shapeSize, shapeSize);

  //}
};

window.touchStarted = function () {
  if (!played) {
    mySound.play(0, 1, 0);
    mySound.loop();
    mySound2.play(0, 1, 0);
    mySound2.loop();
    played = true;
  }

  // expanding = true; // Set expanding flag to true when mouse is pressed
};

window.mouseReleased = function () {
  // expanding = false; // Set expanding flag to false when mouse is released
  //  targetSize = 300; // Set the target size to 100 upon releasing the mouse
  //  shapeType = 'circle'; // Reset shape type to circle
};
