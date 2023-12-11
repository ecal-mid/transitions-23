import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"
let finished = false

let layer1;
let layer2;
let points = [];
let radius = 100;
let colorChange = 0;
let objSize = 0;
let gridPoints = [];
let isAllGridPointsActive = false;
let soundEffect;
let soundEffect2;
let soundPlayed = false;
let soundPlayed2 = false;



window.preload = function () {
  soundEffect = loadSound('assets/SCRATCH.mp3');
  soundEffect2 = loadSound('assets/WOOSH.mp3');

}

const springSize = new SpringNumber({
  position: 30, // start position
  frequency: 3, // oscillations per second (approximate)
  halfLife: 0.15, // time until amplitude is halved
});

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.active = false;
  }

  display() {
    push();
    fill(255, 0, 0);
    if (this.active) fill(0, 0, 255);
    circle(this.x, this.y, 10);
    pop();
  }
}

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  const sceneSize = min(width, height);
  objSize = sceneSize / 2;

  layer1 = createGraphics(windowWidth, windowHeight);
  layer1.background(255);

  layer2 = createGraphics(windowWidth, windowHeight);
  layer2.background(255);
  //layer2.clear();
  //angleMode(DEGREES)

  //console.log(objSize);

  let spacing = 20; // Adjust the spacing as needed

  for (let x = 0; x <= width; x += spacing) {
    for (let y = 0; y <= height; y += spacing) {
      let d = dist(width / 2, height / 2, x, y);
      if (d < objSize / 2) {
        gridPoints.push(new Point(x, y));
      }
    }
  }
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.mouseDragged = function () {
  if (!soundPlayed) {
    soundPlayed = true; // Update the flag to indicate that the sound has been played
    soundEffect.play(); // Play the sound
    soundEffect.loop();
  }
  // Check all the grid points and set active to true if the mouse is over it
  for (let i = 0; i < gridPoints.length; i++) {
    if (dist(mouseX, mouseY, gridPoints[i].x, gridPoints[i].y) < radius / 2) {
      gridPoints[i].active = true;

    }
  }

  if (isPointInsideLargeCircle(mouseX, mouseY))
    points.push({ x: mouseX, y: mouseY });
  // console.log(mouseX)

  isAllGridPointsActive = gridPoints.every((point) => point.active);

  if (isAllGridPointsActive) {
    springSize.target = objSize;
    soundEffect.stop();
    // Update the spring
  }

}

window.draw = function () {

  const sceneSize = min(width, height);
  objSize = sceneSize / 2;
  springSize.step(deltaTime / 1000);


  // SECOND LAYER (UNDERNEATH)

  layer2.push();
  layer2.background(255);
  layer2.rectMode(CENTER);
  layer2.translate(width / 2, height / 2);
  layer1.noStroke();
  layer2.fill(colorChange);
  layer2.square(0, 0, springSize.position);
  layer2.pop();
  // FIRST LAYER
  layer1.push();
  layer1.translate(width / 2, height / 2);
  layer1.fill(0);
  layer1.circle(0, 0, objSize);
  layer1.pop();

  // ERASE

  layer1.erase();
  points.forEach((point) => {
    layer1.ellipse(point.x, point.y, radius, radius);
  })

  if (isAllGridPointsActive) {
    layer1.clear();
    if (soundPlayed2 == false) {
      soundEffect2.play();
      soundPlayed2 = true;
    }
  }

  layer1.noErase();
  // DRAW IMAGES

  image(layer2, 0, 0);

  image(layer1, 0, 0);

  //   gridPoints.forEach((point) => {
  //     point.display();
  //   });

  if (springSize.position == objSize) {
    // colorChange = lerp(colorChange, 0, springSize.position);
    sendSequenceNextSignal(); // finish sketch
    noLoop();
  }

}

function isPointInsideLargeCircle(x, y) {
  let distanceFromCenter = dist(x, y, width / 2, height / 2);
  return distanceFromCenter <= objSize / 2;
}

