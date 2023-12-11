import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js";
import { SpringNumber } from "../../shared/spring.js";


// let shapeId = 0;
// let currentRectSize = 0;
let mySound
let centerX;
let centerY;
let objSize;
let drawBigRectangle = false;
let shapes = [];
let shapesBottom = [];
const rectSize = 30;
let grid;
const strokeW = 30;
let lastShapeTime = 0;
const shapePlacementInterval = 0;
let isMousePressed = false;
let leftGrid,rightGrid;
let bottomLeftGrid,bottomRightGrid;
let crossRotationAngle = 0;
let crossEndSize = 1;
let crossEndSizeTarget = 1;
let shouldRotate=false; // flag to trigger only once //rotation of canvas 
const springRotation = new SpringNumber({
    position: 0, // start position
    frequency: 0.4, // oscillations per second (approximate)
    halfLife: 0.5 // time until amplitude is halved
    
}) 
const rectSpring = new SpringNumber({
    position: 0, // Start position
    frequency: 0.5, // Oscillations per second (approximate)
    halfLife: 0.15 // Time until amplitude is halved
});

window.preload = function () {
    soundFormats('mp3', 'ogg');
    mySound = loadSound('sound/spinotto.wav');
}


window.setup = function () {
    objSize = min(windowWidth, windowHeight) / 2;  // Ensure this is globally available
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    noStroke();
    centerX= width / 2,
    centerY= height / 2,
    objSize= min(windowWidth, windowHeight) / 2
 
    const gridSize = objSize / 2 - strokeW / 2;
    leftGrid = new Grid(centerX - objSize / 2, centerY - objSize / 2, gridSize, gridSize, 10, 10);
    rightGrid = new Grid(centerX+15, centerY - objSize / 2, gridSize, gridSize, 10, 10); // Adjusted position for right grid
    bottomLeftGrid = new Grid(centerX - objSize / 2, centerY - objSize / 2, gridSize, gridSize, 10, 10);
    bottomRightGrid = new Grid(centerX+15, centerY - objSize / 2, gridSize, gridSize, 10, 10); // Adjusted position for right grid

};

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
    centerX = windowWidth / 2;
    centerY = windowHeight / 2;
    objSize = min(windowWidth, windowHeight) / 2;
};

window.mousePressed = function () {
    if (shouldRotate) {
        placeShapeInBottomGrids();
    } else {
        placeShape();
    }
    crossEndSizeTarget = 0;
};

window.mouseReleased = function () {
    isMousePressed = false;
};

window.mouseDragged = function () {
    if (mouseIsPressed) {
        placeShape();
    }
    if (shouldRotate) {
        placeShapeInBottomGrids();
    }
};

function placeShape() {
    let currentTime = millis();
    if (currentTime - lastShapeTime > shapePlacementInterval) {
        let grid = mouseX < width / 2 ? leftGrid : rightGrid; // Determine which grid to use
        let slotSize = grid.getSlotSize();
        let column = grid.getGridColumnForXposition(mouseX);
        let row = grid.getNextFreeRow(column);
        if (row !== undefined) {
            let position = grid.getSlotPosition(column, row);
            let shape = new Shape(
                position.x, 
                position.y,
                slotSize.width,
                slotSize.height,
                column == grid.gridCountX - 1,
                row == grid.gridCountY - 1,
            );
            shapes.push(shape);
            grid.setSlot(column, row, shape);
            lastShapeTime = currentTime;
            mySound.play();
        }
    }
}
function placeShapeInBottomGrids() {
    let currentTime = millis();
    if (currentTime - lastShapeTime > shapePlacementInterval) {
        let grid = mouseX < width / 2 ? bottomLeftGrid : bottomRightGrid;
        let slotSize = grid.getSlotSize();
        let column = grid.getGridColumnForXposition(mouseX);
        let row = grid.getNextFreeRow(column);
        if (row !== undefined) {
            let position = grid.getSlotPosition(column, row);
            let shape = new Shape(
                position.x, 
                position.y,
                slotSize.width,
                slotSize.height,
                column == grid.gridCountX - 1,
                row == grid.gridCountY - 1,
            );
            shapesBottom.push(shape);
            grid.setSlot(column, row, shape);
            lastShapeTime = currentTime;
            mySound.play();
        }
    }
}


class Shape {
    constructor(x, y, width, height, xEnd, yEnd) {
        this.xEnd = xEnd
        this.yEnd = yEnd
        this.x = x;
        this.y = y - 400; // Start above the canvas
        this.width = width;
        this.height = height;
        this.targetY = y;
    }

    update() {
        this.y += 5;
        this.y = min(this.y, this.targetY);
    }

    draw() {
        fill(0);
        //noStroke();
        strokeWeight(1);
        const extensionX = this.xEnd ? 0 : 1;
        const extensionY = this.yEnd ? 0 : 1;
        
        rect(this.x, this.y, this.width+extensionX, this.height+extensionY);
    }
}

