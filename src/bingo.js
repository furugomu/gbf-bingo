'use strict';

class Bingo {
  constructor(size) {
    this.size = size || 5;
    this.cells = range(this.size*this.size).map((i) => new Cell({number: i}));
    this.range = range(this.size);
    this.reverseRange = range(this.size).reverse();
    this.chanceCount = 0;
  }

  // [{number, color}, ...]
  assign(values) {
    values.forEach((v, i) => {
      this.cells[i].update(v);
    });
  }

  // {number, color}
  update(value) {
    let cell = this.cells.find((c) => c.number === value.number);
    if (cell) {
      cell.update(value);
    }
  }

  at(x, y) {
    return this.cells[y * this.size + x];
  }

  // CHANCE ランプを光らせる
  doChance() {
    if (this.chanceCount < 3) this.chanceCount += 1;
  }

  mustChance() {
    return this.chanceCount < 2 || this.isReached();
  }

  // リーチがひとつでもある
  isReached() {
    return this.sequences().some((cells) => cells.filter((c) => c.isOpened).length >= 4)
  }

  // たてよこななめ
  sequences() {
    let all = [];
    // たて
    for (let x of this.range) {
      all.push(this.range.map((y) => this.at(x, y)));
    }
    // よこ
    for (let y of this.range) {
      all.push(this.range.map((x) => this.at(x, y)));
    }
    // ななめ
    all.push(zip(this.range, this.range).map((xy) => this.at(xy[0], xy[1])));
    all.push(zip(this.range, this.reverseRange).map((xy) => this.at(xy[0], xy[1])));

    return all;
  }
}

module.exports = Bingo;

class Cell {
  constructor(x) {
    this.update(x);
  }

  update(x) {
    if (x.number !== undefined) this.number = x.number;
    if (x.color !== undefined) this.color = x.color;
    if (x.opened_type !== undefined) this.openedType = x.opened_type;
    if (x.can_open !== undefined) this.canOpen = x.can_open !== 0;
  }

  get isOpened() { return this.openedType !== undefined; }
}

function range(lo, hi) {
  if (hi === undefined) {
    hi = lo;
    lo = 0;
  }
  if (hi < lo) return undefined;
  let a = new Array(hi - lo);
  for (let i = 0; i < a.length; ++i) {
    a[i] = lo + i;
  }
  return a;
}

function zip(xs, ys) {
  let len = Math.max(xs.length, ys.length);
  return range(len).map((i)=>[xs[i], ys[i]]);
}
