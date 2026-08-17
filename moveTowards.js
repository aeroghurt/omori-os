export function moveTowards(person, destinationPosition, speed) {
    let distanceX = destinationPosition.x - person.position.x;
    let distanceY = destinationPosition.y - person.position.y;
    let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    return distance;
}
