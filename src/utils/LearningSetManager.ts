import type { LearningStats } from '../types';

const AVGN = 10;

export default class LearningSetManager {
    sets = new Map();

    constructor() {

    }

    add(setName: string, data: LearningStats) {
        this.sets.set(setName, data);
    }

    update(setName: string, valueName: string, right: number, wrong: number) {
        if ( !this.sets.has(setName ) ) {
            return;
        }

        const item = this.sets.get(setName)[valueName];
        if ( item ) {
            item.right = item.right * (AVGN - 1) / AVGN + right / AVGN;
            item.wrong = item.wrong * (AVGN - 1) / AVGN + wrong / AVGN;
        }
    }

    getSet(setName: string) {
        return this.sets.get(setName);
    }

    setSet(setName: string, data: LearningStats) {
        return this.sets.set(setName, data);
    }

}
