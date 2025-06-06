
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const shootSound = document.getElementById("shootSound");
const explosionSound = document.getElementById("explosionSound");

let player, bullets, enemyBullets, enemies, enemyDir, shields;
let gameOver = false;
let gameClear = false;
let gameRunning = false;

function initShields() {
    shields = [];
    for (let i = 0; i < 3; i++) {
        shields.push({ x: 100 + i * 150, y: canvas.height - 80, width: 40, height: 20, hp: 3 });
    }
}

function initGame() {
    player = { x: canvas.width / 2 - 15, y: canvas.height - 30, width: 30, height: 10 };
    bullets = [];
    enemyBullets = [];
    enemies = [];
    enemyDir = 1;
    gameOver = false;
    gameClear = false;

    for (let i = 0; i < 6; i++) {
        enemies.push({ x: i * 80 + 30, y: 30, width: 30, height: 10, alive: true });
    }

    initShields();
}

document.addEventListener("keydown", (e) => {
    if (!gameRunning) return;
    if (e.key === "ArrowLeft") player.x -= 10;
    if (e.key === "ArrowRight") player.x += 10;
    if (e.key === " ") {
        bullets.push({ x: player.x + 12, y: player.y, width: 5, height: 10 });
        shootSound.currentTime = 0;
        shootSound.play();
    }
});

startBtn.addEventListener("click", () => {
    initGame();
    gameRunning = true;
    startBtn.style.display = "none";
});

function update() {
    if (!gameRunning || gameOver || gameClear) return;

    bullets = bullets.map(b => ({ ...b, y: b.y - 5 })).filter(b => b.y > 0);
    enemyBullets = enemyBullets.map(b => ({ ...b, y: b.y + 4 })).filter(b => b.y < canvas.height);

    let hitEdge = enemies.some(e => e.alive && (e.x <= 0 || e.x + e.width >= canvas.width));
    if (hitEdge) enemyDir *= -1;
    enemies.forEach(e => {
        if (e.alive) {
            e.x += enemyDir * 2;
            if (hitEdge) e.y += 10;
        }
    });

    enemyBullets.forEach(b => {
        // プレイヤーに当たったら
        if (b.x < player.x + player.width &&
            b.x + b.width > player.x &&
            b.y < player.y + player.height &&
            b.y + b.height > player.y) {
            gameOver = true;
            gameRunning = false;
            startBtn.style.display = "block";
        }

        // シールドに当たったら
        shields.forEach(s => {
            if (b.x < s.x + s.width &&
                b.x + b.width > s.x &&
                b.y < s.y + s.height &&
                b.y + b.height > s.y &&
                s.hp > 0) {
                s.hp--;
                b.y = canvas.height + 1;
            }
        });
    });

    bullets.forEach(b => {
        enemies.forEach(e => {
            if (e.alive &&
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y) {
                e.alive = false;
                b.y = -10;
                explosionSound.currentTime = 0;
                explosionSound.play();
            }
        });
    });

    if (Math.random() < 0.02) {
        const shootingEnemies = enemies.filter(e => e.alive);
        if (shootingEnemies.length > 0) {
            const e = shootingEnemies[Math.floor(Math.random() * shootingEnemies.length)];
            enemyBullets.push({ x: e.x + e.width / 2, y: e.y + e.height, width: 4, height: 10 });
        }
    }

    if (enemies.every(e => !e.alive)) {
        gameClear = true;
        gameRunning = false;
        startBtn.style.display = "block";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameRunning && !gameOver && !gameClear) {
        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText("Press Continue to Start", 180, 200);
        return;
    }

    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "white";
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    ctx.fillStyle = "orange";
    enemyBullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    ctx.fillStyle = "red";
    enemies.forEach(e => {
        if (e.alive) ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    ctx.fillStyle = "cyan";
    shields.forEach(s => {
        if (s.hp > 0) ctx.fillRect(s.x, s.y, s.width, s.height);
    });

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
    }

    if (gameClear) {
        ctx.fillStyle = "yellow";
        ctx.font = "30px sans-serif";
        ctx.fillText("GAME CLEAR!!", canvas.width / 2 - 120, canvas.height / 2);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();