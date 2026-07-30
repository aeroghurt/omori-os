import { resources } from '/src/resource.js';
import { Sprite } from '/src/sprite.js';
import { Vector2 } from '/src/vector2.js';
import { GameLoop } from '/src/gameLoop.js';
import { Input } from '/src/input.js';
import { LEFT } from '/src/input.js';
import { RIGHT } from '/src/input.js';
import { UP } from '/src/input.js';
import { DOWN } from '/src/input.js';
import { GridCells } from './src/grid.js';

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");

const floor = new Sprite({
    resource: resources.images.floor,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 3, 32 * 2)
})

const door = new Sprite({
    resource: resources.images.door,
    frameSize: new Vector2(320, 180),
    position: new Vector2(32 * 3, 0)
})

const omori = new Sprite({
    resource: resources.images.omori,
    frameSize: new Vector2(32, 32),
    hFrames: 3,
    vFrames: 4,
    frame: 1,
    position: new Vector2(GridCells(1), GridCells(2))
})

const input = new Input();

const update = () => {
    if (input.direction === DOWN) {
        omori.position.y += 1;
        omori.frame = 0
    }
    if (input.direction === LEFT) {
        omori.position.x -= 1;
        omori.frame = 3;
    }
    if (input.direction === RIGHT) {
        omori.position.x += 1;
        omori.frame = 6;
    }
    if (input.direction === UP) {
        omori.position.y -= 1;
        omori.frame = 9;
    }
    
}

const draw = () => {
    ctx.clearRect(0, 0, 320, 180);
    floor.drawImage(ctx, floor.position.x, floor.position.y);
    door.drawImage(ctx, door.position.x, door.position.y);
    const omoriOffset = new Vector2(-8, -21);
    const omoriPosX = omori.position.x + omoriOffset.x;
    const omoriPosY = omori.position.y + omoriOffset.y;
    omori.drawImage(ctx, omori.position.x, omori.position.y);
}

const gameLoop = new GameLoop(update, draw);

gameLoop.start();