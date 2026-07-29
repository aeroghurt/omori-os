import { resources } from '/src/resource.js';
import { Sprite } from '/src/sprite.js';
import { Vector2 } from '/src/vector2.js';
import { GameLoop } from '/src/gameLoop.js';

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");

const floor = new Sprite({
    resource: resources.images.floor,
    frameSize: new Vector2(320, 180)
})

const door = new Sprite({
    resource: resources.images.door,
    frameSize: new Vector2(320, 180)
})

const omori = new Sprite({
    resource: resources.images.omori,
    frameSize: new Vector2(32, 32),
    hFrames: 3,
    vFrames: 4,
    frame: 1
})

const omoriPos = new Vector2(32 * 1, 32 * 2);

const draw = () => {
    floor.drawImage(ctx, 0, 0);
    door.drawImage(ctx, 0, 0);
    const omoriOffset = new Vector2(-8, -21);
    const omoriPosX = omoriPos.x + omoriOffset.x;
    const omoriPosY = omoriPos.y + omoriOffset.y;
    omori.drawImage(ctx, omoriPos.x, omoriPos.y);
}

const gameLoop = new GameLoop(update, draw);

gameLoop.start();