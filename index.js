// disclaimer: some of the worst code you've ever seen

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const computer = document.getElementById("laptop");
const sketchbook = document.getElementById("sketchpad");
const laptop_start = document.querySelector("#laptop-start");
const laptop_start_text = document.querySelector("#laptop-start>h1");
const cat = document.querySelector("#cat");

const arrowHands = document.querySelectorAll(".backnforth");
let boredomInterval = setInterval(() => { return });

const LEFT = "LEFT";
const RIGHT = "RIGNT";
const UP = "UP";
const DOWN = "DOWN";

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    duplicate() {
        return new Vector2(this.x, this.y);
    }
}

class Animations {
    constructor(patterns) {
        this.patterns = patterns;
        this.activeKey = Object.keys(this.patterns)[0];
    }

    get frame() {
        return this.patterns[this.activeKey].frame;
    }

    play(key, startAtTime = 0) {
        if (this.activeKey === key) {
            return;
        }

        this.activeKey = key;
        this.patterns[this.activeKey].currentTime = startAtTime;
    }
    step(delta) {
        this.patterns[this.activeKey].step(delta);
    }
}

class GameObject {
    constructor({ position }) {
        this.position = position ?? new Vector2(0, 0);
        this.children = [];
    }

    stepEntry(delta, root) {
        // update all children first
        this.children.forEach((child) => child.stepEntry(delta, root));
        this.step(delta, root);
    }

    step(_delta) {
        // hallo :D
    }

    draw(ctx, x, y) {
        const drawPosX = x + this.position.x;
        const drawPosY = y + this.position.y;

        this.drawImage(ctx, drawPosX, drawPosY);
        this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
    }
    drawImage(ctx, drawPosX, drawPosY) {
        // hallo :DD
    }

    addChild(gameObject) {
        this.children.push(gameObject);
    }

    removeChild(gameObject) {
        this.children = this.children.filter(g => {
            return gameObject !== g;
        })
    }
}

class Camera extends GameObject {
    constructor() {
        super({});

        events.on("OMORI_POSITION", this, omoriPosition => {
            const personHalf = 8;
            const canvasWidth = 320;
            const canvasHeight = 180;
            const halfWidth = -personHalf + canvasWidth / 2;
            const halfHeight = -personHalf + canvasWidth / 2;
            console.log("IT MOVED!!", omoriPosition);
            this.position = new Vector2(
                -omoriPosition.x + halfWidth,
                -omoriPosition.y + halfHeight,
            )
        })
    }
}

class Events {
    callbacks = [];
    nextId = 0;

    emit(eventName, value) {
        this.callbacks.forEach(stored => {
            if (stored.eventName === eventName) {
                stored.callback(value)
            }
        })
    }

    on(eventName, caller, callback) {
        this.nextId += 1;
        this.callbacks.push({
            id: this.nextId,
            eventName,
            caller,
            callback
        });
        return this.nextId;
    }

    off(id) {
        this.callbacks = this.callbacks.filter((stored) => stored.id !== id);
    }

    unsubscribe(caller) {
        this.callbacks = this.callbacks.filter(
            (stored) => stored.caller !== caller,
        )
    }
}

const events = new Events();

class FrameIndexPattern {
    constructor(animationConfig) {
        this.currentTime = 0;
        this.animationConfig = animationConfig;
        this.duration = animationConfig.duration ?? 400;
    }

    get frame() {
        const { frames } = this.animationConfig;
        for (let i = frames.length - 1; i >= 0; i--) {
            if (this.currentTime >= frames[i].time) {
                return frames[i].frame;
            }
        }
        throw "Time is before the first keyframe.";
    }

    step(delta) {
        this.currentTime += delta;
        if (this.currentTime >= this.duration) {
            this.currentTime = 0;
        }
    }
}

class GameLoop {
    constructor(update, render) {
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000 / 60;
        this.update = update;
        this.render = render;
        this.rafId = null;
        this.isRunning = false;
    }

    mainLoop = (timestamp) => {
        if (!this.isRunning) return;
        let deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.accumulatedTime += deltaTime;
        while (this.accumulatedTime >= this.timeStep) {
            this.update(this.timeStep);
            this.accumulatedTime -= this.timeStep;
        }
        this.render();
        this.rafId = requestAnimationFrame(this.mainLoop);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.rafId = requestAnimationFrame(this.mainLoop);
        }
    }

    stop() {
        if (!this.rafId) {
            cancelAnimationFrame(this.mainLoop);
        }
        this.isRunning = false;
    }
}

const GridCells = n => {
    return n * 32;
}

