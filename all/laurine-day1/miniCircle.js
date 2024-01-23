import { SpringNumber } from "../../shared/spring.js";

export class MiniCircle {
    constructor(x, y, activeX, activeY, crossX, crossY) {
        this.activeX = activeX
        this.activeY = activeY
        this.crossX = crossX
        this.crossY = crossY
        this.springX = new SpringNumber({
            position: x,
            frequency: 2,
            halfLife: .2
        });
        this.springY = new SpringNumber({
            position: y,
            frequency: 2,
            halfLife: .2
        });
        this.isActive = false;
        this.isCrossActive = false;
        this.arrived = false;
        this.radius = 10;
        this.color = color(random(255), random(255), random(255));
    }
    update(deltaTimeSeconds) {

        this.springX.step(deltaTimeSeconds);
        this.springY.step(deltaTimeSeconds);
    }

    display() {

        if (this.isCrossActive) {

            setTimeout(() => {
                this.arrived = true;
            }, "3000");
        }
        noStroke()
        if (this.isCrossActive || !this.isActive)
            fill(0)
        else
            fill(this.color)

        ellipse(this.springX.position, this.springY.position, this.radius * 2, this.radius * 2);
    }

}
