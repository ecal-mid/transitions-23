import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"
let finished = false
const gridObjects = []
const gridCount = 5
let soundEffect;
let soundPlayed = false;
let mousePressed = false;
let started = false;
const currentScale = new SpringNumber({
    position: 100, // start position
    frequency: 2, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})
import { SpringNumber } from "../../shared/spring.js"


const spring = new SpringNumber({
    position: 100, // start position
    frequency: 2, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

window.preload = function () {
    soundEffect = loadSound('./assets/BOUB.mp3');
    //console.log(soundEffect);


}
window.mouseClicked = function () {
    mousePressed = true;
    started = true;
    currentScale.target = 1;

}

window.setup = function () {


    createCanvas(windowWidth, windowHeight);
    for (let x = 0; x < gridCount; x++) {
        for (let y = 0; y < gridCount; y++) {
            const obj = {
                gridX: x,
                gridY: y,
                circleActive: false,
                circleProgress: 0
            }
            gridObjects.push(obj)

        }
    }
    const sceneSize = min(width, height)
    const objSize = sceneSize / 2
    const rectSize = objSize / (gridCount - 1)
    let endObjSize = rectSize + objSize;
    currentScale.position = objSize / endObjSize;
    currentScale.target = currentScale.position;


    angleMode(DEGREES)
}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}


window.draw = function () {


    background(255);
    const sceneSize = min(width, height)
    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const strokeW = 20
    let rectSize = objSize / (gridCount - 1)

    currentScale.step(deltaTime / 1000);


    translate(width / 2, height / 2);
    scale(currentScale.position);

    const allSquaresActivated = gridObjects.every(obj => obj.circleActive);

    if (started) {
        fill(0)
        noStroke()
        const pointSize = strokeW

        rectMode(CENTER)


        spring.target = rectSize;

        if (allSquaresActivated) {
            // console.log("YEY", spring.position);
            // spring.position = realRectSize;
            spring.target = pointSize;

            spring.step(deltaTime / 1000);
        }

        for (const obj of gridObjects) {

            const x = obj.gridX;
            const y = obj.gridY;
            const xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2)
            const yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2)


            if (mousePressed &&
                mouseX > xPos - rectSize / 2 && mouseX < xPos + rectSize / 2 &&
                mouseY > yPos - rectSize / 2 && mouseY < yPos + rectSize / 2) {
                obj.circleActive = true
                soundEffect.play();
                mousePressed = false
            }

            const transitionTime = 0.1; // seconds
            if (obj.circleActive) {
                obj.circleProgress += deltaTime / 1000 / transitionTime;
                obj.circleProgress = constrain(obj.circleProgress, 0, 1)
            }


        }
        if (abs(spring.position - spring.target) <= 0.1) {
            sendSequenceNextSignal(); // finish sketch
            noLoop();
        }
    }
    rectMode(CENTER)

    for (const obj of gridObjects) {

        const x = obj.gridX;
        const y = obj.gridY;
        const xPos = map(x, 0, gridCount - 1, - objSize / 2, + objSize / 2)
        const yPos = map(y, 0, gridCount - 1, - objSize / 2, + objSize / 2)


        fill(0)

        const rectRadius = map(obj.circleProgress, 0, 1, 0, rectSize / 2)
        const realRectSize = rectSize; // map(obj.circleProgress, 0, 1, rectSize, pointSize);

        if (allSquaresActivated) {

            rect(xPos, yPos, spring.position, spring.position, spring.position)

        } else {
            rect(xPos, yPos, realRectSize + 1, realRectSize + 1, rectRadius)
        }

    }
    fill(0, 255, 0)
    // circle(centerX, centerY, 100);

}