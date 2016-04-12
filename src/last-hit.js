'use strict';

module.exports = function lastHit(hits) {
  if (!hits) return null;
  return hits[Math.min.apply(Math, Object.keys(hits).map(Number))];
}
