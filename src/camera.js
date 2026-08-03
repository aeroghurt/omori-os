import { GameObject } from '/src/gameObject.js';
import { events } from '/src/events.js';


export class Camera extends GameObject {
    constructor() {
        super({});

        events.on("OMORI_POSITION", this, omoriPosition => {
            console.log("IT MOVED!!", omoriPosition);
            this.position = omoriPosition.duplicate()
        })
    }
}