//  const isSpaceFree = (walls, x, y) => {
//     const str = `${x},${y}`;
//     const isWallPresent = walls.has(str);
//     return !isWallPresent;
// }

// walls.add(`96,0`); // door
// for (let i = 0; i < 32; i++) {
//     walls.add(`${96 - i},${0}`)
//     walls.add(`${96},${0 - i}`)
// }
// walls.add(`128,64`); // laptop
// walls.add(`192,128`); // tissues

class Input {
    constructor() {

        this.heldDirections = [];
        this.keys = {};
        this.lastKeys = {};

        this.heldDirections = [];
        document.addEventListener("keydown", (e) => {
            this.keys[e.code] = true;
            if (e.code === "KeyW") {
                this.onArrowPressed(UP);
            }
            if (e.code === "KeyS") {
                this.onArrowPressed(DOWN);
            }
            if (e.code === "KeyA") {
                this.onArrowPressed(LEFT);
            }
            if (e.code === "KeyD") {
                this.onArrowPressed(RIGHT);
            }
        })

        document.addEventListener("keyup", (e) => {
            this.keys[e.code] = false;
            if (e.code === "KeyW") {
                this.onArrowReleased(UP);
            }
            if (e.code === "KeyS") {
                this.onArrowReleased(DOWN);
            }
            if (e.code === "KeyA") {
                this.onArrowReleased(LEFT);
            }
            if (e.code === "KeyD") {
                this.onArrowReleased(RIGHT);
            }
        })
    }

    get direction() {
        return this.heldDirections[0];
    }

    update() {
        this.lastKeys = { ...this.keys };
    }

    getActionJustPressed(keyCode) {
        let justPressed = false;
        if (this.keys[keyCode] && !this.lastKeys[keyCode]) {
            justPressed = true;
        }
        return justPressed;
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

function moveTowards(person, destinationPosition, speed) {
    let distanceX = destinationPosition.x - person.position.x;
    let distanceY = destinationPosition.y - person.position.y;
    let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    return distance;
}

const Laptop = (rootFrame = 0) => {
    return {
        duration: 600,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 300,
                    frame: rootFrame + 1
                }
            ]
    }
}

const LAPTOP = Laptop(0);

const Lightbulb = (rootFrame = 0) => {
    return {
        duration: 1600,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 400,
                    frame: rootFrame + 1
                },
                {
                    time: 800,
                    frame: rootFrame + 2
                },
                {
                    time: 1200,
                    frame: rootFrame + 1
                },
            ]
    }
}

const LIGHTBULB = Lightbulb(0);

const Mewo = (rootFrame = 0) => {
    return {
        duration: 800,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 400,
                    frame: rootFrame + 1
                }
            ]
    }
}

const MEWO = Mewo(0);

let input = null;

let selectionMenu = false;
let selected = null;
let keyDirection = null;
let state;

