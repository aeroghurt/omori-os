export function moveTowards(char, destinationPosition, speed) {
    let distanceX = destinationPosition.x - char.position.x;
    let distanceY = destinationPosition.y - char.position.y;
    let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    if (distance <= speed) {
        char.position.x = destinationPosition.x;
        char.position.y = destinationPosition.y;
    } else {
        let normalizedX = distanceX / distance;
        let normalizedY = distanceY / distance;

        char.position.x += normalizedX * speed;
        char.position.y += normalizedY * speed;

        distanceX = destinationPosition.x - char.position.x;
        distanceY = destinationPosition.y - char.position.y;
        distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    }
    return distance;
}