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
let boredomInterval = setInterval(() => {return});

export let newText = new RevealingText(laptop_start_text, "You booted up your laptop.");
export let staredText = new RevealingText(document.querySelector("#stared>h1"), "You stared at the screen.");
export let sketchbookText = new RevealingText(document.querySelector("#sketchText>h1"), "Your sketchbook. Take a look inside?");
export let loggedOffText = new RevealingText(document.querySelector("#loggedOff>h1"), "The heat from the laptop warmed your lap. It felt nice.");
export let mewoText = new RevealingText(document.querySelector("#mewo>h1"), "Meow? (Waiting for something to happen?)");
export let tissuesText = new RevealingText(document.querySelector("#tissues>h1"), "A tissue box for wiping your sorrows away.");

let booted = false;
let state = null;

computer.style.visibility = 'hidden';
// sketchbook.style.visibility = 'hidden';
cat.style.visibility = 'hidden';
document.querySelector("#game-container").style.visibility = 'hidden';

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

export const tissues = new Sprite({
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

export const lightbulb = new Sprite({
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
    if (sketchbookText.isDone === true) {
        console.log(sketchbookText.isDone)
        document.querySelector("#tissues>.backnforth").style.visibility = 'visible';
        let idkWhyButThisWorks = false
        onkeydown = (event) => {
            if (event.key == "z" && state === "canInteractAgain" && idkWhyButThisWorks === false) {
                reset();
                idkWhyButThisWorks = true
                sketchbook.style.visibility = 'hidden';
                document.querySelector("#sketchText>.backnforth").style.visibility = 'hidden';
                document.getElementsByClassName("textbox")[4].style.visibility = 'hidden';
            }
        }
    }
    // exits :meow:
    if (mewoText.isDone == true) {
        document.querySelector("#mewo>.backnforth").style.visibility = 'visible';
        let idkWhyButThisWorks = false
        onkeydown = (event) => {
            if (event.key == "z" && state === "canInteractAgain" && idkWhyButThisWorks === false) {
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
        console.log(tissuesText.isDone)
        document.querySelector("#tissues>.backnforth").style.visibility = 'visible';
        let idkWhyButThisWorks = false
        onkeydown = (event) => {
            if (event.key == "z" && state === "canInteractAgain" && idkWhyButThisWorks === false) {
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
        }
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

export function openSketchbook() {
    if (state === "exiting") {
        return;
    }
    if (!sketchbookText.isDone && !sketchbookText.oneInstance && state === "canInteractAgain") {
        document.querySelector("#sketchpad").style.visibility = 'visible';
        document.querySelector("#sketchbook").style.visibility = 'visible';
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

export function meow() {
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

export function wipeYourSorrowsAway() {
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

export function reset() {
    newText.isDone = false;
    newText.oneInstance = false;
    staredText.isDone = false;
    staredText.oneInstance = false;
    loggedOffText.isDone = false;
    loggedOffText.oneInstance = false;
    mewoText.isDone = false;
    mewoText.oneInstance = false;
    tissuesText.isDone = false;
    tissuesText.oneInstance = false;
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

document.querySelector(".close-button").addEventListener("click", () => {
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
    console.log(toggle)
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