class Omori extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
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
            let parent = this.interactSketchbook() || this.interactLaptop();
            this.select(parent);
        }
    }

    ready() { }

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
        this.interactTissues();
        // why are you even reading this code?? there's nothing to learn from here.
    }

    select(parent) {
        if (newText.isDone || sketchbookText.isDone && !selectionMenu && window.getComputedStyle(parent).visibility == 'visible') {
            console.log("Made selectionmenu true :DDD")
            selectionMenu = true
        }
        if (selectionMenu) {
            const children = [...parent.children];
            for (let i = 0; i < children.length; i++) {
                document.getElementsByClassName("laptopOptions")[i].style.visibility = 'hidden';
            }
            selected = 0;
            if (newText.isDone) {
                document.getElementsByClassName("laptopOptions")[selected].style.visibility = 'visible';
            } else {
                document.getElementsByClassName("sketchbookOptions")[selected].style.visibility = 'visible';
            }

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
            if (parent.classList == "textbox2") {
                document.getElementsByClassName("sketchbookOptions")[selected].style.visibility = 'visible';
                onkeydown = (event) => {
                    if (event.key == "ArrowDown") {
                        keyDirection = "down"
                        selected = this.selecting(children)
                        for (let i = 0; i < children.length; i++) {
                            document.getElementsByClassName("sketchbookOptions")[i].style.visibility = 'hidden';
                            document.getElementsByClassName("sketchbookOptions")[selected].style.visibility = 'visible';
                        }
                    }
                    if (event.key == "ArrowUp") {
                        keyDirection = "up"
                        selected = this.selecting(children)
                        for (let i = 0; i < children.length; i++) {
                            document.getElementsByClassName("sketchbookOptions")[i].style.visibility = 'hidden';
                            document.getElementsByClassName("sketchbookOptions")[selected].style.visibility = 'visible';
                        }
                    }
                    // selects one of the options
                    if (event.key == "z" && window.getComputedStyle(parent).visibility == 'visible') {
                        keyDirection = "none";
                        selected = this.selecting(children);
                        document.querySelector(".textbox2").style.visibility = 'hidden';
                        document.getElementsByClassName("textbox")[4].style.visibility = 'hidden';
                        arrowHands.forEach(arrowHands => {
                            arrowHands.style.visibility = 'hidden';
                        })
                        sketchbookSelection(selected);
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

        const { input } = mainScene;

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
        if (distFromLaptopX <= 25 && distFromLaptopY <= 25 && distFromLaptopX >= 0 && distFromLaptopY >= 0) {
            bootLaptop();
            return document.querySelector(".textbox3");
        }
    }

    interactSketchbook() {
        let distFromSketchbookX = Math.abs(this.body.position.x - notebook.position.x)
        let distFromSketchbookY = Math.abs(this.body.position.y - notebook.position.y)
        if (distFromSketchbookX <= 32 && distFromSketchbookY <= 32 && distFromSketchbookX >= 0 && distFromSketchbookY >= 0) {
            openSketchbook();
            return document.querySelector(".textbox2");
        }
    }

    interactMewo() {
        let distFromMewoX = Math.abs(this.body.position.x - mewo.position.x)
        let distFromMewoY = Math.abs(this.body.position.y - mewo.position.y)
        if (distFromMewoX <= 32 && distFromMewoY <= 32 && distFromMewoX >= 0 && distFromMewoY >= 0) {
            meow();
            return document.querySelector("#mewo");
        }
    }

    interactTissues() {
        let distFromTissuesX = Math.abs(this.body.position.x - tissues.position.x)
        let distFromTissuesY = Math.abs(this.body.position.y - tissues.position.y)
        if (distFromTissuesX <= 32 && distFromTissuesY <= 32 && distFromTissuesX >= 0 && distFromTissuesY >= 0) {
            wipeYourSorrowsAway();
            return document.querySelector("#tissues");
        }
    }
}

const MakeWalkingFrames = (rootFrame = 0) => {
    return {
        duration: 800,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame + 1
                },
                {
                    time: 200,
                    frame: rootFrame
                },
                {
                    time: 400,
                    frame: rootFrame + 1
                },
                {
                    time: 600,
                    frame: rootFrame + 2
                }
            ]
    }
}

const MakeStandingFrames = (rootFrame = 0) => {
    return {
        duration: 400,
        frames: [
            {
                time: 0,
                frame: rootFrame
            }
        ]
    }
}

const WALK_DOWN = MakeWalkingFrames(0);
const WALK_LEFT = MakeWalkingFrames(3);
const WALK_RIGHT = MakeWalkingFrames(6);
const WALK_UP = MakeWalkingFrames(9);

const STAND_DOWN = MakeStandingFrames(1);
const STAND_LEFT = MakeStandingFrames(4);
const STAND_RIGHT = MakeStandingFrames(7);
const STAND_UP = MakeStandingFrames(10);

class Resources {
    constructor() {
        // plan to download
        this.toLoad = {
            floor: "assets/floor.png",
            door: "assets/door.png",
            laptop: "assets/laptop.png",
            lightbulb: "assets/lightbulb.png",
            notebook: "assets/notebook.png",
            tissues: "assets/tissues.png",
            omori: "assets/omori-spritesheet.png",
            shadow: "assets/shadow.png",
            mewo: "assets/mewo.png"
        };
        // keep all of the images
        this.images = {};
        // load each image
        Object.keys(this.toLoad).forEach(key => {
            const img = new Image();
            img.src = this.toLoad[key];
            this.images[key] = {
                image: img,
                isLoaded: false
            }
            img.onload = () => {
                this.images[key].isLoaded = true;
            }
        })
    }
}
// create one instance for the whole app to use
const resources = new Resources();

class Sprite extends GameObject {
    constructor({
        resource,
        frameSize,
        hFrames,
        vFrames,
        frame,
        scale,
        position,
        animations
    }) {
        super({});
        this.resource = resource;
        this.frameSize = frameSize ?? new Vector2(32, 32);
        this.hFrames = hFrames ?? 1;
        this.vFrames = vFrames ?? 1;
        this.frame = frame ?? 0;
        this.frameMap = new Map();
        this.scale = scale ?? 1;
        this.position = position ?? new Vector2(0, 0);
        this.animations = animations ?? null;
        this.buildFrameMap();
    }

    buildFrameMap() {
        let frameCount = 0;
        for (let v = 0; v < this.vFrames; v++) {
            for (let h = 0; h < this.hFrames; h++) {
                this.frameMap.set(
                    frameCount,
                    new Vector2(this.frameSize.x * h, this.frameSize.y * v)
                )
                frameCount++;
            }
        }
    }

    step(delta) {
        if (!this.animations) {
            return;
        }
        this.animations.step(delta);
        this.frame = this.animations.frame;
    }

    drawImage(ctx, x, y) {
        if (!this.resource.isLoaded) {
            return;
        }

        let frameCoordX = 0;
        let frameCoordY = 0;
        const frame = this.frameMap.get(this.frame);
        if (frame) {
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }

        const frameSizeX = this.frameSize.x;
        const frameSizeY = this.frameSize.y;

        ctx.drawImage(
            this.resource.image,
            frameCoordX,
            frameCoordY,
            frameSizeX,
            frameSizeY,
            x,
            y,
            frameSizeX * this.scale,
            frameSizeY * this.scale,
        );
    }
}

class RevealingText {
    constructor(element, text) {
        this.element = element;
        this.text = text;
        this.speed = 70;

        this.timeout = null;
        this.isDone = false;
        this.oneInstance = false;
    }

    revealOneChar(list) {
        const array = Array.from(list);
        const next = array.shift();
        next.span.classList.add("revealed");

        if (array.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealOneChar(array);
                this.oneInstance = true;
            }, next.delayAfter)
        } else {
            this.isDone = true;
        }
    }

    warpToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed")
        })
    }

    init() {
        let characters = [];
        this.text.split("").forEach(character => {
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);
            characters.push({
                span,
                delayAfter: character == " " ? 0 : this.speed
            })
        });

        this.revealOneChar(characters);
    }
}

