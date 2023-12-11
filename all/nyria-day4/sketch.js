import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let shapes = [];
let totalShapes = 25; // Nombre total de carrés que vous souhaitez afficher
let createdShapes = 0; // Nombre de carrés déjà créés
let sequenceFinished = false;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  const objSize = min(width, height) / 2;

  const centerX = width / 2;
  const centerY = height / 2;
  const gridCount = 5;
  let strokeW = objSize / 20;

  const cellSize = objSize / gridCount;
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
      const xPosEnd = map(
        x,
        0,
        gridCount - 1,
        centerX - objSize / 2 + cellSize / 2,
        centerX + objSize / 2 - cellSize / 2
      );
      const yPosEnd = map(
        y,
        0,
        gridCount - 1,
        centerY - objSize / 2 + cellSize / 2,
        centerY + objSize / 2 - cellSize / 2
      );

      shapes.push({
        x: xPos,
        y: yPos,
        xEnd: xPosEnd,
        yEnd: yPosEnd,
        pointSize: strokeW,
        size: 5,
        targetSize: cellSize,
      });
    }
  }
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  const objSize = min(width, height) / 2;

  const centerX = width / 2;
  const centerY = height / 2;
  background(255);
  noStroke();

  for (let i = shapes.length - 1; i >= 0; i--) {
    let shape = shapes[i];

    if (dist(mouseX, mouseY, shape.x, shape.y) < shape.pointSize * 2)
      shape.isActive = true;

    if (shape.isActive) {
      shape.size = lerp(shape.size, shape.targetSize, 0.1);
      fill(0);
      noStroke();
      square(shape.x, shape.y, shape.size + 1);
    } else {
      fill(0);
      noStroke(0);
      circle(shape.x, shape.y, shape.pointSize);
    }
  }

  // Vérifier si tous les carrés ont été créés
  if (!sequenceFinished && shapes.every((s) => s.isActive)) {
    sequenceFinished = true;
    for (const shape of shapes) {
      const distToCenter = dist(centerX, centerY, shape.x, shape.y);
      shape.delay = map(distToCenter, 0, objSize / 2, 0, 300);
    }
  }

  if (sequenceFinished) {
    for (const shape of shapes) {
      if (shape.delay > 0) {
        shape.delay -= deltaTime;
      } else {
        shape.x = lerp(shape.x, shape.xEnd, 0.2);
        shape.y = lerp(shape.y, shape.yEnd, 0.2);
      }
    }
    const shape = shapes[0];
    const distToTarget = abs(shape.x - shape.xEnd);

    if (distToTarget < 0.1) {
      sendSequenceNextSignal();
      noLoop();
    }
  }
};
