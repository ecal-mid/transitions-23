import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

const strokeW = 20;
let objSize = 0;
let mySound, mySound2;
let animationSpring;
let started = false;
window.preload = function () {
  soundFormats("mp3");
  mySound = loadSound("sounds/boing2.mp3");
  // mySound2 = loadSound("sounds/whoosh.mp3");
};

const circles = [];

class Circle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isOver = false;
    this.isActive = false;
    this.finishedTransition = false;

    this.springSize = new SpringNumber({
      position: size, // start position
      frequency: 2, // oscillations per second (approximate)
      halfLife: 3.15, // time until amplitude is halved
    });

    this.springRoundness = new SpringNumber({
      position: 100, // start position
      frequency: 2, // oscillations per second (approximate)
      halfLife: 3.15, // time until amplitude is halved
    });
  }

  draw() {
    //const x = spring.position;
    this.springSize.step(deltaTime / 1000); // deltaTime is in milliseconds, we need it in seconds));
    this.springRoundness.step(deltaTime / 1000); // deltaTime is in milliseconds, we need it in seconds));

    push();
    fill(0);
    rectMode(CENTER);
    // Use rect instead of circle, and add a fourth parameter for corner radius
    rect(
      this.x,
      this.y,
      this.springSize.position,
      this.springSize.position,
      abs(this.springRoundness.position)
    );

    pop();

    //when I click on a circle it grows
    if (this.isOver && started) {
      this.isActive = true;
      this.size = strokeW * 2;
      this.springSize.target = objSize / 4;
      this.springRoundness.target = 0;

      // for (const c of circles) {
      //   c.size += 0.1;
    } else {
      this.size = strokeW;
    }

    //console.log(this.springSize.position);
    if (this.isActive && floor(this.springSize.velocity) == 0) {
      this.finishedTransition = true;
    }
  }
}

const gridCount = 5;
const circleSize = 20;
window.mousePressed = function () {
  started = true;
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  objSize = sceneSize / 2;

  animationSpring = new SpringNumber({
    position: objSize + objSize / 5, // start position
    frequency: 4, // oscillations per second (approximate)
    halfLife: 2.15, // time until amplitude is halved
  });

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
      circles.push(new Circle(xPos, yPos, circleSize));
    }
  }
};

window.draw = function () {
  background(255);
  // if (mouseIsPressed) spring.target = 35;
  // else spring.target = 3;

  // // update the spring (make it move)
  // spring.step(deltaTime / 1000); // deltaTime is in milliseconds, we need it in seconds

  // spring "position" can be mapped to anything,
  // including positions, scale, rotations etc
  // it's just a number that tries to reach a target number
  // const x = spring.position;

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;

  const allCirclesAreActive = circles.every(
    (c) => c.isActive && c.finishedTransition
  );

  // DEBUG
  // push();
  // fill(255, 0, 0);
  // noStroke();
  // rectMode(CENTER);
  // rect(centerX, centerY, objSize, objSize);
  // pop();
  //I want my sound play only once when is active

  if (!allCirclesAreActive) {
    for (const c of circles) {
      const distance = dist(mouseX, mouseY, c.x, c.y);
      const wasOver = c.isOver;
      c.isOver = distance < c.size * 2;
      if (c.isOver && !wasOver) {
        mySound.play();
      }
    }

    if (circles.some((c) => c.isOver)) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }

    for (const c of circles) {
      c.draw();
    }
  } else {
    animationSpring.target = objSize;
    animationSpring.step(deltaTime / 1000); // deltaTime is in milliseconds, we need it in seconds

    push();
    fill(0);
    noStroke();
    rectMode(CENTER);
    rect(centerX, centerY, animationSpring.position, animationSpring.position);
    pop();

    if (floor(animationSpring.velocity) == 0) {
      sendSequenceNextSignal();
      noLoop();
    }
  }
};
