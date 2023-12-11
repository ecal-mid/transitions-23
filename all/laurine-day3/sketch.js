import { SpringNumber, createSpringSettings } from "../../shared/spring.js"
let spring
let squareSize = 0;
let state = 0;
let started = false;
let allLocked = false
let endClicked = false
const corners = []

class Corner {
    constructor(angle, x, y) {

        this.angle = angle
        this.locked = false

        this.springX = new SpringNumber({
            position: x,
            frequency: 3,
            halfLife: .2
        })
        this.springY = new SpringNumber({
            position: y,
            frequency: 3,
            halfLife: .2
        })

    }
}

let clickMouseDist = 0;
// const rotateSpring = new SpringNumber({
//     position: 0, // start position
//     frequency: 4.5, // oscillations per second (approximate)
//     halfLife: 0.15 // time until amplitude is halved
// })
window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    const sceneSize = min(width, height);
    const objSize = sceneSize / 2;
    squareSize = objSize;

    spring = new SpringNumber({
        position: 0,
        frequency: 3,
        halfLife: .4
    })
    const centerX = width / 2;
    const centerY = height / 2;
    const diagonalSize = squareSize / 2 * sqrt(2)

    for (let i = 0; i < 4; i++) {


        const angle = 45 + i * 90;
        const dir = p5.Vector.fromAngle(radians(angle));
        const corner = new Corner(angle, centerX + dir.x * diagonalSize, centerY + dir.y * diagonalSize)

        corners.push(corner)
    }
}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mousePressed = function () {
    //squareSize = 20;
    //spring.target = 1

    ///strokeJoin(ROUND);
    const centerX = width / 2;
    const centerY = height / 2;
    const mousePos = createVector(mouseX - centerX, mouseY - centerY)
    clickMouseDist = mousePos.mag()

    if (allLocked && !endClicked) {
        endClicked = true

        for (const corner of corners) {

            corner.springY.settings = createSpringSettings({ frequency: 0.3, halfLife: 1.2 })
            corner.springY.target = height * 2;
            corner.springX.velocity = random(-100, 100)
            corner.springY.velocity = random(-100, 100)

        }
    }
    started = true
}


window.draw = function () {
    background(255);

    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;
    const strokeW = 20

    fill(0);

    // strokeJoin(SQUARE);
    const gridCount = 5;

    if (started)
        squareSize = lerp(squareSize, objSize + strokeW, 0.3)


    spring.step(deltaTime / 1000)
    if (allLocked) {
        for (let x = 0; x < gridCount; x++) {
            for (let y = 0; y < gridCount; y++) {
                const xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2, x);
                const yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2, y);
                // let dd = lerp(110, 20, spring.position)
                //rect(xPos, yPos, dd, dd);

                circle(xPos, yPos, strokeW)
            }
        }
    }
    rectMode(CENTER)


    beginShape()

    const diagonalSize = squareSize / 2 * sqrt(2)
    const mousePos = createVector(mouseX - centerX, mouseY - centerY)
    const mouseAngle = mousePos.heading()
    const mouseDist = mousePos.mag()
    const mouseDistOnlyDir = createVector(mousePos.x, mousePos.y).normalize()
    const mouseDistOffset = max(0, mouseDist - clickMouseDist)


    for (let i = 0; i < corners.length; i++) {

        const corner = corners[i]

        if (!endClicked) {

            const dir = p5.Vector.fromAngle(radians(corner.angle));
            const screenCornerX = centerX + Math.sign(dir.x) * width / 2
            const screenCornerY = centerY + Math.sign(dir.y) * height / 2
            if (dist(screenCornerX, screenCornerY, corner.springX.position, corner.springY.position) < 100) {
                corner.locked = true;
            }
            if (corner.locked) {

                corner.springX.target = screenCornerX;
                corner.springY.target = screenCornerY;


            }
            else {

                const angleDifference = abs(mousePos.angleBetween(dir))
                const maxAngle = map(mouseDistOffset, 0, 200, 45, 90, true)
                const mouseInfluence = map(angleDifference, 0, maxAngle, 1, 0, true)
                const clickInfluence = mouseIsPressed ? 1 : 0;
                const cornerOffset = mouseInfluence * mouseDistOffset * clickInfluence;

                corner.springX.target = centerX + dir.x * diagonalSize + mouseDistOnlyDir.x * cornerOffset;
                corner.springY.target = centerY + dir.y * diagonalSize + mouseDistOnlyDir.y * cornerOffset;

            }
        }
        corner.springX.step(deltaTime / 1000)
        corner.springY.step(deltaTime / 1000)

        vertex(corner.springX.position, corner.springY.position)
    }
    endShape()
    allLocked = corners.every(corner => corner.locked)

}

// fill(0)
// noStroke()
// const gridCount = 5
// const pointSize = strokeW

// for (let x = 0; x < gridCount; x++) {
//     for (let y = 0; y < gridCount; y++) {
//         const xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2, x)
//         const yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2, y)
//         circle(xPos, yPos, pointSize)
//     }
// }
// break

//     case 1:

//         fill(0)
//         noStroke()
//         rectMode(CENTER)
//         strokeWeight(strokeW)
//         stroke(0)
//         line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
//         line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
//         break;



