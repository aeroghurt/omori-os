import { resources } from '/src/resource.js';
import { Sprite } from '/src/sprite.js';
import { Vector2 } from '/src/vector2.js';
import { GameLoop } from '/src/gameLoop.js';
import { Input } from '/src/input.js';
import { LEFT } from '/src/input.js';
import { RIGHT } from '/src/input.js';
import { UP } from '/src/input.js';
import { DOWN } from '/src/input.js';
import { GridCells } from '/src/grid.js';
import { isSpaceFree } from '/src/grid.js';
import { moveTowards } from '/src/moveTowards.js';
import { walls } from '/src/map.js';
import { FrameIndexPattern } from "/src/frameIndexPattern.js";
import { Animations } from '/src/animations.js';
import { WALK_DOWN } from '/src/omoriAnimations.js';
import { WALK_LEFT } from '/src/omoriAnimations.js';
import { WALK_RIGHT } from '/src/omoriAnimations.js';
import { WALK_UP } from '/src/omoriAnimations.js';
import { STAND_DOWN } from '/src/omoriAnimations.js';
import { STAND_LEFT } from '/src/omoriAnimations.js';
import { STAND_RIGHT } from '/src/omoriAnimations.js';
import { STAND_UP } from '/src/omoriAnimations.js';
import { LAPTOP } from '/src/objectAnimations.js';
import { GameObject } from '/src/gameObject.js';
import { mainScene } from '/index.js';

export class Omori extends GameObject {
    constructor(x,y) {
        super({
            position: new Vector2(x,y)
        });

        this.body = new Sprite({
            resource: resources.images.omori,
            frameSize: new Vector2(32, 32),
            hFrames: 3,
            vFrames: 4,
            frame: 1,
            position: new Vector2(0, 0),
            animations: new Animations({
                walkDown: new FrameIndexPattern(WALK_DOWN),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                walkUp: new FrameIndexPattern(WALK_UP),
                standDown: new FrameIndexPattern(STAND_DOWN),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                standRight: new FrameIndexPattern(STAND_RIGHT),
                standUp: new FrameIndexPattern(STAND_UP),
            })
        })
        this.addChild(this.body);

        this.facingDirection = DOWN;
        this.destinationPosition = this.position.duplicate();
    }

    step(root) {
        this.tryMove(root);
    }

    tryMove(root) {
        const {input} = mainScene;
        if (!input.direction) {
                if (this.facingDirection === LEFT) this.body.animations.play("standLeft");
                if (this.facingDirection === RIGHT) this.body.animations.play("standRight");
                if (this.facingDirection === UP) this.body.animations.play("standUp");
                if (this.facingDirection === DOWN) this.body.animations.play("standDown");
            }
        
            const distance = moveTowards(this.body, this.destinationPosition, 1);
            
            let nextX = this.destinationPosition.x;
            let nextY = this.destinationPosition.y;
            const gridSize = 32;
        
            if (input.direction === DOWN) {
                this.body.position.y += 1;
                this.body.animations.play("walkDown");
            }
            if (input.direction === LEFT) {
                this.body.position.x -= 1;
                this.body.animations.play("walkLeft");
            }
            if (input.direction === RIGHT) {
                this.body.position.x += 1;
                this.body.animations.play("walkRight");
            }
            if (input.direction === UP) {
                this.body.position.y -= 1;
                this.body.animations.play("walkUp");
            }
            this.facingDirection = input.direction ?? this.facingDirection;
            if (isSpaceFree(walls, nextX, nextY)) {
                this.destinationPosition.x = nextX;
                this.destinationPosition.y = nextY;
            }
    }
}