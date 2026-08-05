export const walls = new Set();

walls.add(`96,0`); // door
for (let i = 0; i < 32; i++) {
    walls.add(`${96 + i},${0}`)
    walls.add(`${96},${0 + i}`)
}
console.log(walls)
walls.add(`128,64`); // laptop
walls.add(`192,128`); // tissues