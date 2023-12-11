import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";



let mySound;
let mySound2;


window.preload = function () {
    soundFormats('mp3', 'ogg');
    mySound = loadSound('sound/buttonON.mp3');
    mySound2 = loadSound('sound/buttonOFF.mp3');
}


// let rotationSpring = new SpringNumber({
//     position: 0,
//     frequency: 0.4,
//     halfLife: 0.5
// });

class Circle {
    constructor() {
        this.positionX = width / 2;
        this.positionY = height / 2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.scaleSpring = new SpringNumber({
            position: 1,
            frequency: 4,
            halfLife: 0.4
        });
        this.gravity = false;
        this.isGrabbed = false;
        this.grabOffsetX = 0;
        this.grabOffsetY = 0;
        this.radius = 0; // will be set later
        this.rotationSpring = new SpringNumber({
            position: 0,
            frequency: 1.3,
            halfLife: 0.3
        });
    }

    isOverlapping(x, y) {
        return dist(this.positionX, this.positionY, x, y) < this.radius;
    }

    draw() {
        push();
        translate(this.positionX, this.positionY);
        // scale(this.scaleSpring.position);
        console.log(this.radius)
        circle(0, 0, this.radius * 2);
        pop();
    }
}

class Cross {
    constructor() {
        this.positionX = width / 2;
        this.positionY = height / 2;
        this.rotation = 0;
        this.scaleSpring = new SpringNumber({
            position: 0,
            frequency: 3,
            halfLife: 0.3
        });
        this.rotationSpring = new SpringNumber({
            position: 0,
            frequency: 1.3,
            halfLife: 0.3
        });
    }

    updatePosition(x, y) {
        this.positionX = x;
        this.positionY = y;
    }

    updateRotation(circleX, circleY, lastCircleX, lastCircleY) {
        let dx = circleX - lastCircleX;
        let dy = circleY - lastCircleY;
        if (dx !== 0 || dy !== 0) {
            this.rotation = atan2(dy, dx);
        }
    }

    draw() {
        push();
        translate(this.positionX, this.positionY);
        rotate(this.rotationSpring.position); // Use rotation spring for rotation
        scale(this.scaleSpring.position);
        stroke(0); // Cross color
        strokeWeight(30); // Cross thickness
        line(-this.size / 2, 0, this.size / 2, 0); // Horizontal line
        line(0, -this.size / 2, 0, this.size / 2); // Vertical line
        pop();
    }
}

let myCircle, myCross;
let sceneSize, objSize;
let isFinished = false;

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    myCircle = new Circle();
    myCross = new Cross();
    objSize = min(windowWidth, windowHeight) / 2;
    myCircle.radius = objSize * 0.5; // Set initial radius
    myCross.size = objSize; // Set initial size of the cross
    myCross.strokeWeight = objSize / 10; // Set initial thickness of the cross
};

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};

window.draw = function () {
    const dt = deltaTime / 1000;
    const centerX = width / 2;
    const centerY = height / 2;

    let lastX = myCircle.positionX;
    let lastY = myCircle.positionY;

    // Circle grab and movement logic
    if (!myCircle.isGrabbed) {
        if (myCircle.isOverlapping(mouseX, mouseY) && mouseIsPressed) {
            myCircle.isGrabbed = true;
            myCircle.grabOffsetX = (myCircle.positionX - mouseX) / myCircle.scaleSpring.position;
            myCircle.grabOffsetY = (myCircle.positionY - mouseY) / myCircle.scaleSpring.position;
            myCross.scaleSpring.target = 0.3; // Set smaller size when holding the circle
            myCross.rotationSpring.target = myCross.rotation; // Keep current rotation when grabbed
            mySound.play();
        }
    } else {
        if (!mouseIsPressed) {
            myCircle.isGrabbed = false;
            myCircle.gravity = true;
            myCross.scaleSpring.target = 1; // Set larger size when not holding the circle
            myCross.rotationSpring.target = 0; // Target for straightening the cross
            mySound2.play();
        }
    }

    // Update circle position and velocity
    if (myCircle.isGrabbed) {
        myCircle.positionX = mouseX + myCircle.grabOffsetX * myCircle.scaleSpring.position;
        myCircle.positionY = mouseY + myCircle.grabOffsetY * myCircle.scaleSpring.position;
        myCircle.velocityX = (myCircle.positionX - lastX) / dt;
        myCircle.velocityY = (myCircle.positionY - lastY) / dt;


        // Update cross rotation based on circle movement
        let dx = myCircle.positionX - lastX;
        let dy = myCircle.positionY - lastY;
        if (dx !== 0 || dy !== 0) {
            myCross.rotationSpring.target = atan2(dy, dx);
        }
    }

    // Apply gravity to circle
    if (myCircle.gravity) {
        const gravity = 2000;
        myCircle.velocityY += gravity * dt;
    }

    // Circle physics update
    if (!myCircle.isGrabbed) {
        myCircle.positionX += myCircle.velocityX * dt;
        myCircle.positionY += myCircle.velocityY * dt;
    }

    // Calculate distance and determine if the circle is far
    const d = dist(myCircle.positionX, myCircle.positionY, centerX, centerY);
    const isFar = d > myCircle.radius * 0.5;

    // Update cross scaling target
    myCross.scaleSpring.target = isFar && !myCircle.isGrabbed ? 1 : myCross.scaleSpring.target;

    if (myCircle.positionY > myCircle.radius + height &&
        abs(myCross.rotationSpring.position) < .1 &&
        abs(myCross.rotationSpring.velocity) < .001) {

        noLoop();
        sendSequenceNextSignal();
    }
    // Step the springs
    myCircle.scaleSpring.target = myCircle.isGrabbed ? 0.9 : 1;
    myCircle.scaleSpring.step(dt);
    myCross.scaleSpring.step(dt);
    myCross.rotationSpring.step(dt);

    // Drawing the circle and the cross
    background(255);
    fill(0);
    noStroke();
    myCross.draw();
    noStroke();
    myCircle.draw();
};