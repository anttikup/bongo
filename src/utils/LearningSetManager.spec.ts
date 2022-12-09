import { expect } from '../testconfig.js';

import { exponentialMovingAverage } from './LearningSetManager';

describe('exponentialMovingAverage', function () {
    it('should increase with non-zero input if below 1', function () {

        let oldVal = 0;
        for ( let i = 0; i < 100; i++ ) {
            const newVal = exponentialMovingAverage(oldVal, 1);
            expect(newVal).to.be.above(oldVal);
            oldVal = newVal;
        }
    });

    it('should stay the same with if already 1', function () {

        let oldVal = 1;
        for ( let i = 0; i < 100; i++ ) {
            const newVal = exponentialMovingAverage(oldVal, 1);
            expect(newVal).to.equal(oldVal);
            oldVal = newVal;
        }
    });

    it('should decrease with zero input if above 0', function () {

        let oldVal = 1;
        for ( let i = 0; i < 100; i++ ) {
            const newVal = exponentialMovingAverage(oldVal, 0);
            expect(newVal).to.be.below(oldVal);
            oldVal = newVal;
        }
    });

    it('should stay the same with zero input if already 0', function () {

        let oldVal = 0;
        for ( let i = 0; i < 100; i++ ) {
            const newVal = exponentialMovingAverage(oldVal, 0);
            expect(newVal).to.equal(oldVal);
            oldVal = newVal;
        }
    });

});
