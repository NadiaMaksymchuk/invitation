const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const question = document.getElementById("question");
const answer = document.getElementById("answer");

const MARGIN = 12;
const DANGER_ZONE = 90;

function runAway() {
  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - MARGIN;
  const maxY = window.innerHeight - rect.height - MARGIN;

  if (!noBtn.classList.contains("running")) {
    noBtn.style.left = rect.left + "px";
    noBtn.style.top = rect.top + "px";
    noBtn.classList.add("running");
    // The card has a transform animation, which breaks position: fixed inside it.
    document.body.appendChild(noBtn);
  }

  let x;
  let y;
  let tries = 0;
  do {
    x = MARGIN + Math.random() * (maxX - MARGIN);
    y = MARGIN + Math.random() * (maxY - MARGIN);
  } while (Math.hypot(x - rect.left, y - rect.top) < 150 && ++tries < 30);

  requestAnimationFrame(() => {
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  });
}

// Desktop: run when the cursor comes close or the button gets focus.
document.addEventListener("mousemove", (e) => {
  const r = noBtn.getBoundingClientRect();
  const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
  const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
  if (Math.hypot(dx, dy) < DANGER_ZONE) runAway();
});
noBtn.addEventListener("focus", runAway);

// Mobile: run on touch, before the click happens.
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  runAway();
}, { passive: false });

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  runAway();
});

window.addEventListener("resize", () => {
  if (noBtn.classList.contains("running")) runAway();
});

yesBtn.addEventListener("click", () => {
  noBtn.remove();
  question.hidden = true;
  answer.hidden = false;
  rainHearts();
});

function rainHearts() {
  const symbols = ["❤️", "💕", "🤍", "💗"];
  for (let i = 0; i < 40; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = symbols[i % symbols.length];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 14 + Math.random() * 22 + "px";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";
    heart.addEventListener("animationend", () => heart.remove());
    document.body.appendChild(heart);
  }
}
