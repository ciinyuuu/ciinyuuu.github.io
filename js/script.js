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
  const mode = document.getElementById("mode").value;

  if (options.length < 2) {
    alert("請至少輸入兩個選項");
    return;
  }

  // 1. 根據模式過濾可用的索引
  let availableIndices = [];
  options.forEach((_, i) => {
    const isOdd = (i + 1) % 2 !== 0; 
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

  if (availableIndices.length === 0) {
    alert("符合條件的選項已全部抽完！請更換模式或重新輸入。");
    usedIndices = []; 
    return;
  }

  // 2. 決定中獎索引
  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  const index = availableIndices[randomIndex];

  if (mode === "noRepeat") {
    usedIndices.push(index);
  }

  drawWheel(options);

  // 3. 🔊 音效設定：開啟循環並播放 (對應 4 秒轉動)
  if (soundOn) {
    spinSound.currentTime = 0;
    spinSound.loop = true; // 讓音效在 4 秒內不中斷
    spinSound.play();
  }

  // 4. 計算旋轉動畫 (修正指向問題)
  const slice = 360 / options.length;
  const targetRelativeAngle = 360 - (index * slice + slice / 2);
  const currentRounds = Math.ceil(angle / 360);
  // 設定轉動角度，確保每次都順時針轉動至少 5 圈
  angle = (currentRounds + 5) * 360 + targetRelativeAngle;

  const wheel = document.getElementById("wheel");
  wheel.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
  wheel.style.transform = `rotate(${angle}deg)`;
  document.getElementById("result").innerText = "⏳ 抽獎中...";

  // 5. ⌛ 4 秒後停止旋轉並顯示結果
  setTimeout(() => {
    // 🔊 停止旋轉音效，播放中獎音效
    if (soundOn) {
      spinSound.pause();
      spinSound.currentTime = 0;
      winSound.currentTime = 0;
      winSound.play();
    }

    const resultText = options[index];
    document.getElementById("result").innerText = "🎉 抽到：" + resultText;

    // ✨ 中獎色塊閃爍
    if (slicePaths[index]) {
      slicePaths[index].classList.add("highlight");
    }

    // 🚩 如果是「抽過不重複」模式，執行刪除邏輯
    if (mode === "noRepeat") {
      // 延遲一下再執行刪除，讓使用者先看清楚中獎結果
      setTimeout(() => {
        // 1. 從陣列中移除
        options.splice(index, 1); 
        
        // 2. 更新回 textarea
        document.getElementById("options").value = options.join("\n");
        
        // 3. 清空暫存索引（因為 options 已經變動）
        usedIndices = []; 

        // 4. 重置轉盤視覺 (偷換法：關閉動畫回到 0 度)
        wheel.style.transition = "none";
        angle = 0;
        wheel.style.transform = `rotate(0deg)`;

        // 重新畫一個新的轉盤
        if (options.length >= 2) {
          drawWheel(options);
          // 恢復動畫效果
          setTimeout(() => {
            wheel.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
          }, 50);
        } else {
          wheel.innerHTML = "<p style='margin-top:140px; color:#666'>選項不足</p>";
          wheel.style.background = "#eee";
        }
      }, 1500); 
    } else {
      // 非不重複模式，1.5 秒後移除閃爍特效即可
      setTimeout(() => {
        if (slicePaths[index]) slicePaths[index].classList.remove("highlight");
      }, 1500);
    }
  }, 4000); // 準時 4 秒結束
}
