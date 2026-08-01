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