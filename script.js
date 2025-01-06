const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Paddle properties
const paddleWidth = 75;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball properties
const ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;

// Controls
let moveLeft = false;
let moveRight = false;

// Brick properties
const brickWidth = 40; // Smaller bricks
const brickHeight = 15;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;
let bricks = [];
let currentLevel = 0;

// Score
let score = 0;

// Game State
let isPaused = false;
let isGameOver = false;
let isGameStarted = false;

// Emoji Brick Patterns (Grid Representation)
const emojiLevels = [
  // Smiley Face
  [
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
  ],

  // Pumpkin
  [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ],

  // Heart
  [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
  ],

  // Star
  [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
];

// DOM Elements
const startScreen = document.createElement("div");
startScreen.classList.add("modal", "visible");
startScreen.innerHTML = `
  <div class="modal-content">
    <h2>Brick Breaker</h2>
    <p>Form shapes, clear bricks, and win!</p>
    <button onclick="startGame()">Start Game</button>
  </div>`;
document.body.appendChild(startScreen);

const gameOverModal = document.createElement("div");
gameOverModal.classList.add("modal", "hidden");
document.body.appendChild(gameOverModal);

// Event Listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Event Handlers
function keyDownHandler(e) {
  if (e.key === "F" || e.key === "f") moveLeft = true;
  if (e.key === "J" || e.key === "j") moveRight = true;
}

function keyUpHandler(e) {
  if (e.key === "F" || e.key === "f") moveLeft = false;
  if (e.key === "J" || e.key === "j") moveRight = false;
}

// Load Bricks Based on Grid Pattern
function loadLevel(levelIndex) {
  const pattern = emojiLevels[levelIndex];
  bricks = [];
  pattern.forEach((row, rowIndex) => {
    row.forEach((brick, colIndex) => {
      if (brick === 1) {
        bricks.push({
          x: colIndex * (brickWidth + brickPadding) + brickOffsetLeft,
          y: rowIndex * (brickHeight + brickPadding) + brickOffsetTop,
          status: 1,
        });
      }
    });
  });
}

// Draw Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

// Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

// Draw Bricks
function drawBricks() {
  bricks.forEach((brick) => {
    if (brick.status === 1) {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
      ctx.fillStyle = "#ff6f61";
      ctx.fill();
      ctx.closePath();
    }
  });
}

// Collision Detection
function collisionDetection() {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (
      brick.status === 1 &&
      ballX > brick.x &&
      ballX < brick.x + brickWidth &&
      ballY > brick.y &&
      ballY < brick.y + brickHeight
    ) {
      ballDY = -ballDY;
      brick.status = 0;
      score++;
      scoreDisplay.textContent = score;

      if (bricks.every((b) => b.status === 0)) {
        currentLevel++;
        if (currentLevel < emojiLevels.length) {
          loadLevel(currentLevel);
        } else {
          winGame();
        }
      }
    }
  }
}

// Restart Game
function restartGame() {
  score = 0;
  currentLevel = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballDX = 2;
  ballDY = -2;
  isGameStarted = false;
  gameOverModal.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// Start Game
function startGame() {
  startScreen.classList.add("hidden");
  isGameStarted = true;
  loadLevel(currentLevel);
  draw();
}

// Game Over
function gameOver() {
  isGameOver = true;
  pauseGame();
  gameOverModal.innerHTML = `
    <div class="modal-content">
      <h2>Game Over</h2>
      <p>Final Score: ${score}</p>
      <button onclick="restartGame()">Restart</button>
    </div>`;
  gameOverModal.classList.remove("hidden");
}

// Win Game
function winGame() {
  pauseGame();
  gameOverModal.innerHTML = `
    <div class="modal-content">
      <h2>You Win!</h2>
      <p>Score: ${score}</p>
      <button onclick="restartGame()">Play Again</button>
    </div>`;
  gameOverModal.classList.remove("hidden");
}

// Draw Everything
function draw() {
  if (isPaused || isGameOver || !isGameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Ball Movement
  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else {
      gameOver();
    }
  }

  // Paddle Movement
  if (moveRight && paddleX < canvas.width - paddleWidth) paddleX += 5;
  if (moveLeft && paddleX > 0) paddleX -= 5;

  // Ball Position
  ballX += ballDX;
  ballY += ballDY;

  requestAnimationFrame(draw);
}

// Initialize Game
loadLevel(currentLevel);