class Grid{
    constructor(x, y, width, height, gridCountX,gridCountY) {
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gridCountX = gridCountX;
        this.gridCountY = gridCountY;
        this.slots = Array.from({length: gridCountX*gridCountY}, () => undefined);

        
    }
    isFull() {
        return this.slots.every(slot => slot !== undefined && slot.y>=slot.targetY);
    }
    getGridColumnForXposition(x){
        const slotWidth = this.width/this.gridCountX;
        const column = floor((x-this.x)/slotWidth);
        if(column<0 || column>=this.gridCountX){
            return undefined;
        }

        return column;
    }

    getSlotSize(){
        const slotWidth = this.width/this.gridCountX ; // problem with size of slot
        const slotHeight = this.height/this.gridCountY;
        return {width:slotWidth,height:slotHeight};
    }

    getSlotPosition(x,y){
        const slotWidth = this.width/this.gridCountX;
        const slotHeight = this.height/this.gridCountY;
        const xPos = this.x + x*slotWidth;
        const yPos = this.y + y*slotHeight;
        return {x:xPos,y:yPos};
    }

    getNextFreeRow(column){

        for(let y = this.gridCountY-1; y >= 0; y--){
                const slot = this.getSlot(column,y);
                if(slot===undefined){
                    return y;
                }
        }
    }
    getSlot(x,y){
        return this.slots[x+y*this.gridCountX];

    }
    setSlot(x,y,value){
        this.slots[x+y*this.gridCountX] = value;
    }

    draw(){
        noStroke();
        const slotWidth = this.width/this.gridCountX;
        const slotHeight = this.height/this.gridCountY;
        for(let x = 0; x < this.gridCountX; x++){
            for(let y = 0; y < this.gridCountY; y++){
                const xPos = this.x + x*slotWidth;
                const yPos = this.y + y*slotHeight;
                const slot = this.getSlot(x,y);
                if(slot!==undefined){
                    fill(125,125,125);
                    const extensionX = x == this.gridCountX - 1 ? 0 : 1;
                    const extensionY = y == this.gridCountY - 1 ? 0 : 1;
                    
                     rect(xPos,yPos,slotWidth+extensionX,slotHeight+extensionY);
                   

                }
                
            }
        }
   
    }
    
}
function drawCross() {
    strokeWeight(strokeW); // Set the stroke weight for the cross
    stroke(0); // Set the stroke color (black)
    strokeCap(SQUARE); // Set the line caps to square (instead of round

    // Draw the horizontal line of the cross
    line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY);

    // Draw the vertical line of the cross
    line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2);

    noStroke()
    fill(0)
    ellipse(centerX, centerY- objSize / 2, strokeW,strokeW*crossEndSize);
    ellipse(centerX, centerY+ objSize / 2, strokeW,strokeW*crossEndSize); 
    ellipse(centerX- objSize / 2, centerY, strokeW*crossEndSize,strokeW);
    ellipse(centerX+ objSize / 2, centerY, strokeW*crossEndSize,strokeW);
}   
window.draw = function () {

    if (bottomLeftGrid.isFull() && bottomRightGrid.isFull()) {
        noLoop()
        setTimeout(() => {
            sendSequenceNextSignal(); // finish sketch
        }, 1500);
    }
    

    background(255);
    springRotation.step(deltaTime / 1000);

    crossEndSize = lerp(crossEndSize,crossEndSizeTarget,0.2)

    if (leftGrid.isFull() && rightGrid.isFull() && !shouldRotate) {
        springRotation.target = 180;
        shouldRotate = true;
    }
    if (bottomLeftGrid.isFull() && bottomRightGrid.isFull()) {
        drawBigRectangle = true;
        rectSpring.target = objSize; 
       // sendSequenceNextSignal(); // finish sketch
    }
    // if (drawBigRectangle) {
    //     fill(0);
    //     noStroke(); 
    //     rectMode(CENTER); 
    //     rect(centerX, centerY, objSize, objSize); 
    // }

 

    push(); // Start transformation context
    translate(centerX, centerY);
    rotate(springRotation.position);

    push()
    translate(-centerX, -centerY);

    leftGrid.draw();
    rightGrid.draw();
    shapes.forEach(shape => {
        shape.update();
        shape.draw();
    });

    drawCross(); // Draw the cross within the same transformation context
    pop()

    if (shouldRotate) {
        push();
        rotate(180)
       translate(-centerX, -centerY);
        bottomLeftGrid.draw();
        bottomRightGrid.draw();
        shapesBottom.forEach(shape => {
            shape.update();
            shape.draw();
        });
        pop();
    }
    pop(); // End transformation context

    // fill(255, 0, 0, 100)
    // rectMode(CENTER);
    // rect(centerX, centerY, objSize, objSize);
    // rectMode(CORNER)
};


//this works


