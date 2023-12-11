import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"
let finished = false
let shapeId = 0;
let xPosNew = 1;
let yPosNew = 1;
let soundEffect1;
let soundEffect2;

let soundPlayed = false;

window.preload = function () {
    soundEffect1 = loadSound('assets/UP.mp3');
    soundEffect2 = loadSound('assets/BOUB.mp3');

    console.log(soundEffect1);

}
window.setup = function () {

    createCanvas(windowWidth, windowHeight);

    angleMode(DEGREES)
}

window.windowResized = function () {

    resizeCanvas(windowWidth, windowHeight);
}

window.mouseClicked = function () {

}

let actualSize = 1;
let mousePressed = false;
let arrived = false;

window.mousePressed = function () {
    mousePressed = true
}

window.mouseReleased = function () {
    mousePressed = false
}
const spring = new SpringNumber({
    position: 0, // start position
    frequency: 3, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

window.draw = function () {

    const sceneSize = min(width, height);
    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const halfWidth = objSize / tan(60)
    const strokeW = 20
    const finalDx = 1;
    const finalDy = 1;
    let xPos;
    let yPos;
    spring.step(deltaTime / 1000) // deltaTime is in milliseconds, we need it in seconds


    if (soundEffect1.isPlaying() || soundEffect2.isPlaying()) {
        soundPlayed = false;
    }



    if (actualSize >= objSize) {
        arrived = true;
        actualSize = objSize;
    }
    if (mousePressed && !arrived) {
        // console.log("Pressed")
        actualSize += 1.5;
        soundEffect1.play();
        //console.log(actualSize)
    }
    else {
        if (actualSize > 0 && !arrived) {

            actualSize -= 0.5;
            soundEffect1.reverseBuffer();

        } else {
            if (actualSize <= 0) {
                actualSize = 0
                soundEffect1.stop();

            }
        }

    }
    // console.log(actualSize, arrived);
    background(255);

    noStroke()
    fill(0);
    const gridCount = 5
    const pointSize = strokeW



    // GRID
    // console.log(spring.position);
    if (!arrived) {
        for (let x = 0; x < gridCount; x++) {
            for (let y = 0; y < gridCount; y++) {

                xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2, x)
                yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2, y)

                circle(xPos, yPos, pointSize)
            }
        }
    } else {
        spring.target = 1
        for (let x = 0; x < gridCount; x++) {
            for (let y = 0; y < gridCount; y++) {

                xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2, x)
                yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2, y)
                xPosNew = lerp(xPos, centerX, spring.position);
                yPosNew = lerp(yPos, centerY, spring.position);
                circle(xPosNew, yPosNew, pointSize);
                soundEffect2.play();
                soundEffect1.stop();


            }
        }
    }
    // console.log(xPosNew);

    // CROSS
    rectMode(CENTER)
    strokeWeight(strokeW)
    stroke(0)

    translate(width / 2, height / 2);

    line(0 - actualSize / 2, 0, 0 + actualSize / 2, 0);
    line(0, 0 - actualSize / 2, 0, 0 + actualSize / 2);

    if (xPosNew == centerX && yPosNew == centerY) {
        sendSequenceNextSignal(); // finish sketch
        noLoop();
    }
}
