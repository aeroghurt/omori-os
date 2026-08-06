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
import { RevealingText } from '/src/revealingText.js';
import { typewriter } from '/src/typewriter.js';

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const computer = document.getElementById("laptop");
const sketchbook = document.getElementById("sketchpad");
const laptop_start = document.querySelector("#laptop-start");
const laptop_start_text = document.querySelector("#laptop-start>h1");

computer.style.visibility = 'hidden';
sketchbook.style.visibility = 'hidden';

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

export const laptop = new Sprite({
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

export const notebook = new Sprite({
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

function updateTime() {
    let currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
    let time = document.querySelector(".time");
    time.innerHTML = currentTime
}

setInterval(updateTime, 1000);

export function bootLaptop() {
    laptop_start.style.visibility = 'visible';
    let newText = new RevealingText(laptop_start_text, "You booted up your laptop.");
    newText.init()
}

export function openSketchbook() {
    sketchbook.style.visibility = 'visible';
    console.log("sketchbook visible")
}

// Make the element draggable:
dragElement(document.getElementById("computer"));
dragElement(document.getElementById("sketchbook"));

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

