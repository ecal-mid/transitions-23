import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"



const spring = new SpringNumber({
	position: 0, // start position
	frequency: 1.5, // oscillations per second (approximate)
	halfLife: 0.15 // time until amplitude is halved
})

const spring2 = new SpringNumber({ 
    position: window.innerWidth/2, // start position
    frequency: 10.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

const spring3 = new SpringNumber({
    position: window.innerHeight/2, // start position
    frequency: 10.5, // oscillations per second (approximate)
    halfLife: 0.15 // time until amplitude is halved
})

let osc;



let mouseClicked = false    
let shapeId = 0
let change = false

const positions = []; 
const circles = []; 

let pop;

window.preload = function () {
    pop = loadSound('popping.mp3')
}

window.setup = function () {

    createCanvas(windowWidth, windowHeight);

    osc = new p5.Oscillator();
    osc.setType('sine');

    angleMode(DEGREES)
    const gridCount = 5
    const centerX = width / 2
    const centerY = height / 2
    const objSize = min(width, height) / 2

  

    for (let x = 0; x < gridCount; x++) {
        for (let y = 0; y < gridCount; y++) {
            const xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2, x)
            const yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2, y)
            positions.push({ x: xPos, y: yPos }); // Store position in the array
        }
    }



}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mouseClicked = function () {
    mouseClicked = true
    
 
}

window.draw = function () {


    background(255);
    fill(255,0,0)



    const sceneSize = min(width, height)

   const centerX = width / 2
    const centerY = height / 2
    let objSize = sceneSize / 2
    const strokeW = 20


    if (positions.length == 0) {
        change = true
       }
    if (change) {
        noLoop();
        setTimeout(function () {
            sendSequenceNextSignal()
        }, 1000);
    }
    switch (shapeId) {
        case 0:
          
           

         
                if (mouseIsPressed) {
                    spring.target = 20;
                   
                } else {
                    spring.target = objSize;
                   
                }
             
                spring.step(deltaTime / 1000);

                const x = spring.position;
              
               

                fill(0);
                noStroke();
                circle(centerX, centerY, x);



if (x >= 19.5 && x <= 20.5) {
   
    shapeId++
}






    fill(0)
    noStroke()
    circle(centerX, centerY, x);
           
            break;

        case 1:


        fill(0)
        noStroke()
        
        const pointSize = strokeW
    
        //   spring2.target = mouseX
        //     spring3.target = mouseY
    
        spring2.step(deltaTime / 1000)
        spring3.step(deltaTime / 1000)
    
      
    
       
    
       
   

        for (let i = 0; i < positions.length; i++) {
            
            const pos = positions[i];
            const x = pos.x;
            const y = pos.y;
            const distance = dist(x, y, mouseX, mouseY);

            if (distance <100) {

                spring2.target = x
                spring3.target = y
            } 

            const xpos = spring2.position
            const ypos = spring3.position


                if (xpos >= x-30.5 && xpos <= x+30.5 && ypos >= y-30.5 && ypos <= y+30.5) {


                    fill(0);
                    noStroke();
                    circle(x, y, pointSize);
                    circles.push(new Circle(x, y, pointSize));
                    positions.splice(i, 1);

                      
                    
                    pop.setVolume(0.5)
                    pop.play()
                   
                   
                   
               
                }

                
            let cercle = new Circle(xpos, ypos, pointSize);
            cercle.draw();

        
     }
      
     for (let i = 0; i < circles.length; i++) {
        circles[i].draw();
      
    }

  
   
    
    console.log(positions.length)

  
            break;

            

        
}

        
}


class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        circle(this.x, this.y, this.radius);
    }


}

