import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"
let finished = false
let shapeId = 3
let x = 0;
let speed = 0;
let started = false;
let angle = 0;
let angleWhenClicked = 0;
let growing = 0;
let soundEffect1;
let soundEffect2;
let soundPlayed1 = false;
let soundPlayed2 = false;
window.preload = function () {
    soundEffect1 = loadSound('assets/ROLLING.mp3');
    soundEffect2 = loadSound('assets/PULL.mp3');
}

window.setup = function () {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    frameRate(120);


}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mouseClicked = function () {
    started = true;


}
window.mousePressed = function () {
    angleWhenClicked = angle;
    speed = 0;

}
window.draw = function () {


    background(255);


    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const halfWidth = objSize / tan(60)
    const strokeW = 20

    translate(width / 2, height / 2);

    switch (started) {

        case true:
            let force = 0;

            if (mouseIsPressed) {
                force = -1000;
                if (soundPlayed1 == false) {
                    soundEffect1, stop();
                    soundEffect2.play();
                    soundEffect2.loop();
                    soundPlayed1 = true;
                    soundPlayed2 = false;

                }

            } else {
                force = max(-(angle - angleWhenClicked) * 10, 0);
                soundEffect2.stop();
                if (soundPlayed2 == false) {
                    soundEffect1.play();
                    soundPlayed2 = true;
                    soundPlayed1 = false;
                }
            }

            speed += force * deltaTime / 1000;
            speed = max(speed, -200);
            angle += speed * deltaTime / 1000;

            break;
        case false:

            break;
    }
    fill(0)
    noStroke()
    rectMode(CENTER)
    strokeWeight(strokeW)
    stroke(0)
    rotate(angle);
    let maxAngle = asin(strokeW / (objSize / 2));
    let distanceLines = min(speed * 0.01, maxAngle);
    let lineCount = 18
    let totalAngleLines = distanceLines * lineCount;
    for (let i = 0; i <= lineCount; i++) {

        line(0 - objSize / 2, 0, 0 + objSize / 2, 0)
        line(0, 0 - objSize / 2, 0, 0 + objSize / 2)
        rotate(-distanceLines);
    }
    //console.log(totalAngleLines);

    if (totalAngleLines >= 75) {
        fill(0)
        noStroke()
        growing += 0.7;
        circle(0, 0, constrain(growing, 0, objSize + 10));
        // console.log(growing);
    }
    if (growing > objSize + 5) {
        soundEffect2.stop();
        soundEffect1.stop();
        sendSequenceNextSignal(); // finish sketch
        noLoop();

    }
}
