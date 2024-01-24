import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";
import { SpringNumber } from "../../shared/spring.js";

let pg;
let endCircleScale = 0;
let endCrossScale = 1;
let lastPointX;
let lastPointY;
let isDrawing = false;
let Sound;
let started = false;

window.preload = function () {
  Sound = loadSound("./sound/squish.mp3");
  //console.log("Sound loaded");
};

window.setup = function () {
  background(255);
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  const sceneSize = min(width, height);
  let smallCircleRadius = 10;
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  pg = createGraphics(Math.round(objSize), Math.round(objSize));
  pg.pixelDensity(1);

  Sound.setVolume(0);
  Sound.loop();
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.mousePressed = function () {
  isDrawing = true;
  Sound.play();
  started = true;
};

window.mouseReleased = function () {
  isDrawing = false;

  lastPointX = undefined;
  lastPointY = undefined;
  Sound.stop();
};

function soundEffect() {
  let mouseXSpeed = abs(pmouseX - mouseX);
  let mouseYSpeed = abs(pmouseY - mouseY);
  let volume = map(mag(mouseXSpeed,mouseYSpeed), 0, 100, 0, 1);
  Sound.setVolume(volume);

  //console.log(volume);
  //console.log("sound on");
}

window.draw = function () {
  background(255);

  const sceneSize = min(width, height);
  let smallCircleRadius = 60;
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const halfWidth = objSize / tan(60);
  const strokeW = 20;

  fill(0);
  noStroke();
  rectMode(CENTER);
  strokeWeight(strokeW);
  stroke(0);
  if(started )
    endCrossScale = lerp(endCrossScale, objSize/(objSize+strokeW), 0.1);
  line(
    centerX - (objSize / 2) * endCrossScale,
    centerY,
    centerX + (objSize / 2) * endCrossScale,
    centerY
  );
  line(
    centerX,
    centerY - (objSize / 2) * endCrossScale,
    centerX,
    centerY + (objSize / 2) * endCrossScale
  );

  // Draw the larger circle
  if (isDrawing) {
    noFill();
    soundEffect();
    // stroke(0);
    //  x  ellipse(centerX, centerY, objSize);

    // Draw the smaller circle linked to mouseX and mouseY
    // fill(0, 150, 255);

    // Calculate the distance from the mouse to the center of the larger circle
    let distance = dist(mouseX, mouseY, centerX, centerY);

    let x = mouseX;
    let y = mouseY;
    // If thex   mouse is outside the larger circle, constrain the small circle to the circular boundary
    // if (distance > 300 - smallCircleRadius) {
    let angle = atan2(mouseY - centerY, mouseX - centerX);
    let d = dist(mouseX, mouseY, centerX, centerY);
    x = centerX + cos(angle) * min(d, objSize / 2 - smallCircleRadius);
    y = centerY + sin(angle) * min(d, objSize / 2 - smallCircleRadius);
    //} else {
    // If the mouse is inside the larger circle, directly set the small circle's position to the mouse coordinates
    // pg.ellipse(mouseX, mouseY, smallCircleRadius * 12);
    // }

    x = x - centerX + objSize / 2;
    y = y - centerY + objSize / 2;

    pg.noStroke();
    pg.fill(0);

    if (lastPointX === undefined) {
      lastPointX = x;
      lastPointY = y;
    }

    pg.stroke(0);
    pg.strokeWeight(smallCircleRadius * 2);
    pg.line(lastPointX, lastPointY, x, y);

    // pg.ellipse(x, y, smallCircleRadius * 2);

    lastPointX = x;
    lastPointY = y;
  }
  // pg.ellipse(
  // mouseX - centerX + objSize / 2,
  // mouseY - centerY + objSize / 2,
  // );

  pg.loadPixels();

  let alpha = 0;

  // let d = 1;
  let pixelCount = pg.width * pg.height;
  let halfImage = 4 * pixelCount;

  for (let i = 0; i < pg.width; i += 1) {
    for (let j = 0; j < pg.height; j += 1) {
      let index = 4 * (i + j * pg.width);
      let d = dist(i, j, pg.width / 2, pg.height / 2);
      if (d > pg.width / 2 - 1) {
        alpha += 255;
      } else {
        alpha += pg.pixels[index + 3];
      }
      // Red.
      // pg.pixels[index] = 0;
      // Green.
      // pg.pixels[index + 1] = 0;
      // Blue.
      // pg.pixels[index + 2] = 0;
      // Alpha.
      // pg.pixels[index + 3] = 255;
    }
  }

  alpha /= pixelCount;
  //console.log(alpha);

  image(pg, centerX - objSize / 2, centerY - objSize / 2);

  if (alpha >= 254.5) {
    endCircleScale = lerp(endCircleScale, 1, 0.1);
    // fill(255, 0, 0);
    // noStroke();
    // circle(centerX, centerY, objSize * endCircleScale);

    noLoop();

    setTimeout(() => {
      sendSequenceNextSignal();
    }, 500);
  }
};
