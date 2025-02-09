//Elements
const colors = ['#808080', '#ff0000', '#ffff00', '#0000ff'];
const gameBox = document.getElementById('gameBox');
const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timer');
const resultPopup = document.getElementById('resultPopup');
const resultText = document.getElementById('resultText');
//Globals
let timeLeft;
let timerInterval;
let currentBalls = [];
let gameActive = false;
const duration = 5000;
let startTime = 0;

function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues) return rgb;
    return '#' + rgbValues.map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function generateBalls() {
    gameBox.innerHTML = '';
    currentBalls = [];

    const winnerColor = colors[Math.floor(Math.random() * colors.length)];

    const counts = {};
    colors.forEach(color => {
        if (color !== winnerColor) {
            counts[color] = Math.floor(Math.random() * 3) + 1;
        }
    });

    let maxNonWinnerCount = 0;
    for (let color in counts) {
        if (counts[color] > maxNonWinnerCount) {
            maxNonWinnerCount = counts[color];
        }
    }

    const winnerCount = maxNonWinnerCount + Math.floor(Math.random() * 3) + 1;

    let ballColors = [];
    colors.forEach(color => {
        if (color === winnerColor) {
            for (let i = 0; i < winnerCount; i++) {
                ballColors.push(color);
            }
        } else {
            for (let i = 0; i < counts[color]; i++) {
                ballColors.push(color);
            }
        }
    });

    ballColors.sort(() => Math.random() - 0.5);
    currentBalls = ballColors.slice();

    ballColors.forEach(color => {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = color;
        ball.style.position = 'absolute';
        const ballSize = 40;
        const boxWidth = gameBox.clientWidth;
        const boxHeight = gameBox.clientHeight;
        const left = Math.random() * (boxWidth - ballSize);
        const top = Math.random() * (boxHeight - ballSize);
        ball.style.left = left + 'px';
        ball.style.top = top + 'px';
        gameBox.appendChild(ball);
    });
}

function getMostFrequentColor() {
    const colorCount = {};
    let maxCount = 0;
    let mostFrequent = null;
    currentBalls.forEach(color => {
        colorCount[color] = (colorCount[color] || 0) + 1;
        if (colorCount[color] > maxCount) {
            maxCount = colorCount[color];
            mostFrequent = color;
        }
    });
    return mostFrequent;
}

function startTimer() {
    startTime = Date.now();
    timeLeft = duration;
    updateTimer();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeLeft = duration - elapsed;
        if (timeLeft <= 0) {
            timeLeft = 0;
            updateTimer();
            clearInterval(timerInterval);
            showResult("Time's up!");
            gameActive = false;
        } else {
            updateTimer();
        }
    }, 50);
}

function updateTimer() {
    const seconds = Math.floor(timeLeft / 1000);
    const ms = timeLeft % 1000;
    timerDisplay.textContent = `${seconds}.${ms.toString().padStart(3, '0')}`;
}

function showResult(message) {
    resultText.textContent = message;
    resultPopup.style.display = 'block';
    clearInterval(timerInterval);
    gameActive = false;
}

function closePopup() {
    resultPopup.style.display = 'none';
    gameBox.innerHTML = '';
    timerDisplay.textContent = '';
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        generateBalls();
        startTimer();
    }
}

startBtn.addEventListener('click', startGame);

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        if (gameActive && timeLeft > 0) {
            const selectedColor = rgbToHex(window.getComputedStyle(button).backgroundColor).toLowerCase();
            const correctColor = getMostFrequentColor().toLowerCase();
            if (selectedColor === correctColor) {
                showResult('Congratulations! You won!');
            } else {
                showResult('Wrong choice! Try again!');
            }
        }
    });
});
