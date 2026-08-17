import { GameObject } from './src/gameObject.js';
import { events } from './src/events.js';
import { Vector2 } from './src/vector2.js';

export class Camera extends GameObject {
    constructor() {
        super({});

        events.on("OMORI_POSITION", this, omoriPosition => {
            const personHalf = 8;
            const canvasWidth = 320;
            const canvasHeight = 180;
            const halfWidth = -personHalf + canvasWidth / 2;
            const halfHeight  = -personHalf + canvasWidth / 2;
            console.log("IT MOVED!!", omoriPosition);
            this.position = new Vector2(
                -omoriPosition.x + halfWidth,
                -omoriPosition.y + halfHeight,
            )
        })
    }
}