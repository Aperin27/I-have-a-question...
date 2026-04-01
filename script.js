const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const narrator = document.getElementById("narrator");
const scoreDisplay = document.getElementById("score");
const playZone = document.getElementById("play-zone");
const TOTAL_RED_HEARTS = 75;
const TOTAL_PINK_HEARTS = 5;
const MAX_SCORE = 100;
const WIN_SCORE = 95;

let heartsSpawned = 0; 
let score = 0;

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    gameArea.classList.remove("hidden");

    narrator.textContent = "Focus... this is important.";

    startGame();
});

function startGame() {
    gameInterval=setInterval(spawnHeart, 800); // new heart every 0.8s
}

function spawnHeart() {
    if (heartsSpawned >= TOTAL_RED_HEARTS + TOTAL_PINK_HEARTS) return;

    const heart = document.createElement("div");

    // Decide red or pink
    let isPink = false;
    if (heartsSpawned >= TOTAL_RED_HEARTS) {
        isPink = true;
        heart.textContent = "💖"; // pink heart emoji
        heart.speed = 6; // 2x speed
        heart.points = 5;
    } else {
        heart.textContent = "❤️"; // red heart emoji
        heart.speed = 3;
        heart.points = 1;
    }

    heart.classList.add("heart");
    heart.style.left = Math.random() * 90 + "%";
    heart.style.top = "0px";

    playZone.appendChild(heart);
    heartsSpawned++;

    let position = 0;

    const fall = setInterval(() => {
        position += heart.speed;
        heart.style.top = position + "px";

        if (position > playZone.offsetHeight - 20) {
            heart.remove();
            clearInterval(fall);
        }
    }, 30);

    heart.addEventListener("click", () => handleHeartClick(heart, fall));
    heart.addEventListener("touchstart", () => handleHeartClick(heart, fall));
}

function handleHeartClick(heart, fallInterval) {
    score += heart.points;
    scoreDisplay.textContent = "Score: " + score;
    heart.remove();
    clearInterval(fallInterval);

    updateNarrator(score);
    checkWin();
}

function handleHeartClick(heart, fallInterval) {
    score += heart.points;
    scoreDisplay.textContent = "Score: " + score;
    heart.remove();
    clearInterval(fallInterval);

    updateNarrator(score);
    checkWin();
}

function updateNarrator(score) {
    if (score < 10) {
        narrator.textContent = "Focus… this is important.";
    } else if (score < 30) {
        narrator.textContent = "Not bad… keep going!";
    } else if (score < 60) {
        narrator.textContent = "Wow, you’re really good at this!";
    } else if (score < 90) {
        narrator.textContent = "Almost there… I believe in you 😏";
    } else {
        narrator.textContent = "You’re crushing it… just a bit more!";
    }
}

function checkWin() {
    if (score >= WIN_SCORE && heartsSpawned >= TOTAL_RED_HEARTS + TOTAL_PINK_HEARTS) {
        narrator.textContent = "You did it! 🎉";

        // Stop spawning hearts (optional)
        clearInterval(gameInterval);

        // Show final reveal after a pause
        setTimeout(showFinalQuestion, 1000);
    }
}

function showFinalQuestion() {
    playZone.innerHTML = "";
    narrator.textContent = "Okay… the moment has come 😏";
    
    const question = document.createElement("h2");
    question.textContent = "Will you be my April Fool? ❤️";
    playZone.appendChild(question);

    const yesBtn = document.createElement("button");
    yesBtn.textContent = "Yes!";
    yesBtn.addEventListener("click", () => {
        question.textContent = "Yay! You’re stuck with me now 😌🎉";
        // Confetti / slide show can go here next
    });
    playZone.appendChild(yesBtn);

    const noBtn = document.createElement("button");
    noBtn.textContent = "No…";
    noBtn.addEventListener("click", () => {
        noBtn.style.display = "none";
        question.textContent = "Hmm… that option is currently unavailable 😏";
    });
    playZone.appendChild(noBtn);
}