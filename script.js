
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
