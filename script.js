// DOM elements
const connectBtn = document.getElementById('connectBtn');
const payInput = document.getElementById('payAmount');
const receiveInput = document.getElementById('receiveAmount');
const swapArrow = document.getElementById('swapArrow');
const mainActionBtn = document.getElementById('mainActionBtn');
const payTokenBtn = document.getElementById('payTokenBtn');
const receiveTokenBtn = document.getElementById('receiveTokenBtn');

// Constants
const ETH_TO_FLCN_RATE = 1450.75; // 1 ETH = 1450.75 FLCN

// State
let isWalletConnected = false;
let currentPayToken = 'ETH';      // can be ETH or FLCN
let currentReceiveToken = 'FLCN'; // the other

// Helper: format number to 6 decimals max (avoid scientific)
function formatAmount(value) {
    if (isNaN(value) || value === null || value === '') return '0.00';
    return parseFloat(value).toFixed(6).replace(/\.?0+$/, ''); // remove trailing zeros
}

// Calculate receive amount based on pay amount and direction
function calculateReceive() {
    let payVal = parseFloat(payInput.value);
    if (isNaN(payVal) || payVal < 0) payVal = 0;

    let receiveVal = 0;
    if (currentPayToken === 'ETH' && currentReceiveToken === 'FLCN') {
        receiveVal = payVal * ETH_TO_FLCN_RATE;
    } else if (currentPayToken === 'FLCN' && currentReceiveToken === 'ETH') {
        receiveVal = payVal / ETH_TO_FLCN_RATE;
    } else {
        // fallback (should never happen with our simple toggle)
        receiveVal = payVal;
    }

    receiveInput.value = formatAmount(receiveVal);
    updateMainButtonState();
}

// Swap tokens & values (central arrow)
function swapTokensAndValues() {
    // Swap token symbols
    const payTokenSpan = payTokenBtn.querySelector('.token-symbol');
    const receiveTokenSpan = receiveTokenBtn.querySelector('.token-symbol');
    const tempToken = payTokenSpan.innerText;
    payTokenSpan.innerText = receiveTokenSpan.innerText;
    receiveTokenSpan.innerText = tempToken;

    // Update current token state
    currentPayToken = payTokenSpan.innerText;
    currentReceiveToken = receiveTokenSpan.innerText;

    // Swap input values: pay becomes previous receive, then recalc
    const currentPayVal = payInput.value;
    const currentReceiveVal = receiveInput.value;
    payInput.value = currentReceiveVal !== '0.00' && currentReceiveVal !== '' ? currentReceiveVal : '0';
    
    // Recalculate based on new pay amount (which is the old receive)
    calculateReceive();

    // also update USD estimates? (optional, could keep as placeholder)
}

// Update main button (active / inactive)
function updateMainButtonState() {
    const payAmount = parseFloat(payInput.value);
    const hasValidAmount = !isNaN(payAmount) && payAmount > 0;

    if (hasValidAmount) {
        mainActionBtn.classList.add('active');
        mainActionBtn.innerText = 'Swap';
    } else {
        mainActionBtn.classList.remove('active');
        mainActionBtn.innerText = 'Enter an amount';
    }
}

// Connect wallet simulation
function connectWallet() {
    isWalletConnected = true;
    const addresses = ['0x1234...abcd', '0x7F3a...c9e', '0xDEf1...5Bc'];
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    connectBtn.innerText = randomAddress;
    connectBtn.style.letterSpacing = '0.02em';
    // after connect, re-check main button (maybe enable if amount present)
    updateMainButtonState();
}

// Event listeners
payInput.addEventListener('input', function(e) {
    // allow only numbers and one dot
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    e.target.value = val;
    calculateReceive();
});

swapArrow.addEventListener('click', function() {
    swapTokensAndValues();
});

mainActionBtn.addEventListener('click', function() {
    if (mainActionBtn.classList.contains('active')) {
        const payAmt = parseFloat(payInput.value) || 0;
        const receiveAmt = receiveInput.value;
        const paySym = currentPayToken;
        const receiveSym = currentReceiveToken;
        alert(`Swapped ${payAmt} ${paySym} for ${receiveAmt} ${receiveSym} (simulated)`);
    } else {
        // if inactive, maybe shake or just hint
        mainActionBtn.style.transform = 'scale(0.98)';
        setTimeout(() => mainActionBtn.style.transform = '', 150);
    }
});

connectBtn.addEventListener('click', connectWallet);

// token selector clicks (just for visual feedback – they don't change token in this demo)
payTokenBtn.addEventListener('click', () => {
    // optional: you could cycle tokens, but we'll just show a ripple effect
    payTokenBtn.style.background = 'rgba(212, 175, 55, 0.2)';
    setTimeout(() => payTokenBtn.style.background = '', 200);
});

receiveTokenBtn.addEventListener('click', () => {
    receiveTokenBtn.style.background = 'rgba(212, 175, 55, 0.2)';
    setTimeout(() => receiveTokenBtn.style.background = '', 200);
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // set default pay value
    payInput.value = '1.0';
    calculateReceive();
    updateMainButtonState();

    // USD estimates can be left as static for demo
});
