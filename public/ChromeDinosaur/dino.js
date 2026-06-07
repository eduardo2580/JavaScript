// ─── Canvas setup ───────────────────────────────────────────────────────────
const board = document.getElementById("board");
const ctx = board.getContext("2d");

const BOARD_W = 750;
const BOARD_H = 300;
board.width  = BOARD_W;
board.height = BOARD_H;

const GROUND_Y = BOARD_H - 50; // y of ground surface

// ─── Sprite dimensions (exact pixel sizes from image files) ─────────────────
const DINO_W = 88,  DINO_H = 94;
const DUCK_W = 118, DUCK_H = 60;
const BIRD_W = 97,  BIRD_H = 68;
const CLOUD_W = 84, CLOUD_H = 101;
const TRACK_W = 2404, TRACK_H = 28;
const GAMEOVER_W = 386, GAMEOVER_H = 40;
const RESET_W = 76,  RESET_H = 68;

const CACTUS_SIZES = {
    "cactus1":     { w: 30,  h: 50  },
    "cactus2":     { w: 32,  h: 52  },
    "cactus3":     { w: 34, h: 54  },
    "big-cactus1": { w: 50,  h: 80 },
    "big-cactus2": { w: 52, h: 82 },
    "big-cactus3": { w: 54, h: 84 },
};

// ─── Image loading ───────────────────────────────────────────────────────────
const imgs = {};
const imgSrcs = [
    "dino", "dino-run1", "dino-run2", "dino-jump", "dino-dead",
    "dino-duck1", "dino-duck2",
    "bird1", "bird2",
    "cactus1", "cactus2", "cactus3",
    "big-cactus1", "big-cactus2", "big-cactus3",
    "cloud", "track", "game-over", "reset"
];

let loadedCount = 0;
imgSrcs.forEach(name => {
    const img = new Image();
    img.src = `./img/${name}.png`;
    img.onload = () => { loadedCount++; if (loadedCount === imgSrcs.length) init(); };
    imgs[name] = img;
});

// ─── Game state ──────────────────────────────────────────────────────────────
let state = "idle";  // idle | running | dead
let score = 0;
let hiScore = 0;
let speed = 6;
let frameCount = 0;
let animId;

// Dino
const dinoX = 65;
let dino = {};
function resetDino() {
    dino = {
        x: dinoX,
        y: GROUND_Y - DINO_H,
        w: DINO_W, h: DINO_H,
        vy: 0,
        onGround: true,
        ducking: false,
        animFrame: 0,
        animTimer: 0,
    };
}

// Track (ground scrolling)
let trackX1 = 0;
let trackX2 = TRACK_W;

// Clouds
let clouds = [];
let cloudTimer = 0;

// Obstacles
let obstacles = [];
let obstacleTimer = 0;
let nextObstacleIn = 90;

// Score display elements
const curScoreEl = document.getElementById("cur-score");
const hiScoreEl  = document.getElementById("hi-score");

function fmtScore(n) { return String(Math.floor(n)).padStart(5, "0"); }

// ─── Init / Reset ────────────────────────────────────────────────────────────
function init() {
    resetDino();
    drawIdle();
}

function startGame() {
    state = "running";
    score = 0;
    speed = 6;
    frameCount = 0;
    obstacles = [];
    clouds = [];
    cloudTimer = 0;
    obstacleTimer = 0;
    nextObstacleIn = 90;
    trackX1 = 0;
    trackX2 = TRACK_W;
    resetDino();
    if (animId) cancelAnimationFrame(animId);
    loop();
}

// ─── Input ───────────────────────────────────────────────────────────────────
function onJump() {
    if (state === "idle")    { startGame(); return; }
    if (state === "dead")    { startGame(); return; }
    if (dino.onGround && !dino.ducking) {
        dino.vy = -16;
        dino.onGround = false;
    }
}

function onDuckStart() {
    if (state !== "running") return;
    dino.ducking = true;
    if (!dino.onGround) dino.vy += 5; // fast drop
}

function onDuckEnd() {
    dino.ducking = false;
}

