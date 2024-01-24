;;;
import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

let clickSound;

let sceneSize;
const strokeW = 20
let objSize = sceneSize / 2

let mouseDrag = false
let stageSketch3 = 0;
let stageSketch32 = 0;
let tuto1;

let coolDownSound;
let centerX;
let centerY;

let isFinished = false;

const mobileAndTabletCheck = function () {
	let check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

window.preload= function () {
	coolDownSound = createAudio("Audio/FinalSound.wav")
  }

const springLine = new SpringNumber({
	position: 0, // start position
	frequency: 4, // oscillations per second (approximate)
	halfLife: 0.2 // time until amplitude is halved
})

const springLineY = new SpringNumber({
	position: 0, // start position
	frequency: 4, // oscillations per second (approximate)
	halfLife: 0.2 // time until amplitude is halved
})

window.setup = function () {
	clickSound = loadSound('Audio/click.wav');
	createCanvas(windowWidth, windowHeight);
	centerX = width / 2
    centerY = height / 2
	sceneSize = min(width, height)
	objSize = sceneSize / 2;
	springLine.position = 0
	springLineY.position = 0

	tuto1Bool = !mobileAndTabletCheck()

	tuto1 = loadImage("Images/Touches.png")
}

window.windowResized = function () {
	resizeCanvas(windowWidth, windowHeight);
	centerX = width / 2
    centerY = height / 2
}

window.mouseDragged = function(){

}

window.mouseReleased = function(){
	mouseDrag = false;

	if(!isFinished && mobileAndTabletCheck()){
		allstageSketch3 = 1;
	}

}

window.mousePressed = function () {

	/*if(allstageSketch3 == 1)
	{
		clickSound.play();
		linesScalesX.target = objSize;
		linesScalesY.target = objSize;
		gridCol.target = 0;
		setTimeout(() => {
			noLoop();
			 sendSequenceNextSignal();
		  }, 2000);
	}*/
}

window.keyPressed = function () {

	tuto1Bool = false;
	if(canClick && allstageSketch3!=1)
	{
		if (keyCode === LEFT_ARROW) {
			if(stageSketch3 <= 0)
			{
				return;
			}
			clickSound.play();
			stageSketch3--;
			back = true;
			//canClick = false;
			timeout();
		}
		else if(keyCode === RIGHT_ARROW){
			if(stageSketch3 >= 2)
			{
				return;
			}
			clickSound.play();
			stageSketch3++;
			back = false;
			//canClick = false;
			timeout();
		}

		if(keyCode === DOWN_ARROW)
		{
			if(stageSketch32 <= 0)
			{
				return;
			}
			clickSound.play();
			stageSketch32--;
			back = true;
			//canClick = false;
			timeout();
		}
		else if(keyCode === UP_ARROW){
			if(stageSketch32 >= 2)
			{
				return;
			}
			clickSound.play();
			stageSketch32++;
			back = false;
			//canClick = false;
			timeout();
		}
	}
  }

  //Timeout entre chazque click 
  let canClick = true;
  function timeout(){
	setTimeout(() => {
		canClick = true;
	  }, 500);
  }
  //---

let back = false;
let allstageSketch3 = 0;

let tuto1Bool = false;
  
window.draw = function () {

	centerX = width / 2;
	centerY = height / 2;
	sceneSize = min(width, height)
	objSize = (sceneSize / 2);
	background(255);


	if(tuto1Bool)
	{
		push()
		translate(windowWidth/2 - 92,windowHeight - 150)
		scale(0.5)
		image(tuto1, 0,0);
		pop()
	}

	springLine.step(deltaTime / 1000)
	springLineY.step(deltaTime / 1000)

	let x = springLine.position
	let y = springLineY.position

	switch(allstageSketch3){
		case 0:
			switch(stageSketch3){
				case 0:
					springLine.target = 0
					line(centerX + x, centerY - objSize / 2, centerX + x, centerY + objSize / 2)
					line(centerX - x, centerY - objSize / 2, centerX - x, centerY + objSize / 2)
					break;
				case 1:
					springLine.target = objSize/4
					if(back){
		
						//Region Static
						line(centerX + objSize/4, centerY - objSize / 2, centerX + objSize/4, centerY + objSize / 2)
						line(centerX - objSize/4, centerY - objSize / 2, centerX - objSize/4, centerY + objSize / 2)
						//---
		
						//Animated
						line(centerX + x, centerY - objSize / 2, centerX + x, centerY + objSize / 2)
						line(centerX - x, centerY - objSize / 2, centerX - x, centerY + objSize / 2)
						//---
					}
					else
					{
						//Animated
						line(centerX + x, centerY - objSize / 2, centerX + x, centerY + objSize / 2)
						line(centerX - x, centerY - objSize / 2, centerX - x, centerY + objSize / 2)
						//---
					}
					break;
				case 2:
					springLine.target = objSize/2
					if(back)
					{
						//Region Static
						line(centerX + objSize/4, centerY - objSize / 2, centerX + objSize/4, centerY + objSize / 2)
						line(centerX - objSize/4, centerY - objSize / 2, centerX - objSize/4, centerY + objSize / 2)
						//---
		
						//Animated
						line(centerX + x, centerY - objSize / 2, centerX + x, centerY + objSize / 2)
						line(centerX - x, centerY - objSize / 2, centerX - x, centerY + objSize / 2)
						//---
					}
					else
					{
						line(centerX + objSize / 4, centerY - objSize / 2, centerX +  objSize / 4, centerY + objSize / 2)
						line(centerX -  objSize / 4, centerY - objSize / 2, centerX -  objSize / 4, centerY + objSize / 2)
		
						line(centerX + x, centerY - objSize / 2, centerX + x, centerY + objSize / 2)
						line(centerX - x, centerY - objSize / 2, centerX - x, centerY + objSize / 2)
					}
					break;
			}
		
			switch(stageSketch32){
				case 0:
					springLineY.target = 0
					if(back){
		
						line(centerX - objSize / 2, centerY - y, centerX + objSize / 2, centerY - y)
						line(centerX - objSize / 2, centerY + y, centerX + objSize / 2, centerY + y)
					}
					else
					{
						line(centerX + y, centerY - objSize / 2, centerX + y, centerY + objSize / 2)
						line(centerX - y, centerY - objSize / 2, centerX - y, centerY + objSize / 2)
					}
					break;
				case 1:
					springLineY.target = objSize/4
					if(back)
					{
						line(centerX - objSize / 2, centerY - objSize/4, centerX + objSize / 2, centerY - objSize/4)
						line(centerX - objSize / 2, centerY + objSize/4, centerX + objSize / 2, centerY + objSize/4)
						//Animated
						line(centerX - objSize / 2, centerY - y, centerX + objSize / 2, centerY - y)
						line(centerX - objSize / 2, centerY + y, centerX + objSize / 2, centerY + y)
						//---
					}
					else
					{
						//Animated
						line(centerX - objSize / 2, centerY - y, centerX + objSize / 2, centerY - y)
						line(centerX - objSize / 2, centerY + y, centerX + objSize / 2, centerY + y)
						//---
					}
					break;
				case 2:
					//lineFullX();
					springLineY.target = objSize/2
					//#region lines
					if(back)
					{
						line(centerX - objSize / 2, centerY - objSize/4, centerX + objSize / 2, centerY - objSize/4)
						line(centerX - objSize / 2, centerY + objSize/4, centerX + objSize / 2, centerY + objSize/4)
						//Animated
						line(centerX - objSize / 2, centerY - y, centerX + objSize / 2, centerY - y)
						line(centerX - objSize / 2, centerY + y, centerX + objSize / 2, centerY + y)
					}
					else{
						//Static
						line(centerX - objSize / 2, centerY - objSize/4, centerX + objSize / 2, centerY - objSize/4)
						line(centerX - objSize / 2, centerY + objSize/4, centerX + objSize / 2, centerY + objSize/4)
						//---
						//Animated
						line(centerX - objSize / 2, centerY - y, centerX + objSize / 2, centerY - y)
						line(centerX - objSize / 2, centerY + y, centerX + objSize / 2, centerY + y)
						//---
					}
					//#endregion
					break;
			}
			cross(centerX,centerY);
			if(stageSketch3 == 2 && stageSketch32 == 2)
			{
				setTimeout(() => {
					allstageSketch3 =1;
				}, 500);
			}
			break;
	case 1:
		fullLinesXY();
		if(!clickSound.isPlaying() && soundIndex < 1)
		{
			coolDownSound.play();
			soundIndex++;
		}
		linesScalesX.target = objSize;
		linesScalesY.target = objSize;
		gridCol.target = 0;

		if(!isFinished)
		{
			isFinished = true;
			setTimeout(() => {
				noLoop();
				sendSequenceNextSignal();
			}, 2000);
		}
		break;
	//grid(centerX,centerY)
	}	
}

let soundIndex = 0;

const linesScalesX = new SpringNumber({
	position: 0, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.1 // time until amplitude is halved
})

const linesScalesY = new SpringNumber({
	position: 0, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.1 // time until amplitude is halved
})

const gridCol = new SpringNumber({
	position: 255, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.1 // time until amplitude is halved
})


function fullLinesXY(){

	linesScalesY.step(deltaTime / 1000)
	linesScalesX.step(deltaTime / 1000)
	gridCol.step(deltaTime / 2500)

	let x = linesScalesX.position
	let y = linesScalesY.position
	let r = gridCol.position
	/*
	//Vertical
	line(centerX - objSize/2, centerY - objSize / 2, centerX - objSize/2, centerY + objSize / 2)
	line(centerX - objSize/4, centerY - objSize / 2, centerX - objSize/4, centerY + objSize / 2)
	line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
	line(centerX + objSize/4, centerY - objSize / 2, centerX + objSize/4, centerY + objSize / 2)
	line(centerX + objSize/2, centerY - objSize / 2, centerX + objSize/2, centerY + objSize / 2)

	//Horiontal
	line(centerX - objSize / 2, centerY - objSize / 2, centerX + objSize / 2, centerY - objSize / 2)
	line(centerX - objSize / 2, centerY - objSize / 4, centerX + objSize / 2, centerY - objSize / 4)
	line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
	line(centerX - objSize / 2, centerY + objSize / 4, centerX + objSize / 2, centerY + objSize / 4)
	line(centerX - objSize / 2, centerY + objSize / 2, centerX + objSize / 2, centerY + objSize / 2)
	*/

	fill(r,0,0)

	grid(centerX,centerY);

	fill(0,0,0)

	rectMode(CENTER)

	noStroke()

	for(let v = 0; v < 5; v++)
	{
		rect(centerX - objSize / 2 + (objSize / 4) * v,centerY,20,(objSize + 20) - x,10)
	}

	for(let h = 0; h < 5; h++)
	{
		rect(centerX,centerY - objSize / 2 + (objSize / 4) * h,(objSize + 20) - x, 20,10)
	}

	/*
	//Vertical
	line(centerX - objSize/2, centerY - objSize / 2, centerX - objSize/2, centerY + objSize / 2)
	line(centerX - objSize/4, centerY - objSize / 2, centerX - objSize/4, centerY + objSize / 2)
	line(centerX, centerY - objSize / 2, centerX, centerY + objSize / 2)
	line(centerX + objSize/4, centerY - objSize / 2, centerX + objSize/4, centerY + objSize / 2)
	line(centerX + objSize/2, centerY - objSize / 2, centerX + objSize/2, centerY + objSize / 2)

	//Horiontal
	line(centerX - objSize / 2, centerY - objSize / 2, centerX + objSize / 2, centerY - objSize / 2)
	line(centerX - objSize / 2, centerY - objSize / 4, centerX + objSize / 2, centerY - objSize / 4)
	line(centerX - objSize / 2, centerY, centerX + objSize / 2, centerY)
	line(centerX - objSize / 2, centerY + objSize / 4, centerX + objSize / 2, centerY + objSize / 4)
	line(centerX - objSize / 2, centerY + objSize / 2, centerX + objSize / 2, centerY + objSize / 2)
*/

}

function lineFullX(){
	cross(centerX,centerY)

	line(centerX + objSize/4, centerY - objSize / 2, centerX + objSize/4, centerY + objSize / 2)
	line(centerX - objSize/4, centerY - objSize / 2, centerX - objSize/4, centerY + objSize / 2)

	line(centerX + objSize/2, centerY - objSize / 2, centerX + objSize/2, centerY + objSize / 2)
	line(centerX - objSize/2, centerY - objSize / 2, centerX - objSize/2, centerY + objSize / 2)
}

function grid(cX,cY){
	//push();
	//fill(0,0,0)
	noStroke()

	const gridCount = 5
	const pointSize = strokeW

	for (let x = 0; x < gridCount; x++) {
		for (let y = 0; y < gridCount; y++) {
			const xPos = map(x, 0, gridCount - 1, cX - objSize / 2, cX + objSize / 2, x)
			const yPos = map(y, 0, gridCount - 1, cY - objSize / 2, cY + objSize / 2, y)
			circle(xPos, yPos, pointSize)
		}
	}
	//pop()
}

function cross(cX,cY){
	fill(0)
	noStroke()
	rectMode(CENTER)
	strokeWeight(strokeW)
	stroke(0)
	line(cX - objSize / 2, cY, cX + objSize / 2, cY)
	line(cX, cY - objSize / 2, cX, cY + objSize / 2)
}

;;;