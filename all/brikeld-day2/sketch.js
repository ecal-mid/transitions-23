import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let movers = [];
let attractor;


const gridCount = 5;

let state = 0;

let centerX, centerY, objSize, halfWidth, strokeW, sceneSize, pointSize;

let circleSizeSpring, circlePosXSpring, circlePosYSpring;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);

  sceneSize = min(width, height);

  centerX = width / 2;
  centerY = height / 2;
  objSize = sceneSize / 2;
  halfWidth = objSize / tan(60);
  strokeW = 20;

  pointSize = strokeW;

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
      //circle(xPos, yPos, pointSize);
      movers.push(new Mover(xPos, yPos, pointSize));
    }
  }
  angleMode(DEGREES);
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.mousePressed = function () {
  // shapeId++
  // shapeId %= 4
  const clickedCircle = movers.some((mover) => {
    return mover.testPosition();
  });

  if (clickedCircle) {
    attractor = new Attractor(mouseX, mouseY, 100);
  }
};

window.mouseReleased = function () {
  attractor = null;

  movers.forEach((mover) => {
    mover.resetPosition();
  });
};


function dist2(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
function dist2Sqr(x1, y1, x2, y2) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}


window.draw = function () {
  background(255);

  if (state == 1) {
    setTimeout(() => {
      sendSequenceNextSignal();
      noLoop();
      //console.log("ok");
    }, 1500);
  }

  switch (state) {
    case 0:
      for (let i = 0; i < movers.length; i++) {
        movers[i].update();
        movers[i].show();

        if (attractor) attractor.attract(movers[i]);
      }

      if (attractor) {
        attractor.pos.x = mouseX;
        attractor.pos.y = mouseY;


        // test if all movers are the same position than attractor
        const allMoversAttracted = movers.every((mover) => {
          const d = mover.mass * 2;
          return dist2Sqr( mover.pos.x, mover.pos.y,attractor.pos.x,attractor.pos.y) < d*d;
        });

        if (allMoversAttracted) {
          state = 1;

          circleSizeSpring = new SpringNumber({
            position: pointSize, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          });
          circlePosXSpring = new SpringNumber({
            position: mouseX, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          });

          circlePosYSpring = new SpringNumber({
            position: mouseY, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          });
          circleSizeSpring.target = objSize;
          circlePosXSpring.target = centerX;
          circlePosYSpring.target = centerY;
        }
      }
      if (attractor) attractor.show();
      break;

    case 1:
      state = 1;
      //console.log(state);
      circleSizeSpring.step(deltaTime / 1000);
      circlePosXSpring.step(deltaTime / 1000);
      circlePosYSpring.step(deltaTime / 1000);


      push();
      fill(0);
      noStroke();
      circle(
        circlePosXSpring.position,
        circlePosYSpring.position,
        circleSizeSpring.position
      );
      pop();

      break;
  }
};

class Attractor {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;
  }

  attract(mover) {
    let force = p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let G = 5;
    let strength = (G * (this.mass * mover.mass)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  show() {
    push();
    noStroke();
    fill(0);
    ellipse(this.pos.x, this.pos.y, this.r);
    pop();
  }
}

class Mover {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.ogPos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;

    this.enabled = false;

    this.posX = new SpringNumber({
      position: this.pos.x, // start position
      frequency: random(0.5, 2), // oscillations per second (approximate)
      halfLife: random(1, 2), // time until amplitude is halved
    });
    this.posY = new SpringNumber({
      position: this.pos.y, // start position
      frequency: random(0.5, 2), // oscillations per second (approximate)
      halfLife: random(1, 2), // time until amplitude is halved
    });

    this.resetPosition();
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  resetPosition() {
    this.posX.target = this.ogPos.x;
    this.posY.target = this.ogPos.y;

    this.springVel = new SpringNumber({
      position: 1, // start position
      frequency: 0.2, // 0.05
      halfLife: 0.15, // time until amplitude is halved
    });
  }

  testPosition() {
    let mouse = createVector(mouseX, mouseY);
    if (mouse.dist(this.pos) < this.mass) {
      return true;
    }
  }

  update() {
    if (attractor) {
      this.springVel.target = 0.9;
      this.springVel.step(deltaTime / 1000);

      this.vel.add(this.acc);
      this.vel.mult(this.springVel.position);
      this.springVel.position;
      this.pos.add(this.vel);
      this.acc.set(0, 0);

      this.posX.position = this.pos.x;
      this.posY.position = this.pos.y;
    } else {
      this.posX.step(deltaTime / 1000);
      this.posY.step(deltaTime / 1000);
      this.pos.x = this.posX.position;
      this.pos.y = this.posY.position;
    }
  }

  show() {
    push();
    noStroke();
    fill(0);
    ellipse(this.pos.x, this.pos.y, this.mass);
    pop;
  }
}



// when my circle is drawn, send a signal to the server
// if show, send signal to server

// // example : 	if (progress >= 1) {
// 		sendSequenceNextSignal(); // finish sketch
// 		noLoop();
// 	}

// }

// if clickedCircle {
//   sendSequenceNextSignal();
//   noLoop();
// }

// where do i draw my circle? // draw function 
// when vector is created, send signal to server 