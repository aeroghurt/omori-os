const Laptop = (rootFrame = 0) => {
    return {
        duration: 600,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 300,
                    frame: rootFrame + 1
                }
            ]
    }
}

export const LAPTOP = Laptop(0);

const Lightbulb = (rootFrame = 0) => {
    return {
        duration: 1600,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 400,
                    frame: rootFrame + 1
                },
                {
                    time: 800,
                    frame: rootFrame + 2
                },
                {
                    time: 1200,
                    frame: rootFrame + 1
                },
            ]
    }
}

export const LIGHTBULB = Lightbulb(0);