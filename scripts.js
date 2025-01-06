// Update ball position
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
