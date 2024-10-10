// Elementos DOM
const playerPaddle = document.getElementById("player-paddle");
const aiPaddle = document.getElementById("ai-paddle");
const ball = document.getElementById("ball");
const playerScoreElement = document.getElementById("player-score");
const aiScoreElement = document.getElementById("ai-score");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

let playerScore = 0;
let aiScore = 0;

const gameArea = document.getElementById("game-area");
const gameHeight = gameArea.offsetHeight;
const gameWidth = gameArea.offsetWidth;

let playerPaddleY = playerPaddle.offsetTop;
let aiPaddleY = aiPaddle.offsetTop;
let ballX = ball.offsetLeft;
let ballY = ball.offsetTop;
let ballSpeedX = 4;
let ballSpeedY = 4;
let aiSpeed = 3;
let isGameOver = false;

let playerMoveUp = false;
let playerMoveDown = false;

// Actualizar el marcador
function updateScore() {
    playerScoreElement.textContent = playerScore;
    aiScoreElement.textContent = aiScore;
}

// Reiniciar juego
function resetGame() {
    playerScore = 0;
    aiScore = 0;
    updateScore();
    isGameOver = false;
    gameOverScreen.classList.add("hidden");
    resetBall();
    requestAnimationFrame(gameLoop);
}

// Reiniciar posición de la pelota
function resetBall() {
    ballX = gameWidth / 2 - ball.offsetWidth / 2;
    ballY = gameHeight / 2 - ball.offsetHeight / 2;
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Detectar colisión
function detectCollision(paddle) {
    const paddleRect = paddle.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    return !(ballRect.right < paddleRect.left ||
             ballRect.left > paddleRect.right ||
             ballRect.bottom < paddleRect.top ||
             ballRect.top > paddleRect.bottom);
}

// Lógica del juego
function gameLoop() {
    if (isGameOver) return;

    // Movimiento del jugador (teclado)
    if (playerMoveUp && playerPaddleY > 0) {
        playerPaddleY -= 6;
    }
    if (playerMoveDown && playerPaddleY + playerPaddle.offsetHeight < gameHeight) {
        playerPaddleY += 6;
    }

    // Movimiento del jugador (ratón)
    gameArea.onmousemove = function(event) {
        const mouseY = event.clientY - gameArea.offsetTop - playerPaddle.offsetHeight / 2;
        if (mouseY >= 0 && mouseY <= gameHeight - playerPaddle.offsetHeight) {
            playerPaddleY = mouseY;
        }
    };

    // Movimiento de la IA
    if (aiPaddleY + aiPaddle.offsetHeight / 2 < ballY) {
        aiPaddleY += aiSpeed;
    } else {
        aiPaddleY -= aiSpeed;
    }

    // Movimiento de la pelota
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebote de la pelota en las paredes superior e inferior
    if (ballY <= 0 || ballY + ball.offsetHeight >= gameHeight) {
        ballSpeedY = -ballSpeedY;
    }

    // Rebote de la pelota en la pala del jugador
    if (ballX <= playerPaddle.offsetLeft + playerPaddle.offsetWidth && detectCollision(playerPaddle)) {
        ballSpeedX = -ballSpeedX;
    }

    // Rebote de la pelota en la pala de la IA
    if (ballX + ball.offsetWidth >= aiPaddle.offsetLeft && detectCollision(aiPaddle)) {
        ballSpeedX = -ballSpeedX;
    }

    // Cuando la IA anota
    if (ballX <= 0) {
        aiScore++;
        updateScore();
        if (aiScore >= 10) {
            gameOver("¡Gana el Jugador 2 (IA)!");
        } else {
            resetBall();
        }
    }

    // Cuando el jugador anota
    if (ballX + ball.offsetWidth >= gameWidth) {
        playerScore++;
        updateScore();
        if (playerScore >= 10) {
            gameOver("¡Gana el Jugador 1!");
        } else {
            resetBall();
        }
    }

    // Actualizar posición de los elementos
    playerPaddle.style.top = `${playerPaddleY}px`;
    aiPaddle.style.top = `${aiPaddleY}px`;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(gameLoop);
}

// Terminar el juego
function gameOver(message) {
    isGameOver = true;
    gameOverScreen.querySelector("h1").textContent = message;
    gameOverScreen.classList.remove("hidden");
}

// Manejar los controles del teclado
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        playerMoveUp = true;
    } else if (event.key === "ArrowDown") {
        playerMoveDown = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp") {
        playerMoveUp = false;
    } else if (event.key === "ArrowDown") {
        playerMoveDown = false;
    }
});

// Botón de reinicio
restartBtn.addEventListener("click", resetGame);

// Iniciar el juego
resetGame();