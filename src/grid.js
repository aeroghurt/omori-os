import { walls } from '/src/map.js';

export const GridCells = n => {
    return n * 32;
}

export const isSpaceFree = (wall, x, y) => {
    const str = `${x},${y}`;
    const isWallPresent = walls.has(str);
    return !isWallPresent;
}