// Keyboard
document.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code === "ArrowUp")  { e.preventDefault(); onJump(); }
    if (e.code === "ArrowDown")                       { e.preventDefault(); onDuckStart(); }
});
document.addEventListener("keyup", e => {
    if (e.code === "ArrowDown") onDuckEnd();
});

// Touch / click
let touchStartY = 0;
board.addEventListener("touchstart", e => {
    e.preventDefault();
    touchStartY = e.touches[0].clientY;
    onJump();
}, { passive: false });
board.addEventListener("touchmove", e => {
    e.preventDefault();
    if (e.touches[0].clientY - touchStartY > 30) onDuckStart();
}, { passive: false });
board.addEventListener("touchend", e => {
    e.preventDefault();
    onDuckEnd();
}, { passive: false });
board.addEventListener("click", () => onJump());

// ─── Spawning ────────────────────────────────────────────────────────────────
function spawnCloud() {
    const y = 20 + Math.random() * 60;
    clouds.push({ x: BOARD_W + CLOUD_W, y });
}

const cactusTypes = ["cactus1", "cactus2", "cactus3", "big-cactus1", "big-cactus2", "big-cactus3"];
const birdHeights = [GROUND_Y - 100, GROUND_Y - 60, GROUND_Y - 30]; // high / mid / low

function spawnObstacle() {
    // Birds appear after score 300
    const canBird = score > 300 && Math.random() < 0.35;
    if (canBird) {
        const bh = birdHeights[Math.floor(Math.random() * birdHeights.length)];
        obstacles.push({
            kind: "bird",
            x: BOARD_W + BIRD_W,
            y: bh,
            w: BIRD_W, h: BIRD_H,
            animFrame: 0, animTimer: 0,
        });
    } else {
        const type = cactusTypes[Math.floor(Math.random() * cactusTypes.length)];
        const { w, h } = CACTUS_SIZES[type];
        obstacles.push({
            kind: "cactus",
            type,
            x: BOARD_W + w,
            y: GROUND_Y - h,
            w, h,
        });
    }
}

// ─── Physics / Update ────────────────────────────────────────────────────────
const GRAVITY = 0.9;

function update() {
    frameCount++;
    score += 0.1;
    speed = Math.min(6 + score * 0.005, 16);

    curScoreEl.textContent = fmtScore(score);
    // Flash effect every 100 points
    if (Math.floor(score) % 100 === 0 && Math.floor(score) !== 0 && frameCount % 6 < 3) {
        curScoreEl.style.visibility = "hidden";
    } else {
        curScoreEl.style.visibility = "visible";
    }

    // ── Dino physics ──
    dino.vy += GRAVITY;
    dino.y  += dino.vy;
    const groundY = GROUND_Y - (dino.ducking ? DUCK_H : DINO_H);
    if (dino.y >= groundY) {
        dino.y = groundY;
        dino.vy = 0;
        dino.onGround = true;
    } else {
        dino.onGround = false;
    }

    // Animate dino legs
    dino.animTimer++;
    const animInterval = Math.max(3, Math.floor(8 - speed * 0.3));
    if (dino.animTimer >= animInterval) {
        dino.animFrame = (dino.animFrame + 1) % 2;
        dino.animTimer = 0;
    }

    // ── Track ──
    trackX1 -= speed;
    trackX2 -= speed;
    if (trackX1 + TRACK_W <= 0) trackX1 = trackX2 + TRACK_W;
    if (trackX2 + TRACK_W <= 0) trackX2 = trackX1 + TRACK_W;

    // ── Clouds ──
    cloudTimer++;
    if (cloudTimer >= 100 - speed * 2) {
        spawnCloud();
        cloudTimer = 0;
    }
    clouds.forEach(c => c.x -= speed * 0.35);
    clouds = clouds.filter(c => c.x > -CLOUD_W - 10);

    // ── Obstacles ──
    obstacleTimer++;
    if (obstacleTimer >= nextObstacleIn) {
        spawnObstacle();
        obstacleTimer = 0;
        nextObstacleIn = Math.max(40, 80 + Math.random() * 80 - speed * 3);
    }
    obstacles.forEach(o => {
        o.x -= speed;
        if (o.kind === "bird") {
            o.animTimer++;
            if (o.animTimer >= 8) { o.animFrame = (o.animFrame + 1) % 2; o.animTimer = 0; }
        }
    });
    obstacles = obstacles.filter(o => o.x > -200);

    // ── Collision detection ──
    const hitboxShrink = 8;
    const dw = dino.ducking ? DUCK_W : DINO_W;
    const dh = dino.ducking ? DUCK_H : DINO_H;
    const dhit = {
        x: dino.x + hitboxShrink,
        y: dino.y + hitboxShrink,
        w: dw - hitboxShrink * 2,
        h: dh - hitboxShrink * 2,
    };

    for (const o of obstacles) {
        const ohit = {
            x: o.x + hitboxShrink,
            y: o.y + hitboxShrink,
            w: o.w - hitboxShrink * 2,
            h: o.h - hitboxShrink * 2,
        };
        if (
            dhit.x < ohit.x + ohit.w &&
            dhit.x + dhit.w > ohit.x &&
            dhit.y < ohit.y + ohit.h &&
            dhit.y + dhit.h > ohit.y
        ) {
            triggerGameOver();
            return;
        }
    }
}

