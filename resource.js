class Resources {
    constructor() {
        // plan to download
        this.toLoad = {
            floor: "assets/floor.png",
            door: "assets/door.png",
            laptop: "assets/laptop.png",
            lightbulb: "assets/lightbulb.png",
            notebook: "assets/notebook.png",
            tissues: "assets/tissues.png",
            omori: "assets/omori-spritesheet.png",
            shadow: "assets/shadow.png",
            mewo: "assets/mewo.png"
        };
        // keep all of the images
        this.images = {};
        // load each image
        Object.keys(this.toLoad).forEach(key => {
            const img = new Image();
            img.src = this.toLoad[key];
            this.images[key] = {
                image: img,
                isLoaded: false
            }
            img.onload = () => {
                this.images[key].isLoaded = true;
            }
        })
    }
}
// create one instance for the whole app to use
export const resources = new Resources();