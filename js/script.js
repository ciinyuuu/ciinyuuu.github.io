let angle = 0;
let soundOn = true;
let sliceElements = [];

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

function drawWheel(options) {
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = "";

  const colors = [
    "#fde2e4",
    "#f8cdda",
    "#fbcfe8",
    "#f3e8ff", // 淡紫
    "#e0ecff", // 淡藍
  ];

  const size = 320;
  const radius = 130;
  const slice = 360 / options.length;

  let gradient = "conic-gradient(";

  // 背景色塊
  options.forEach((_, i) => {
    gradient += `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg,`;
  });
  wheel.style.background = gradient.slice(0, -1) + ")";

  // SVG 弧形文字
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

    const path = document.createElementNS(svgNS, "path");
    const pathId = `path-${i}`;
    path.setAttribute("id", pathId);

    path.setAttribute(
      "d",
      `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
    );
    path.setAttribute("fill", "none");

    const textEl = document.createElementNS(svgNS, "text");
    textEl.setAttribute("class", "slice-text");

    const textPath = document.createElementNS(svgNS, "textPath");
    textPath.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      `#${pathId}`
    );
    textPath.setAttribute("startOffset", "50%");
    textPath.textContent = text;

    textEl.appendChild(textPath);
    svg.appendChild(path);
    svg.appendChild(textEl);
  });

  wheel.appendChild(svg);
}
    // 🎯 建立色塊標記元素（用來閃爍）
    const sliceMark = document.createElement("div");
    sliceMark.style.position = "absolute";
    sliceMark.style.width = "100%";
    sliceMark.style.height = "100%";
    sliceMark.style.borderRadius = "50%";
    sliceMark.style.clipPath =
      `polygon(50% 50%, 100% 0, 100% 100%)`;
    sliceMark.style.transform =
      `rotate(${i * slice}deg)`;
    sliceMark.dataset.index = i;

    sliceElements.push(sliceMark);
    wheel.appendChild(sliceMark);

    // 📝 色塊文字
    const text = document.createElement("div");
    text.className = "slice-text";
    text.style.transform =
      `rotate(${i * slice + slice / 2}deg) translate(135px)`;
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

  // 🎯 指針對應角度
  const targetAngle = 360 - (index * slice + slice / 2);
  angle += 360 * 5 + targetAngle;

  if (soundOn) {
    const spinSound = document.getElementById("spinSound");
    spinSound.currentTime = 0;
    spinSound.play();
  }

  const wheel = document.getElementById("wheel");
  wheel.style.transform = `rotate(${angle}deg)`;

  setTimeout(() => {
    document.getElementById("result").innerText =
      "🎉 抽到：" + options[index];

    // ⭐ 加上閃爍效果
    sliceElements[index].classList.add("highlight");

    setTimeout(() => {
      sliceElements[index].classList.remove("highlight");
    }, 1600);

    if (soundOn) {
      const winSound = document.getElementById("winSound");
      winSound.currentTime = 0;
      winSound.play();
    }
  }, 4000);
}
