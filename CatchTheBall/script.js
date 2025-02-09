const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const message = document.getElementById('message');

const BALL_SIZE = 40;
const CONTAINER_SIZE = 500;

let isPlaying = false;
let animationId;
let ballX = 50;
let ballY = 50;
let velocityX = 1;
let velocityY = 1;

const SPEEDS = {
    easy: 3,
    normal: 5,
    hardcore: 8
};

function startGame() {
    if (isPlaying) return;

    isPlaying = true;
    ballX = 50;
    ballY = 50;

    const angle = Math.random() * 2 * Math.PI;
    velocityX = Math.cos(angle);
    velocityY = Math.sin(angle);

    startButton.textContent = 'Playing...';
    difficultySelect.disabled = true;
    message.classList.add('hidden');

    animateBall();
}

function animateBall() {
    const speed = SPEEDS[difficultySelect.value];

    ballX += velocityX * speed;
    ballY += velocityY * speed;

    if (ballX <= 0 || ballX >= CONTAINER_SIZE - BALL_SIZE) {
        velocityX = -velocityX;
        ballX = Math.max(0, Math.min(CONTAINER_SIZE - BALL_SIZE, ballX));
    }
    if (ballY <= 0 || ballY >= CONTAINER_SIZE - BALL_SIZE) {
        velocityY = -velocityY;
        ballY = Math.max(0, Math.min(CONTAINER_SIZE - BALL_SIZE, ballY));
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    animationId = requestAnimationFrame(animateBall);
}

function endGame(won) {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    startButton.textContent = 'Start Game';
    difficultySelect.disabled = false;
    message.textContent = won ? 'Congratulations! You won! 🎉' : 'Game Over! Try again! 🎮';
    message.classList.remove('hidden');
}

function handleClick(event) {
    if (!isPlaying) return;

    const rect = gameArea.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const ballCenterX = ballX + BALL_SIZE / 2;
    const ballCenterY = ballY + BALL_SIZE / 2;

    const distance = Math.sqrt(
        Math.pow(clickX - ballCenterX, 2) + Math.pow(clickY - ballCenterY, 2)
    );

    endGame(distance <= BALL_SIZE / 2);
}

startButton.addEventListener('click', startGame);
gameArea.addEventListener('click', handleClick);