let newText = new RevealingText(laptop_start_text, "You booted up your laptop.");
let staredText = new RevealingText(document.querySelector("#stared>h1"), "You stared at the screen.");
let sketchbookText = new RevealingText(document.querySelector("#sketchText>h1"), "Your sketchbook. Take a look inside?");
let loggedOffText = new RevealingText(document.querySelector("#loggedOff>h1"), "The heat from the laptop warmed your lap. It felt nice.");
let mewoText = new RevealingText(document.querySelector("#mewo>h1"), "Meow? (Waiting for something to happen?)");
let tissuesText = new RevealingText(document.querySelector("#tissues>h1"), "A tissue box for wiping your sorrows away.");

let booted = false;

computer.style.visibility = 'hidden';
sketchbook.style.visibility = 'hidden';
cat.style.visibility = 'hidden';
document.querySelector("#game-container").style.visibility = 'hidden';
document.querySelector("#journal").style.visibility = 'visible';

document.querySelectorAll(".textbox").forEach(element => {
    element.style.visibility = 'hidden';
})

const mainScene = new GameObject({
    position: new Vector2(0, 0)
})

const floor = new Sprite({
    resource: resources.images.floor,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 3, 32 * 2)
})
mainScene.addChild(floor);

const door = new Sprite({
    resource: resources.images.door,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 3, 0)
})
mainScene.addChild(door);

const laptop = new Sprite({
    resource: resources.images.laptop,
    frameSize: new Vector2(32, 32),
    hFrames: 2,
    vFrames: 1,
    frame: 1,
    position: new Vector2(32 * 4, 32 * 2),
    animations: new Animations({
        laptop: new FrameIndexPattern(LAPTOP)
    })
})
mainScene.addChild(laptop);

const shadow = new Sprite({
    resource: resources.images.shadow,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 5, 32 * 1)
})
mainScene.addChild(shadow);

const notebook = new Sprite({
    resource: resources.images.notebook,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 6, 32 * 2)
})
mainScene.addChild(notebook);

const tissues = new Sprite({
    resource: resources.images.tissues,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 6, 32 * 4)
})
mainScene.addChild(tissues);

const mewo = new Sprite({
    resource: resources.images.mewo,
    frameSize: new Vector2(32, 32),
    hFrames: 2,
    vFrames: 1,
    position: new Vector2(32 * 3, 32 * 4.5),
    animations: new Animations({
        mewoing: new FrameIndexPattern(MEWO)
    })
})
mainScene.addChild(mewo);

const omori = new Omori(0, 0);
mainScene.addChild(omori);
omori.ready()

const lightbulb = new Sprite({
    resource: resources.images.lightbulb,
    frameSize: new Vector2(32, 96),
    hFrames: 3,
    vFrames: 1,
    position: new Vector2(32 * 5, -32 * 2),
    animations: new Animations({
        lightbulb: new FrameIndexPattern(LIGHTBULB)
    })
})
mainScene.addChild(lightbulb);

mainScene.input = new Input();

