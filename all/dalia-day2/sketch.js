import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let centerX;
let centerY;
let startSize = 450;
const endSize = 20;
let clickSize;
let clickPositionX;
let clickPositionY;
let rectHeight = startSize; // Initial height of the rectangle
let rectWidth = startSize;
let targetHeight = endSize; // Target height for the rectangle
let targetWidth = endSize;
let easing = 0.05; // Easing factor for smooth transition
const startWeight = 0;
let targetWeight = 20;
let rectWeight = 0;
let mySound;
let played = false;
let finished = false;
let prevSize = 0;
let sizeChangeSpeedSmooth = 0;

let changeHeight = false; // Flag to indicate if height change is in progress
let changeWidth = false;
let changeWeight = false;
let currentSize = startSize;
let isDragging = false;

window.preload = function () {
  //soundFormats('mp3', 'ogg', 'wav');
  mySound = loadSound("sounds/son1.wav");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  centerX = width / 2;
  centerY = height / 2;

  let sceneSize = min(width, height);
  let objSize = sceneSize / 2;
  startSize = objSize;
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  centerX = width / 2;
  centerY = height / 2;
  let sceneSize = min(width, height);
  let objSize = sceneSize / 2;

  if (currentSize > endSize) currentSize += (deltaTime / 1000) * 100;

  if (isDragging) {
    const distAtClick = dist(centerX, centerY, clickPositionX, clickPositionY);
    const distNow = dist(centerX, centerY, mouseX, mouseY);
    const distOffset = distNow - distAtClick;

    currentSize = clickSize + distOffset;
  }

  currentSize = constrain(currentSize, endSize, startSize);
  background(255);
  rectMode(CENTER);
  fill(0);
  // rect(centerX, centerY, 300, rectHeight, rectWeight);
  // rect(centerX, centerY, rectWidth, 300, rectWeight);
  const currentWeight = map(
    currentSize,
    startSize,
    endSize,
    startWeight,
    targetWeight,
    true
  ); //;
  rect(centerX, centerY, startSize, currentSize, currentWeight);
  rect(centerX, centerY, currentSize, startSize, currentWeight);

  if (changeHeight) {
    updateRectHeight();
  }
  if (changeWidth) {
    updateRectWidth();
  }
  if (changeWeight) {
    updateRectWeight();
  }

  const dt = deltaTime / 1000;
  const sizeChangeSpeed = abs(currentSize - prevSize) / dt;
  sizeChangeSpeedSmooth = lerp(sizeChangeSpeedSmooth, sizeChangeSpeed, 0.4);

  if (currentSize <= endSize + 1 && !finished && played) {
    finished = true;
    sendSequenceNextSignal();
    mySound.stop();
    played = false;
    noLoop();
    console.log("done");
  }

  prevSize = currentSize;

  const volume2 = map(sizeChangeSpeedSmooth, 0, 1000, 0, 1, true);
  mySound.setVolume(volume2);
  const rate2 = map(sizeChangeSpeedSmooth, 0, 1000, 0, 2, true);
  //console.log(rate2)
  mySound.rate(rate2);
};

window.mousePressed = function () {
  if (!played && currentSize > endSize) {
    mySound.play(0, 1, 0);
    mySound.loop();
    played = true;
  }
  changeHeight = true; // Set the flag to start changing height
  changeWidth = true;
  changeWeight = true;
  if (
    mouseX > centerX - startSize / 2 &&
    mouseX < centerX + startSize / 2 &&
    mouseY > centerY - startSize / 2 &&
    mouseY < centerY + startSize / 2
  ) {
  }

  isDragging = true;
  clickPositionX = mouseX;
  clickPositionY = mouseY;
  clickSize = currentSize;
};

window.mouseReleased = function () {
  isDragging = false;
};

window.updateRectHeight = function () {
  let diff = targetHeight - rectHeight;
  rectHeight += diff * easing; // Smoothly transition towards the target height

  if (abs(diff) < 0.1) {
    rectHeight = targetHeight; // Ensure the target height is reached
    changeHeight = false; // Stop height change once target is reached
  }
};

window.updateRectWidth = function () {
  let diff = targetWidth - rectWidth;
  rectWidth += diff * easing; // Smoothly transition towards the target height

  if (abs(diff) < 0.1) {
    rectWidth = targetWidth; // Ensure the target height is reached
    changeWidth = false; // Stop height change once target is reached
  }
};

window.updateRectWeight = function () {
  let diff = targetWeight - rectWeight;
  rectWeight += diff * easing; // Smoothly transition towards the target height

  if (abs(diff) < 0.1) {
    rectWeight = targetWeight; // Ensure the target height is reached
    changeWeight = false; // Stop height change once target is reached
  }
};
