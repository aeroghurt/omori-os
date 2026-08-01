const MakeWalkingFrames = (rootFrame = 0) => {
    return {
    duration: 800,
    frames:
        [
            {
                time: 0,
                frame: rootFrame + 1
            },
            {
                time: 200,
                frame: rootFrame
            },
            {
                time: 400,
                frame: rootFrame + 1
            },
            {
                time: 600,
                frame: rootFrame + 2
            }
        ]
    }
}



const MakeStandingFrames = (rootFrame = 0) => {
    return {
        duration: 400,
        frames: [
            {
                time: 0,
                frame: rootFrame 
            }
        ]
    }
}

export const WALK_DOWN = MakeWalkingFrames(0);
export const WALK_LEFT = MakeWalkingFrames(3);
export const WALK_RIGHT = MakeWalkingFrames(6);
export const WALK_UP = MakeWalkingFrames(9);

export const STAND_DOWN = MakeStandingFrames(1);
export const STAND_LEFT = MakeStandingFrames(4);
export const STAND_RIGHT = MakeStandingFrames(7);
export const STAND_UP = MakeStandingFrames(10);