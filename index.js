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
import { Omori } from '/src/omori.js';

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");

const mainScene = new GameObject({
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
    frameSize: new Vector2(320, 180),
    hFrames: 2,
    vFrames: 1,
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

const lightbulb = new Sprite({
    resource: resources.images.lightbulb,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 5, -32 * 2)
})
mainScene.addChild(lightbulb);

const omori = new Omori(GridCells(6), GridCells(5));
mainScene.addChild(omori);

const input = new Input();

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene);
}

const draw = () => {
    mainScene.draw(ctx, 0, 0);
}

const gameLoop = new GameLoop(update, draw);

gameLoop.start();