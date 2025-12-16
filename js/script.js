let used = [];
let angle = 0;
let soundOn = true;

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

// 🎨 產生輪盤與文字
function drawWheel(options) {
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = "";

  const colors = ["#ff9999", "#99ff99", "#9999ff", "#ffff99", "#ffcc99", "#cc99ff"];
  const sliceAngle = 360 / options.length;

  let gradient = "conic-gradient(";

  options.forEach((opt, i) => {
    gradient += `${colors[i % colors.length]} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg,`;

    const text = document.createElement("div");
    text.className = "slice-text";
    text.style.transform = `rotate(${i * sliceAngle}deg) translate(10px, -50%)`;
    text.innerText = opt;

    wheel.appendChild(text);
  });

  wheel.style.background = gradient.slice(0, -1) + ")";
}

function spin() {
  let input = document.getElementById("options").value.trim();
  let mode = document.getElementById("mode").value;
  let options = input.split("\n").filter(x => x !== "");

  if (options.length === 0) {
    alert("請輸入選項");
    return;
  }

  drawWheel(options);

  if (mode === "odd") {
    options = options.filter(x => !isNaN(x) && x % 2 === 1);
  }

  if (mode === "even") {
    options = options.filter(x => !isNaN(x) && x % 2 === 0);
  }

  if (mode === "noRepeat") {
    options = options.filter(x => !used.includes(x));
  }

  if (options.length === 0) {
    alert("沒有可抽的選項");
    return;
  }

  let pick = options[Math.floor(Math.random() * options.length)];
  if (mode === "noRepeat") used.push(pick);

  if (soundOn) {
    let spinSound = document.getElementById("spinSound");
    spinSound.currentTime = 0;
    spinSound.play();
  }

  angle += 360 * 5 + Math.floor(Math.random() * 360);
  document.getElementById("wheel").style.transform =
    `rotate(${angle}deg)`;

  setTimeout(() => {
    document.getElementById("result").innerText = "🎉 抽到：" + pick;
    if (soundOn) {
      let winSound = document.getElementById("winSound");
      winSound.currentTime = 0;
      winSound.play();
    }
  }, 3000);
}