function triggerGameOver() {
    state = "dead";
    if (score > hiScore) {
        hiScore = score;
        hiScoreEl.textContent = "HI " + fmtScore(hiScore);
    }
}

// ─── Drawing ─────────────────────────────────────────────────────────────────
function drawScene() {
    ctx.clearRect(0, 0, BOARD_W, BOARD_H);

    // Clouds
    clouds.forEach(c => {
        ctx.drawImage(imgs["cloud"], c.x, c.y, CLOUD_W, CLOUD_H);
    });

    // Track (ground texture)
    ctx.drawImage(imgs["track"], trackX1, GROUND_Y, TRACK_W, TRACK_H);
    ctx.drawImage(imgs["track"], trackX2, GROUND_Y, TRACK_W, TRACK_H);

    // Obstacles
    obstacles.forEach(o => {
        if (o.kind === "cactus") {
            ctx.drawImage(imgs[o.type], o.x, o.y, o.w, o.h);
        } else {
            const birdImg = o.animFrame === 0 ? imgs["bird1"] : imgs["bird2"];
            ctx.drawImage(birdImg, o.x, o.y, BIRD_W, BIRD_H);
        }
    });

    // Dino
    let dinoImg;
    if (state === "dead") {
        dinoImg = imgs["dino-dead"];
        ctx.drawImage(dinoImg, dino.x, dino.y, DINO_W, DINO_H);
    } else if (dino.ducking) {
        dinoImg = dino.animFrame === 0 ? imgs["dino-duck1"] : imgs["dino-duck2"];
        ctx.drawImage(dinoImg, dino.x, dino.y, DUCK_W, DUCK_H);
    } else if (!dino.onGround) {
        ctx.drawImage(imgs["dino-jump"], dino.x, dino.y, DINO_W, DINO_H);
    } else {
        dinoImg = dino.animFrame === 0 ? imgs["dino-run1"] : imgs["dino-run2"];
        ctx.drawImage(dinoImg, dino.x, dino.y, DINO_W, DINO_H);
    }

    // Game over overlay
    if (state === "dead") {
        const goX = (BOARD_W - GAMEOVER_W) / 2;
        const goY = BOARD_H / 2 - GAMEOVER_H - 20;
        ctx.drawImage(imgs["game-over"], goX, goY, GAMEOVER_W, GAMEOVER_H);

        const resetX = (BOARD_W - RESET_W) / 2;
        const resetY = goY + GAMEOVER_H + 20;
        ctx.drawImage(imgs["reset"], resetX, resetY, RESET_W, RESET_H);
    }
}

function drawIdle() {
    ctx.clearRect(0, 0, BOARD_W, BOARD_H);
    ctx.drawImage(imgs["track"], 0, GROUND_Y, TRACK_W, TRACK_H);
    ctx.drawImage(imgs["dino"], dinoX, GROUND_Y - DINO_H, DINO_W, DINO_H);
}

// ─── Main loop ───────────────────────────────────────────────────────────────
function loop() {
    if (state === "running") update();
    drawScene();
    animId = requestAnimationFrame(loop);
}
