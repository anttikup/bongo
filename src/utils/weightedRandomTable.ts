import { getRandomFloat } from './random';

/**
 * Return the index where value `x` is on the cumulative array `arr`.
 **/
export const binarySearch = (arr: number[], x: number) => {
    let start = 0, end = arr.length - 1;

    let mid;
    while ( start < end ) {
        mid = start + Math.floor((end - start + 1) / 2);

        if ( arr[mid] > x ) {
            end = mid - 1
        } else {
            start = mid
        }
    }

    return start;
};

/**
 * Creates a cumulation of values in `weights`.
 *
 * E. g. given [ 2, 4, 2, 1, 0, 5 ] returns
 *  [ 0, 2, 6, 8, 9, 9, 14 ].
 **/
export const getCumulationArray = (weights: number[]) => {
    const cumulativeCeils = new Array(weights.length);
    let acc = 0;
    for ( let i = 0; i < weights.length; i++ ) {
        cumulativeCeils[i] = acc;
        acc += weights[i];
        if ( weights[i] < 0 ) {
            throw new Error('Negative weight');
        }
    }
    cumulativeCeils[weights.length] = acc;

    return cumulativeCeils;
};


export const weightedRandomSlot = (weights: number[]) => {
    const cumulativeCeils = getCumulationArray(weights);
    const max = cumulativeCeils[cumulativeCeils.length - 1];

    const val = getRandomFloat(0, max);

    return binarySearch(cumulativeCeils, val);
};


type RightWrong = {
    right: number;
    wrong: number;
};

export default class WeightedRandomTable {
    weightsMap: Map<string, number> = new Map();
    weights: number[] = [];
    values: number[] = [];

    constructor(weightsMap: Map<string, number>) {
        const weights = new Array(weightsMap.size);
        const values = new Array(weightsMap.size);
        this.weightsMap = weightsMap;

        let i = 0;
        weightsMap.forEach((val, key) => {
            weights[i] = val;
            values[i] = key;
            i++;
        });

        this.weights = weights;
        this.values = values;
    }

    static fromRightWrongValues(rightWrongMap: Map<string, RightWrong>) {
        const weightsMap = new Map();

        rightWrongMap.forEach((val, key) => {
            weightsMap.set(key, val.wrong / val.right);
        });

        return new WeightedRandomTable(weightsMap);
    }

    getSubset(ids: string[]) {
        const subset = new Map();
        const weightsMap = this.weightsMap;

        ids.forEach(key => subset.set(key, weightsMap.get(key)));

        return new WeightedRandomTable(subset);
    }

    chooseOne() {
        const index = weightedRandomSlot(this.weights);
        return this.values[index];
    }

    chooseMany(k: number) {
        console.assert(k <= this.weights.length, `Can't choose ${k} items from ${this.weights.length}`);

        // Copy because we set the value to 0 after use.
        const distr = [ ...this.weights ];
        const result = new Array(k);

        for ( let i = 0; i < k; i++ ) {
            //console.log("weights left:", distr);
            const slot = weightedRandomSlot(distr);

            result[i] = this.values[slot];
            distr[slot] = 0;
        }

        return result;
    }

};




//const test = new WeightedRandomTable([1, 2, 3, 4, 5]);

//for ( let i = 0; i < 10; i++ ) {
//    console.log(test.chooseK(2));
//}
