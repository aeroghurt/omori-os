const Laptop = (rootFrame = 0) => {
    return {
        duration: 400,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 200,
                    frame: rootFrame + 1
                }
            ]
    }
}

export const LAPTOP = Laptop(0);

const Lightbulb = (rootFrame = 0) => {
    return {
        duration: 900,
        frames:
            [
                {
                    time: 0,
                    frame: rootFrame
                },
                {
                    time: 300,
                    frame: rootFrame + 1
                },
                {
                    time: 600,
                    frame: rootFrame + 2
                },
            ]
    }
}

export const LIGHTBULB = Lightbulb(0);