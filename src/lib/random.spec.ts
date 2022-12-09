import { expect } from '../testconfig';

import random from './random';

describe('getFloat', function () {
    it('should return values between min and max', function () {
        const MIN = 3.0;
        const MAX = 3.1;

        for ( let i = 0; i < 1000; i++ ) {
            const val = random.getFloat(MIN, MAX);
            expect(val).to.be.within(MIN, MAX);
        }
    });
});

describe('getInteger', function () {
    it('should return value x such that min <= x < max', function () {
        const MIN = 3;
        const MAX_PLUS_ONE = 5;

        const values = [];
        for ( let i = 0; i < 1000; i++ ) {
            values.push(random.getInteger(MIN, MAX_PLUS_ONE));
        }

        expect(values).to.contain(MIN);
        expect(values).to.contain(MIN + 1);
        expect(values).to.not.contain(MAX_PLUS_ONE);
    });
});

describe('getBoolean', function () {
    it('should return true or false and nothing else', function () {
        const values = [];
        for ( let i = 0; i < 1000; i++ ) {
            values.push(random.getBoolean());
        }

        expect(values).to.contain(true);
        expect(values).to.contain(false);
        expect(values.every(val => val === true || val === false)).to.be.true;
    });
});



describe('getKOfN', function () {
    describe('when 0 < k < n', function () {
        before(function () {
            this.N = 10;
            this.K = 5;
            this.runs = [];

            for ( let i = 0; i < 1000; i++ ) {
                this.runs.push(random.getKOfN(this.K, this.N));
            }
        });

        it('returns k unique values', function () {
            this.runs.forEach((values: number[]) => {
                expect((new Set(values)).size).to.equal(this.K);
            });
        });

        it('returns values that are >= 0 and < n', function () {
            this.runs.forEach((values: number[]) => {
                expect(
                    values.every(
                        (value: number) => value >= 0 && value < this.N
                    )
                ).to.be.true;
            });
        });

        it('returns values that are in random order', function () {
            const pos0 = this.runs.map((run: number[]) => run[0]);
            const pos1 = this.runs.map((run: number[]) => run[1]);
            const pos2 = this.runs.map((run: number[]) => run[2]);
            const pos3 = this.runs.map((run: number[]) => run[3]);
            const pos4 = this.runs.map((run: number[]) => run[4]);

            expect((new Set(pos0)).size).to.equal(this.N);
            expect((new Set(pos1)).size).to.equal(this.N);
            expect((new Set(pos2)).size).to.equal(this.N);
            expect((new Set(pos3)).size).to.equal(this.N);
            expect((new Set(pos4)).size).to.equal(this.N);
        });
    });

    describe('when k == n', function () {
        before(function () {
            this.N = 10;
            this.K = 10;
            this.runs = [];

            for ( let i = 0; i < 1000; i++ ) {
                this.runs.push(random.getKOfN(this.K, this.N));
            }
        });

        it('returns k unique values', function () {
            this.runs.forEach((values: number[]) => {
                expect((new Set(values)).size).to.equal(this.K);
            });
        });

        it('returns values that are >= 0 and < n', function () {
            this.runs.forEach((values: number[]) => {
                expect(
                    values.every(
                        (value: number) => value >= 0 && value < this.N
                    )
                ).to.be.true;
            });
        });

        it('returns values that are in random order', function () {
            const pos0 = this.runs.map((run: number[]) => run[0]);
            const pos1 = this.runs.map((run: number[]) => run[1]);
            const pos2 = this.runs.map((run: number[]) => run[2]);
            const pos3 = this.runs.map((run: number[]) => run[3]);
            const pos4 = this.runs.map((run: number[]) => run[4]);

            expect((new Set(pos0)).size).to.equal(this.N);
            expect((new Set(pos1)).size).to.equal(this.N);
            expect((new Set(pos2)).size).to.equal(this.N);
            expect((new Set(pos3)).size).to.equal(this.N);
            expect((new Set(pos4)).size).to.equal(this.N);
        });
    });

    describe('when k == 0', function () {
        before(function () {
            this.N = 10;
            this.K = 0;
            this.runs = [];

            for ( let i = 0; i < 1000; i++ ) {
                this.runs.push(random.getKOfN(this.K, this.N));
            }
        });

        it('returns k unique values', function () {
            this.runs.forEach((values: number[]) => {
                expect(values.length).to.equal(0);
            });
        });
    });


    describe('when k > n', function () {
        it('throws', function () {
            expect(() => random.getKOfN(10, 5)).to.throw('Invalid arguments');
        });
    });

    describe('when k < 0', function () {
        it('throws', function () {
            expect(() => random.getKOfN(-1, 5)).to.throw('Invalid arguments');
        });
    });


});

