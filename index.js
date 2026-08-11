// disclaimer: some of the worst code you've ever seen
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
import { MEWO } from '/src/objectAnimations.js';
import { GameObject } from '/src/gameObject.js';
import { Omori } from '/src/omori.js';
import { events } from '/src/events.js';
import { Camera } from '/src/camera.js'
import { RevealingText } from '/src/revealingText.js';

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const computer = document.getElementById("laptop");
const sketchbook = document.getElementById("sketchpad");
const laptop_start = document.querySelector("#laptop-start");
const laptop_start_text = document.querySelector("#laptop-start>h1");
const cat = document.querySelector("#cat");

export const arrowHands = document.querySelectorAll(".backnforth");

export let newText = new RevealingText(laptop_start_text, "You booted up your laptop.");
export let staredText = new RevealingText(document.querySelector("#stared>h1"), "You stared at the screen.");
export let loggedOffText = new RevealingText(document.querySelector("#loggedOff>h1"), "The heat from the laptop warmed your lap. It felt nice.");
export let mewoText = new RevealingText(document.querySelector("#mewo>h1"), "Meow? (Waiting for something to happen?)");

let booted = false;
let state = null;

computer.style.visibility = 'hidden';
sketchbook.style.visibility = 'hidden';
cat.style.visibility = 'visible';

document.querySelectorAll(".textbox").forEach(element => {
    element.style.visibility = 'hidden';
})

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

export const mewo = new Sprite({
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
    laptop.animations.play("laptop")
    mainScene.stepEntry(delta, mainScene);
    mainScene.input?.update();
    // fires only when starting laptop text is true, z is pressed and not booted is true
    if (newText.isDone == true && !booted) {
        document.querySelector("#laptop-start>.backnforth").style.visibility = 'visible';
        onkeydown = (event) => {
            if (event.key == "z" && !booted) {
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
            if (event.key == "z" && booted) {;
                reset();
                document.querySelector("#computer").style.visibility = 'hidden';
                document.getElementById("stared").style.visibility = 'hidden';
                document.querySelector("#stared>.backnforth").style.visibility = 'hidden';
                document.querySelector("#laptop-start").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
                document.querySelector(".textbox3").style.visibility = 'hidden';
                computer.style.visibility = 'hidden';
                console.log("laptop exited, ", state)
            }
        }
    }
    // exits laptop but not before making a very long and unnecessary statement
    if (loggedOffText.isDone == true) {
        document.querySelector("#loggedOff>.backnforth").style.visibility = 'visible';
        onkeydown = (event) => {
            if (event.key == "z" && booted) {
                reset();
                document.getElementById("loggedOff").style.visibility = 'hidden';
                document.querySelector("#loggedOff>.backnforth").style.visibility = 'hidden';
                document.querySelector("#laptop-start").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[1].style.visibility = 'hidden';
                document.querySelector(".textbox3").style.visibility = 'hidden';
                computer.style.visibility = 'hidden';
                console.log("laptop exited, state: ", state)
            }
        }
    }
    // exits :meow:
    if (mewoText.isDone == true) {
        document.querySelector("#mewo>.backnforth").style.visibility = 'visible';
        onkeydown = (event) => {
            if (event.key == "z" && booted) {
                reset();
                document.querySelector("#cat").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[5].style.visibility = 'hidden';
                cat.style.visibility = 'hidden';
                console.log("laptop exited, state: ", state)
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

export function bootLaptop() {
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
            console.log(`computer visibility is: ${window.getComputedStyle(computer).visibility}`)
        }
    }
}


export function openSketchbook() {
    sketchbook.style.visibility = 'visible';
}

export function meow() {
    document.querySelector("#cat").style.visibility = 'visible';
    document.getElementsByClassName("textbox")[5].style.visibility = 'visible';
    if (!mewoText.isDone && !mewoText.oneInstance) {
            mewoText.init();
        }
        else if (mewoText.isDone) {
            cat.style.visibility = 'hidden';
            arrowHands.forEach(arrowHands => {
                arrowHands.style.visibility = 'hidden';
            })
        }
}

// makes the element draggable
dragElement(document.getElementById("computer"));
dragElement(document.getElementById("sketchbook"));
dragElement(document.getElementById("game-container"));

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

export function laptopSelection(selected) {
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
            console.log("Chose to look at journal");
            break
        // chose to log off
        case 2:
            console.log("booted")
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

export function reset() {
    newText.isDone = false;
    newText.oneInstance = false;
    staredText.isDone = false;
    staredText.oneInstance = false;
    loggedOffText.isDone = false;
    loggedOffText.oneInstance = false;
    booted = false;
    document.getElementsByClassName("container")[0].style.background = 'black';
    for (let i = document.getElementsByTagName("span").length - 1; i >= 0; i--) {
        document.getElementsByTagName("span")[i].remove();
    }
    state = "exiting";
    setTimeout(canInteractAgain, 10000);
}

let randomStat;
let stats = [`hunger`, `boredom`, `trust`];
let chosenStat;
let width;

setInterval(chooseRandomStat, 1000);

function chooseRandomStat() {
    randomStat = Math.floor(Math.random() * 3);
    decreaseStat(randomStat);
}

function decreaseStat(stat) {
    width = document.getElementsByClassName(`value`)[stat].offsetWidth
    console.log(width)
    document.getElementsByClassName(`value`)[stat].style.width = `${width - 5}px`;
}

(document.getElementsByTagName(`#chillin-spot>img`)[0]).addEventListener("click", () => {
    width = document.getElementsByClassName(`value`)[2].offsetWidth
    document.getElementsByClassName(`value`)[2].style.width = `${width +  5}px`
    console.log("pat :3")
})