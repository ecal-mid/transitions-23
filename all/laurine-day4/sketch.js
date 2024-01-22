import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"




// Radius of the circles

let circleRadius = 10;
let sceneSize, objSize;
let targetRadius; // Target radius on hover
let cols = 5; // Number of columns
let rows = 5; // Number of rows
let canvasWidth, canvasHeight; // Canvas dimensions
let circlePositions = []; // Array to store current positions of circles
let isMoving = false; // Flag to check if circles are moving
let allCirclesReached = false;

let finished = false;








window.setup = function () {

    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(canvasWidth, canvasHeight);
    fill(0);

    sceneSize = min(width, height);
    objSize = sceneSize / 2;
    targetRadius = objSize / 2;


    let spacing = objSize / (cols - 1); // Spacing between circles

    // Calculate total grid width and height
    let totalGridWidth = objSize;
    let totalGridHeight = objSize;

    // Calculate the center position of the grid
    let centerX = (width - totalGridWidth) / 2;
    let centerY = (height - totalGridHeight) / 2;

    // Store initial positions of circles with grid centered
    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {


            let x = centerX + j * spacing; // Calculate x position
            let y = centerY + i * spacing; // Calculate y position
            circlePositions.push({ position: createVector(x, y), radius: circleRadius });
        }
    }
}



window.windowResized = function () {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    resizeCanvas(canvasWidth, canvasHeight);
};


window.drawGrid = function () {
    background(255); // Clear the canvas
    // Draw the grid
    for (let i = 0; i < circlePositions.length; i++) {

        let circle = circlePositions[i];
        ellipse(circle.position.x, circle.position.y, circle.radius * 2, circle.radius * 2);
    }
}

window.draw = function () {
    if (isMoving) {

        background(255); // Clear the canvas
        allCirclesReached = true;


        for (let i = 0; i < circlePositions.length; i++) {

            let circle = circlePositions[i];
            let targetX = canvasWidth / 2; // Target X position (center)
            let targetY = canvasHeight / 2; // Target Y position (center)
            let dx = targetX - circle.position.x;
            let dy = targetY - circle.position.y;
            let easing = 0.1; // Easing value for smooth movement


            if (abs(dx) > 1 || abs(dy) > 1) {

                circle.position.x += dx * easing;
                circle.position.y += dy * easing;
                allCirclesReached = false;
            }


            ellipse(circle.position.x, circle.position.y, circle.radius * 2, circle.radius * 2);
        }

        if (allCirclesReached) {
            isMoving = false;

        }
    } else {
        drawGrid(); // If not moving, redraw the grid
    }

    if (allCirclesReached) {

        for (let i = 0; i < circlePositions.length; i++) {


            let circle = circlePositions[i];
            let d = dist(mouseX, mouseY, circle.position.x, circle.position.y);

            if (d < circle.radius && circle.radius < targetRadius) {

                if (circle.radius >= targetRadius - 1 && circle.radius <= targetRadius + 1 && !finished) {
                    finished = true
                    sendSequenceNextSignal()
                    noLoop()
                    console.log("done");

                }




                circle.radius = lerp(circle.radius, targetRadius, 0.1); // Gradually increase radius
            } else if (circle.radius > targetRadius) {




                circle.radius = targetRadius; // Ensure radius stays at 250 pixels


                console.log("Circle Radius:", circle.radius);

            }
        }
    }
}

window.mouseClicked = function () {


    if (!isMoving) {

        isMoving = true; // Start moving circles to the center
    }
}
