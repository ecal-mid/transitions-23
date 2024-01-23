import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";
import { DragManager } from "../../shared/dragManager.js";
import { SpringNumber } from "../../shared/spring.js";

let shapeId = 0;

let square;
let sound1, sound2, sound3, sound4;

// class Point {
//   constructor(vector, draggable) {
//     this.vector = vector;
//     this.draggable = draggable;
//   }
// }

window.preload = function () {
  sound1 = loadSound("./sound/pop-01.mp3");
  sound2 = loadSound("./sound/pop-02.mp3");
  sound3 = loadSound("./sound/pop-03.mp3");
  sound4 = loadSound("./sound/pop-04.mp3");
  //console.log("Sound loaded");
};

class Shape {
  constructor(points) {
    this.dragManager = new DragManager();
    this.ogPoints = points;
    this.pointsDrag = [];
    this.strokeW = 20;

    this.countCenter = 0;

    this.strokeSpring = new SpringNumber({
      position: 0, // start position
      frequency: 2.5, // oscillations per second (approximate)
      halfLife: 0.15, // time until amplitude is halved
    });

    this.ogPoints.forEach((point, index) => {
      if (point.draggable) {
        this.pointsDrag.push({
          springX: new SpringNumber({
            position: point.vector.x, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          }),
          springY: new SpringNumber({
            position: point.vector.y, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          }),
          grabObject: this.dragManager.createDragObject({
            target: {
              positionX: point.vector.x,
              positionY: point.vector.y,
              radius: 40,
            },
            onStartDrag: (o) => {
              cursor("grabbing");
              //console.log("start drag :" + o);
            },
            onStopDrag: (o) => {
              cursor("default");
              //console.log("stop drag :" + o);
            },
          }),
        });
      } else {
        this.pointsDrag.push({
          springX: new SpringNumber({
            position: point.vector.x, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          }),
          springY: new SpringNumber({
            position: point.vector.y, // start position
            frequency: 2.5, // oscillations per second (approximate)
            halfLife: 0.15, // time until amplitude is halved
          }),
        });
      }

      //console.log(this.pointsDrag);
    });
  }

  update() {
    this.strokeSpring.step(deltaTime / 1000);

    this.pointsDrag.forEach((point, index) => {
      if (point.grabObject) {
        point.springX.target = point.grabObject.target.positionX;
        point.springY.target = point.grabObject.target.positionY;
      }

      point.springX.step(deltaTime / 1000);
      point.springY.step(deltaTime / 1000);
    });

    // test all point if close to center within a certain radius
    this.pointsDrag.some((point, index) => {
      if (
        point.grabObject &&
        dist(
          point.grabObject.target.positionX,
          point.grabObject.target.positionY,
          width / 2,
          height / 2
        ) < 100
      ) {
        point.grabObject = false;
        point.springX.target = width / 2;
        point.springY.target = height / 2;

        this.countCenter++;

        if (this.countCenter === 1) {
          sound1.play();
        }
        if (this.countCenter === 2) {
          sound2.play();
        }
        if (this.countCenter === 3) {
          sound3.play();
        }
        if (this.countCenter === 4) {
          sound4.play();
        }

        if (this.countCenter > 0)
          this.strokeSpring.target =
            this.strokeSpring.position + this.strokeW / 4;

        if (this.countCenter === 4) {
          // noLoop();
          setTimeout(() => {
            sendSequenceNextSignal();
          }, 400); // Wait for 3 seconds
        }
      }
    });
  }

  display() {
    push();
    fill(0);
    stroke(0);
    strokeWeight(this.strokeSpring.position);
    strokeJoin(ROUND);

    beginShape();
    this.pointsDrag.forEach((point) => {
      vertex(point.springX.position, point.springY.position);
      // push();
      // fill(255, 0, 0);
      // circle(point.springX.position, point.springY.position, 40);
      // pop();
    });

    endShape(CLOSE);
    pop();
  }
}

window.setup = function () {
  createCanvas(windowWidth, windowHeight);

  const sceneSize = min(width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const objSize = sceneSize / 2;
  // const halfWidth = objSize / tan(60);
  const halfWidth = objSize / 2;

  square = new Shape([
    {
      vector: createVector(centerX - halfWidth, centerY - halfWidth),
      draggable: true,
    },
    {
      vector: createVector(centerX, centerY - halfWidth),
      draggable: false,
    },
    {
      vector: createVector(centerX + halfWidth, centerY - halfWidth),
      draggable: true,
    },
    {
      vector: createVector(centerX + halfWidth, centerY),
      draggable: false,
    },
    {
      vector: createVector(centerX + halfWidth, centerY + halfWidth),
      draggable: true,
    },
    {
      vector: createVector(centerX, centerY + halfWidth),
      draggable: false,
    },
    {
      vector: createVector(centerX - halfWidth, centerY + halfWidth),
      draggable: true,
    },
    {
      vector: createVector(centerX - halfWidth, centerY),
      draggable: false,
    },
  ]);

  // createVector(centerX - halfWidth, centerY - halfWidth),
  // createVector(centerX, centerY - halfWidth),
  // createVector(centerX + halfWidth, centerY - halfWidth),
  // createVector(centerX + halfWidth, centerY),
  // createVector(centerX + halfWidth, centerY + halfWidth),
  // createVector(centerX, centerY + halfWidth),
  // createVector(centerX - halfWidth, centerY + halfWidth),
  // createVector(centerX - halfWidth, centerY),

  // dragManager.createDragObject({
  //   target: {
  //     positionX: width / 2,
  //     positionY: height / 2,
  //     radius: 200,
  //   },
  //   onStartDrag: (o) => {
  //     console.log("start drag");
  //   },
  //   onStopDrag: (o) => {
  //     console.log("stop drag");
  //   },
  // });

  // angleMode(DEGREES);
};


window.draw = function () {
  background(255);

  // dragManager.update();
  // console.log(dragManager.currentDragObject);
  //console.log(dragManager.currentDragObject);
  square.dragManager.update();
  square.update();
  square.display();

  // fill(255, 0, 0);
  // if (dragManager.currentDragObject)
  //   circle(
  //     dragManager.currentDragObject.target.positionX,
  //     dragManager.currentDragObject.target.positionY,
  //     50
  //   );
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
