export class RevealingText {
    constructor(element, text) {
        this.element = element;
        this.text = text;
        this.speed = 70;

        this.timeout = null;
        this.isDone = false;
    }

    revealOneChar(list) {
        const array = Array.from(list)
        const next = array.shift();
        next.span.classList.add("revealed");

        if (array.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealOneChar(array)
            }, next.delayAfter)
        } else {
            this.isDone = true;
        }
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