describe('pickK', function () {
    describe('when 0 < k < n', function () {
        before(function () {
            this.K = 3;
            this.INPUT_SET = ['a', 'b', 'c', 'd', 'e'];
            this.runs = [];

            for ( let i = 0; i < 1000; i++ ) {
                this.runs.push(random.pickK(this.INPUT_SET, this.K));
            }
        });

        it('returns k unique values', function () {
            this.runs.forEach((values: string[]) => {
                expect((new Set(values)).size).to.equal(this.K);
            });
        });

        it('returns values that are in the input set', function () {
            this.runs.forEach((values: string[]) => {
                expect(
                    values.every(
                        (value: string) => this.INPUT_SET.includes(value)
                    )
                ).to.be.true;
            });
        });

        it('returns values that are in random order', function () {
            const pos0 = this.runs.map((run: string[]) => run[0]);
            const pos1 = this.runs.map((run: string[]) => run[1]);
            const pos2 = this.runs.map((run: string[]) => run[2]);

            expect((new Set(pos0)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos1)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos2)).size).to.equal(this.INPUT_SET.length);
        });

    });

});


describe('pickKWithDuplicates', function () {
    describe('when 0 < k < n', function () {
        before(function () {
            this.K = 3;
            this.INPUT_SET = ['a', 'b', 'c', 'd', 'e'];
            this.runs = [];

            for ( let i = 0; i < 1000; i++ ) {
                this.runs.push(random.pickKWithDuplicates(this.INPUT_SET, this.K));
            }
        });

        it('returns k values', function () {
            this.runs.forEach((values: string[]) => {
                expect(values.length).to.equal(this.K);
            });
        });

        it('returns values that are in the input set', function () {
            this.runs.forEach((values: string[]) => {
                expect(
                    values.every(
                        (value: string) => this.INPUT_SET.includes(value)
                    )
                ).to.be.true;
            });
        });

        it('returns values that are in random order', function () {
            const pos0 = this.runs.map((run: string[]) => run[0]);
            const pos1 = this.runs.map((run: string[]) => run[1]);
            const pos2 = this.runs.map((run: string[]) => run[2]);

            expect((new Set(pos0)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos1)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos2)).size).to.equal(this.INPUT_SET.length);
        });

    });

    describe('when k > n', function () {
        before(function () {
            this.K = 7;
            this.INPUT_SET = ['a', 'b', 'c', 'd', 'e'];
            this.runs = [];

            for ( let i = 0; i < 1000; i++ ) {
                this.runs.push(random.pickKWithDuplicates(this.INPUT_SET, this.K));
            }
        });

        it('returns k values', function () {
            this.runs.forEach((values: string[]) => {
                expect(values.length).to.equal(this.K);
            });
        });

        it('returns values that are in the input set', function () {
            this.runs.forEach((values: string[]) => {
                expect(
                    values.every(
                        (value: string) => this.INPUT_SET.includes(value)
                    )
                ).to.be.true;
            });
        });

        it('returns values that are in random order', function () {
            const pos0 = this.runs.map((run: string[]) => run[0]);
            const pos1 = this.runs.map((run: string[]) => run[1]);
            const pos2 = this.runs.map((run: string[]) => run[2]);
            const pos3 = this.runs.map((run: string[]) => run[3]);
            const pos4 = this.runs.map((run: string[]) => run[4]);
            const pos5 = this.runs.map((run: string[]) => run[5]);
            const pos6 = this.runs.map((run: string[]) => run[6]);

            expect((new Set(pos0)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos1)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos2)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos3)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos4)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos5)).size).to.equal(this.INPUT_SET.length);
            expect((new Set(pos6)).size).to.equal(this.INPUT_SET.length);
        });

    });

});



describe('pickOne', function () {
    before(function () {
        this.INPUT_SET = ['a', 'b', 'c', 'd', 'e'];
        this.runs = [];

        for ( let i = 0; i < 1000; i++ ) {
            this.runs.push(random.pickOne(this.INPUT_SET));
        }
    });

    it('returns value that is in the input set', function () {
        this.runs.every((value: string) => this.INPUT_SET.includes(value));
    });

    it('returns each of the input set values', function () {
        expect((new Set(this.runs)).size).to.equal(this.INPUT_SET.length);
    });
});



describe('shuffle', function () {
    before(function () {
        this.INPUT_SET = ['a', 'b', 'c', 'd', 'e'];
        this.runs = [];

        for ( let i = 0; i < 1000; i++ ) {
            this.runs.push(random.shuffle(this.INPUT_SET));
        }
    });

    it('returns k unique values', function () {
        this.runs.forEach((values: string[]) => {
            expect((new Set(values)).size).to.equal(this.INPUT_SET.length);
        });
    });

    it('returns values that are in the input set', function () {
        this.runs.forEach((values: string[]) => {
            expect(
                values.every(
                    (value: string) => this.INPUT_SET.includes(value)
                )
            ).to.be.true;
        });
    });

    it('returns values that are in random order', function () {
        const pos0 = this.runs.map((run: string[]) => run[0]);
        const pos1 = this.runs.map((run: string[]) => run[1]);
        const pos2 = this.runs.map((run: string[]) => run[2]);
        const pos3 = this.runs.map((run: string[]) => run[3]);
        const pos4 = this.runs.map((run: string[]) => run[4]);

        expect((new Set(pos0)).size).to.equal(this.INPUT_SET.length);
        expect((new Set(pos1)).size).to.equal(this.INPUT_SET.length);
        expect((new Set(pos2)).size).to.equal(this.INPUT_SET.length);
        expect((new Set(pos3)).size).to.equal(this.INPUT_SET.length);
        expect((new Set(pos4)).size).to.equal(this.INPUT_SET.length);
    });
});
