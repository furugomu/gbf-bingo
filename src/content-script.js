'use strict';

// gbf.mbga.jp では console.log が潰されている
if (console.log.toString().indexOf('native code') < 0) {
  console.log = Object.getPrototypeOf(console).log;
}
window.onerror = null;

const onAjaxSuccess = require('./on-ajax-success');
const Bingo = require('./bingo');
const lastHit = require('./last-hit');

waitJQuery(main);
function main() {
  console.log('main', jQuery);
  //onAjaxSuccess((board) => console.log('onAjaxSuccess', board));
  // ビンゴをする
  let bingo = new Bingo();
  window.bingo = bingo;
  onAjaxSuccess((board) => {
    if (board.game_status.status === 0) {
      window.bingo = bingo = new Bingo();
    }
  });
  onAjaxSuccess((board) => playBingo(bingo, board));

  // 再プレイボタンを押し続ける
  setInterval(() => jQuery('.btn-play-again').trigger('tap'), 2211);

  // ベット額を決めるダイアログの Play ボタンを押し続ける
  setInterval(() => jQuery('.btn-play-ok').trigger('tap'), 2121);
}

function playBingo(bingo, board) {
  // 盤面にある数字
  if (board.sheet_list) {
    bingo.assign(board.sheet_list);
  }
  // 転がってきた数字
  if (board.hit_list) {
    for (let i in board.hit_list) {
      bingo.update(board.hit_list[i]);
    }
  }
  // チャンスの状態
  if (board.chance_data) {
    bingo.chanceCount = board.chance_data.gauge_level;
  }

  // チャンスしたほうが良ければする
  if (!bingo.mustChance()) return;
  let hit = lastHit(board.hit_list);
  if (!hit) return;
  // 押せるようになるまで数秒かかるので何度か押す
  for (let t = 500; t <= 4000; t += 500) {
    setTimeout(() => tap(hit.number), t);
  }
}

function waitJQuery(f) {
  setTimeout(() => {
    if (typeof jQuery === undefined) return wait(f);
    f();
  }, 100);
}

// 数字がnであるマスを叩く
function tap(n) {
  jQuery(`[data-number='${n}']`).trigger('tap');
}

/*
  div.cnt-bingo
   div.prt-sheet-area
    div.panel-(0-24)
     &.opened
      div[data-number=x]
*/
