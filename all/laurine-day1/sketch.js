import { MiniCircle } from "./miniCircle.js";

let circles = [];

let progress = 0; // 0 to 1
let scaleCross = 0;

window.setup = function () {

    createCanvas(windowWidth, windowHeight);

    const crossPositions = []

    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const count = ceil(objSize / 3)

    for (let i = 0; i < count; i++) {

        crossPositions.push({
            x: map(i, 0, count - 1, centerX - objSize / 2, centerX + objSize / 2),
            y: centerY
        })
    }
    for (let i = 0; i < count; i++) {

        crossPositions.push({
            x: centerX,
            y: map(i, 0, count - 1, centerY - objSize / 2, centerY + objSize / 2),
        })
    }
    for (let i = 0; i < crossPositions.length; i++) {

        let newCircle = new MiniCircle(
            width / 2, height / 2,
            random(width), random(height),
            crossPositions[i].x, crossPositions[i].y
        );
        circles.push(newCircle);

    }

    angleMode(DEGREES)
}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mouseClicked = function () {

}


window.draw = function () {




    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const strokeW = 20


    const deltaTimeSeconds = deltaTime / 1000
    const secondsUntilFullProgress = 3; // seconds
    if (progress < 1) {
        if (mouseIsPressed) {
            progress += deltaTimeSeconds / secondsUntilFullProgress;
        }
        else {
            progress -= deltaTimeSeconds / secondsUntilFullProgress;
        }
        progress = constrain(progress, 0, 1);
    }




    for (let i = 0; i < circles.length; i++) {

        const circleProgressNeeded = map(i, 0, circles.length - 1, 0, 1);
        if (circleProgressNeeded < progress)
            circles[i].isActive = true;
        else
            circles[i].isActive = false;

        if (progress >= 1 &&
            dist(mouseX, mouseY, circles[i].springX.position, circles[i].springY.position) < 100) {

            circles[i].isCrossActive = true
        }

        if (circles[i].isCrossActive) {
            circles[i].springX.target = circles[i].crossX
            circles[i].springY.target = circles[i].crossY
        }
        else if (circles[i].isActive) {
            circles[i].springX.target = circles[i].activeX
            circles[i].springY.target = circles[i].activeY
        }
        else {
            circles[i].springX.target = centerX;
            circles[i].springY.target = centerY;
        }
        circles[i].update(deltaTimeSeconds);


    }

    background(255);

    for (let i = 0; i < circles.length; i++) {
        circles[i].display();
    }

    // drawing
    fill(0)
    noStroke()
    circle(centerX, centerY, map(progress, 0, 1, objSize, strokeW));



    // const targetScale = mouseIsPressed ? 1 : 0
    // scaleCross = lerp(scaleCross, targetScale, 0.1)
    rectMode(CENTER)
    strokeWeight(strokeW)
    stroke(0)
    push()
    translate(centerX, centerY)
    scale(scaleCross)
    line(0 - objSize / 2, 0, 0 + objSize / 2, 0)
    line(0, 0 - objSize / 2, 0, 0 + objSize / 2)
    pop()

    // for (let i = 0; i < 0.99; i++) {
    //     if (progress < 1) {
    //         if (mouseIsOver) {
    //             progress += deltaTimeSeconds / secondsUntilFullProgress;
    //         }
    //         else {
    //             progress -= deltaTimeSeconds / secondsUntilFullProgress;
    //         }
    //         progress = constrain(progress, 0, 1);
    //     }

    //     if (circles[i].isActive) {
    //         circles[i].springX.cross = circles[i].crossX
    //         circles[i].springY.cross = circles[i].crossY
    //     }
    //     else {

    //         circles[i].springX.cross = centerX - objSize / 2, centerY, centerX + objSize / 2, centerY
    //         circles[i].springY.cross = centerX, centerY - objSize / 2, centerX, centerY + objSize / 2
    //     }



}