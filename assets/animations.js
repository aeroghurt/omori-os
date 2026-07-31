import { FrameIndexPattern } from "/src/frameIndexPattern";

export class Animations {
    constructor(patterns) {
        this.patterns = patterns;
        this.activeKey = Object.keys(this.patterns)[0];
    }

    step(delta) {
        this.patterns[this.activeKey].step(delta);
    }
}