const update = (delta) => {
    ctx.clearRect(0, 0, 320, 180);
    // console.log(state)
    laptop.animations.play("laptop")
    mainScene.stepEntry(delta, mainScene);
    mainScene.input?.update();
    // fires only when starting laptop text is true, z is pressed and not booted is true
    if (newText.isDone == true && !booted) {
        document.querySelector("#laptop-start>.backnforth").style.visibility = 'visible';
        onkeydown = (event) => {
            if (event.key === "z" && !booted) {
                computer.style.visibility = 'visible';
                laptop_start.style.visibility = 'hidden';
                document.querySelector("#computer").style.visibility = 'visible';
                document.querySelector(".textbox3").style.visibility = 'visible';
                document.querySelector("#laptop-start>.backnforth").style.visibility = 'hidden';
                booted = true
            }
        }
    }
    // exits laptop
    if (staredText.isDone == true) {
        document.querySelector("#stared>.backnforth").style.visibility = 'visible';
        onkeydown = (event) => {
            if (event.key === "z" && booted) {
                ;
                reset();
                document.querySelector("#computer").style.visibility = 'hidden';
                document.getElementById("stared").style.visibility = 'hidden';
                document.querySelector("#stared>.backnforth").style.visibility = 'hidden';
                document.querySelector("#laptop-start").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
                document.querySelector(".textbox3").style.visibility = 'hidden';
                computer.style.visibility = 'hidden';
            }
        }
    }
    // exits laptop but not before making a very long and unnecessary statement
    if (loggedOffText.isDone == true) {
        document.querySelector("#loggedOff>.backnforth").style.visibility = 'visible';
        onkeydown = (event) => {
            if (event.key === "z" && booted) {
                reset();
                document.getElementById("loggedOff").style.visibility = 'hidden';
                document.querySelector("#loggedOff>.backnforth").style.visibility = 'hidden';
                document.querySelector("#laptop-start").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
                document.querySelector(".textbox3").style.visibility = 'hidden';
                computer.style.visibility = 'hidden';
            }
        }
    }
    // exits :meow:
    if (mewoText.isDone == true) {
        document.querySelector("#mewo>.backnforth").style.visibility = 'visible';
        let idkWhyButThisWorks = false
        onkeydown = (event) => {
            if (event.key === "z" && state === "canInteractAgain" && idkWhyButThisWorks === false) {
                reset();
                idkWhyButThisWorks = true
                document.querySelector("#mewo").style.visibility = 'hidden';
                document.querySelector("#mewo>.backnforth").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[5].style.visibility = 'hidden';
                cat.style.visibility = 'hidden';
                if (state === "exiting") {
                    document.querySelector("#game-container").style.visibility = 'visible';
                }
            }
        }
    }

    if (tissuesText.isDone === true) {
        document.querySelector("#tissues>.backnforth").style.visibility = 'visible';
        let idkWhyButThisWorks = false
        onkeydown = (event) => {
            if (event.key === "z" && state === "canInteractAgain" && idkWhyButThisWorks === false) {
                reset();
                idkWhyButThisWorks = true
                document.querySelector("#tissues").style.visibility = 'hidden';
                document.querySelector("#tissues>.backnforth").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[6].style.visibility = 'hidden';
                document.querySelector("#box-of-tissues").style.visibility = 'hidden';
            }
        }
    }
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.save();
    mainScene.draw(ctx, 0, 0);
    ctx.restore();
}

const gameLoop = new GameLoop(update, draw);

gameLoop.start();
ready();

function updateTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let merediem;
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (hours > 11) {
        merediem = `PM`;
    } else {
        merediem = `AM`;
    }
    let currentTime = `${hours}:${minutes} ${merediem}`;
    let time = document.querySelector(".time");
    time.innerHTML = currentTime;
}

setInterval(updateTime, 1000);

function ready() {
    state = "canInteractAgain"
}

function canInteractAgain() {
    state = "canInteractAgain";
}

function bootLaptop() {
    if (state === "exiting") {
        return;
    }
    if (!booted && state === "canInteractAgain") {
        console.log("not booted")
        laptop_start.style.visibility = 'visible';
        document.querySelector("#laptop-start>.backnforth").style.visibility = 'hidden';
        // initialises starting laptop text if it's not yet shown and does not have another instance
        if (!newText.isDone && !newText.oneInstance) {
            newText.init();
            console.log("newtext initialised", newText.isDone, newText.oneInstance)
        }
    }
    if (booted) {
        if (state === "exiting") {
            return;
        }
        // i actually have no clue wtf this does
        // oh it just switches to the laptop screen oh ok ok
        if (newText.isDone && state === "canInteractAgain") {
            computer.style.visibility = 'visible';
            document.getElementsByClassName("textbox")[1].style.visibility = 'visible';
            laptop_start.style.visibility = 'hidden';
            arrowHands.forEach(arrowHands => {
                arrowHands.style.visibility = 'hidden';
            })
        }
    }
}

