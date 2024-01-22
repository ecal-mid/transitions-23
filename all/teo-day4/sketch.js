import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

const spring = new SpringNumber({
	position: 0, // start position
	frequency: 4.5, // oscillations per second (approximate)
	halfLife: 0.15 // time until amplitude is halved
})

const spring1 = new SpringNumber({
    position: 0, // start position
    frequency: 1.0, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

const spring2 = new SpringNumber({
    position: 0, // start position
    frequency: 4.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

const spring3 = new SpringNumber({
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
let flow = false
let robinet = false

let shapeId = 0

let img;

let intStart = 0

let bodyRotations = [];

let tap
let squeak
let water;
let boing
let gear;

window.preload = function () {
    
    img = loadImage('tap.png')
    tap = loadSound('tap.mp3')
    squeak = loadSound('squeak.mp3')
    water = loadSound('water.mp3')
    boing = loadSound('boing.mp3')
    gear = loadSound('gear.mp3')
}

window.setup = function (){
    createCanvas(windowWidth, windowHeight);
    const sceneSize = min(width, height)

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const strokeW = objSize / 20

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
    boundary1 = new Boundary(centerX , centerY, 20, objSize+20, HALF_PI + rot);
    boundary2 = new Boundary(centerX , centerY, 20, objSize+20, PI + rot);
    
    // Create constraints to center
    let constraintOptions = {
        bodyA: boundary1.body,
        pointB: { x: width/2, y: height/2 },
        length: 0
    };

    let constraintOptions2 = {
        bodyA: boundary2.body,
        pointB: { x: width/2, y: height/2 },
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
    background(255,255,255);

    const sceneSize = min(width, height)
    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    const strokeW = objSize / 20

    switch (shapeId) {
        case 0:
            fill(0)
            noStroke()
            rectMode(CENTER)
            strokeWeight(20)
            stroke(0)
            line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
            line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)

          

            window.mouseClicked = function () {
             
            
                if  (mouseX > 0 && mouseX < 100 && mouseY > height/6-26 && mouseY < height/6+24) {
                    robinet = true;
                    tap.play()
                    tap.setVolume(3)
                   
                   
                }
            }
         
          
            if (robinet) {
                spring.target = width/2.4
         
            } else {
                spring.target = 0
            }

            if (mouseButton === LEFT) {
              
            spring4.target = 100
            }


            spring.step(deltaTime / 1000) 
            spring4.step(deltaTime / 1000)

            const x = spring.position
            const b = spring4.position

            strokeWeight(12)
            translate(-100+b,0)
            line(-100, height/6, x+20 , height/6)

            imageMode(CENTER)
           
            image(img, x+58, height/6-26+20,183/2.4,119/2.4);

            const tolerance = 0.001; // Adjust the tolerance as needed

            if (Math.abs(x - width/2.4) < tolerance) {
                shapeId++;
            }
            break;

        case 1:
            strokeWeight(12)
         

            Matter.Engine.update(engine);

            window.mouseClicked = function () {
                if  (mouseX > width/2.4+40 && mouseX < width/2.4+160 && mouseY > height/6-46 && mouseY < height/6+44) {
                    flow = true;
                    squeak.play()
                    water.play()
                }
            }

            if (flow) {
                // Limit the rate of ball creation
                let ball = new Ball(width/2.14-3, 193, 5);
                balls.push(ball);
            }

            if (!flow) {
               water.stop()
               
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
            line(0, height/6, width/2.4+20 , height/6)
            image(img, width/2.4+58, height/6-26+20,183/2.4,119/2.4);


            break;

        case 2:
           
        fill(0)
        noStroke()
        rectMode(CENTER)
        strokeWeight(20)
        stroke(0)
     
        line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)

        
      
        if (!flow) {
            spring1.target = width/2.4
             
        } else {
            spring1.target = 0
        }

       

        spring1.step(deltaTime / 1000) 

       const y = spring1.position

        strokeWeight(12)
        line(0, height/6, width/2.4+20-y , height/6)
        image(img, width/2.4+58-y, height/6-26+20, 183/2.4,119/2.4);

      if (y > 746) {
        shapeId++;
        }

        //console.log(y)

        break;

        case 3:
            fill(0)
        noStroke()
        rectMode(CENTER)
        strokeWeight(20)
     
      
     
        window.mouseClicked = function () {
            spring2.target = objSize-20
            spring3.target = 30
            boing.play()
            boing.setVolume(1.5)
        }

      

        spring2.step(deltaTime / 1000)
        spring3.step(deltaTime / 1000)

        const z = spring2.position
        const a = spring3.position
        let roundness = abs(30-a)
     
        stroke(0)
        noStroke()
        rect(centerX, centerY, 20+z, objSize, roundness);

    
    if (roundness < 1) {
        setTimeout(function () {
            sendSequenceNextSignal()
        }, 1000);
        }

        

       

        stroke(0)
        strokeWeight(12)
        translate(intStart-a*4,0)
        line(0, height/6, 20 , height/6)
        image(img, 58, height/6-26+20, 183/2.4,119/2.4);
        

        break;
    }
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
        fill(119,181,254);
        noStroke();
        ellipse(0, 0, this.radius *3 );
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

        if (Math.abs(this.body.angle) < 0.05) {
            flow = false;
            let allBallsOffScreen = true;
            for (let i = 0; i < balls.length; i++) {
                if (!balls[i].isOffScreen()) {
                    allBallsOffScreen = false;
                    break;
                }
            }
            
            if (allBallsOffScreen) {
                shapeId++;
            }
            
        }
    }

   
}


