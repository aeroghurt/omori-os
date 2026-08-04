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
import { LIGHTBULB } from '/src/objectAnimations.js';
import { GameObject } from '/src/gameObject.js';
import { Omori } from '/src/omori.js';
import { events } from '/src/events.js';
import { Camera } from '/src/camera.js'

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");

export const mainScene = new GameObject({
    position: new Vector2(0,0)
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
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 3, 32 * 4.5)
})
mainScene.addChild(mewo);

const omori = new Omori(GridCells(5), GridCells(3));
mainScene.addChild(omori);

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
    laptop.animations.play("laptop")
    mainScene.stepEntry(delta, mainScene);
    mainScene.input?.update();
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.save();
    mainScene.draw(ctx, 0, 0);
    ctx.restore();
}

const gameLoop = new GameLoop(update, draw);

gameLoop.start();