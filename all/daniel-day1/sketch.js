import { SpringNumber } from "../../shared/spring.js"
import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

let maxRadius;
let r = 0;
let rotSave = 0;
let mousePress = false;

let coolDownSound;
let windSound;
let playS = false;


window.preload= function () {
    coolDownSound = createAudio("Audio/FinalSound.wav")
    windSound = createAudio("Audio/wind.mp3")
  }

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    frameRate(60);
    stage = 0;
}

window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
}

window.mousePressed = function () {
    windSound.play();
    windSound.loop();
    mousePress = true;
    if(timeKeeper > 0)
    {
        changerDeForme = true
    }
    else
    {
        setTimeout(() => {
            changerDeForme = true
        }, 1000);
    }
    temps = 1000;
}

window.mouseReleased = function () {
    temps = 15000;
    mousePress = false;
    changerDeForme = true
    stopTimer();
}

const c1 = new SpringNumber({
	position: 0, // start position
	frequency: 2, // oscillations per second (approximate)
	halfLife: 0.05 // time until amplitude is halved
})

const c2 = new SpringNumber({
	position: 0, // start position
	frequency: 2, // oscillations per second (approximate)
	halfLife: 0.05 // time until amplitude is halved
})

const c3 = new SpringNumber({
	position: 0, // start position
	frequency: 2, // oscillations per second (approximate)
	halfLife: 0.05 // time until amplitude is halved
})

const c4 = new SpringNumber({
	position: 0, // start position
	frequency: 2, // oscillations per second (approximate)
	halfLife: 0.05 // time until amplitude is halved
})

const colC = new SpringNumber({
	position: 255, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.1 // time until amplitude is halved
})

const soundVolume = new SpringNumber({
	position: 1, // start position
	frequency: 1, // oscillations per second (approximate)
	halfLife: 0.1 // time until amplitude is halved
})

var timer = 0;
var timeKeeper = 0;
var changerDeForme = false;
let stage = 0;
let rSave = 0;
let col = 0;

let temps = 1000

window.draw = function () {
    
    background(255);

    const sceneSize = min(width, height)

	c1.step(deltaTime / temps) // deltaTime is in milliseconds, we need it in seconds
    c2.step(deltaTime / temps)
    c3.step(deltaTime / temps)
    c4.step(deltaTime / temps)
    colC.step(deltaTime / 1000)
    soundVolume.step(deltaTime / 1000)
    const C1 = c1.position
    const C2 = c2.position
    const C3 = c3.position
    const C4 = c4.position
    const sV = soundVolume.position;

    const ColCircle  = colC.position

    const centerX = width / 2
    const centerY = height / 2
    const objSize = sceneSize / 2
    maxRadius = objSize / 2

    noStroke()
    rectMode(CENTER)
    translate(centerX, centerY);
    rotate(rSave += timeKeeper / 20);
    coolDownSound.volume(0.25)
    windSound.volume(1 * timeKeeper / 700)
    switch(stage)
    {
        case 0:
            console.log(windSound.volume())
            fill(col,0,0)
            noStroke()
            rect(0, 0, objSize, objSize,C1,C2,C3,C4);
            break;
        case 1:

            //timeKeeper--;
            if(playS == false)
            {
                coolDownSound.play();
               windSound.stop();
                playS = true;
            }
            setTimeout(() => {
                colC.target = 0
            }, 100);
            console.log("cercle")
            fill(ColCircle,0,0)
            noStroke()
            circle(0, 0, objSize)
            setTimeout(() => {
              noLoop();
               sendSequenceNextSignal();
            }, 1000);
            break;
    }

    if(mousePress)
    {
        timeKeeper++;
        if(timeKeeper >= 450)
        {
            stage = 1;
        }
        if(timeKeeper >= 100)
        {
            col+=1;
        }
    }
    else
    {
        timeKeeper--;
        col-=1;
        if(timeKeeper < 0)
        {
            timeKeeper = 0;
        }
    }

    console.log(timeKeeper)

    if(changerDeForme == true)
    {
        if(mousePress == true){
            timer += 1
            if(timer >= 10)
            {
                c1.target = random(10,100) * timeKeeper / 60
                c2.target = random(10,100) * timeKeeper / 60
                c3.target = random(10,100) * timeKeeper / 60
                c4.target = random(10,100) * timeKeeper / 60
                timer = 0;
            }
        }
        else
        {
            changerDeForme = false;
            c1.target = 0.1
            c2.target = 0.1
            c3.target = 0.1
            c4.target = 0.1
        }
    }
}

function stopTimer(){

}

;;;