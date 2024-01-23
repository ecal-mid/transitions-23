import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

const spring = new SpringNumber({
    position: -120, // start position
    frequency: 2.5, // oscillations per second (approximate)
    halfLife: 0.05 // time until amplitude is halved
})
const spring2 = new SpringNumber({
    position: 0, // start position
    frequency: 1.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})


const spring4 = new SpringNumber({
    position: 0, // start position
    frequency: 0.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

let engine;
let world;

let balls = [];
let boundary1;
let boundary2;
let rot = 0;
let flow = undefined
let robinet = false
const xOffset = .2;

let shapeId = 0
let isClicking = false

let img;

let intStart = 0

let bodyRotations = [];

let tap
let squeak
let water;
let boing
let gear;
let x, y, imgWidth, imgHeight;

window.preload = function () {

    img = loadImage('tap.png')
    tap = loadSound('tap.mp3')
    squeak = loadSound('squeak.mp3')
    water = loadSound('water.mp3')
    boing = loadSound('boing.mp3')
    gear = loadSound('gear.mp3')
}

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const strokeW = 20

    fill(0)
    noStroke()
    rectMode(CENTER)
    strokeWeight(strokeW)
    stroke(0)
    line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
    line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)

    engine = Matter.Engine.create();
    world = engine.world;
    world.gravity.y /= 2; // Halve the gravity

    Matter.Engine.run(engine);

    // Create static boundaries constrained to the center
    boundary1 = new Boundary(centerX, centerY, 20, objSize + 20, HALF_PI + rot);
    boundary2 = new Boundary(centerX, centerY, 20, objSize + 20, PI + rot);

    // Create constraints to center
    let constraintOptions = {
        bodyA: boundary1.body,
        pointB: { x: width / 2, y: height / 2 },
        length: 0
    };

    let constraintOptions2 = {
        bodyA: boundary2.body,
        pointB: { x: width / 2, y: height / 2 },
        length: 0
    };

    let constraint = Matter.Constraint.create(constraintOptions);
    let constraint2 = Matter.Constraint.create(constraintOptions2);
    Matter.World.add(world, constraint2);
    Matter.World.add(world, constraint);


}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.draw = function () {
    background(255, 255, 255);

    const sceneSize = min(width, height)
    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const strokeW = 20

    const targetPos = (width - xOffset * width) / 2;
    x = spring.position
    y = height / 6 - 26 + 20;
    imgWidth = img.width / 2.4
    imgHeight = img.height / 2.4
    const robinetClicked = mouseX > x - imgWidth / 2 &&
        mouseX < x + imgWidth / 2 &&
        mouseY > y - imgHeight / 2 &&
        mouseY < y + imgHeight / 2;

    if (robinetClicked) {
        cursor('pointer')
    }
    else {
        cursor('default')
    }
    switch (shapeId) {
        case 0:
            fill(0)
            noStroke()
            rectMode(CENTER)
            strokeWeight(20)
            stroke(0)
            line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
            line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)



            if (robinet) {
                spring.target = targetPos

            }


            const tolerance = 0.1; // Adjust the tolerance as needed

            if (Math.abs(x - targetPos) < tolerance) {
                shapeId++;
            }
            break;

        case 1:


            Matter.Engine.update(engine);


            if (flow) {
                // Limit the rate of ball creation
                let ball = new Ball(x + 35, y + 30, 5);
                balls.push(ball);
            }

            if (!flow) {
                water.stop()

            }

            if (flow === false) {

                spring.target = -imgWidth / 2;
            }
            if (flow !== undefined && balls.length == 0) {

                shapeId++;
            }

            // Display and check boundaries for each ball
            for (let i = balls.length - 1; i >= 0; i--) {
                balls[i].show();
                balls[i].checkBounds();

                // Remove balls that are off-screen
                if (balls[i].isOffScreen()) {
                    Matter.World.remove(world, balls[i].body);
                    balls.splice(i, 1);
                }
            }

            // Display static boundaries
            boundary1.show();
            boundary2.show();

            break;

        case 2:

            fill(0)
            noStroke()
            rectMode(CENTER)
            strokeWeight(20)
            stroke(0)

            const target1 = getAngleTarget(boundary1.body.angle)
            const target2 = getAngleTarget(boundary2.body.angle)
            boundary1.body.angle = lerp(boundary1.body.angle, target1, 0.01)
            boundary2.body.angle = lerp(boundary2.body.angle, target2, 0.01)
            boundary1.show();
            boundary2.show();

            if (Math.abs(boundary1.body.angle - target1) < .01 &&
                Math.abs(boundary2.body.angle - target2) < .01) {
                shapeId++;
            }
            break;

        case 3:
            fill(0)
            noStroke()
            rectMode(CENTER)
            strokeWeight(20)



            spring2.step(deltaTime / 1000)

            let roundness = map(spring2.position, 0, 1, 20, 0)
            let w = map(spring2.position, 0, 1, 20, objSize)
            let h = map(spring2.position, 0, 1, objSize + 20, objSize)

            stroke(0)
            noStroke()
            rect(centerX, centerY, w, h, max(0, roundness));


            if (roundness < 1) {
                sendSequenceNextSignal()
                noLoop();
            }



            break;
    }


    spring.step(deltaTime / 1000)


    strokeWeight(12)
    push()
    translate(-imgWidth / 2, 6)
    line(x, y, x - 1000, y)
    pop()
    imageMode(CENTER)
    image(img, x, y, imgWidth, imgHeight);
}


