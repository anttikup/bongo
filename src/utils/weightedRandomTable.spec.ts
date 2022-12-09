import { expect } from '../testconfig.js';

import WeightedRandomTable, { binarySearch, getCumulationArray } from './weightedRandomTable.js';

describe('binarySearch of cumulative data', function () {
    it('should returns index of the closest smaller value', function () {
        const data = [ 10, 20, 30, 40, 50 ];

        const result = binarySearch(data, 35);

        expect(result).to.equal(data.indexOf(30));
    });

    it('even if exact', function () {
        const data = [ 10, 20, 30, 40, 50 ];

        const result = binarySearch(data, 30);

        expect(result).to.equal(data.indexOf(30));
    });

    it('should return match in the beginning', function () {
        const data = [ 10, 20, 30, 40, 50 ];

        const result = binarySearch(data, 5);

        expect(result).to.equal(data.indexOf(10));
    });

    it('should return match in the end', function () {
        const data = [ 10, 20, 30, 40, 50 ];

        const result = binarySearch(data, 5555555);

        expect(result).to.equal(data.indexOf(50));
    });

    it('should return first if value under first', function () {
        const data = [ 10, 20, 30, 40, 50 ];

        const result = binarySearch(data, 5);

        expect(result).to.equal(data.indexOf(10));
    });

});


describe('getCumulationAray', function () {
    it('should have values rising or staying equal', function () {
        const data = [ 2, 4, 2, 1, 0, 5 ];

        const result = getCumulationArray(data);

        expect(result).to.deep.equal([ 0, 2, 6, 8, 9, 9, 14 ]);
    });

    it('should throw on negative weight', function () {
        const data = [ 2, 4, -2, 1, 0, 5 ];

        expect(() => getCumulationArray(data)).to.throw('Negative weight');
    });
});


describe('fromRightWrongValues', function () {
    it('should have weight over 1 when wrong is greater', function () {
        const rightWrong = new Map([
            [ 'a', { right: 0.001, wrong: 1 }],
            [ 'b', { right: 0.5, wrong: 1.5 }],
            [ 'c', { right: 0.1, wrong: 0.11 }],
        ]);

        const result = WeightedRandomTable.fromRightWrongValues(rightWrong);

        expect(result.weights[0]).to.be.above(1.0);
        expect(result.weights[1]).to.be.above(1.0);
        expect(result.weights[2]).to.be.above(1.0);
    });

    it('should have weight below 1 when right is greater', function () {
        const rightWrong = new Map([
            [ 'a', { right: 1, wrong: 0.001 }],
            [ 'b', { right: 1.5, wrong: 0.5 }],
            [ 'c', { right: 0.11, wrong: 0.1 }],
        ]);

        const result = WeightedRandomTable.fromRightWrongValues(rightWrong);

        expect(result.weights[0]).to.be.below(1.0);
        expect(result.weights[1]).to.be.below(1.0);
        expect(result.weights[2]).to.be.below(1.0);
    });


});
