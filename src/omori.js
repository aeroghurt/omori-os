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
import { events } from '/src/events.js';
import { bootLaptop } from '/index.js';
import { laptop } from '/index.js';
import { openSketchbook } from '/index.js';
import { notebook } from '/index.js';
import { mewo } from '/index.js';
import { meow } from '/index.js';
import { RevealingText } from '/src/revealingText.js';
import { newText } from '/index.js';
import { laptopSelection } from '/index.js';
import { arrowHands } from '/index.js';
import { reset } from '/index.js';

let input = null;

let selectionMenu = false;
let selected = null;
let keyDirection = null;
let state;

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
            position: new Vector2(GridCells(5), GridCells(3)),
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
        input = mainScene.input;
        if (!selectionMenu) {
            this.tryMove(root);   
        }
        this.tryEmitPosition();
        if (input?.getActionJustPressed("KeyZ")) {
            this.omoriInteract();
            arrowHands.forEach(arrowHands => {
                arrowHands.style.visibility = 'hidden';
            })
        }
        if ((input?.getActionJustPressed("ArrowDown") && !selectionMenu) || (input?.getActionJustPressed("ArrowUp") && !selectionMenu)) {
            let parent = this.interactSketchbook() || this.interactLaptop() || this.interactMewo();
            this.select(parent);
        }
    }

    ready() {
    }

    tryEmitPosition() {
        if (this.lastX === this.position.x && this.lastY === this.position.y) {
            return;
        }
        this.lastX = this.position.x;
        this.lastY = this.position.y;
        events.emit("OMORI_POSITION", this.position)
    }

    omoriInteract() {
        this.interactLaptop();
        this.interactSketchbook();
        this.interactMewo();
        // why are you even reading this code?? there's nothing to learn from here.
    }

    select(parent) {
        if (newText.isDone && !selectionMenu && window.getComputedStyle(parent).visibility == 'visible') {
            console.log("Made selectionmenu true :DDD")
            selectionMenu = true
        }
        if (selectionMenu) {
            const children = [...parent.children];
            for (let i = 0; i < children.length; i++) {
                    document.getElementsByClassName("laptopOptions")[i].style.visibility = 'hidden';
            }
            selected = 0;
            document.getElementsByClassName("laptopOptions")[selected].style.visibility = 'visible';
            if (parent.classList == "textbox3") {
                document.getElementsByClassName("laptopOptions")[selected].style.visibility = 'visible';
                onkeydown = (event) => {
                    if (event.key == "ArrowDown") {
                        keyDirection = "down"
                        selected = this.selecting(children)
                        for (let i = 0; i < children.length; i++) {
                            document.getElementsByClassName("laptopOptions")[i].style.visibility = 'hidden';
                            document.getElementsByClassName("laptopOptions")[selected].style.visibility = 'visible';
                        }
                    }
                    if (event.key == "ArrowUp") {
                        keyDirection = "up"
                        selected = this.selecting(children)
                        for (let i = 0; i < children.length; i++) {
                            document.getElementsByClassName("laptopOptions")[i].style.visibility = 'hidden';
                            document.getElementsByClassName("laptopOptions")[selected].style.visibility = 'visible';
                        }
                    }
                    // selects one of the options
                    if (event.key == "z" && window.getComputedStyle(parent).visibility == 'visible') {
                        keyDirection = "none";
                        selected = this.selecting(children);
                        document.querySelector(".textbox3").style.visibility = 'hidden';
                        document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
                        arrowHands.forEach(arrowHands => {
                            arrowHands.style.visibility = 'hidden';
                        })
                        laptopSelection(selected);
                        selectionMenu = false;
                        console.log(`option selected`)
                    }
                }
            }
        } else {
            console.log(`did not meet one of the requirements, selectionmenu is: ${selectionMenu}`)
        }
    }

    selecting(children) {
        if (keyDirection == "down") {
            if (selected < (children.length - 1)) {
                selected += 1;
            } else {
                selected = 0;
            }
        }
        if (keyDirection == "up") {
            if (selected > 0) {
                selected -= 1;
            } else {
                selected = (children.length - 1);
            }
        }
        if (keyDirection == "none") {
            return selected;
        }
        return selected;
    }

    tryMove(root) {
        const gridSize = 32;
        let nextX = this.body.position.x;
        let nextY = this.body.position.y;
        let canMove = true;

        const {input} = mainScene;

        if (walls.has(`${nextX},${nextY}`)) {
            console.log("blocked")
        }

        if (!input.direction) {
                if (this.facingDirection === LEFT) {
                    this.body.animations.play("standLeft");
                }
                if (this.facingDirection === RIGHT) {
                    this.body.animations.play("standRight");
                }
                if (this.facingDirection === UP) {
                    this.body.animations.play("standUp");
                }
                if (this.facingDirection === DOWN) {
                    this.body.animations.play("standDown");
                }
            }
        if (canMove == true) {
            if (input.direction === DOWN) {
                this.body.position.y += 1;
                this.body.animations.play("walkDown");
                nextY += gridSize;
            }
            if (input.direction === LEFT) {
                this.body.position.x -= 1;
                this.body.animations.play("walkLeft");
                nextX -= gridSize;
            }
            if (input.direction === RIGHT) {
                this.body.position.x += 1;
                this.body.animations.play("walkRight");
                nextX += gridSize;
            }
            if (input.direction === UP) {
                this.body.position.y -= 1;
                this.body.animations.play("walkUp");
                nextY -= gridSize;
            }
        }
        this.facingDirection = input.direction ?? this.facingDirection;
    }
    
    interactLaptop() {
        let distFromLaptopX = Math.abs(this.body.position.x - laptop.position.x)
        let distFromLaptopY = Math.abs(this.body.position.y - laptop.position.y)
        if (distFromLaptopX <= 16 && distFromLaptopY <= 16 && distFromLaptopX >= 0 && distFromLaptopY >= 0) {
            bootLaptop();
            return document.querySelector(".textbox3");
            selectionMenu = true;
        }
    }

    interactSketchbook() {
        let distFromSketchbookX = Math.abs(this.body.position.x - notebook.position.x)
        let distFromSketchbookY = Math.abs(this.body.position.y - notebook.position.y)
        if (distFromSketchbookX <= 16 && distFromSketchbookY <= 16 && distFromSketchbookX >= 0 && distFromSketchbookY >= 0) {
            openSketchbook();
            return document.querySelector(".textbox2");
        }
    }

    interactMewo() {
        let distFromMewoX = Math.abs(this.body.position.x - mewo.position.x)
        let distFromMewoY = Math.abs(this.body.position.y - mewo.position.y)
        if (distFromMewoX <= 16 && distFromMewoY <= 16 && distFromMewoX >= 0 && distFromMewoY >= 0) {
            meow();
            return document.querySelector("#mewo");
        }
    }
}