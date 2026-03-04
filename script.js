const btn = document.getElementById('swap-btn');
const pay = document.getElementById('pay');
const receive = document.getElementById('receive');

// ئەنیمەیشنی شەپۆلی ئاو (Ripple Effect)
btn.addEventListener('click', function(e) {
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;

    let ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    this.appendChild(ripple);

    setTimeout(() => { ripple.remove(); }, 800);
});

// ئەژمارکردنی نرخ بە شێوەی زۆر نەرم
pay.addEventListener('input', (e) => {
    let val = e.target.value;
    if(val > 0) {
        receive.value = (val * 1450.75).toFixed(2);
        btn.style.background = "#d4af37"; // گۆڕینی ڕەنگ بۆ ئاڵتوونی کاتێک ژمارە هەیە
    } else {
        receive.value = "";
        btn.style.background = "#fff";
    }
});
