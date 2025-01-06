// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const themeSelector = document.getElementById('themeSelector');
const scoreDisplay = document.getElementById('score');
const expulsionButton = document.getElementById('expulsionButton');

// Game variables
let ball = { x: 400, y: 100, radius: 10, dx: 0, dy: 0, color: '#ffffff' };
let flipperLeft = { x: 200, y: 550, width: 60, height: 10, angle: 0, color: '#00ff00' };
let flipperRight = { x: 600, y: 550, width: 60, height: 10, angle: 0, color: '#00ff00' };
let recoveryPoints = [
    { x: 150, y: 400, radius: 20, color: '#00f' },
    { x: 250, y: 350, radius: 20, color: '#00f' }
];
let bumpers = [
    { x: 300, y: 200, radius: 20, color: '#0000ff', points: 50 },
    { x: 500, y: 250, radius: 20, color: '#0000ff', points: 50 },
    { x: 400, y: 350, radius: 20, color: '#0000ff', points: 50 }
];
let backgroundColor = '#000';
let score = 0;
let startTime = Date.now(); // Start the timer
let inChamber = true; // Ball starts in the chamber

// Themes for customization
const themes = {
    classic: {
        backgroundColor: '#000',
        flipperColor: '#00ff00',
        recoveryColor: '#0000ff'
    },
    neon: {
        backgroundColor: '#101020',
        flipperColor: '#ff00ff',
        recoveryColor: '#ff00ff'
    },
    retro: {
        backgroundColor: '#2d2d00',
        flipperColor: '#ffff00',
        recoveryColor: '#ff0000'
    }
};

// Apply the selected theme
function applyTheme(theme) {
    const selectedTheme = themes[theme];
    backgroundColor = selectedTheme.backgroundColor;
    flipperLeft.color = selectedTheme.flipperColor;
    flipperRight.color = selectedTheme.flipperColor;
    recoveryPoints.forEach(point => point.color = selectedTheme.recoveryColor);
}

// Draw the background
function drawBackground() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the boundaries (with chamber and shaft)
function drawBoundaries() {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 5;

    // Outer boundary
    ctx.beginPath();
    ctx.moveTo(50, 50); // Top-left
    ctx.lineTo(750, 50); // Top-right
    ctx.lineTo(750, 550); // Bottom-right
    ctx.lineTo(50, 550); // Bottom-left
    ctx.closePath();
    ctx.stroke();

    // Chamber (top section)
    ctx.beginPath();
    ctx.moveTo(300, 50);
    ctx.lineTo(300, 150); // Left wall of chamber
    ctx.lineTo(500, 150); // Bottom of chamber
    ctx.lineTo(500, 50); // Right wall of chamber
    ctx.stroke();

    // Shaft (connects chamber to playfield)
    ctx.beginPath();
    ctx.moveTo(400, 150);
    ctx.lineTo(400, 250);
    ctx.stroke();
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Draw the flippers
function drawFlipper(flipper) {
    ctx.save();
    ctx.translate(flipper.x, flipper.y);
    ctx.rotate((flipper.angle * Math.PI) / 180);
    ctx.fillStyle = flipper.color;
    ctx.fillRect(-flipper.width / 2, -flipper.height / 2, flipper.width, flipper.height);
    ctx.restore();
}

// Draw recovery points
function drawRecoveryPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fillStyle = point.color;
    ctx.fill();
    ctx.closePath();
}

// Draw bumpers
function drawBumper(bumper) {
    ctx.beginPath();
    ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
    ctx.fillStyle = bumper.color;
    ctx.fill();
    ctx.closePath();
}

// Launch the ball from the chamber
expulsionButton.addEventListener('click', () => {
    if (inChamber) {
        ball.dx = Math.random() * 2 - 1; // Add slight randomness to horizontal direction
        ball.dy = 3; // Launch downward
        inChamber = false; // Ball leaves the chamber
        expulsionButton.style.display = 'none'; // Hide the button
    }
});

// Reset the ball to the chamber
function resetBall() {
    ball.x = 400;
    ball.y = 100;
    ball.dx = 0;
    ball.dy = 0;
    inChamber = true;
    expulsionButton.style.display = 'block'; // Show the button again
}

// Update ball position and handle collisions
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
    if (ball.y - ball.radius < 0) ball.dy *= -1;

    // Gutter collision (exit playfield)
    if (ball.y + ball.radius > canvas.height) {
        setTimeout(resetBall, 1000); // Reset the ball after a short delay
    }

    // Recovery point collisions
    recoveryPoints.forEach(point => {
        const dist = Math.sqrt((ball.x - point.x) ** 2 + (ball.y - point.y) ** 2);
        if (dist < ball.radius + point.radius) {
            ball.dy = -Math.abs(ball.dy); // Bounce upward
            updateScore(10); // Reward points
        }
    });

    // Bumper collisions
    bumpers.forEach(bumper => {
        const dist = Math.sqrt((ball.x - bumper.x) ** 2 + (ball.y - bumper.y) ** 2);
        if (dist < ball.radius + bumper.radius) {
            ball.dy *= -1; // Reflect ball
            updateScore(bumper.points); // Reward points
        }
    });
}

// Update the score
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}

// Draw the timer
function drawTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Time: ${elapsedTime}s`, 10, 30); // Display timer in the top-left corner
}

// Draw all elements
function draw() {
    drawBackground();
    drawBoundaries();
    drawBall();
    drawFlipper(flipperLeft);
    drawFlipper(flipperRight);
    recoveryPoints.forEach(drawRecoveryPoint);
    bumpers.forEach(drawBumper);
    drawTimer();
}

// Main update loop
function update() {
    updateBall();
    draw();
    requestAnimationFrame(update);
}

// Event listeners for flipper control
document.addEventListener('keydown', (event) => {
    if (event.key === 'f') flipperLeft.angle = -30; // Rotate left flipper
    if (event.key === 'j') flipperRight.angle = 30; // Rotate right flipper
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'f') flipperLeft.angle = 0;
    if (event.key === 'j') flipperRight.angle = 0;
});

// Event listener for theme changes
themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));

// Start the game with the default theme
applyTheme('classic');
update();
