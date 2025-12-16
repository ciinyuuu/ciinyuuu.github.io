let used = [];
let angle = 0;
let soundOn = true;

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

function spin() {
  let input = document.getElementById("options").value.trim();
  let mode = document.getElementById("mode").value;
  let options = input.split("\n").filter(x => x !== "");

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
