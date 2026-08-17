export class RevealingText {
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