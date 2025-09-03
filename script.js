let timer;
let timeLeft = 25 * 60; // default 25 menit
let isRunning = false;
let totalTime = timeLeft;
let hasFinished = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const customInput = document.getElementById("custom-minutes");
const setCustomBtn = document.getElementById("set-custom-time");
const progressBar = document.getElementById("progress-bar");
const alarmSound = document.getElementById("alarm-sound"); // ambil dari HTML

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Hitung progress
  let progress = (timeLeft / totalTime) * 100;
  progressBar.style.width = progress + "%";

  // Ubah warna sesuai sisa waktu
  if (progress >= 60) {
    progressBar.style.background = "#08CB00"; // hijau
    progressBar.classList.remove("blink");
  } else if (progress >= 30) {
    progressBar.style.background = "#feca57"; // kuning
    progressBar.classList.remove("blink");
  } else if (progress >= 10) {
    progressBar.style.background = "#ff6b6b"; // merah
    progressBar.classList.remove("blink");
  } else {
    progressBar.style.background = "#ff4757"; // merah gelap
    progressBar.classList.add("blink"); // aktifkan kedip
  }
}

function startTimer() {
  if (!isRunning && timeLeft > 0) {
    isRunning = true;
    hasFinished = false;

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        handleFinish();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  totalTime = timeLeft;
  hasFinished = false;
  updateDisplay();

  // stop alarm saat reset ditekan
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

function handleFinish() {
  if (hasFinished) return;
  hasFinished = true;

  clearInterval(timer);
  isRunning = false;
  timeLeft = 0;
  updateDisplay();

  // mainkan alarm looping
  alarmSound.play().catch((err) => {
    console.log("Audio tidak bisa diputar:", err);
  });

  // hanya alert, tidak stop alarm
  setTimeout(() => {
    alert("Waktu Habis! Saatnya istirahat 🎉");
  }, 100);
}

// --- event listener ---
startBtn.addEventListener("click", () => {
  // trick: “izin” audio agar bisa diputar di browser
  alarmSound
    .play()
    .then(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    })
    .catch((err) => console.log("Audio preload gagal:", err));

  startTimer();
});

pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

setCustomBtn.addEventListener("click", () => {
  let minutes = parseInt(customInput.value);
  if (!isNaN(minutes) && minutes > 0) {
    clearInterval(timer);
    isRunning = false;
    timeLeft = minutes * 60;
    totalTime = timeLeft;
    updateDisplay();
  } else {
    alert("Masukkan angka menit yang valid!");
  }
});

updateDisplay();
