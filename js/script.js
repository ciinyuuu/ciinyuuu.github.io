llet angle = 0;
let soundOn = true;
let currentOptions = [];

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

// 🎨 畫輪盤（顏色＋文字）
function drawWheel(options) {
  currentOptions = options;
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = "";

  const colors = [
    "#ff9999", "#99ff99", "#9999ff",
    "#ffff99", "#ffcc99", "#cc99ff"
  ];

  const slice = 360 / options.length;
  let gradient = "conic-gradient(";

  options.forEach((opt, i) => {
    gradient += `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg,`;

    const text = document.createElement("div");
    text.className = "slice-text";
    text.style.transform =
      `rotate(${i * slice + slice / 2}deg) translate(10px, -50%) rotate(90deg)`;
    text.innerText = opt;

    wheel.appendChild(text);
  });

  wheel.style.background = gradient.slice(0, -1) + ")";
}

function spin() {
  let input = document.getElementById("options").value.trim();
  let options = input.split("\n").filter(x => x !== "");

  if (options.length < 2) {
    alert("請至少輸入兩個選項");
    return;
  }

  drawWheel(options);

  // 🎯 隨機旋轉角度
  const slice = 360 / options.length;
  const randomIndex = Math.floor(Math.random() * options.length);

  // 指針在正上方（0 度），所以要反向計算
  const targetAngle = 360 - (randomIndex * slice + slice / 2);

  angle += 360 * 5 + targetAngle;

  if (soundOn) {
    const spinSound = document.getElementById("spinSound");
    spinSound.currentTime = 0;
    spinSound.play();
  }

  document.getElementById("wheel").style.transform =
    `rotate(${angle}deg)`;

  setTimeout(() => {
    const result = options[randomIndex];
    document.getElementById("result").innerText = "🎯 抽到：" + result;

    if (soundOn) {
      const winSound = document.getElementById("winSound");
      winSound.currentTime = 0;
      winSound.play();
    }
  }, 4000);
}
