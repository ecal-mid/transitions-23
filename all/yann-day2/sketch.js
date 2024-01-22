// let shapeId = 0

import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";
import { SpringNumber } from "../../shared/spring.js";

const scaleSpring = new SpringNumber({
  position: 1, // start position
  frequency: 0.7, // oscillations per second (approximate)
  halfLife: 0.1, // time until amplitude is halved
});

let mysound;

window.preload = function () {
  mysound = loadSound("./sound/bubble.mp3");
  //console.log("Sound loaded");
};

window.mousePressed = function () {
  // playing a sound file on a user gesture
  // is equivalent to `userStartAudio()`
  //mysound.play();
};

class Circle {
  constructor(x, y, s, pointSize) {
    this.x = x;
    this.y = y;
    this.squareSize = s;
    this.played = false;
    this.sound = mysound;
    this.sound.setVolume(1);
    this.pointSize = pointSize;
    this.spring = new SpringNumber({
      position: 0, // start position
      frequency: 2.7, // oscillations per second (approximate)
      halfLife: 0.2, // time until amplitude is halved
    });
    // this.r = r;
    // this.targetSize = s;
  }

  update() {
    this.spring.step(deltaTime / 1000);
  }

  draw() {
    fill(0);
    rectMode(CENTER);
    let size = map(
      this.spring.position,
      0,
      1,
      this.pointSize,
      this.squareSize + 1
    );
    let radius = map(this.spring.position, 0, 1, 100, 0, true);
    rect(this.x, this.y, size, size, radius);
  }

  isInMe(inputX, inputY) {
    let d = dist(inputX, inputY, this.x, this.y);
    if (d <= this.pointSize + 60) {
      if (!this.played) {
        //console.log("in");
        this.sound.play();

        this.played = true;
      }
      // console.log("in" + pos.x);
      // this.r = 0;
      this.spring.target = 1;
      // this.s = 7.5;
    } else {
      return false;
    }
  }

  isHover(inputX, inputY) {
    let d = dist(inputX, inputY, this.x, this.y);
    if (d <= this.pointSize + 60) {
      this.pointSize = 30;

      // this.s = 7.5;
    } else {
      this.pointSize = 20;

      return false;
    }
  }
}

let posList = [];
let isFinished = false;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(255);

  mysound.play();

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const halfWidth = objSize / tan(60);
  const gridCount = 5;

  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      const xPos = map(x, 0, gridCount - 1, -objSize / 2, +objSize / 2, x);
      const yPos = map(y, 0, gridCount - 1, -objSize / 2, +objSize / 2, y);
      const cellSizeBig = objSize / (gridCount - 1);
      let circle = new Circle(xPos, yPos, cellSizeBig, 20);
      circle.draw();
      posList.push(circle);
      //circle(xPos, yPos, pointSize);
      // rectMode(CENTER);
      // rect(xPos, yPos, pointSize * 8);
    }
  }
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  const sceneSize = min(width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;

  // fill(0);
  // noStroke();
  // rectMode(CENTER);
  // rect(centerX, centerY, objSize, objSize);

  // BASE
  const gridCount = 5;

  posList.forEach((element) => {
    element.update();
    // Check if the spring position of the element is greater than or equal to a threshold
  });

  isFinished = posList.every((element) => {
    return element.spring.position >= 0.9;
  });

  if (isFinished) {
    const cellSize = objSize / gridCount;
    const cellSizeBig = objSize / (gridCount - 1);
    scaleSpring.target = cellSize / cellSizeBig;

    setTimeout(() => {
      sendSequenceNextSignal();
    }, 3500);

    // noLoop();
  }

  scaleSpring.step(deltaTime / 1000); // deltaTime is in milliseconds, we need it in seconds

  // drawing things
  background(255);
  fill(0);
  noStroke();
  translate(centerX, centerY);
  scale(scaleSpring.position);

  posList.forEach((element) => {
    element.draw();
  });
  /*
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      const xPos = map(
        x,
        0,
        gridCount - 1,
        centerX - objSize / 2,
        centerX + objSize / 2,
        x
      );
      const yPos = map(
        y,
        0,
        gridCount - 1,
        centerY - objSize / 2,
        centerY + objSize / 2,
        y
      );
      //posList.push({ x: xPos, y: yPos });
      rectMode(CENTER);
      rect(
        xPos,
        yPos,
        pointSize * posList[y].s,
        pointSize * posList[y].s,
        posList[gridCount * x + y].r
      );
      console.log(pointSize, pointSize * posList[y].s);
      // rect(xPos, yPos, pointSize * 8);
    }
  }*/
};

window.mouseMoved = function () {
  const centerX = width / 2;
  const centerY = height / 2;
  //isInMe();
  posList.forEach((element) => {
    element.isHover(mouseX - centerX, mouseY - centerY);
  });
};

window.mouseDragged = function () {
  const centerX = width / 2;
  const centerY = height / 2;
  //isInMe();
  posList.forEach((element) => {
    element.isInMe(mouseX - centerX, mouseY - centerY);
  });
};
/*
function isInMe() {
  console.log("in");
  let pointSize = 20;
  posList.forEach((pos) => {
    let d = dist(mouseX, mouseY, pos.x, pos.y);
    if (d <= pointSize) {
      // console.log("in" + pos.x);
      pos.r = 0;
      pos.s = 10;
    } else {
      return false;
    }
  });

  console.log(posList);
}

// mySound.play();*/
