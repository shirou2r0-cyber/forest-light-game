// --- 要素取得 ---
const playArea = document.getElementById("play-area");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const endScreen = document.getElementById("end-screen");

const popSound = document.getElementById("pop-sound");
const bgm = document.getElementById("bgm");

// --- 状態変数 ---
let score = 0;
let remaining = 30;
let spawnIntervalId = null;
let gameTimerId = null;
let maxLights = 8;

// --- ユーティリティ ---
function rand(min, max){ return Math.random() * (max - min) + min; }

// --- 光生成 ---
function createLight(lifetime = 3000){
  const light = document.createElement("div");
  light.className = "light";

  // 出現位置（プレイエリアの余白を少し残す）
  const x = rand(6, 94);
  const y = rand(12, 86);
  light.style.left = x + "%";
  light.style.top = y + "%";

  // クリック・タッチのハンドラ
  const collect = (e) => {
    e.stopPropagation();
    score++;
    scoreEl.textContent = `Score: ${score}`;
    if (popSound) { popSound.currentTime = 0; popSound.play().catch(()=>{}); }
    light.classList.add("pop");
    setTimeout(()=> {
      if (light.parentNode) light.remove();
    }, 250);
  };
  light.addEventListener("click", collect);
  light.addEventListener("touchstart", collect);

  playArea.appendChild(light);

  // 自動消滅
  const removeTimeout = setTimeout(() => {
    if (document.body.contains(light)) {
      light.classList.add("pop");
      setTimeout(()=> {
        if (light.parentNode) light.remove();
      }, 300);
    }
  }, lifetime);
}

// --- ゲーム開始 ---
function startGame(){
  // reset
  score = 0; remaining = 30;
  scoreEl.textContent = `Score: ${score}`;
  timerEl.textContent = `Time: ${remaining}`;
  endScreen.style.display = "none";
  restartBtn.style.display = "none";
  startBtn.style.display = "none";

  // BGM再生（ユーザー操作トリガーなのでブラウザが許可）
  if (bgm) bgm.play().catch(()=>{});

  // spawnループ
  spawnIntervalId = setInterval(()=> {
    const current = playArea.querySelectorAll(".light").length;
    if (current < maxLights) createLight(3000 + Math.random()*2200);
  }, 700);

  // タイマー
  gameTimerId = setInterval(()=> {
    remaining--;
    timerEl.textContent = `Time: ${remaining}`;
    if (remaining <= 0) endGame();
  }, 1000);
}

// --- 終了処理 ---
function endGame(){
  clearInterval(spawnIntervalId);
  clearInterval(gameTimerId);
  if (bgm) bgm.pause();

  // 光を消す
  document.querySelectorAll(".light").forEach(l => {
    l.classList.add("pop");
    setTimeout(()=> { if (l.parentNode) l.remove(); }, 250);
  });

  endScreen.style.display = "flex";
  endScreen.innerHTML = `<div><h2>終了</h2><p>あなたは <strong>${score}</strong> 個の光を集めました</p></div>`;
  restartBtn.style.display = "inline-block";
}

// --- 再開／初期化 ---
function restartGame(){
  clearInterval(spawnIntervalId);
  clearInterval(gameTimerId);
  document.querySelectorAll(".light").forEach(l => l.remove());
  startBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  endScreen.style.display = "none";
  score = 0;
  remaining = 30;
  scoreEl.textContent = `Score: ${score}`;
  timerEl.textContent = `Time: ${remaining}`;
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
