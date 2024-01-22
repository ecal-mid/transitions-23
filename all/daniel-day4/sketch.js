;;;

import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

let sceneSize;
const strokeW = 20
let objSize = sceneSize / 2

let stageSketch4 = 0;

let inSound;
let outSound;

let coolDownSound;

window.preload= function () {
	coolDownSound = createAudio("Audio/FinalSound.wav")
  }


window.setup = function () {
	createCanvas(windowWidth, windowHeight);
	centerX = width / 2
    centerY = height / 2
	sceneSize = min(width, height)
	objSize = sceneSize / 2;
	gridSquares();
	BlackSquare = [];
	inSound = loadSound('Audio/In.wav');
	outSound = loadSound('Audio/Out.wav');
}

window.windowResized = function () {
	resizeCanvas(windowWidth, windowHeight);
	centerX = width / 2
    centerY = height / 2
	Squares = [];
	gridSquares();
}

window.mouseDragged = function(){

}

window.mousePressed = function () {

}

window.keyPressed = function () {

}

let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

let Squares = [];
let BlackSquare = [];
let mouseDrag = false;

window.mousePressed = function () {
	mouseDrag = true;
}

window.mouseReleased = function () {
	if(BlackSquare.length != 16)
	{
		BlackSquare.forEach(e => {
			e.RemoveFromList()
		});
	}
	mouseDrag = false;
}


const SpringRect = new SpringNumber({
	position: 255, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.15 // time until amplitude is halved
})
const SpringGrid = new SpringNumber({
	position: 255, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.15 // time until amplitude is halved
})

window.draw = function () {
	background(255);
	SpringRect.step(deltaTime / 1000)
	SpringGrid.step(deltaTime / 1000)

	let sR = SpringRect.position;
	let sG = SpringGrid.position;

	switch (stageSketch4) {
		case 0:

			if(BlackSquare.length == 16)
			{
				setTimeout(() => {
					stageSketch4 = 1;
				}, 1000);
			}

			if(mouseDrag){
				Squares.forEach(e => {
					e.isInMe(mouseX,mouseY);
				});
			}
		
			background(255);
			sceneSize = min(width, height);
			objSize = (sceneSize / 2);
		
			Squares.forEach(e => {
				e.draw();
			});
			fill(0,0,0)
			basicGrid();
			break;
		case 1:

			SpringRect.target = 0;
			push();
			fill(sR,0,0)
            noStroke()
            rectMode(CENTER)
            rect(centerX, centerY, objSize, objSize)
			pop();

			SpringGrid.target = 0;

			if(finalSound == 0)
			{
				coolDownSound.play()
				finalSound = 1;
			}

			push();
			noStroke()
			fill(0,0,0,sG)
			basicGrid();
			pop();

			setTimeout(() => {
				noLoop();
				 sendSequenceNextSignal();
			  }, 1000);

			break;
	}
}

let finalSound = 0;

class Square{
	

	constructor(x, y, size){
		this.x = x;
		this.y = y;
		this.size = size;
		this.mouseIsIn = false;
		this.col = 0;
		this.Spring = new SpringNumber({
			position: 0, // start position
			frequency: 10, // oscillations per second (approximate)
			halfLife: 0.1 // time until amplitude is halved
		})
		this.id;

	}

	RemoveFromList(){
		setTimeout(() => {
			BlackSquare.shift(this.id);
			this.Spring.target = 255;
			//console.log(this.id)
			outSound.play()
			setTimeout(() => {
				this.mouseIsIn = false;
			}, 500);
		}, 100 * this.id);
	}

	isInMe(mouseX, mouseY) {
		if(mouseX >= this.x && mouseX <= this.x + this.size &&
			mouseY >= this.y && mouseY <= this.y + this.size){
				if(this.mouseIsIn == false)
				{
					this.id = BlackSquare.length;
					BlackSquare.push(this);
					this.Spring.target = 0;
					//console.log(this.id)
					//console.log(BlackSquare.length)
					inSound.play()
				}
				this.mouseIsIn = true;
		}
    }
	draw(){

		this.Spring.step(deltaTime / 10)
		this.col = this.Spring.position;

		if(!this.mouseIsIn){
			fill(255);
			stroke(255);
		}
		else
		{
			fill(255,this.col,this.col);
			stroke(255,this.col,this.col);
		}
		rect(this.x, this.y, this.size, this.size);
	}


}

function gridSquares(){
	push();

	noStroke()
	const gridCount = 4

	for (let x = 0; x < gridCount; x++) {
		for (let y = 0; y < gridCount; y++) {
			const xPos = map(x, 0, gridCount - 1, centerX - objSize / 4, centerX + objSize / 2, x) - objSize/4
			const yPos = map(y, 0, gridCount - 1, centerY - objSize / 4, centerY + objSize / 2, y) - objSize/4
			let rectangle = new Square(xPos, yPos, objSize / gridCount);
			Squares.push(rectangle);
		}
	}
	pop();
}

function basicGrid(){

	noStroke()
	const gridCount = 5
	const pointSize = strokeW

	for (let x = 0; x < gridCount; x++) {
		for (let y = 0; y < gridCount; y++) {
			const xPos = map(x, 0, gridCount - 1, centerX - objSize / 2, centerX + objSize / 2, x)
			const yPos = map(y, 0, gridCount - 1, centerY - objSize / 2, centerY + objSize / 2, y)
			circle(xPos, yPos, pointSize)
		}
	}
}

;;;