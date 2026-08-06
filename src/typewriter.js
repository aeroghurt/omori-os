export class typewriter {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("typewriter");

        this.element.innerHTML= (`
            <h1 class="typewriter">${this.text}<h1>
            <img src="assets/hand.png" class="backnforth">
        `)
    }

    init(container) {
        this.createElement();
        containter.appendChild(this.element);
    }
}