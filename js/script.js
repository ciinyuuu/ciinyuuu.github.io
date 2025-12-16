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

    const x1 = size / 2 +
