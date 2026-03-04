// script.js – cinematic dex logic

// ========== INTRO MANAGEMENT ==========
const intro = document.getElementById('introOverlay');
const dashboard = document.getElementById('dashboard');

// after stroke animation (approx 3.5s) hide intro with blur-out
setTimeout(() => {
  intro.classList.add('hide');
  setTimeout(() => {
    intro.style.display = 'none';
    dashboard.classList.add('visible');
    initBokeh(); // start bokeh canvas after dashboard visible
  }, 1200);
}, 3500);

// ========== COSMIC BOKEH WITH MOUSE PARALLAX ==========
let canvas, ctx, width, height, particles = [];
const PARTICLE_COUNT = 80;

function initBokeh() {
  canvas = document.getElementById('bokehCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      radius: 30 + Math.random() * 60,
      speedX: (Math.random() - 0.5) * 0.02,
      speedY: (Math.random() - 0.5) * 0.02,
      alpha: 0.1 + Math.random() * 0.2,
      gold: Math.random() > 0.5 ? '#D4AF37' : '#ffffff',
    });
  }

  // mouse effect factor
  let mouseX = 0.5, mouseY = 0.5;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / width;
    mouseY = e.clientY / height;
  });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX / width;
      mouseY = e.touches[0].clientY / height;
    }
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      // subtle autonomous movement
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      // parallax offset based on mouse (inverse direction)
      const offsetX = (mouseX - 0.5) * 40;
      const offsetY = (mouseY - 0.5) * 40;
      const xPos = (p.x * width + offsetX) % width;
      const yPos = (p.y * height + offsetY) % height;

      ctx.beginPath();
      ctx.arc(xPos, yPos, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = p.gold;
      ctx.globalAlpha = p.alpha * 0.3;
      ctx.filter = 'blur(15px)';
      ctx.fill();
    });
    ctx.filter = 'none';
    requestAnimationFrame(draw);
  }
  draw();
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

// ========== SWAP STATE & LOGIC ==========
let payToken = 'ETH';
let receiveToken = 'FLCN';
const TOKENS = {
  ETH: { balance: 12.542, usdRate: 1850.45 },
  FLCN: { balance: 8450.32, usdRate: 1.275 },
  USDC: { balance: 15420.89, usdRate: 1.00 }
};
const RATE = 1450.75; // 1 ETH = 1450.75 FLCN

const payInput = document.getElementById('payAmount');
const receiveInput = document.getElementById('receiveAmount');
const payUsd = document.getElementById('payUsd');
const receiveUsd = document.getElementById('receiveUsd');
const payBalanceSpan = document.getElementById('payBalance');
const receiveBalanceSpan = document.getElementById('receiveBalance');
const rateDisplay = document.getElementById('rateDisplay');
const impactSpan = document.getElementById('impact');
const swapArrow = document.getElementById('swapArrow');
const payTokenBtn = document.getElementById('payTokenBtn');
const receiveTokenBtn = document.getElementById('receiveTokenBtn');
const maxBtn = document.getElementById('maxBtn');
const actionBtn = document.getElementById('actionBtn');
const walletBtn = document.getElementById('walletBtn');

// update receive amount & usd
function updateSwap() {
  let payVal = parseFloat(payInput.value) || 0;
  if (payVal < 0) payVal = 0;

  let receiveVal = 0;
  if (payToken === 'ETH' && receiveToken === 'FLCN') receiveVal = payVal * RATE;
  else if (payToken === 'FLCN' && receiveToken === 'ETH') receiveVal = payVal / RATE;
  else receiveVal = payVal;

  receiveInput.value = receiveVal.toFixed(6);

  const payUsdVal = payVal * TOKENS[payToken].usdRate;
  const receiveUsdVal = receiveVal * TOKENS[receiveToken].usdRate;
  payUsd.textContent = `≈ $${payUsdVal.toFixed(2)}`;
  receiveUsd.textContent = `≈ $${receiveUsdVal.toFixed(2)}`;

  // price impact simulation (tiny)
  const impact = Math.min(0.5, payVal * 0.0004);
  impactSpan.textContent = `${impact.toFixed(3)}%`;

  // rate display
  if (payToken === 'ETH' && receiveToken === 'FLCN') rateDisplay.textContent = `1 ETH ≈ ${RATE} FLCN`;
  else if (payToken === 'FLCN' && receiveToken === 'ETH') rateDisplay.textContent = `1 FLCN ≈ ${(1/RATE).toFixed(6)} ETH`;
}

// sanitize input
payInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/[^0-9.]/g, '');
  const parts = val.split('.');
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
  e.target.value = val;
  updateSwap();
});

// max button
maxBtn.addEventListener('click', () => {
  payInput.value = TOKENS[payToken].balance;
  updateSwap();
});

// swap arrow direction
swapArrow.addEventListener('click', () => {
  [payToken, receiveToken] = [receiveToken, payToken];
  payTokenBtn.innerHTML = `${payToken} <span class="chevron">▼</span>`;
  receiveTokenBtn.innerHTML = `${receiveToken} <span class="chevron">▼</span>`;
  // swap balances in UI
  payBalanceSpan.textContent = `${TOKENS[payToken].balance.toFixed(3)} ${payToken}`;
  receiveBalanceSpan.textContent = `${TOKENS[receiveToken].balance.toFixed(2)} ${receiveToken}`;
  updateSwap();
});

// token modal logic
const modal = document.getElementById('tokenModal');
const closeModal = document.getElementById('closeModal');
let activeTokenButton = null; // which button opened modal

payTokenBtn.addEventListener('click', () => {
  activeTokenButton = 'pay';
  modal.classList.add('active');
});
receiveTokenBtn.addEventListener('click', () => {
  activeTokenButton = 'receive';
  modal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// token selection from modal
document.querySelectorAll('.token-item').forEach(item => {
  item.addEventListener('click', () => {
    const symbol = item.dataset.symbol;
    if (activeTokenButton === 'pay') {
      payToken = symbol;
      payTokenBtn.innerHTML = `${symbol} <span class="chevron">▼</span>`;
      payBalanceSpan.textContent = `${TOKENS[symbol].balance.toFixed(3)} ${symbol}`;
    } else if (activeTokenButton === 'receive') {
      receiveToken = symbol;
      receiveTokenBtn.innerHTML = `${symbol} <span class="chevron">▼</span>`;
      receiveBalanceSpan.textContent = `${TOKENS[symbol].balance.toFixed(2)} ${symbol}`;
    }
    updateSwap();
    modal.classList.remove('active');
  });
});

// wallet connection simulation
walletBtn.addEventListener('click', () => {
  walletBtn.textContent = '0x3Fc9...aB1e';
  walletBtn.style.background = 'rgba(212,175,55,0.2)';
});

// action button (swap)
actionBtn.addEventListener('click', () => {
  alert(`✨ Quantum swap executed: ${payInput.value} ${payToken} → ${receiveInput.value} ${receiveToken}`);
});

// initial update
updateSwap();
