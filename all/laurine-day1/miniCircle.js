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
            halfLife: .5
        });
        this.springY = new SpringNumber({
            position: y,
            frequency: 2,
            halfLife: .5
        });
        this.isActive = false;
        this.isCrossActive = false;
        this.arrived = false;
        this.radius = 10;
        this.color = color(random(255), random(255), random(255));
        this.activeColor = color(0);
    }
    update(deltaTimeSeconds) {

        this.springX.step(deltaTimeSeconds);
        this.springY.step(deltaTimeSeconds);
    }

    display() {
        noStroke()
        if (this.isActive)
            fill(this.color)
        else
            fill(0)
        ellipse(this.springX.position, this.springY.position, this.radius * 2, this.radius * 2);

        if (this.isCrossActive) {

            fill(this.activeColor);
            setTimeout(() => {
                this.arrived = true;
            }, "3000");
        }

        else
            fill(this.color)
        ellipse(this.springX.position, this.springY.position, this.radius * 2, this.radius * 2);
    }

}
