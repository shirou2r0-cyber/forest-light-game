
// 要素取得
const playArea = document.getElementById("play-area");

function rand(min, max){ return Math.random() * (max - min) + min; }

// 光を1つ作って一定時間後に消す
function createLight(lifetime = 3000){
  const light = document.createElement("div");
  light.className = "light";
  // ランダム位置（%で指定）
  const x = rand(5, 95);
  const y = rand(10, 85);
  light.style.left = x + "%";
  light.style.top = y + "%";

  playArea.appendChild(light);

  // 自動で消える（演出：縮小して消す）
  setTimeout(() => {
    light.classList.add("pop");
    // popアニメーション後にDOM除去
    setTimeout(()=> light.remove(), 300);
  }, lifetime);
}

// 確認用: 1秒ごとに出す
const testInterval = setInterval(()=> createLight(3000), 1000);

// 実行はブラウザでscript.jsを読み込み時に動く。
// 後で start/stop 制御を追加します。

// HUD要素
const scoreEl = document.getElementById("score");
let score = 0;

// クリックハンドラを光に登録するバージョン
function createLight(lifetime = 3000){
  const light = document.createElement("div");
  light.className = "light";
  const x = rand(5, 95);
  const y = rand(10, 85);
  light.style.left = x + "%";
  light.style.top = y + "%";

  // クリックでスコア増加＆アニメ
  light.addEventListener("click", (e) => {
    e.stopPropagation(); // 他のハンドラに影響させない
    score++;
    scoreEl.textContent = `Score: ${score}`;
    light.classList.add("pop");
    setTimeout(()=> light.remove(), 250);
  });

  playArea.appendChild(light);

  setTimeout(() => {
    // まだDOM内ならフェードアウト
    if (document.body.contains(light)) {
      light.classList.add("pop");
      setTimeout(()=> light.remove(), 300);
    }
  }, lifetime);
}

// 既出の要素（playArea, scoreEl）に加えて
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const endScreen = document.getElementById("end-screen");

let spawnIntervalId = null;
let gameTimerId = null;
let remaining = 30;
let maxLights = 8; // 同時出現上限

function startGame(){
  // リセット
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  remaining = 30;
  timerEl.textContent = `Time: ${remaining}`;
  endScreen.style.display = "none";
  restartBtn.style.display = "none";
  startBtn.style.display = "none";

  // 定期的に光をスポーン（出現数を監視）
  spawnIntervalId = setInterval(()=> {
    // 同時に存在する光の数をチェックして上限以下なら生成
    const current = playArea.querySelectorAll(".light").length;
    if (current < maxLights) createLight(3000 + Math.random()*2000);
  }, 700);

  // ゲームタイマー（1秒ごと）
  gameTimerId = setInterval(()=> {
    remaining--;
    timerEl.textContent = `Time: ${remaining}`;
    if (remaining <= 0) endGame();
  }, 1000);
}

function endGame(){
  // 停止処理
  clearInterval(spawnIntervalId);
  clearInterval(gameTimerId);

  // 既存の光を消す（ポップ演出）
  document.querySelectorAll(".light").forEach(l => {
    l.classList.add("pop");
    setTimeout(()=> l.remove(), 250);
  });

  // 結果表示
  endScreen.style.display = "flex";
  endScreen.innerHTML = `<div><h2>終了！</h2><p>あなたは <strong>${score}</strong> 個の光を集めました</p></div>`;
  restartBtn.style.display = "inline-block";
}

// 再挑戦
function restartGame(){
  // 画面をクリーンにして再スタート
  document.querySelectorAll(".light").forEach(l => l.remove());
  startBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  endScreen.style.display = "none";
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  remaining = 30;
  timerEl.textContent = `Time: ${remaining}`;
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

