let angle = 0;
let soundOn = true;
let slicePaths = [];

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").innerText =
    soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

function drawWheel(options) {
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = "";
  slicePaths = [];

  const colors = [
    "#fde2e4",
    "#f8cdda",
    "#fbcfe8",
    "#f3e8ff",
    "#e0ecff"
  ];

  const size = 320;
  const radius = 140;
  const slice = 360 / options.length;

  // 🎨 背景色塊
  let gradient = "conic-gradient(";
  options.forEach((_, i) => {
    gradient += `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg,`;
  });
  wheel.style.background = gradient.slice(0, -1) + ")";

  // 🌀 SVG（弧形文字 + 閃爍用 path）
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

    // 🎯 色塊 path（用來閃爍）
    const slicePath = document.createElementNS(svgNS, "path");
    slicePath.setAttribute(
      "d",
      `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`
    );
    slicePath.setAttribute("fill", "transparent");
    slicePath.classList.add("slice-path");
    slicePaths.push(slicePath);
    svg.appendChild(slicePath);

    // 📝 文字弧線
    const textPathArc = document.createElementNS(svgNS, "path");
    const arcId = `arc-${i}`;
    textPathArc.setAttribute("id", arcId);
    textPathArc.setAttribute(
      "d",
      `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
    );
    textPathArc.setAttribute("fill", "none");

    const textEl = document.createElementNS(svgNS, "text");
    textEl.setAttribute("class", "slice-text");

    const textPath = document.createElementNS(svgNS, "textPath");
    textPath.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      `#${arcId}`
    );
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

  if (options.length < 2) {
    alert("請至少輸入兩個選項");
    return;
  }

  drawWheel(options);

  const slice = 360 / options.length;
  const index = Math.floor(Math.random() * options.length);

  const targetAngle = 360 - (index * slice + slice / 2);
  angle += 360 * 5 + targetAngle;

  if (soundOn) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  const wheel = document.getElementById("wheel");
  wheel.style.transform = `rotate(${angle}deg)`;

  setTimeout(() => {
    document.getElementById("result").innerText =
      "🎉 抽到：" + options[index];

    // ✨ 中獎色塊閃爍
    slicePaths[index].classList.add("highlight");
    setTimeout(() => {
      slicePaths[index].classList.remove("highlight");
    }, 1500);

    if (soundOn) {
      winSound.currentTime = 0;
      winSound.play();
    }
  }, 4000);
}
