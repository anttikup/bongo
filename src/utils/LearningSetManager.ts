import type { LearningStats } from '../types';

const AVGN = 10;

export const exponentialMovingAverage = (oldVal: number, newVal: number) =>
    oldVal * (AVGN - 1) / AVGN + newVal / AVGN;

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
            item.right = exponentialMovingAverage(item.right, right);
            item.wrong = exponentialMovingAverage(item.wrong, wrong);
        }
    }

    getSet(setName: string) {
        return this.sets.get(setName);
    }

    setSet(setName: string, data: LearningStats) {
        return this.sets.set(setName, data);
    }

    has(setName: string) {
        return this.sets.has(setName);
    }

    listSets() {
        const out: string[] = [];
        this.sets.forEach((_, key) => {
            out.push(key);
        });

        if ( out.length === 0 ) {
            return "No sets";
        }
        return "Sets: " + out.join(', ');
    }
}
