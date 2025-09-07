// ---------------- CURTAIN ----------------
window.addEventListener("DOMContentLoaded", () => {
  const curtain = document.getElementById("curtain");
  const quote = document.getElementById("quote-section");
  const banner = document.getElementById("banner-section");
  const nextBtn = document.getElementById("next-btn");

  // Wait for tap to open curtain
  curtain.addEventListener("click", () => {
    curtain.classList.add("open");
    setTimeout(() => {
      curtain.style.display = "none";
      quote.style.display = "flex";
    }, 2000);
  });

  // After quote -> banner
  nextBtn.addEventListener("click", () => {
    quote.style.display = "none";
    banner.style.display = "block";
  });
});

// ---------------- GAME LOGIC ----------------
document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-btn");
  const shuffleBtn = document.getElementById("shuffle-btn");
  const puzzle = document.getElementById("puzzle");
  const bannerSection = document.getElementById("banner-section");
  const gameSection = document.getElementById("game-section");
  const backBtn = document.getElementById("back-btn");
  const timerDisplay = document.getElementById("timer");
  const timeUpPopup = document.getElementById("timeup-popup");
  const winMsg = document.getElementById("win-message");

  let timer = null;
  let totalSeconds = 120; // 2 minutes

  function startTimer() {
    totalSeconds = 120;
    if (timer) clearInterval(timer);
    timerDisplay.style.display = "block";
    timeUpPopup.style.display = "none";

    timer = setInterval(() => {
      totalSeconds--;
      const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const sec = String(totalSeconds % 60).padStart(2, "0");
      timerDisplay.textContent = `${min}:${sec}`;

      if (totalSeconds <= 0) {
        clearInterval(timer);
        timeUpPopup.style.display = "block";
        setTimeout(() => { timeUpPopup.style.display = "none"; }, 5000);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
  }

  // Start game
  playBtn.addEventListener("click", () => {
    bannerSection.style.display = "none";
    gameSection.style.display = "block";
    startTimer();
  });

  // Back button
  backBtn.addEventListener("click", () => {
    gameSection.style.display = "none";
    bannerSection.style.display = "block";
    stopTimer();
  });

  // ---------------- PUZZLE ----------------
  let tiles = [];
  let emptyIndex = 8;
  let currentImage = "";

  function createPuzzle(imgSrc) {
    puzzle.innerHTML = "";
    tiles = [];
    currentImage = imgSrc;
    emptyIndex = 8;
    winMsg.style.display = "none";

    for (let i = 0; i < 9; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.correctIndex = String(i);

      if (i !== 8) {
        tile.style.backgroundImage = `url(${imgSrc})`;
        tile.style.backgroundPosition =
          `${-(i % 3) * 120}px ${-Math.floor(i / 3) * 120}px`;

        tile.addEventListener("click", () => {
          const idx = tiles.indexOf(tile);
          moveTile(idx);
        });
      } else {
        tile.classList.add("empty");
      }

      tiles.push(tile);
      puzzle.appendChild(tile);
    }
  }

  function getNeighbors(empty) {
    const neighbors = [];
    const row = Math.floor(empty / 3);
    const col = empty % 3;
    if (col > 0) neighbors.push(empty - 1);
    if (col < 2) neighbors.push(empty + 1);
    if (row > 0) neighbors.push(empty - 3);
    if (row < 2) neighbors.push(empty + 3);
    return neighbors;
  }

  function moveTile(index) {
    if (index === emptyIndex) return;
    const neighbors = getNeighbors(emptyIndex);
    if (!neighbors.includes(index)) return;

    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    emptyIndex = index;

    puzzle.innerHTML = "";
    tiles.forEach(t => puzzle.appendChild(t));

    checkSolved();
  }

  function checkSolved() {
    for (let i = 0; i < 9; i++) {
      if (parseInt(tiles[i].dataset.correctIndex || "-1", 10) !== i) return;
    }
    if (emptyIndex !== 8) return;

    puzzle.classList.add("solved");
    puzzle.innerHTML = "";
    puzzle.style.backgroundImage = `url(${currentImage})`;
    puzzle.style.backgroundSize = "360px 360px";
    puzzle.style.backgroundPosition = "center";

    stopTimer();
    winMsg.style.display = "block";
  }

  shuffleBtn.addEventListener("click", () => {
    for (let i = 0; i < 20; i++) {
      const neighbors = getNeighbors(emptyIndex);
      const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
      [tiles[rand], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[rand]];
      emptyIndex = rand;
    }
    puzzle.innerHTML = "";
    tiles.forEach(t => puzzle.appendChild(t));
    startTimer();
  });

  document.querySelectorAll(".teacher-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-img");
      if (src) createPuzzle(src);
    });
  });

  const firstBtn = document.querySelector(".teacher-btn[data-img]");
  if (firstBtn) createPuzzle(firstBtn.getAttribute("data-img"));
});
