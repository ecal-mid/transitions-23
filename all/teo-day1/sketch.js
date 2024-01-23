import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";

const spring = new SpringNumber({

    position: 0, // start position
    frequency: 1.5, // oscillations per second (approximate)
    halfLife: 0.09 // time until amplitude is halved
})

const spring2 = new SpringNumber({

    position: 0, // start position
    frequency: 1.5, // oscillations per second (approximate)
    halfLife: 0.09 // time until amplitude is halved
})
const spring3 = new SpringNumber({

    position: 0, // start position
    frequency: 1.5, // oscillations per second (approximate)
    halfLife: 0.09 // time until amplitude is halved
})
const spring4 = new SpringNumber({

    position: 0, // start position
    frequency: 1.5, // oscillations per second (approximate)
    halfLife: 0.09 // time until amplitude is halved
})

const Sspring = new SpringNumber({

    position: 0, // start position
    frequency: 2, // oscillations per second (approximate)
    halfLife: 0.1 // time until amplitude is halved
})



let roundness = 0;
let roundness2 = 0;
let roundness3 = 0;
let roundness4 = 0;

let sizeSpring = 0;

let mouseControlX1 = 0;
let mouseControlY1 = 0;
let mouseControlX2 = 0;
let mouseControlY2 = 0;
let mouseControlX3 = 0;
let mouseControlY3 = 0;
let mouseControlX4 = 0;
let mouseControlY4 = 0;

let click;
let woosh;

let roundedSquarePositions = [];

window.preload = function () {

    click = loadSound("click.mp3")
    woosh = loadSound("woosh.mp3")

}

window.setup = function () {

    createCanvas(windowWidth, windowHeight);


}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mousePressed = function () {
    click.play()

}

window.mouseReleased = function () {

    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;
    woosh.play()

    if (mouseX < centerX && mouseY < centerY) {
        spring.target = objSize
        //console.log("mouse released")
    }

    if (mouseX > centerX && mouseY < centerY) {
        spring2.target = objSize
        //console.log("mouse released")
    }

    if (mouseX > centerX && mouseY > centerY) {
        spring3.target = objSize
        //console.log("mouse released")
    }

    if (mouseX < centerX && mouseY > centerY) {
        spring4.target = objSize
        //console.log("mouse released")
    }
}


