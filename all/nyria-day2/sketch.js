import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let drops = [];
let overlapCheck;
let raining = false;
let isFinished = false;
let soundPlayed = false;
let sound1;

window.preload = function () {
  sound1 = loadSound("./song/tombe2.mp3");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  background(255);
  const objSize = min(width, height) / 2;
  overlapCheck = new Uint8Array(objSize);
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  const objSize = min(width, height) / 2;

  const centerX = width / 2;
  const centerY = height / 2;
  const strokeW = objSize / 20;

  background(255);
  fill(0);
  noStroke();

  if (isFinished) {
    fill(0);
    noStroke();
    rectMode(CENTER);
    strokeWeight(strokeW);
    stroke(0);
    line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY);
    line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2);
  } else {
    ellipse(width / 2, height / 2, objSize);
  }

  if (!isFinished && raining && frameCount % 10 === 0) {
    let dropX;

    if (mouseIsPressed) {
      dropX = mouseX;
    } else {
      dropX = random(width);
    }

    let drop = new RainDrop(dropX, -10);
    sound1.play();
    drops.push(drop);
  }

  if (!isFinished && !mouseIsPressed) {
    isFinished = true;
    for (var i = 0; i < overlapCheck.length; i++) {
      if (overlapCheck[i] === 0) {
        isFinished = false;
        break;
      }
    }
  }
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    if (isFinished) {
      drop.blocked = false;
      if (drop.y > height + drop.length) {
        drop.isOut = true;
      }
    } else {
      if (drop.y > height) {
        drop.blocked = true;
      }
    }
    if (!drop.checked && drop.y > centerY + objSize / 2) {
      for (let i = 0; i < ceil(drop.weight); i++) {
        const arrayIndex = round(
          map(
            drop.x - drop.weight / 2 + i,
            centerX - objSize / 2,
            centerX + objSize / 2,
            0,
            overlapCheck.length - 1
          )
        );
        if (arrayIndex >= 0 && arrayIndex < overlapCheck.length) {
          overlapCheck[arrayIndex] = 1;
        }
      }
      drop.checked = true;
    }
    drop.update(deltaTime / 1000);
  }
  const allOut = drops.length > 0 && drops.every((drop) => drop.isOut);
  if (allOut) {
    //console.log("done");
    sendSequenceNextSignal();
    noLoop();
  }

  for (let i = 0; i < drops.length; i++) {
    drops[i].display();
  }
};

window.mousePressed = function () {
  raining = true;
  if (!soundPlayed) {
    //sound1.play();
    soundPlayed = true;
  }
};

window.mouseReleased = function () {
  raining = false;
  //sound1.stop();
  soundPlayed = false;
  // x = lerp(x, width / 2, 0.2);
  // y = lerp(y, height / 2, 0.2);
};

const gravity = 250;
class RainDrop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = height + 100;
    this.speed = random(20, 40) * 40;
    this.weight = random(20, 30);
    this.blocked = false;
    this.isOut = false;
  }

  display() {
    stroke(2);
    strokeWeight(this.weight);
    line(this.x, this.y, this.x, this.y - this.length);
  }

  update(dt) {
    this.speed += gravity * dt;
    if (!this.blocked) {
      this.y += this.speed * dt;
    }
  }
}
