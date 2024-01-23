import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let x = 0;
let y = 0;
let corners = [0, 0, 0, 0];
let angle = 0; // Angle de rotation en degrés
let isDragging = false;
let sound1;
let done = false;
let soundPlayed = false;

window.preload = function () {
  sound1 = loadSound("./song/shaving.mp3");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  x = centerX;
  y = centerY;
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  let targetAngle = 0;
  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const radiusSize = objSize / 2;

  if (isDragging) targetAngle = 45;
  angle = lerp(angle, targetAngle, 0.5);
  const diagonalSize = Math.sqrt(2) * radiusSize; // 1.41 * objSize
  //Ajoutez cette condition pour jouer le son lorsque le rectangle atteint le bord du canevas
  if (
    !done &&
    (x < diagonalSize ||
      x > width - diagonalSize ||
      y < diagonalSize ||
      y > height - diagonalSize) &&
    !soundPlayed
  ) {
    sound1.setVolume(1);
    soundPlayed = true;
  } else if (
    !(
      x < diagonalSize ||
      x > width - diagonalSize ||
      y < diagonalSize ||
      y > height - diagonalSize
    )
  ) {
    sound1.setVolume(0);
    soundPlayed = false;
  }

  for (let i = 0; i < corners.length; i++) {
    if (corners[i] < radiusSize) {
      corners[i] -= (deltaTime / 1000) * 100;
      corners[i] = max(0, corners[i]);
    }

    // if (!soundPlayed) {
    //   sound1.play();
    //   soundPlayed = true;
    // } else {
    //   sound1.stop();
    //   soundPlayed = false;
    // }

    //
  }

  if (isDragging) {
    x = constrain(mouseX, radiusSize, width - radiusSize);
    y = constrain(mouseY, radiusSize, height - radiusSize);
    // sound1.play();
    if (!soundPlayed) {
      //sound1.play();
      //soundPlayed = true;
    }
  } else {
    sound1.stop();
    soundPlayed = false;
    x = lerp(x, width / 2, 0.2);
    y = lerp(y, height / 2, 0.2);
  }

  const distToLeft = x;
  const distToTop = y;
  const distToRight = width - x;
  const distToBottom = height - y;
  const distances = [distToTop, distToRight, distToBottom, distToLeft];

  for (let i = 0; i < corners.length; i++) {
    const minimumRadius = map(
      distances[i],
      radiusSize,
      diagonalSize,
      radiusSize,
      0,
      true
    );

    corners[i] = max(minimumRadius, corners[i]);
  }

  if (
    !done &&
    corners[0] >= radiusSize &&
    corners[1] >= radiusSize &&
    corners[2] >= radiusSize &&
    corners[3] >= radiusSize &&
    dist(x, y, centerX, centerY) < 1
  ) {
    done = true;
    //console.log("done");
    // sound1.play();
    noLoop();
    setTimeout(() => {
      sendSequenceNextSignal(); //
    }, 1000); // pour qu'il s'arrêteet donne place a l'autre code !
  }

  background(255);
  translate(x, y);
  rotate(radians(angle));
  fill(0);
  rect(0, 0, objSize, objSize, corners[0], corners[1], corners[2], corners[3]);
  resetMatrix();
};

window.mousePressed = function () {
  const sceneSize = min(width, height);
  const objSize = sceneSize / 2;

  if (!done && dist(mouseX, mouseY, x, y) < objSize / 2) {
    isDragging = true;
  }
  sound1.loop();
};

window.mouseReleased = function () {
  isDragging = false;
};

// window.mouseDragged = function () {
//   // console.log(distToLeft, radiusSize, diagonalSize);
//   // //console.log(r4);
//   // if (x < objSize) {
//   //   //r4 += 100;
//   //   //sound1.play();
//   // }
//   // if (y < objSize) {
//   //   //console.log(r1);
//   //   r1 += 3;
//   //   //sound1.play();
//   //   //ajouter sons raser la barbe
//   // }
//   // if (y > height - objSize) {
//   //   //console.log(r3);
//   //   r3 += 3;
//   //   //sound1.play();
//   // }
//   // if (x > width - objSize) {
//   //   //console.log(r2);
//   //   r2 += 3;
//   //   //sound1.play();
//   // }
// };
