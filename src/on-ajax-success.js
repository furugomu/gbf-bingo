'use strict';

const lastHit = require('./last-hit');

// ビンゴのデータを受け取った時になにかする
module.exports = function(callback) {
  jQuery(document).ajaxSuccess((event, xhr, settings) => {
    if (settings.url.indexOf('/bingo_init_data/') < 0) return;
    callback(xhr.responseJSON);
  });
}

// いろつけて表示
module.exports.log = function(game) {
  let lines = [''];
  let styles = [];
  // let chance = game.chance_data;
  // lines.push(`chance ${chance.number}, ${chance.gauge_level}`);
  let sheet = game.sheet_list;
  if (!sheet) return;
  for (let y = 0; y < 5; ++y) {
    let texts = [];
    for (let x = 0; x < 5; ++x) {
      let i = y * 5 + x;
      let p = sheet[i];
      texts.push('%c' + (p.number < 10 ? ' ' : '') + p.number);
      let style = '';

      if (p.opened_type) {
        style = 'color: blue; background: white';
      }
      else if ((lastHit(game.hit_list) || {}).number === p.number) {
        style = 'color: red; background: white';
      }
      styles.push(style);
    }
    lines.push(texts.join(' '));
  }
  let args = [].concat([lines.join('\n')], styles);
  console.debug.apply(console, args);
}
