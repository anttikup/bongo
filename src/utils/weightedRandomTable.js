import { getRandomFloat } from './random.js';

const binarySearch = function (arr, x) {
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

const weightedRandomSlot = (weights) => {
    const cumulativeCeils = new Array(weights.length);
    let acc = 0;
    for ( let i = 0; i < weights.length; i++ ) {
        cumulativeCeils[i] = acc;
        acc += weights[i];
    }
    cumulativeCeils[weights.length] = acc;

    const val = getRandomFloat(0, acc);

    return binarySearch(cumulativeCeils, val);
};



export default class WeightedRandomTable {
    constructor(weightsMap) {
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

    static fromRightWrongValues(rightWrongMap) {
        const weightsMap = new Map();

        rightWrongMap.forEach((val, key) => {
            weightsMap.set(key, val.wrong / val.right);
        });

        return new WeightedRandomTable(weightsMap);
    }

    getSubset(ids) {
        const subset = new Map();
        const weightsMap = this.weightsMap;
        ids.forEach(key => subset.set(key, weightsMap.get(key)));
        return new WeightedRandomTable(subset);
    }

    chooseOne() {
        const index = weightedRandomSlot(this.weights);
        return this.values[index];
    }

    chooseMany(k) {
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
