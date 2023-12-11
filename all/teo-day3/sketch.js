import { SpringNumber, SpringVector } from "../../shared/spring.js"
import { VerletPhysics } from "../../shared/verletPhysics.js"
import { DragManager } from "../../shared/dragManager.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

const dragManager = new DragManager()

const physics = new VerletPhysics()
physics.gravityY = 0

let chain
let chain2
let chain3
let chain4

const spring = new SpringNumber({
	position: 0, // start position
	frequency: 4.5, // oscillations per second (approximate)
	halfLife: 0.15 // time until amplitude is halved
})

class Grid {
    constructor(centerX, centerY, objSize, gridCount, pointSize) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.objSize = objSize;
        this.gridCount = gridCount;
        this.pointSize = pointSize;
    }
}

class Circle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.originalX = x;
        this.originalY = y;
        this.attracted = false;
        this.color = color;
    }

    draw() {
        if (this.attracted) {
            const attractionPointX = mouseX;
            const attractionPointY = mouseY;
            const attractionForce = 0.025;

            this.x += (attractionPointX - this.x) * attractionForce;
            this.y += (attractionPointY - this.y) * attractionForce;
            // this.size += (50 - this.size) * 0.15;
        } else {
            this.x -= (this.originalX - this.x) * 0.03;
            this.y -= (this.originalY - this.y) * 0.03;
            // this.size += (20 - this.size) * 0.15;
        }

        fill(this.color);
        noStroke();
        circle(this.x, this.y, this.size);
    }
}



let grid;
let circles = [];

let shapeId = 0;    

const originalPositions = [];
const originalPositions2 = [];
const originalPositions3 = [];
const originalPositions4 = [];

let cling;
let grab;
let ding;


window.preload = function () {
    cling = loadSound('cling.mp3')
    grab = loadSound('grab.mp3')
    ding = loadSound('ding.mp3')
}


window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;
    const halfWidth = objSize / tan(60);
    const strokeW = 20;

    grid = new Grid(centerX, centerY, objSize, 5, strokeW);

    for (let x = 0; x < grid.gridCount; x++) {
        for (let y = 0; y < grid.gridCount; y++) {
            const xPos = map(
                x,
                0,
                grid.gridCount - 1,
                grid.centerX - grid.objSize / 2,
                grid.centerX + grid.objSize / 2,
                x
            );
            const yPos = map(
                y,
                0,
                grid.gridCount - 1,
                grid.centerY - grid.objSize / 2,
                grid.centerY + grid.objSize / 2,
                y
            );
            circles.push(new Circle(xPos, yPos, strokeW, color(0)));
        }
    }


    chain = physics.createChain({

        startPositionX: centerX,
        startPositionY: centerY,
        endPositionX: centerX + halfWidth-39,
        endPositionY: centerY,
        elementCount: 10,
        linkOptions: {
            //mode: VerletMode.Pull,
            stiffness: 1
        },
        bodyOptions: {
            drag: 1,
            radius: 10,
            radius: 50
        }
    })

    chain2 = physics.createChain({

        startPositionX: centerX,
        startPositionY: centerY,
        endPositionX: centerX,
        endPositionY: centerY + halfWidth-39,
        elementCount: 10,
        linkOptions: {
            //mode: VerletMode.Pull,
            stiffness: 1
        },
        bodyOptions: {
            drag: 1,
            radius: 10,
            radius: 50
        }
    })

    chain3 = physics.createChain({

        startPositionX: centerX,
        startPositionY: centerY,
        endPositionX: centerX - halfWidth+39,
        endPositionY: centerY,
        elementCount: 10,
        linkOptions: {
            //mode: VerletMode.Pull,
            stiffness: 1
        },
        bodyOptions: {
            drag: 1,
            radius: 10,
            radius: 50
        }
    })

    chain4 = physics.createChain({

        startPositionX: centerX,
        startPositionY: centerY,
        endPositionX: centerX,
        endPositionY: centerY - halfWidth+39,
        elementCount: 10,
        linkOptions: {
            //mode: VerletMode.Pull,
            stiffness: 1
        },
        bodyOptions: {
            drag: 1,
            radius: 10,
            radius: 50
        }
    })


    const link = physics.createLink({
        bodyA: chain.bodies[0],
        bodyB: chain2.bodies[0],
        stiffness: 1,
        distance: 0,
    })

    const link2 = physics.createLink({
        bodyA: chain2.bodies[0],
        bodyB: chain3.bodies[0],
        stiffness: 1,
        distance: 0,
    })

    const link3 = physics.createLink({
        bodyA: chain3.bodies[0],
        bodyB: chain4.bodies[0],
        stiffness: 1,
        distance: 0,
    })

    for (const o of chain.bodies) {

        dragManager.createDragObject({
            target: o,
            onStartDrag: o => {
                o.isFixed = true
            },
            onStopDrag: o => {
                o.isFixed = false
            }
        })
    }

    for (const o of chain2.bodies) {

        dragManager.createDragObject({
            target: o,
            onStartDrag: o => {
                o.isFixed = true
            },
            onStopDrag: o => {
                o.isFixed = false
            }
        })
    }

    for (const o of chain3.bodies) {

        dragManager.createDragObject({
            target: o,
            onStartDrag: o => {
                o.isFixed = true
            },
            onStopDrag: o => {
                o.isFixed = false
            }
        })
    }

    for (const o of chain4.bodies) {

        dragManager.createDragObject({
            target: o,
            onStartDrag: o => {
                o.isFixed = true
            },
            onStopDrag: o => {
                o.isFixed = false
            }
        })
    }



};






