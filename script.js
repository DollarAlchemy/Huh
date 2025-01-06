// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const themeSelector = document.getElementById('themeSelector');
const scoreDisplay = document.getElementById('score');

// Game variables
let ball = { x: 400, y: 500, radius: 10, dx: 2, dy: -2, color: '#ffffff' };
let flipperRight1 = { x: 600, y: 450, width: 60, height: 10, angle: 0, color: '#00ff00' };
let flipperRight2 = { x: 700, y: 500, width: 60, height: 10, angle: 0, color: '#00ff00' };
let recoveryPoints = [
    { x: 150, y: 400, radius: 20, color: '#00f' },
    { x: 250, y: 350, radius: 20, color: '#00f' }
];
let bumpers = [
    { x: 400, y: 300, radius: 30, color: '#ff9900', points: 50 }
];
let backgroundColor = '#000';
let score = 0;

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
    flipperRight1.color = selectedTheme.flipperColor;
    flipperRight2.color = selectedTheme.flipperColor;
    recoveryPoints.forEach(point => point.color = selectedTheme.recoveryColor);
}

// Draw the background
function drawBackground() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    ctx.translate(flipper.x + flipper.width / 2, flipper.y);
    ctx.rotate(flipper.angle * Math.PI / 180);
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

// Update ball position and handle collisions
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
    if (ball.y - ball.radius < 0) ball.dy *= -1;

    // Gutter collision
    if (ball.y + ball.radius > canvas.height) {
        alert('Game Over');
        document.location.reload();
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

// Randomize bumper positions periodically
function randomizeBumpers() {
    bumpers.forEach(bumper => {
        bumper.x = Math.random() * (canvas.width - 100) + 50;
        bumper.y = Math.random() * (canvas.height / 2) + 50;
    });
}

// Draw all elements
function draw() {
    drawBackground();
    drawBall();
    drawFlipper(flipperRight1);
    drawFlipper(flipperRight2);
    recoveryPoints.forEach(drawRecoveryPoint);
    bumpers.forEach(drawBumper);
}

// Main update loop
function update() {
    updateBall();
    draw();
    requestAnimationFrame(update);
}

// Event listeners
themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));

// Randomize bumpers every 10 seconds
setInterval(randomizeBumpers, 10000);

// Start the game with the default theme
applyTheme('classic');
update();
