import { sendSequenceNextSignal } from "../../shared/sequenceRunner.js"

let finished = false

window.setup = function () {
	createCanvas(windowWidth, windowHeight)
}
window.mousePressed = function () {
	finished = true;
}

window.draw = function () {

	background(255, 0, 0);
	if (finished) {
		sendSequenceNextSignal(); // finish sketch
		noLoop();
	}

}
