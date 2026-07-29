export const LEFT = "LEFT";
export const RIGHT = "RIGNT";
export const UP = "UP";
export const DOWN = "DOWN";

export class Input{
    constructor() {
        this.heldDirections = []
        document.addEventListener("keydown", (e) => {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                this.onArrowPressed(UP);
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                this.onArrowPressed(DOWN);
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.onArrowPressed(LEFT);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                this.onArrowPressed(RIGHT);
            }
        })
    }

    onArrowPressed(direction) {
        // makes sure that holding down more than one key at once will not add it to the queue if it's not new
        if (this.heldDirections.indexOf(direction) === -1) {
            this.heldDirections.unshift(direction);
        }
    }

    onArrowReleased(direction) {
        const index = this.heldDirections.indexOf(direction);
        if (index === -1) {
            return;
        }
        this.heldDirections.splice(index, 1);
    }
}