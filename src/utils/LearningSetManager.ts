const AVGN = 10;

export default class LearningSetManager {
    sets = new Map();

    constructor() {

    }

    add(setName, data) {
        this.sets.set(setName, data);
    }

    update(setName, valueName, right, wrong) {
        const item = this.sets.get(setName)[valueName];
        item.right = item.right * (AVGN - 1) / AVGN + right / AVGN;
        item.wrong = item.wrong * (AVGN - 1) / AVGN + wrong / AVGN;
    }

    getSet(setName) {
        return this.sets.get(setName);
    }
}
