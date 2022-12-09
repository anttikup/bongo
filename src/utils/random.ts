export function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}


export function getRandomBoolean() {
    return Math.random() > 0.5;
}

export function getRandomInteger(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}
