const getRandomInteger = (min: number, maxPlusOne: number) => {
    min = Math.ceil(min)
    maxPlusOne = Math.floor(maxPlusOne)
    return Math.floor(Math.random() * (maxPlusOne - min)) + min
}


const getRandomBoolean = () => {
    return getRandomInteger(0, 2) === 1;
};

/**
 * Palauttaa k satunnaisesti valittua arvoa n:stä satunnaisessa järjestyksessä, kun k <= n.
 *
 * Arvot ovat aina välillä (0...n - 1).
 * Esim. (k: 5 n: 5) -> [ 1, 2, 4, 0, 3 ]
 *       (k: 4 n: 5) -> [ 0, 1, 3, 4 ]
 *       (k: 3 n: 5) -> [ 2, 1, 3 ]
 **/
const getKOfN = (k: number, n: number) => {
    if (k > n ) {
        throw Error(`Virheelliset parametrit: k > n (= ${k} > ${n})`)
    }
    const moved: Record<number, number> = {}
    const getNth = (x: number) => {
        return moved[x] || x
    }
    const out = []
    const limit = n - k

    for ( let t = n - 1; t >= 0; t-- ) {
        const r = getRandomInteger(0, t+1)
        out.push(getNth(r))
        if ( t === limit ) {
            break;
        }
        moved[r] = getNth(t)
    }
    return out
}


/**
 * Palauttaa `k:n` mukaisen määrän alkioita taulukosta `values` satunnaisessa järjestyksessä.
 * @param values: taulukko, jonka alkioista valitaan
 * @param k:      määrä joka valitaan
 **/
const pickK = <T>(values: Array<T>, k: number) => {
    const count = Math.min(k, values.length)
    const indices = getKOfN(count, values.length)

    return indices.map((index) => values[index])
}


/**
 * Palauttaa `k:n` mukaisen määrän alkioita taulukosta `values` satunnaisessa järjestyksessä siten,
 * että sama voi esiintyä useita kertoja.
 * @param values: taulukko, jonka alkioista valitaan
 * @param k:      määrä joka valitaan
 **/
const pickKWithDuplicates = <T>(values: Array<T>, k: number) => {
    const indices = [];
    for ( let i = 0; i < k; i++ ) {
        indices.push(getRandomInteger(0, values.length));
    }

    return indices.map((index) => values[index])
}


const pickOne = <T>(values: Array<T>) => {
    const array = pickK(values, 1)
    return array[0]
}

const shuffle = <T>(array: Array<T>): Array<T> => {
    const indices = getKOfN(array.length, array.length)
    return indices.map((index) => array[index])
}

export default {
    getRandomBoolean,
    getRandomInteger,
    getKOfN,
    pickK,
    pickKWithDuplicates,
    pickOne,
    shuffle
};