window.mousePressed = function () {

    const robinetClicked = mouseX > x - imgWidth / 2 &&
        mouseX < x + imgWidth / 2 &&
        mouseY > y - imgHeight / 2 &&
        mouseY < y + imgHeight / 2;

    if (robinetClicked) {
        isClicking = true;
    }
    switch (shapeId) {
        case 0:
            if (isClicking) {
                robinet = true;

                if (!tap.isPlaying()) {
                    tap.play()
                    tap.setVolume(3)
                }


            }
            spring.target = img.width / 2
            break;


        case 1:
            break

        case 3:

            spring2.target = 1
            if (!boing.isPlaying()) {
                boing.play()
                boing.setVolume(1.5)
            }
            break
    }
}

window.mouseReleased = function () {

    switch (shapeId) {
        case 1:
            if (isClicking) {
                flow = !flow;
                squeak.play()
                if (flow) {

                    water.play()
                }
            }
            break;
    }

    isClicking = false;
}

class Ball {
    constructor(x, y, radius) {
        this.body = Matter.Bodies.circle(x, y, radius);
        Matter.World.add(world, this.body);
        this.radius = radius;
    }

    show() {
        const pos = this.body.position;
        const angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        fill(119, 181, 254);
        noStroke();
        ellipse(0, 0, this.radius * 3);
        pop();
    }

    checkBounds() {
        const pos = this.body.position;
        const vel = this.body.velocity;

        // If the ball crosses the screen bounds, reverse its velocity
        if (pos.x < 0 || pos.x > width) {
            Matter.Body.setVelocity(this.body, { x: -vel.x, y: vel.y });
        }
        if (pos.y < 0 || pos.y > height) {
            Matter.Body.setVelocity(this.body, { x: vel.x, y: -vel.y });
        }
    }

    isOffScreen() {
        const pos = this.body.position;
        return (pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height);
    }
}

class Boundary {
    constructor(x, y, w, h, a, s) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.options = {
            friction: 0,
            restitution: 0.9,
            angle: a,

            isStatic: s
        };

        this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, this.options);
        this.body.frictionAir = 0.01
        this.body.restitution = 0
        this.body.friction = 0
        this.body.label = 'boundary';
        this.body.collisionFilter.group = -1;

        Matter.World.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        //console.log("Boundary Orientation:", this.body.angle);
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h, 30);
        pop();
    }


}

function getAngleTarget(angle) {

    const rounded = Math.round(angle / Math.PI) * Math.PI
    let diff = repeat(rounded - angle, Math.PI * 2)
    if (diff > Math.PI)
        diff -= Math.PI * 2

    return angle + diff
}

function repeat(value, repeatValue) {

    let mod = value % repeatValue
    if (mod < 0)
        mod += repeatValue
    return mod
}