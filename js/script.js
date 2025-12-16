let angle = 0;
let soundOn = true;

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

// 🎡 建立輪盤（馬卡龍色＋文字置中）
function drawWheel(options) {
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = "";

  const pastelColors = [
    "#ffd6e0", // 粉
    "#ffe5b4", // 杏
    "#e2f0cb", // 淡綠
    "#d7e3fc", // 淡藍
    "#f3d9fa", // 淡紫
    "#fff1c1"  // 淡黃
  ];

  const slice = 360 / options.length;
  let gradient = "conic-gradient(";

  options.forEach((opt, i) => {
    gradient += `${pastelColors[i % pastelColors.length]} ${i * slice}deg ${(i + 1) * slice}deg,`;

    const text = document.createElement("div");
    text.className = "slice-text";

    // ⭐ 文字放在色塊正中央
    text.style.transform =
  `rotate(${i * slice + slice / 2}deg) translate(155px) rotate(90deg)`;
    
    text.innerText = opt;
    wheel.appendChild(text);
  });

  wheel.style.background = gradient.slice(0, -1) + ")";
}

function spin() {
  const input = document.getElementById("options").value.trim();
  const options = input.split("\n").filter(x => x !== "");

  if (options.length < 2) {
    alert("請至少輸入兩個選項");
    return;
  }

  drawWheel(options);

  const slice = 360 / options.length;
  const index = Math.floor(Math.random() * options.length);

  // 🎯 對準指針（正上方）
  const targetAngle = 360 - (index * slice + slice / 2);
  angle += 360 * 5 + targetAngle;

  if (soundOn) {
    const spinSound = document.getElementById("spinSound");
    spinSound.currentTime = 0;
    spinSound.play();
  }

  document.getElementById("wheel").style.transform =
    `rotate(${angle}deg)`;

  setTimeout(() => {
    document.getElementById("result").innerText =
      "🎉 抽到：" + options[index];

    if (soundOn) {
      const winSound = document.getElementById("winSound");
      winSound.currentTime = 0;
      winSound.play();
    }
  }, 4000);
}