function laptopSelection(selected) {
    switch (selected) {
        // chose to stare at the screen
        case 0:
            document.getElementsByClassName("textbox")[2].style.visibility = 'visible';
            if (!staredText.isDone && !staredText.oneInstance) {
                state = "cannotInteract";
                document.querySelector("#stared").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
                setTimeout(() => {
                    document.querySelector("#stared").style.visibility = 'visible';
                    staredText.init();
                    state = "canInteractAgain"
                }, 3000)
            }
            else if (staredText.isDone) {
                computer.style.visibility = 'hidden';
                arrowHands.forEach(arrowHands => {
                    arrowHands.style.visibility = 'hidden';
                })
            }
            console.log("Chose to stare at screen");
            break
        // chose to look at the journal
        case 1:
            document.querySelector("#journal").style.visibility = 'visible';
            reset();
            document.getElementById("loggedOff").style.visibility = 'hidden';
            document.querySelector("#loggedOff>.backnforth").style.visibility = 'hidden';
            document.querySelector("#laptop-start").style.visibility = 'hidden';
            document.querySelector("#computer").style.visibility = 'hidden';
            document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
            document.querySelector(".textbox3").style.visibility = 'hidden';
            computer.style.visibility = 'hidden'
            console.log("Chose to look at journal");
            break
        // chose to log off
        case 2:
            document.getElementsByClassName("textbox")[3].style.visibility = 'visible';
            if (!loggedOffText.isDone && !loggedOffText.oneInstance) {
                loggedOffText.init();
                document.querySelector(".textbox3").style.visibility = 'hidden';
                document.querySelector("#computer").style.visibility = 'hidden';
                document.getElementsByClassName("container")[0].style.background = 'transparent';
                document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
            }
            else if (loggedOffText.isDone) {
                computer.style.visibility = 'hidden';
                arrowHands.forEach(arrowHands => {
                    arrowHands.style.visibility = 'hidden';
                })
            }
            console.log("Chose to log off");
            break
    }
}

function openSketchbook() {
    if (state === "exiting") {
        return;
    }
    if (!sketchbookText.isDone && !sketchbookText.oneInstance && state === "canInteractAgain") {
        document.querySelector("#sketchpad").style.visibility = 'visible';
        document.querySelector("#sketchbook").style.visibility = 'hidden';
        document.getElementsByClassName("textbox")[4].style.visibility = 'visible';
        sketchbookText.init();
    }
    else if (sketchbookText.isDone) {
        arrowHands.forEach(arrowHands => {
            arrowHands.style.visibility = 'hidden';
        })
    }
    sketchbook.style.visibility = 'visible';
}

function sketchbookSelection(selected) {
    switch (selected) {
        case 0:
            console.log("Chose look at sketchbook");
            document.querySelector("#sketchpad").style.visibility = 'hidden';
            document.querySelector("#sketchbook").style.visibility = 'hidden';
            document.getElementsByClassName("textbox")[4].style.visibility = 'hidden';
            document.getElementsByClassName("textbox2")[0].style.visibility = 'hidden';
            document.getElementById("sketchbook").style.visibility = 'visible';
            reset();
            break
        // chose to look at the journal
        case 1:
            console.log("Chose to not look at journal");
            document.querySelector("#sketchpad").style.visibility = 'hidden';
            document.querySelector("#sketchbook").style.visibility = 'hidden';
            document.getElementsByClassName("textbox")[4].style.visibility = 'hidden';
            document.getElementsByClassName("textbox2")[0].style.visibility = 'hidden';
            reset();
            break
    }
}

function meow() {
    if (state === "exiting") {
        return;
    }
    if (!mewoText.isDone && !mewoText.oneInstance && state === "canInteractAgain") {
        document.querySelector("#cat").style.visibility = 'visible';
        document.getElementsByClassName("textbox")[5].style.visibility = 'visible';
        mewoText.init();
    }
    else if (mewoText.isDone) {
        arrowHands.forEach(arrowHands => {
            arrowHands.style.visibility = 'hidden';
        })
    }
}

function wipeYourSorrowsAway() {
    if (state === "exiting") {
        return;
    }
    if (!tissuesText.isDone && !tissuesText.oneInstance && state == "canInteractAgain") {
        document.querySelector("#box-of-tissues").style.visibility = 'visible';
        document.getElementsByClassName("textbox")[6].style.visibility = 'visible';
        tissuesText.init();
    }
    else if (tissuesText.isDone) {
        arrowHands.forEach(arrowHands => {
            arrowHands.style.visibility = 'hidden';
        })
    }
}