window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};





window.draw = function () {
    background(255);

    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;
    const halfWidth = objSize / tan(60);
    const strokeW = 20;

    
    switch (shapeId) {

        case 0:
   
    let allCirclesOutside = true;

    circles.forEach((circle) => {
        circle.draw();


       
        circles[12].color = color(255)


//if a circle goes outside the screen, cling sound plays
    

      
     


        if (circle.x >= 0 && circle.x <= width && circle.y >= 0 && circle.y <= height) {
           
            allCirclesOutside = false;
        }
    });

    if (allCirclesOutside) {
        cling.play()
       shapeId++
    }

    let attractionDistance = 150;


    circles.forEach((circle) => {
        const distance = dist(circle.originalX, circle.originalY, mouseX, mouseY);
        const distance2 = dist(circle.x, circle.y, circle.originalX, circle.originalY);
        if (distance < attractionDistance && distance2 < attractionDistance) {
           
          
           
            circle.attracted = true;
        } else {
            circle.attracted = false;
        }
    });



  


    circle(centerX, centerY, 20)

    break;

    case 1:

   


    fill(0)
    noStroke()
    rectMode(CENTER)
    strokeWeight(strokeW)


 

      

    spring.step(deltaTime / 1000) 

    let lineLengthX = spring.position

   
    
    stroke('black')
    line(centerX , centerY, centerX + lineLengthX, centerY)
    

    line(centerX - lineLengthX, centerY, centerX, centerY);


   
    line(centerX, centerY - lineLengthX, centerX, centerY)

   
    line(centerX, centerY, centerX, centerY + lineLengthX)

    let target = mouseX - centerX

    if (mouseIsPressed) {
        spring.target = mouseX- centerX;
      
    } 

    window.mousePressed = function() {

        grab.play()
    
    }

    window.mouseReleased = function() {
        spring.target = objSize / 2;
        ding.play()
    }

   

    if (lineLengthX > objSize / 2 -0.2 && lineLengthX < objSize / 2+0.2 ) {
        shapeId++
    }

    break;

    case 2:

    window.mouseReleased = function() {
        physics.gravityY = 1000
    }

    physics.bounds = {
      
        left: 0,
        right: width,
        bottom: height
    }


    for (const body of chain.bodies) {
        originalPositions.push({ x: body.positionX, y: body.positionY });
    }
    
    for (const body of chain2.bodies) {
        originalPositions2.push({ x: body.positionX, y: body.positionY });
    }
    
    for (const body of chain3.bodies) {
        originalPositions3.push({ x: body.positionX, y: body.positionY });
    }
    
    for (const body of chain4.bodies) {
        originalPositions4.push({ x: body.positionX, y: body.positionY });
    }

    dragManager.update()
    physics.update()

    strokeWeight(20)
    noFill()
    stroke('black')


    strokeJoin(BEVEL)
    beginShape()
    const firstBody = chain.bodies[0]

    curveVertex(firstBody.positionX, firstBody.positionY)

    for (const body of chain.bodies) {
        curveVertex(body.positionX, body.positionY)
        // chain.bodies[0].isFixed = true
    }
    const lastBody = chain.bodies[chain.bodies.length - 1]
    curveVertex(lastBody.positionX, lastBody.positionY)
    endShape()

    
    beginShape()
    const firstBody2 = chain2.bodies[0]
    curveVertex(firstBody2.positionX, firstBody2.positionY)

    for (const body of chain2.bodies) {
        curveVertex(body.positionX, body.positionY)
        // chain2.bodies[0].isFixed = true
    }
    const lastBody2 = chain2.bodies[chain2.bodies.length - 1]
    curveVertex(lastBody2.positionX, lastBody2.positionY)
    endShape()

  
    beginShape()
    const firstBody7 = chain3.bodies[0]
    curveVertex(firstBody7.positionX, firstBody7.positionY)
    for (const body of chain3.bodies) {
        curveVertex(body.positionX, body.positionY)
        // chain3.bodies[0].isFixed = true
    }
    const lastBody7 = chain3.bodies[chain3.bodies.length - 1]
    curveVertex(lastBody7.positionX, lastBody7.positionY)
    endShape()


    beginShape()
    const firstBody8 = chain4.bodies[0]
    vertex(firstBody8.positionX, firstBody8.positionY)
    for (const body of chain4.bodies) {
        curveVertex(body.positionX, body.positionY)
        // chain4.bodies[0].isFixed = true
    }
    const lastBody8 = chain4.bodies[chain4.bodies.length - 1]
    curveVertex(lastBody8.positionX, lastBody8.positionY)
    endShape()


    let allBodiesOutsideScreen = true;

for (const body of chain.bodies) {
    if (body.positionX >= 0 && body.positionX <= width && body.positionY >= 0 && body.positionY <= height) {
        allBodiesOutsideScreen = false;
        break;
    }
}

if (allBodiesOutsideScreen) {

//     chain.bodies.isFixed = true


//    for (let i = 0; i < chain.bodies.length; i++) {
//         const body = chain.bodies[i];
//         body.positionX = originalPositions[i].x;
//         body.positionY = originalPositions[i].y;
//     }
//     for (let i = 0; i < chain2.bodies.length; i++) {
//         const body = chain2.bodies[i];
//         body.positionX = originalPositions2[i].x;
//         body.positionY = originalPositions2[i].y;
//     }
//     for (let i = 0; i < chain3.bodies.length; i++) {
//         const body = chain3.bodies[i];
//         body.positionX = originalPositions3[i].x;
//         body.positionY = originalPositions3[i].y;
//     }
//     for (let i = 0; i < chain4.bodies.length; i++) {
//         const body = chain4.bodies[i];
//         body.positionX = originalPositions4[i].x;
//         body.positionY = originalPositions4[i].y;
//     }

shapeId++
}





   
    // debug visualization
    // physics.displayDebug()

   
   
    rectMode(CENTER)
    strokeWeight(strokeW)
    stroke(0,0,0)
    line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
    line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)

    break;

    case 3:



    fill(0)
    noStroke()
    rectMode(CENTER)
    strokeWeight(strokeW)
    stroke(0)
    line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
    line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)

noLoop()
setTimeout(function () {
    sendSequenceNextSignal()
}, 2000);
  

    break;
    }
    };

