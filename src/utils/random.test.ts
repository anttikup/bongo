import { expect } from '../testconfig';

import random from './random.js';

describe('getRandomFloat', function () {
    it('should return values between min and max', function () {
        const MIN = 3.0;
        const MAX = 5.0;

        for ( let i = 0; i < 1000; i++ ) {
            const val = random.getFloat(MIN, MAX);
            expect(val).to.be.within(MIN, MAX);
        }
    });
});