function reset() {
    newText.isDone = false;
    newText.oneInstance = false;
    staredText.isDone = false;
    staredText.oneInstance = false;
    loggedOffText.isDone = false;
    loggedOffText.oneInstance = false;
    mewoText.isDone = false;
    mewoText.oneInstance = false;
    tissuesText.isDone = false;
    sketchText.oneInstance = false;
    sketchText.isDone = false;
    booted = false;
    document.getElementsByClassName("container")[0].style.background = 'black';
    for (let i = document.getElementsByTagName("span").length - 1; i >= 0; i--) {
        document.getElementsByTagName("span")[i].remove();
    }
    state = "exiting";
    setTimeout(canInteractAgain, 1000);
}

let randomStat;
let width;

setInterval(chooseRandomStat, 5000);

function chooseRandomStat() {
    randomStat = Math.floor(Math.random() * 3);
    decreaseStat(randomStat);
}

function decreaseStat(stat) {
    width = (document.getElementsByClassName(`value`)[stat].style.width).slice(0, -1)
    if (width >= 0) {
        document.getElementsByClassName(`value`)[stat].style.width = `${(width - 5)}%`;
    }
}

// pets mewo
document.querySelector("#chillin-spot>img").addEventListener("click", () => {
    width = (document.getElementsByClassName(`value`)[2].style.width).slice(0, -1);
    console.log(width)
    if (width < 100) {
        width = Number(width) + 5
        document.getElementsByClassName(`value`)[2].style.width = `${width}%`;
        let heart = document.createElement("img");
        heart.setAttribute("src", "assets/heart.png");
        document.getElementById("chillin-spot").appendChild(heart);
        random_position(heart)
        setTimeout(() => {
            document.getElementById("chillin-spot").removeChild(heart);
        }, 500)
    }
})

function random_position(element) {
    let spot_height = document.querySelector("#chillin-spot").offsetHeight;
    let spot_width = document.querySelector("#chillin-spot").offsetWidth;
    let posOrNeg = Math.random() < 0.5 ? -1 : 1;
    let random_pos_x = Math.random() * 25 * posOrNeg;
    let random_pos_y = Math.random() * -25;
    element.setAttribute("style", `position: relative; top: ${random_pos_y}%; left: ${random_pos_x}%`);
}

document.querySelectorAll(".close-button")[1].addEventListener("click", () => {
    document.querySelector("#game-container").style.visibility = 'hidden';
})

let food;

for (let i = 0; i < document.getElementsByClassName("food").length; i++) {
    document.getElementsByClassName("food")[i].addEventListener("click", () => {
        switch (i) {
            case 0:
                food = "kibble_nibble"
                break
            case 1:
                food = "salmon"
                break
            case 2:
                food = "tuna"
                break
        }
        eat(food)
    })
}

let toggle = false;
let toggleCount = 0;

document.getElementsByClassName("toy")[0].addEventListener("click", () => {
    if (toggleCount % 2 === 0) {
        toggle = true;
    } else {
        toggle = false
    }
    toggleCount += 1;
    playWithLaser();
})

function eat(food) {
    console.log("eating", food);
    let toBeFedFood = document.createElement("img");
    toBeFedFood.setAttribute('src', `assets/${food}.png`);
    toBeFedFood.setAttribute('style', `position: absolute; top: 60%;`);
    document.getElementById("chillin-spot").appendChild(toBeFedFood);
    width = (document.getElementsByClassName(`value`)[0].style.width).slice(0, -1);
    for (let i = 0; i < document.getElementsByClassName("food").length; i++) {
        document.getElementsByClassName("food")[i].disabled = true;
    }
    setTimeout(() => {
        document.getElementById("chillin-spot").removeChild(toBeFedFood);
        for (let i = 0; i < document.getElementsByClassName("food").length; i++) {
            document.getElementsByClassName("food")[i].disabled = false;
        }
    }, 2000);
    if (width < 80) {
        width = Number(width) + 20
    } else if (width < 100) {
        width = Number(width) + 5
    }
    document.getElementsByClassName(`value`)[0].style.width = `${width}%`;
}

