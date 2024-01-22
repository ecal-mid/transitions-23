// import { triangle } from "./triangle.js";
import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

let finished = false



let shapeId = 0
let triangles = []

let objSize = 0;
let strokeW = 20;
// let strokeCap = (SQUARE);


let state = 0;

const rotateSpring = new SpringNumber({
    position: 0, // start position
    frequency: 4.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

const scaleSpring = new SpringNumber({
    position: 1, // start position
    frequency: 4.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})


const strokeSpring = new SpringNumber({
    position: 20, // start position
    frequency: 4.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})


window.setup = function () {

    createCanvas(windowWidth, windowHeight);

    angleMode(DEGREES)

    strokeCap(ROUND);
    for (let i = 0; i < 4; i++) {
        triangles.push(new Triangle(i * 90))
    }
    console.log(triangles);
}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mouseClicked = function () {
    shapeId++
    shapeId %= 2


    for (let i = 0; i < triangles.length; i++) {
        triangles[i].isClicked(mouseX, mouseY)
    }


    switch (state) {
        case 0: // Draw Triangles
            const allFinished = triangles.every((a) => a.animate);
            if (allFinished) { state++; };
            break;
        case 1: // Rotate
            rotateSpring.target = 45;
            strokeSpring.target = 0
            state++;
            break;
        case 2:
            const diagonal = Math.sqrt(2 * objSize * objSize);
            // Calculate the scaling factor to fill the square based on the rotated cross
            const scaleFactor = diagonal / objSize;
            scaleSpring.target = scaleFactor;
            state++;
            setTimeout(() => {
                sendSequenceNextSignal(); // finish sketch
                noLoop();

            }, "3000");
            break;
    }
}


window.draw = function () {
    background(255);



    rotateSpring.step(deltaTime / 1000)
    scaleSpring.step(deltaTime / 1000)
    strokeSpring.step(deltaTime / 1000)

    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    objSize = sceneSize / 2
    const halfWidth = objSize / tan(60)



    // switch (shapeId) {
    //     case 1:
    //         fill(0)
    //         noStroke()
    //         rectMode(CENTER)
    //         rect(centerX, centerY, objSize, objSize)
    //         break;



    //     case 0:

    //         fill(0)
    //         noStroke()
    //         rectMode(CENTER)
    //         strokeWeight(strokeW)
    //         stroke(0)
    //         line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
    //         line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
    //         break;
    // }

    fill(0)
    noStroke()
    rectMode(CENTER)
    strokeWeight(strokeSpring.position)
    stroke(0)
    if (state === 0) {
        line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
        line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
    }

    push();

    translate(centerX, centerY)
    rotate(rotateSpring.position)
    scale(scaleSpring.position)

    for (let i = 0; i < triangles.length; i++) {
        triangles[i].draw()
    }
    pop();

    // DEBUG
    // push();

    // fill("red")
    // noStroke()
    // rectMode(CENTER)
    // rect(centerX, centerY, objSize, objSize)

    // pop();

}

class Triangle {

    constructor(rotation) {
        this.positionX = 0
        this.positionY = 0

        this.animate = false;
        this.rotation = rotation;
        this.color = color(random(255), random(255), random(255));
        this.activeColor = color(0);

        this.firstSpring = new SpringNumber({
            position: 0,
            frequency: 3,
            halfLife: .4
        })

    }

    isClicked(mouseX, mouseY) {
        const offsetX = mouseX - width / 2
        const offsetY = mouseY - height / 2


        let angle = Math.atan2(offsetY, offsetX) * (180 / Math.PI);

        // Ensure the angle is positive
        if (angle < 0) {
            angle += 360;
            fill(this.color)
        }
        else {

            fill(this.activeColor);
        }

        if (angle > this.rotation && angle < this.rotation + 90)

        //if (!this.animate && mouseX > this.positionX && mouseX < this.positionX + objSize / 2 && mouseY > this.positionY && mouseY < this.positionY + objSize / 2) {
        {
            this.animate = !this.animate;
            this.firstSpring.target = objSize / 2;
        }
    }

    draw() {

        this.firstSpring.step(deltaTime / 1000)

        push()
        //translate(this.positionX, this.positionY)
        rotate(this.rotation);
        fill("black");
        strokeCap(ROUND);
        strokeJoin(ROUND)
        //noStroke();
        // strokeWeight(4);



        // strokeWeight(strokeSpring / 2);
        beginShape();
        vertex(0, 0)
        vertex(this.firstSpring.position, 0)
        vertex(0, this.firstSpring.position)
        //vertex()
        endShape(CLOSE)
        pop()
    }
    display() { // Ensure the angle is positive
        if (angle < 0) {
            angle += 360;
            fill(this.color)
        }
        else {

            fill(this.activeColor);
        }
        //     if (this.animate)
        //         fill(this.color)
        //     else
        //         fill(this.activeColor);

        // }
    }
}
