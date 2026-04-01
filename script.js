const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const narrator = document.getElementById("narrator");
const scoreDisplay = document.getElementById("score");
const playZone = document.getElementById("play-zone");
const TOTAL_RED_HEARTS = 75;
const TOTAL_PINK_HEARTS = 5;
const MAX_SCORE = 100;
const WIN_SCORE = 95;
const missAudio = document.getElementById("miss-sound");

let heartsSpawned = 0; 
let score = 0;
let activeHearts = 0; 
let gameInterval;



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

    const pinkPositions = [16, 32, 48, 64, 80]; 
    let isPink = pinkPositions.includes(heartsSpawned + 1); 
    
    if (isPink) {
        heart.textContent = "💖";
        heart.speed = 13; // 2x speed
        heart.points = 5;
        heart.classList.add("pink-heart");
    } else {
        heart.textContent = "❤️";
        heart.speed = 9;
        heart.points = 1;
    }

    heart.classList.add("heart");
    heart.style.left = Math.random() * 90 + "%";
    heart.style.top = "0px";

    playZone.appendChild(heart);
    heartsSpawned++;
    activeHearts++; 

    let position = 0;

    const fall = setInterval(() => {
        position += heart.speed;
        heart.style.top = position + "px";

        if (position > playZone.offsetHeight - 20) {
            heart.remove();
            clearInterval(fall);

            activeHearts--;  // heart is done falling
            if (heartsSpawned >= TOTAL_RED_HEARTS + TOTAL_PINK_HEARTS && activeHearts === 0) {
                checkLose();
            }

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

    activeHearts--;  
    if (heartsSpawned >= TOTAL_RED_HEARTS + TOTAL_PINK_HEARTS && activeHearts === 0) {
        checkLose();
    }

    updateNarrator(score);
    checkWin();
}


function updateNarrator(score) {
    if (score < 10) {
        narrator.textContent = "Click all the hearts";
    } else if (score < 30) {
        narrator.textContent = "Keep going";
    } else if (score < 50) {
        narrator.textContent = "I said ADVANCE GOD DAMMIT";
    } else if (score < 90) {
        narrator.textContent = "Past half way";
    } else {
        narrator.textContent = "Almost there...";
    }
}

function playMissSound() {
    missAudio.currentTime = 0; 
    missAudio.play();

    setTimeout(() => {
        missAudio.pause();     
        missAudio.currentTime = 0; 
    }, 2000); 
}

function checkWin() {
    if (score >= WIN_SCORE && heartsSpawned >= TOTAL_RED_HEARTS + TOTAL_PINK_HEARTS) {
        narrator.textContent = "FUCK YEAH! 🎉";

        // Stop spawning hearts (optional)
        clearInterval(gameInterval);

        // Show final reveal after a pause
        setTimeout(showFinalQuestion, 1000);
    }
}

function checkLose() {
    if (score < WIN_SCORE) {
        narrator.textContent = "WOMP WOMP, do it again";
        playMissSound();
        playZone.innerHTML = "";

        const message = document.createElement("h2");
        message.textContent = "Better luck next time!";
        playZone.appendChild(message);

        const playAgainBtn = document.createElement("button");
        playAgainBtn.textContent = "Redemption";
        playAgainBtn.addEventListener("click", () => {
            clearInterval(gameInterval);

            heartsSpawned = 0;
            score = 0;
            activeHearts = 0;
            scoreDisplay.textContent = "Score: 0";
            playZone.innerHTML = "";
            narrator.textContent = "Click all the hearts";

            startGame();
        });
        playZone.appendChild(playAgainBtn);
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
    yesBtn.classList.add("final-btn");
    yesBtn.addEventListener("click", () => {
            question.textContent = "YIPPIIEEEEEE😌🎉";
            yesBtn.style.display = "none";
        noBtn.style.display = "none";

        // Slideshow images
        const images = [
            "photo1.jpeg",
            "photo2.jpeg",
            "photo3.jpeg",
            "photo4.jpeg",
            "photo5.jpeg",
            "photo6.jpeg",
            "photo7.jpeg",
            "photo8.jpeg",
            "photo9.jpeg",
            "photo10.jpeg",
            "photo11.jpeg",
            "photo12.jpeg",
            "photo13.jpeg",
            "photo14.jpeg",
            "photo15.jpeg"
        ];
        playZone.classList.add("slideshow-mode");

        let index = 0;

        const bgElement = document.createElement("img");
        bgElement.classList.add("slideshow-bg");
        bgElement.src = images[index];

        const imgElement = document.createElement("img");
        imgElement.classList.add("slideshow-image");
        imgElement.src = images[index];

        playZone.appendChild(bgElement);
        playZone.appendChild(imgElement);

        setInterval(() => {
            index = (index + 1) % images.length;
            bgElement.src = images[index];
            imgElement.src = images[index];
        }, 2000);
    });
    playZone.appendChild(yesBtn);

    const noBtn = document.createElement("button");
    noBtn.textContent = "No…";
    noBtn.classList.add("final-btn");
    noBtn.addEventListener("click", () => {
        noBtn.style.display = "none";
        question.textContent = "Hmm… that option is currently unavailable 😏";
    });
    playZone.appendChild(noBtn);
}