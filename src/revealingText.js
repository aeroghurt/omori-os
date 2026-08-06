export class RevealingText {
    constructor(element, text) {
        this.element = element
        this.text = text;
        this.speed = 70;

        this.timeout = null;
        this.isDone = false;
    }

    revealOneChar(list) {
        console.log(list)
        const next = Array.from(list).splice(0,1)[0];
        next.span.classList.add("revealed");

        if (list.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealOneChar(next)
            }, next.delayAfter)
        } else {
            this.isDone = true;
        }
    }

    init() {
        let characters = [];
        console.log(this.text)
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
        console.log(characters)
    }
}