function playWithLaser() {
    if (toggle === true) {
        document.body.setAttribute('style', 'cursor: url("assets/laser.png"), auto;');
        width = (document.getElementsByClassName(`value`)[1].style.width).slice(0, -1);
        boredomInterval = setInterval(() => {
            if (width < 90) {
                width = Number(width) + 10
            } else if (width < 100) {
                width = Number(width) + 5
            }
            document.getElementsByClassName(`value`)[1].style.width = `${width}%`
        }, 2000
        )
    } else {
        document.body.setAttribute('style', 'cursor: default;');
        clearInterval(boredomInterval);
    }
}

// makes the element draggable
dragElement(document.getElementById("computer"));
dragElement(document.getElementById("game-container"));
dragElement(document.getElementById("journal-container"));

function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    if (document.getElementById(element.id + "header")) {
        document.getElementById(element.id + "header").onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = dragElement;
    }

    function dragElement(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const sketchCanvas = document.getElementById("sketchCanvas");
const sketchctx = sketchCanvas.getContext("2d");
const clearCanvas = document.getElementById("clear-canvas");
const colorPicker = document.getElementById("color-picker");
const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");
const close = document.getElementById("close");

let isDrawing = false;

sketchCanvas.width = sketchCanvas.offsetWidth;
sketchCanvas.height = sketchCanvas.offsetHeight;

sketchctx.lineWidth = 5;
sketchctx.lineCap = 'round';
sketchctx.strokeStyle = colorPicker.value;

function startPos(e) {
    isDrawing = true;
    sketch(e);
}

function endPos(e) {
    isDrawing = false;
    sketchctx.beginPath();
}

function sketch(e) {
    if (!isDrawing) return;
    sketchctx.strokeStyle = colorPicker.value;
    const rect = sketchCanvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    sketchctx.imageSmoothingEnabled = false;
    sketchctx.lineTo(x, y);
    sketchctx.stroke();
    sketchctx.beginPath();
    sketchctx.moveTo(x, y);
}

sketchCanvas.addEventListener('mousedown', startPos);
sketchCanvas.addEventListener('mouseup', endPos);
sketchCanvas.addEventListener('mousemove', sketch);

clearCanvas.addEventListener('click', () => {
    sketchctx.clearRect(
        0, 0, sketchCanvas.width, sketchCanvas.height
    )
})

function activatePen() {
    sketchctx.globalCompositeOperation = 'source-over';
    sketchctx.strokeStyle = 'black';
}

function activateEraser() {
    sketchctx.globalCompositeOperation = 'destination-out';
}

pen.addEventListener('click', () => {
    activatePen();
})

eraser.addEventListener('click', () => {
    activateEraser();
})

close.addEventListener('click', () => {
    document.querySelector("#sketchbook").style.visibility = 'hidden';
})

let size;
let specifiedSize;

for (let i = 0; i < document.querySelectorAll(".size>img").length; i++) {
    document.querySelectorAll(".size>img")[i].addEventListener('click', (event) => {
        size = document.querySelectorAll(".size>img")[i].getAttribute("src");
        changeSize(size);
    })
}

function changeSize(size) {
    switch (size) {
        case "assets/size1.png":
            specifiedSize = 5;
            break;
        case "assets/size2.png":
            specifiedSize = 10;
            break;
        case "assets/size3.png":
            specifiedSize = 15;
            break;
        case "assets/size4.png":
            specifiedSize = 20;
            break;
    }
    sketchctx.lineWidth = specifiedSize;
}

document.querySelectorAll(".close-button")[0].addEventListener("click", () => {
    document.querySelector("#journal").style.visibility = 'hidden';
})

document.getElementsByClassName("tab")[0].onclick = () => {
    document.getElementsByClassName("tab")[0].setAttribute('style', 'z-index: 1;');
    document.getElementsByClassName("tab")[0].classList.add("tab-selected");
    document.getElementsByClassName("tab")[1].setAttribute('style', '');
    document.getElementsByClassName("tab")[1].classList.remove("tab-selected");
    document.getElementsByClassName("entry")[0].style.visibility = 'visible';
    document.getElementsByClassName("entry")[1].style.visibility = 'hidden';
    document.querySelector("#journal>.handle>.app-name>p").innerText = "AEROGHURT'S JOURNAL";
}

document.getElementsByClassName("tab")[1].onclick = () => {
    document.getElementsByClassName("tab")[1].setAttribute('style', 'z-index: 1;')
    document.getElementsByClassName("tab")[1].classList.add("tab-selected");
    document.getElementsByClassName("tab")[0].setAttribute('style', '')
    document.getElementsByClassName("tab")[0].classList.remove("tab-selected");
    document.getElementsByClassName("entry")[1].style.visibility = 'visible';
    document.getElementsByClassName("entry")[0].style.visibility = 'hidden';
    document.querySelector("#journal>.handle>.app-name>p").innerText = "YOUR JOURNAL";
}