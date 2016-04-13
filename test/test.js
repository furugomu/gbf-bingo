'use strict';

// mocha --require intelli-espower-loader test.js

const assert = require('power-assert');
const Bingo = require('../src/bingo');

describe('Bingo', () => {
  let bingo;
  beforeEach(() => {
    bingo = new Bingo();
  });

  describe('assign', () => {
    it('中身を更新', () => {
      bingo.assign([{number: 999}]);
      assert(bingo.at(0, 0).number === 999);
    });

    it('入れ物はそのまま', () => {
      let old = bingo.at(0, 0);
      bingo.assign([{number: 999}]);
      assert(bingo.at(0, 0) === old);
    });
  });

  describe('update', () => {
    it('同じnumberの所を更新', () => {
      let n = bingo.at(3, 3).number;
      bingo.update({number: n, color: 333});
      assert(bingo.at(3, 3).color === 333);
    });

    it('存在しない番号でも例外を投げない', () => {
      assert.doesNotThrow(() => bingo.update({number: 99999}));
    });
  });

  describe('mustChance', () => {
    describe('CHANCE ランプが 0 個', () => {
      it('returns true', () => {
        times(0, () => bingo.doChance());
        assert(bingo.mustChance());
      });
    });

    describe('CHANCE ランプが 1 個', () => {
      it('returns true', () => {
        times(1, () => bingo.doChance());
        assert(bingo.mustChance());
      });
    });

    describe('CHANCE ランプが 2 個', () => {
      describe('リーチしていない', () => {
        it('returns false', () => {
          times(2, () => bingo.doChance());
          assert(!bingo.isReached());
          assert(!bingo.mustChance());
        });
      });

      describe('リーチしている', () => {
        it('returns true', () => {
          times(2, () => bingo.doChance());
          bingo.isReached = () => true;
          assert(bingo.mustChance());
        });
      });
    });
  });

  describe('isReached', () => {
    describe('3マス開いている', () => {
      beforeEach(() => times(3, (i) => bingo.cells[i].openedType = 1));
      it('returns true', () => {
        assert(!bingo.isReached());
      });
    });

    describe('4マス開いている', () => {
      beforeEach(() => times(4, (i) => bingo.cells[i].openedType = 1));
      it('returns true', () => {
        assert(bingo.isReached());
      });
    });

    describe('5マス開いている', () => {
      beforeEach(() => times(5, (i) => bingo.cells[i].openedType = 1));
      it('returns true', () => {
        assert(bingo.isReached());
      });
    });
  });

  describe('sequences', () => {
    beforeEach(() => bingo = new Bingo());
    it('5(縦)+5(横)+2(斜め)個の配列', () => {
      assert.equal(bingo.sequences().length, 5+5+2);
    });

    it('returns よこ、たて、ななめ', () => {
      bingo.cells = range(25);
      assert.deepEqual(
        bingo.sequences(),
        [
          [0, 1, 2, 3, 4],
          [5, 6, 7, 8, 9],
          [10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19],
          [20, 21, 22, 23, 24],

          [0, 5, 10, 15, 20],
          [1, 6, 11, 16, 21],
          [2, 7, 12, 17, 22],
          [3, 8, 13, 18, 23],
          [4, 9, 14, 19, 24],

          [0, 6, 12, 18, 24],
          [20, 16, 12, 8, 4],
        ]);
    });
  });
});

function range(x) { return Array.from({length: x}).map((_,i)=>i); }
function times(x, f) { range(x).forEach(f); }
