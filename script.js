const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Menu inputs
const ratio1Input = document.getElementById("ratio1");
const ratio2Input = document.getElementById("ratio2");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Animation state
let angle = 0;
let path = [];
let axis1 = 3;
let axis2 = 2;
let animationId = null;

// Stick lengths
const lengthA = 120;
const lengthB = 120;
const speed = 0.0125;

// --- Stop simulation ---
function stopSimulation() {
    if (animationId !== null) {
        cancelAnimationFrame(animationId); // stop animation
        animationId = null;
    }

    // Reset all animation state
    angle = 0;
    path = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Show menu again
    document.querySelector(".menu").style.display = "flex";
}

// --- Start simulation ---
startBtn.addEventListener("click", () => {
    // Read values from inputs
    axis1 = parseFloat(ratio1Input.value) || 1;
    axis2 = parseFloat(ratio2Input.value) || 1;

    // Reset animation state
    angle = 0;
    path = [];

    // Hide menu
    document.querySelector(".menu").style.display = "none";

    // Only start if not already running
    if (!animationId) draw();
});

stopBtn.addEventListener("click", stopSimulation);

// --- Draw loop ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const angleA = angle * axis1;
    const angleB = angle * axis2;

    const x1 = centerX + Math.cos(angleA) * lengthA;
    const y1 = centerY + Math.sin(angleA) * lengthA;

    const x2 = x1 + Math.cos(angleB) * lengthB;
    const y2 = y1 + Math.sin(angleB) * lengthB;

    // Save tip for the curve
    path.push({ x: x2, y: y2 });

    // Draw the permanent curve
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < path.length; i++) {
        ctx.moveTo(path[i - 1].x, path[i - 1].y);
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    // Draw sticks (only for this frame)
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    angle += speed;

    // Save animationId so we can cancel later
    animationId = requestAnimationFrame(draw);
}
