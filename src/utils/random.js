export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


export function getRandomBoolean() {
    return Math.random() > 0.5;
}

export function getRandomInteger(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}
