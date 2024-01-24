;;;

import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"


let sceneSize;
let objSize;
let objSizeCircle;
let stageSketch2 = 0;
let differentiel = 0;
let mouseDragState = false;

let figerTrait1 = false;
let figerTrait2 = false;

let zone = false;

let sphereSound;
let linePickSound;
let lineReleaseSound;


let coolDownSound;

const springCircle = new SpringNumber({
  position: 500, // start position
  frequency: 1.5, // oscillations per second (approximate)
  halfLife: 0.1 // time until amplitude is halved
})

const springX = new SpringNumber({
  position: window.innerWidth / 2, // start position
  frequency: 1.5, // oscillations per second (approximate)
  halfLife: 0.1 // time until amplitude is halved
})

const springY = new SpringNumber({
  position: window.innerHeight / 2, // start position
  frequency: 1.5, // oscillations per second (approximate)
  halfLife: 0.1 // time until amplitude is halved
})

const springCol = new SpringNumber({
  position: window.innerHeight / 2, // start position
  frequency: 1.5, // oscillations per second (approximate)
  halfLife: 0.1 // time until amplitude is halved
})

window.preload = function () {
  coolDownSound = createAudio("Audio/FinalSound.wav")
}

window.setup = function () {

  sphereSound = loadSound('Audio/SphereClick.wav');
  linePickSound = loadSound('Audio/LinePick.wav');
  lineReleaseSound = loadSound('Audio/LineReleased.wav');

  createCanvas(windowWidth, windowHeight);
  sceneSize = min(width, height)
  objSize = sceneSize / 2;

  springCircle.position = objSize;
  springCircle.target = objSize;

  stageSketch2 = 0;
}

window.mousePressed = function () {

  if (stageSketch2 == 1 || stageSketch2 == 2 || stageSketch2 == 3) {
    linePickSound.play();
  }

  if (stageSketch2 == 0) {
    stageSketch2 = 1;
    sphereSound.play();
    springCircle.target = 20;
  }
}

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
}


window.mouseDragged = function () {

  if (stageSketch2 == 2 || stageSketch2 == 3) {
    mouseDragState = true;
  }
  let d = dist(window.innerWidth / 2, window.innerHeight / 2, mouseX, mouseY);
  if (d >= 300 && !figerTrait2) {
    zone = true;
    springCol.target = 1 * d / 2;
    //console.log(zone)
  }
  else {
    springCol.target = 0;
    zone = false;
  }
}

window.mouseReleased = function () {

  let d = dist(width / 2, height / 2, mouseX, mouseY);
  zone = false;
  springCol.target = 0;

  if (stageSketch2 == 2 || stageSketch2 == 3) {
    lineReleaseSound.play();
  }

  if (stageSketch2 == 2 && d >= objSize/2) {
    figerTrait1 = true;
    springX.position = width / 2;
    d = 0;
  }
  else if (stageSketch2 == 3 && d >= objSize/2) {
    figerTrait2 = true;
    stageSketch2 = 3;
    if (finalSound == 0) {
      setTimeout(() => {
        coolDownSound.play();
      }, 500);
      finalSound = 1;
    }
    setTimeout(() => {
      noLoop();
      sendSequenceNextSignal();
    }, 1500);
    d = 0;
  }



  mouseDragState = false;
}


let finalSound = 0;

window.draw = function () {

  background(255);

  const centerX = width / 2
  const centerY = height / 2
  const strokeW = 20
  sceneSize = min(width, height)
  objSize = (sceneSize / 2);

  springX.step(deltaTime / 1000) // deltaTime is in milliseconds, we need it in seconds
  springY.step(deltaTime / 1000) // deltaTime is in milliseconds, we need it in seconds
  springCircle.step(deltaTime / 1000) // deltaTime is in milliseconds, we need it in seconds
  springCol.step(deltaTime / 1000)
  const x = springX.position
  const y = springY.position
  const sCircle = springCircle.position;
  const springC = springCol.position;

  //cross(centerX,centerY,strokeW);

  switch (stageSketch2) {
    case 0:
      //Cercle Statique
      circleShape(centerX, centerY);
      break;
    case 1:
      //Cercle qui raptisse
      circleShape(centerX, centerY);
      setTimeout(function () {
        stageSketch2 = 2;
      }, 1000);
      break;
    case 2:
      //Déplacement des lignes Horizontales et Verticales
      circleShape(centerX, centerY);
      if (mouseDragState && !figerTrait1) {
        springY.target = mouseY
      }
      else if (!mouseDragState && !figerTrait1) {
        springY.target = centerY
      }
      if (figerTrait1) {
        springY.target = centerY + objSize / 2
        setTimeout(function () {
          stageSketch2 = 3;
        }, 500);
      }
      push()
      if (zone == true) {
        stroke(springC, 0, 0);
      }
      else {
        stroke(springC, 0, 0);
      }
      strokeWeight(strokeW);
      line(centerX, centerY, centerX, y);
      line(centerX, centerY, centerX, window.innerHeight - y);
      pop()
      break;

    case 3: {

      //console.log(x, springX.position, springX.target)

      push()
      strokeWeight(strokeW);
      line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
      pop()

      if (mouseDragState && !figerTrait2) {
        springX.target = mouseX
      }
      else if (!mouseDragState && !figerTrait2) {
        springX.target = centerX
      }
      if (figerTrait2) {
        springX.target = centerX - objSize / 2
      }

      push()
      if (zone == true) {
        stroke(springC, 0, 0);
      }
      else {
        stroke(springC, 0, 0);
      }
      strokeWeight(strokeW);
      line(centerX, centerY, x, centerY);
      line(centerX, centerY, window.innerWidth - x, centerY);
      pop()
    }
    case 4: {
      /*push()
      console.log(4);
      strokeWeight(strokeW);
      line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
      line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
      pop()*/
    }
  }
}

function circleShape(x, y) {

  objSizeCircle = (sceneSize / 2) - differentiel;

  const sCircle = springCircle.position;

  //Cercle
  push()
  fill(0, 0, 0)
  noStroke()
  translate(x, y);
  circle(0, 0, sCircle)
  pop()
  //---
}



function cross(cX, cY, sW) {
  fill(255, 0, 0, 0.5)
  noStroke()
  rectMode(CENTER)
  strokeWeight(sW)
  stroke(0)
  line(cX - objSize / 2, cY, cX + objSize / 2, cY)
  line(cX, cY - objSize / 2, cX, cY + objSize / 2)
}

;;;