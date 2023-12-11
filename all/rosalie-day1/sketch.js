import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

let mySound, mySound2, mySound3;
let startTime = 0;
let shapeId = 0;
let crossSize = 0;
let growthRate = 0.2;
let stop = false;
let showSquare = true;
let showCross = false;
let particles = [];
let attractStarted = false;
let drag = 3; // 0 = no drag, 1 = a bit of drag, 100 = lots of drag
window.preload = function () {
  soundFormats("mp3");
  mySound = loadSound("sounds/roue2.mp3");
  mySound2 = loadSound("sounds/xilo.mp3");
  mySound3 = loadSound("sounds/reverse.mp3");
};
class Particle {
  constructor(x, y, endSize) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(3000));
    this.targetX = width / 2;
    this.targetY = height / 2;
    this.size = 20;
    this.opacity = 255;
    this.useFinalSize = false;
    this.endSize = endSize;
    this.targetForce = 0;

    this.targetSize = this.size;
    this.isTargetActive = false;
  }

  update(dt) {
    this.size = lerp(this.size, this.targetSize, 0.05);
    // Ajout d'une logique pour se déplacer vers la cible dans le cas de shapeId 5
    let target = createVector(this.targetX, this.targetY);
    let force = p5.Vector.sub(target, this.pos);

    force.mult(this.targetForce); // Vitesse de déplacement vers la cible

    this.vel.add(p5.Vector.mult(force, dt));
    this.vel.mult(Math.exp(-drag * dt)); // drag
    if (this.useFinalSize) {
      const distToTarget = dist(
        this.targetX,
        this.targetY,
        this.pos.x,
        this.pos.y
      );
      this.targetSize = map(distToTarget, 5, 100, this.endSize, 20, true);
    }

    this.pos.add(p5.Vector.mult(this.vel, dt));
  }

  show() {
    //opacity est de 255 et décrémente de 1 mais ne passe pas sous 100
    fill(0, 0, 0);
    if (this.opacity < 100) {
      this.opacity = 100;
    }
    noStroke();
    circle(this.pos.x, this.pos.y, this.size);
  }

  // setTarget(x, y) {
  //   this.targetX = x;
  //   this.targetY = y;
  // }
  // growToSize(targetSize) {
  //   if (this.size < targetSize) {
  //     // this.size += 1;
  //   }
  // }
  // moveToCenter = function () {
  //   this.vel = p5.Vector.random2D().mult(200);
  //   this.setTarget(width / 2, height / 2);
  // };
}
const spring = new SpringNumber({
  position: 0, // start position
  frequency: 1.5, // oscillations per second (approximate)
  halfLife: 0.45, // time until amplitude is halved
});
let rotationTarget = 0;
let rotation = 0;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const strokeW = 20;
  const dt = deltaTime / 1000;

  spring.position = objSize;
  spring.target = objSize;

  angleMode(DEGREES);
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  background(255);

  const sceneSize = min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  const strokeW = 20;
  const dt = deltaTime / 1000;

  for (let particle of particles) {
    particle.update(deltaTime / 1000);
    particle.show();
  }
  spring.step(dt); // deltaTime is in milliseconds, we need it in seconds
  translate(width / 2, height / 2);
  let newRotationDiff = lerp(rotation, rotationTarget, 0.1) - rotation;
  newRotationDiff = min(newRotationDiff, 10);
  rotation += newRotationDiff;
  rotate(rotation);

  switch (shapeId) {
    case 0:
      if (mouseIsPressed) spring.target = 10;
      else spring.target = objSize;

      if (showSquare && spring.position < 10) {
        showSquare = false;
        showCross = true;
        stop = true;
      }
      if (stop == true) {
        mySound.play();
      }

      // Dessiner le carré
      if (showSquare) {
        fill(0, 0, 0);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, spring.position, spring.position);
      }

      //carré
      if (stop == true) {
        // if (objSize + 20 > 20) {
        fill(0);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, 20, 20);
        shapeId++;
        shapeId %= 4;
      }
      break;

    case 1:
      fill(0);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, 20, 20);
      // if (mouseIsPressed)
      shapeId++;
      shapeId %= 4;
      break;

    case 2:
      rotationTarget = 360 * 5;
      crossSize += growthRate * deltaTime;

      // translate(width / 2, height / 2);
      // rotate(PI * 2, width / 2, height / 2);
      // if (crossSize > 600) {
      // crossSize = lerp(600, 0, 1);
      //}

      fill(0);
      noStroke();
      rectMode(CENTER);
      strokeWeight(strokeW);
      stroke(0);
      line(0 - crossSize / 2, 0, 0 + crossSize / 2, 0);
      line(0, 0 - crossSize / 2, 0, 0 + crossSize / 2);
      // console.log(crossSize);
      if (crossSize >= objSize) {
        shapeId++;

        shapeId %= 4;
      }

      break;
    case 3:
      //if (mouseIsPressed) spring.target = 10;
      //else spring.target = 400;

      fill(0);
      noStroke();
      rectMode(CENTER);
      strokeWeight(strokeW);
      stroke(0);
      line(0 - objSize + 200, 0, 0 + objSize - 200, 0);
      line(0, 0 - objSize + 200, 0, 0 + objSize - 200);
      if (mouseIsPressed) {
        mySound2.play();
        particles = [];
        for (let i = 0; i < 100; i++) {
          let x, y;
          // 100 particules par exemple
          if (i < 50) {
            x = map(
              i,
              0,
              50,
              width / 2 - objSize + 200,
              width / 2 + objSize - 200
            );
            y = height / 2;
          } else {
            x = width / 2;
            y = map(
              i,
              50,
              100,
              height / 2 - objSize + 200,
              height / 2 + objSize - 200
            );
          }
          particles.push(new Particle(x, y, objSize));
        }
        shapeId++;
        //shapeId %= 4;
      }
      break;
    case 4:
      if (startTime === 0) {
        // Initialiser startTime lors de l'entrée dans la case 4
        startTime = millis();
      }
      // Dessiner les particules en mouvement libre
      if (millis() - startTime > 2000) {
        //   // 3000 millisecondes = 3 secondes
        //   particles.forEach((particle) => particle.moveToCenter());
        shapeId++;
        //   startTime = 0; // Réinitialiser startTime pour la prochaine utilisation
      }
      // if (shapeId === 5) {
      //   particles.forEach((particle) => particle.moveToCenter());
      // }
      break;
    case 5:
      // for (let particle of particles) {
      //   particle.growToSize(sceneSize / 2);
      // }
      if (mouseIsPressed && !attractStarted) {
        particles.forEach((p) => (p.vel = p5.Vector.random2D().mult(400)));
        attractStarted = true;
      }
      if (attractStarted)
        particles.forEach((p) => (p.targetForce = mouseIsPressed ? 4 : 4));

      if (mouseIsPressed) {
        particles.forEach((p) => (p.useFinalSize = true));
        mySound3.play();
      }

      //console.log(floor(particles[0].pos.x));
      //console.log(width / 2);

      const finishedTransition = particles.every(
        (particle) =>
          particle.pos.x >= width / 2 - 1 &&
          particle.pos.x <= width / 2 + 1 &&
          particle.pos.y >= height / 2 - 1 &&
          particle.pos.y <= height / 2 + 1 &&
          abs(particle.size - particle.targetSize) < 1
      );

      if (finishedTransition) {
        shapeId++;
      }

      break;
    case 6:
      push();
      fill(0);
      noStroke();
      circle(0, 0, sceneSize / 2);
      pop();

      sendSequenceNextSignal();
      noLoop();
      // setTimeout(() => {
      //   sendSequenceNextSignal();
      // }, 300);
      break;
  }
};