window.draw = function () {
    background(255);
    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;



    if (mouseIsPressed) {
        Sspring.target = 5
    } else {
        Sspring.target = 0
    }



    const radius = objSize / 2
    if (mouseIsPressed && mouseX < centerX && mouseY < centerY) {

        mouseControlX1 = mouseX - (centerX - objSize / 2)
        mouseControlY1 = mouseY - (centerY - objSize / 2)
        mouseControlX1 = Math.min(0, mouseControlX1)
        mouseControlY1 = Math.min(0, mouseControlY1)
    }
    else {

        mouseControlX1 = lerp(mouseControlX1, 0, 0.5)
        mouseControlY1 = lerp(mouseControlY1, 0, 0.5)
    }

    if (mouseIsPressed && mouseX > centerX && mouseY < centerY) {

        mouseControlX2 = mouseX - (centerX + objSize / 2)
        mouseControlY2 = mouseY - (centerY - objSize / 2)
        mouseControlX2 = Math.max(0, mouseControlX2)
        mouseControlY2 = Math.min(0, mouseControlY2)

    } else {

        mouseControlX2 = lerp(mouseControlX2, 0, 0.5)
        mouseControlY2 = lerp(mouseControlY2, 0, 0.5)
    }
    if (mouseIsPressed && mouseX > centerX && mouseY > centerY) {

        mouseControlX3 = mouseX - (centerX + objSize / 2)
        mouseControlY3 = mouseY - (centerY + objSize / 2)
        mouseControlX3 = Math.max(0, mouseControlX3)
        mouseControlY3 = Math.max(0, mouseControlY3)
    }
    else {

        mouseControlX3 = lerp(mouseControlX3, 0, 0.5)
        mouseControlY3 = lerp(mouseControlY3, 0, 0.5)
    }

    if (mouseIsPressed && mouseX < centerX && mouseY > centerY) {

        mouseControlX4 = mouseX - (centerX - objSize / 2)
        mouseControlY4 = mouseY - (centerY + objSize / 2)
        mouseControlX4 = Math.min(0, mouseControlX4)
        mouseControlY4 = Math.max(0, mouseControlY4)

    }
    else {

        mouseControlX4 = lerp(mouseControlX4, 0, 0.5)
        mouseControlY4 = lerp(mouseControlY4, 0, 0.5)
    }





    spring.step(deltaTime / 1000)
    spring2.step(deltaTime / 1000)
    spring3.step(deltaTime / 1000)
    spring4.step(deltaTime / 1000)
    Sspring.step(deltaTime / 1000)


    const roundness = spring.position
    const roundness2 = spring2.position
    const roundness3 = spring3.position
    const roundness4 = spring4.position

    const sizeSpring = Sspring.position

    // if (mouseIsPressed) {
    //     roundedSquarePositions.x1 = mouseX
    // }



    const roundnessTarget = objSize - 0.1
    if (roundness >= roundnessTarget && roundness2 >= roundnessTarget && roundness3 >= roundnessTarget && roundness4 >= roundnessTarget) {
        sendSequenceNextSignal()
        noLoop();

    }




    noStroke();
    fill(0);

    drawRoundedSquare(centerX - objSize / 2 + mouseControlX1, centerY - objSize / 2 + mouseControlY1, centerX - objSize / 2 + mouseControlX2, centerY - objSize / 2 + mouseControlY2, centerX - objSize / 2 + mouseControlX3, centerY - objSize / 2 + mouseControlY3, centerX - objSize / 2 + mouseControlX4, centerY - objSize / 2 + mouseControlY4, objSize, roundness, roundness2, roundness3, roundness4)


    roundedSquarePositions.push({
        x1: centerX - objSize / 2,
        y1: centerY - objSize / 2,
        x2: centerX + objSize / 2,
        y2: centerY - objSize / 2,
        x3: centerX + objSize / 2,
        y3: centerY + objSize / 2,
        x4: centerX - objSize / 2,

        sideLength: objSize,
        TFcornerRadius: roundness,
        TRcornerRadius: roundness2,
        BRcornerRadius: roundness3,
        BLcornerRadius: roundness4
    });



}

window.drawRoundedSquare = function (x1, y1, x2, y2, x3, y3, x4, y4, sideLength, TFcornerRadius, TRcornerRadius, BRcornerRadius, BLcornerRadius) {
    let TFhalfRadius = TFcornerRadius / 2;
    let TRhalfRadius = TRcornerRadius / 2;
    let BRhalfRadius = BRcornerRadius / 2;
    let BLhalfRadius = BLcornerRadius / 2;

    beginShape();

    // Top-left corner
    vertex(x1 + TFhalfRadius - TFcornerRadius / 2, y1 + TFcornerRadius / 2);
    arc(x1 + TFhalfRadius, y1 + TFhalfRadius, TFcornerRadius, TFcornerRadius, PI, PI + HALF_PI);
    vertex(x1 + TFhalfRadius, y1);

    // Top-right corner
    vertex(x2 + sideLength - TRhalfRadius, y2);
    arc(x2 + sideLength - TRhalfRadius, y2 + TRhalfRadius, TRcornerRadius, TRcornerRadius, -HALF_PI, 0);
    vertex(x2 + sideLength, y2 + TRcornerRadius / 2);

    // Bottom-right corner
    vertex(x3 + sideLength, y3 + sideLength - BRhalfRadius);
    arc(x3 + sideLength - BRhalfRadius, y3 + sideLength - BRhalfRadius, BRcornerRadius, BRcornerRadius, 0, HALF_PI);
    vertex(x3 + sideLength - BRhalfRadius, y3 + sideLength);

    // Bottom-left corner
    vertex(x4 + BLhalfRadius, y4 + sideLength);
    arc(x4 + BLhalfRadius, y4 + sideLength - BLhalfRadius, BLcornerRadius, BLcornerRadius, HALF_PI, PI);
    vertex(x4, y4 + sideLength - BLhalfRadius);

    // Close the shape
    endShape(CLOSE);
}