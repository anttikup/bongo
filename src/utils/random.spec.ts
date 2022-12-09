import { expect } from '../testconfig.js';

import { getRandomBoolean, getRandomFloat, getRandomInteger } from './random.js';

describe('getRandomFloat', function () {
    it('should return values between min and max', function () {
        const MIN = 3.0;
        const MAX = 3.1;

        for ( let i = 0; i < 1000; i++ ) {
            const val = getRandomFloat(MIN, MAX);
            expect(val).to.be.within(MIN, MAX);
        }
    });
});

describe('getRandomInteger', function () {
    it('should return value x such that min <= x < max', function () {
        const MIN = 3;
        const MAX_PLUS_ONE = 5;

        const values = [];
        for ( let i = 0; i < 1000; i++ ) {
            values.push(getRandomInteger(MIN, MAX_PLUS_ONE));
        }

        expect(values).to.contain(MIN);
        expect(values).to.contain(MIN + 1);
        expect(values).to.not.contain(MAX_PLUS_ONE);
    });
});

describe('getRandomBoolean', function () {
    it('should return true or false and nothing else', function () {
        const values = [];
        for ( let i = 0; i < 1000; i++ ) {
            values.push(getRandomBoolean());
        }

        expect(values).to.contain(true);
        expect(values).to.contain(false);
        expect(values.every(val => val === true || val === false)).to.be.true;
    });
});
