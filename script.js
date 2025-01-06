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
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Score
let score = 0;

// Game State
let isPaused = false;

// Paddle and Ball colors
let paddleColor = "#ffffff";
let ballColor = "#ffffff";

// DOM Elements
const scoreDisplay = document.getElementById("scoreDisplay");
const menuButton = document.getElementById("menuButton");
const menuModal = document.getElementById("menuModal");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const paddleColorInput = document.getElementById("paddleColor");
const ballColorInput = document.getElementById("ballColor");

// Event Listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.getElementById("leftButton").addEventListener("touchstart", () => (moveLeft = true));
document.getElementById("leftButton").addEventListener("touchend", () => (moveLeft = false));
document.getElementById("rightButton").addEventListener("touchstart", () => (moveRight = true));
document.getElementById("rightButton").addEventListener("touchend", () => (moveRight = false));
menuButton.addEventListener("click", () => toggleMenu(true));
closeMenuButton.addEventListener("click", () => toggleMenu(false));
resumeButton.addEventListener("click", () => toggleMenu(false));
restartButton.addEventListener("click", restartGame);
paddleColorInput.addEventListener("change", (e) => (paddleColor = e.target.value));
ballColorInput.addEventListener("change", (e) => (ballColor = e.target.value));

// Event Handlers
function keyDownHandler(e) {
  if (e.key === "F" || e.key === "f") moveLeft = true;
  if (e.key === "J" || e.key === "j") moveRight = true;
}

function keyUpHandler(e) {
  if (e.key === "F" || e.key === "f") moveLeft = false;
  if (e.key === "J" || e.key === "j") moveRight = false;
}

// Pause and Resume Game
function pauseGame() {
  isPaused = true;
}

function resumeGame() {
  isPaused = false;
  draw(); // Restart game loop
}

// Restart Game
function restartGame() {
  document.location.reload();
}

// Toggle Menu
function toggleMenu(show) {
  if (show) {
    menuModal.classList.remove("hidden");
    menuModal.classList.add("visible");
    pauseGame();
  } else {
    menuModal.classList.remove("visible");
    menuModal.classList.add("hidden");
    resumeGame();
  }
}

// Draw Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

// Draw Bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        b.x = brickX;
        b.y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff6f61";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Collision Detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          ballDY = -ballDY;
          b.status = 0;
          score++;
          scoreDisplay.textContent = score;

          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Draw Everything
function draw() {
  if (isPaused) return;

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
      alert("GAME OVER");
      document.location.reload();
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

// Start Game Loop
draw();
