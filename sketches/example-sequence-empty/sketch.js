import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let started = false;
let progress = 0;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
};
window.mousePressed = function () {
  started = true;
};

window.draw = function () {
  if (started) progress += deltaTime / 1000;

  const bg = sin(progress * PI);
  background(bg * 255, 0, 255);

  if (progress >= 1) {
    sendSequenceNextSignal(); // finish sketch
    noLoop();
  }
};
