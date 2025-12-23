let angle = 0;
let soundOn = true;
let slicePaths = [];
let usedIndices = [];

const optionsArea = document.getElementById("options");
const spinBtn = document.getElementById("spinBtn");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

// 初始化繪製
window.onload = () => {
    const initOptions = optionsArea.value.trim().split("\n").filter(x => x !== "");
    if (initOptions.length > 0) drawWheel(initOptions);
};

// 監聽輸入框，內容改變就重畫轉盤
optionsArea.addEventListener("input", () => {
    usedIndices = [];
    const currentOptions = optionsArea.value.trim().split("\n").filter(x => x !== "");
    if (currentOptions.length > 0) drawWheel(currentOptions);
});

function toggleSound() {
    soundOn = !soundOn;
    document.getElementById("soundBtn").innerText = soundOn ? "🔊 音效：開" : "🔇 音效：關";
}

function drawWheel(options) {
    const wheel = document.getElementById("wheel");
    wheel.innerHTML = "";
    slicePaths = [];

    const colors = ["#fde2e4", "#f8cdda", "#fbcfe8", "#f3e8ff", "#e0ecff"];
    const size = 320;
    const radius = 140;
    const slice = 360 / options.length;

    // 背景色塊
    let gradient = "conic-gradient(";
    options.forEach((_, i) => {
        gradient += `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg,`;
    });
    wheel.style.background = gradient.slice(0, -1) + ")";

    // SVG 文字
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

        const arcId = `arc-${i}`;
        const textPathArc = document.createElementNS(svgNS, "path");
        textPathArc.setAttribute("id", arcId);
        textPathArc.setAttribute("d", `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`);
        textPathArc.setAttribute("fill", "none");
        svg.appendChild(textPathArc);

        const textEl = document.createElementNS(svgNS, "text");
        textEl.setAttribute("class", "slice-text");
        const textPath = document.createElementNS(svgNS, "textPath");
        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${arcId}`);
        textPath.setAttribute("startOffset", "50%");
        textPath.setAttribute("text-anchor", "middle");
        textPath.textContent = text;

        textEl.appendChild(textPath);
        svg.appendChild(textEl);
    });
    wheel.appendChild(svg);
}

function spin() {
    const input = optionsArea.value.trim();
    const options = input.split("\n").filter(x => x !== "");
    const mode = document.getElementById("mode").value;

    if (options.length < 1) {
        alert("請至少輸入一個選項");
        return;
    }

    let availableIndices = [];
    options.forEach((_, i) => {
        const isOdd = (i + 1) % 2 !== 0;
        if (mode === "all" || (mode === "noRepeat" && !usedIndices.includes(i)) || 
            (mode === "odd" && isOdd) || (mode === "even" && !isOdd)) {
            availableIndices.push(i);
        }
    });

    if (availableIndices.length === 0) {
        alert("符合條件的選項已抽完！");
        return;
    }

    // 禁用按鈕防止重複點擊
    spinBtn.disabled = true;

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const index = availableIndices[randomIndex];
    if (mode === "noRepeat") usedIndices.push(index);

    // 音效處理：循環播放 4 秒
    if (soundOn) {
        spinSound.currentTime = 0;
        spinSound.loop = true;
        spinSound.play();
    }

    const slice = 360 / options.length;
    const targetRelativeAngle = 360 - (index * slice + slice / 2);
    const rounds = Math.ceil(angle / 360) + 5; 
    angle = rounds * 360 + targetRelativeAngle;

    const wheel = document.getElementById("wheel");
    wheel.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    wheel.style.transform = `rotate(${angle}deg)`;
    document.getElementById("result").innerText = "⏳ 抽獎中...";

    // 4 秒後結束
    setTimeout(() => {
        if (soundOn) {
            spinSound.pause();
            spinSound.currentTime = 0;
            winSound.currentTime = 0;
            winSound.play();
        }

        const resultText = options[index];
        document.getElementById("result").innerText = "🎉 抽到：" + resultText;
        if (slicePaths[index]) slicePaths[index].classList.add("highlight");

        // 處理不重複模式的刪除邏輯
        if (mode === "noRepeat") {
            setTimeout(() => {
                options.splice(index, 1);
                optionsArea.value = options.join("\n");
                usedIndices = [];

                // 偷偷重置角度
                wheel.style.transition = "none";
                angle = 0;
                wheel.style.transform = "rotate(0deg)";
                
                if (options.length > 0) {
                    drawWheel(options);
                    setTimeout(() => {
                        wheel.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
                    }, 50);
                } else {
                    wheel.innerHTML = "<div style='padding-top:140px; color:#999'>名單已空</div>";
                    wheel.style.background = "#eee";
                }
                spinBtn.disabled = false;
            }, 1500);
        } else {
            setTimeout(() => {
                if (slicePaths[index]) slicePaths[index].classList.remove("highlight");
                spinBtn.disabled = false;
            }, 1500);
        }
    }, 4000);
}
