import { SpringNumber } from "../../shared/spring.js";
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";



let mySound;
let mySound2;
let mySound3;
let shapeId = 0;
let posList = []; // list of positions
let squareSize;
let allFilled = false; // true if all squares are filled
let playedSound2 = []


window.preload = function () {
    soundFormats('mp3', 'ogg');
    mySound = loadSound('sound/bubble.mp3');
    mySound2 = loadSound('sound/tinyClick.wav');
    mySound3 = loadSound('sound/bamboClick.mp3');
}
const gridSize = 5;
window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;
    squareSize = objSize / gridSize;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let index = i * gridSize + j;
            playedSound2.push(false);
            //if (index >= posList.length) {
                let squareX = centerX - objSize / 2 + i * squareSize;
                let squareY = centerY - objSize / 2 + j * squareSize;
                let pos = {
                    x: squareX,
                    y: squareY,
                    showCircle: false,
                    hideSquare: false,
                    spring: new SpringNumber({
                        position: 60, // start position
                        frequency: 0.5, // oscillations per second
                        halfLife: 10 // time until amplitude is halved
                
                    })
                };
                posList.push(pos);
            //}
           // rect(posList[index].x + squareSize / 2, posList[index].y + squareSize / 2, squareSize, squareSize);
          //  if (posList[index].clicked) filledCount++;
            
        }
    }
}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}
window.keyPressed = function() {
    if (keyCode === 32) { 
        allFilled = true;
        posList.forEach(pos => {
            pos.showCircle = true;
        });
    }
}
window.draw = function () {
    if ( mouseIsPressed ) { 
        posList.forEach(pos => {
            if (mouseX > pos.x && mouseX < pos.x + squareSize &&
                mouseY > pos.y && mouseY < pos.y + squareSize) {

                    

                if(allFilled){
                    pos.hideSquare = true;}
                else{
                    pos.showCircle = true;
                    pos.spring.position = 60;

                    if (pos.spring.position == 60) {
                        mySound.play();
                    }


                }
            }
    
     
        });
    }
    background(255);
    const sceneSize = min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const objSize = sceneSize / 2;
    squareSize = objSize / gridSize;

    let filledCount = 0;

   
    fill(0);
    noStroke();
    rectMode(CENTER);
    //rect(centerX, centerY, objSize, objSize);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let index = i * gridSize + j;
            
            if(!posList[index].hideSquare) 
                rect(posList[index].x + squareSize / 2, posList[index].y + squareSize / 2, squareSize+1, squareSize+1);
            if (posList[index].showCircle) filledCount++; 
            if (posList[index].hideSquare && !playedSound2[index]) {
                playedSound2[index] = true;
                if (mySound2.isPlaying()) {
                    mySound2.stop();
                    mySound2.play();
                } else {

                    mySound2.play();
                }
                
                //posList[index].hideSquare = false;
            }


            
        }
    }    


    fill(allFilled ? 0 : 255);
    noStroke();
    posList.forEach(pos => {
        if (pos.showCircle) {
            pos.spring.target = allFilled ? 20 : 40; 
            pos.spring.step(deltaTime / 500);
            
            let size = pos.spring.position;
            fill((0 + size / 20 ) * pos.spring.position ,0,0);
            ellipse(pos.x + squareSize / 2, pos.y + squareSize / 2, size, size);

        }
    });

    if (filledCount === posList.length) {
        allFilled = true;
    } else {
        allFilled = false;
    }


}
window.mouseClicked = function () {

}
// add delay before signal is sent

window.mouseReleased = function () {
    if (allFilled) {
 // finish sketch
        setTimeout(() => {
            noLoop();
            sendSequenceNextSignal();
        }
        , 1500);
    }
}   



