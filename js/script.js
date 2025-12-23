let angle = 0;
let soundOn = true;
let slicePaths = [];
let usedIndices = []; // 🚩 新增：記錄已經抽過的索引

// 當輸入內容改變時，重置已抽中清單
document.getElementById("options").addEventListener("input", () => {
  usedIndices = [];
});

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

function drawWheel(options) {
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = "";
  slicePaths = [];

  const colors = ["#fde2e4", "#f8cdda", "#fbcfe8", "#f3e8ff", "#e0ecff"];
  const size = 320;
  const radius = 140;
  const slice = 360 / options.length;

  let gradient = "conic-gradient(";
  options.forEach((_, i) => {
    gradient += `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg,`;
  });
  wheel.style.background = gradient.slice(0, -1) + ")";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  options.forEach((text, i) => {
    const startAngle = (i * slice - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * slice - 90) * Math.PI / 180;
    const x1 = size / 2 + radius * Math.cos(startAngle);
    const y1 = size / 2 + radius * Math.sin(startAngle);
    const x2 = size / 2 + radius * Math.cos(endAngle);
    const y2 = size / 2 + radius * Math.sin(endAngle);

    const slicePath = document.createElementNS(svgNS, "path");
    slicePath.setAttribute("d", `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`);
    slicePath.setAttribute("fill", "transparent");
    slicePath.classList.add("slice-path");
    slicePaths.push(slicePath);
    svg.appendChild(slicePath);

    const textPathArc = document.createElementNS(svgNS, "path");
    const arcId = `arc-${i}`;
    textPathArc.setAttribute("id", arcId);
    textPathArc.setAttribute("d", `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`);
    textPathArc.setAttribute("fill", "none");

    const textEl = document.createElementNS(svgNS, "text");
    textEl.setAttribute("class", "slice-text");
    const textPath = document.createElementNS(svgNS, "textPath");
    textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${arcId}`);
    textPath.setAttribute("startOffset", "50%");
    textPath.textContent = text;

    textEl.appendChild(textPath);
    svg.appendChild(textPathArc);
    svg.appendChild(textEl);
  });
  wheel.appendChild(svg);
}

function spin() {
  const input = document.getElementById("options").value.trim();
  const options = input.split("\n").filter(x => x !== "");
  const mode = document.getElementById("mode").value; // 🚩 獲取當前模式

  if (options.length < 2) {
    alert("請至少輸入兩個選項");
    return;
  }

  // 1. 根據模式過濾可用的索引
  let availableIndices = [];
  options.forEach((_, i) => {
    const isOdd = (i + 1) % 2 !== 0; // 第1, 3, 5項為單數
    
    if (mode === "all") {
      availableIndices.push(i);
    } else if (mode === "noRepeat") {
      if (!usedIndices.includes(i)) availableIndices.push(i);
    } else if (mode === "odd") {
      if (isOdd) availableIndices.push(i);
    } else if (mode === "even") {
      if (!isOdd) availableIndices.push(i);
    }
  });

  // 2. 檢查是否還有可抽的選項
  if (availableIndices.length === 0) {
    alert("符合條件的選項已全部抽完！請更換模式或重新輸入。");
    usedIndices = []; // 重置
    return;
  }

  // 3. 從可用清單中隨機選一個
  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  const index = availableIndices[randomIndex];

  // 如果是不重複模式，記錄下來
  if (mode === "noRepeat") {
    usedIndices.push(index);
  }

  drawWheel(options);

  // 4. 計算旋轉動畫 (修正指向問題)
  const slice = 360 / options.length;
  const targetRelativeAngle = 360 - (index * slice + slice / 2);
  const currentRounds = Math.ceil(angle / 360);
  angle = (currentRounds + 5) * 360 + targetRelativeAngle;

  if (soundOn) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  const wheel = document.getElementById("wheel");
  wheel.style.transform = `rotate(${angle}deg)`;
  document.getElementById("result").innerText = "⏳ 抽獎中...";

  // ... 前面的 spin 邏輯保持不變 ...

  setTimeout(() => {
    const resultText = options[index];
    document.getElementById("result").innerText = "🎉 抽到：" + resultText;

    // ✨ 中獎色塊閃爍
    slicePaths[index].classList.add("highlight");

    // 🚩 核心修改：如果是「抽過不重複」模式，則移除該選項
    if (mode === "noRepeat") {
      // 1. 從陣列中移除該選項
      options.splice(index, 1); 
      
      // 2. 將剩餘選項接回字串，更新回 textarea
      document.getElementById("options").value = options.join("\n");
      
      // 3. 記錄已使用的索引可以重置了（因為原始名單已經變了）
      usedIndices = []; 

      // 4. 等閃爍動畫結束後，重新畫一個「縮小版」的轉盤
      setTimeout(() => {
        if (options.length >= 2) {
          drawWheel(options);
          // 重置轉盤角度到 0，避免下次旋轉角度過大
          angle = 0;
          document.getElementById("wheel").style.transition = "none";
          document.getElementById("wheel").style.transform = `rotate(0deg)`;
          // 強制瀏覽器重繪，再把 transition 加回來
          setTimeout(() => {
            document.getElementById("wheel").style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
          }, 50);
        } else {
          // 如果只剩一個或沒了，清空轉盤
          document.getElementById("wheel").innerHTML = "<p style='margin-top:140px'>名單已空</p>";
          document.getElementById("wheel").style.background = "#eee";
        }
      }, 1500);
    } else {
      // 非不重複模式，只移除閃爍效果
      setTimeout(() => {
        slicePaths[index].classList.remove("highlight");
      }, 1500);
    }

    if (soundOn) {
      winSound.currentTime = 0;
      winSound.play();
    }
  }, 4000);
