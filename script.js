// FalconDex - Professional Logic Script

// ١. سیستەمی زمان (Localization Data)
const translations = {
    en: {
        langText: "العربية",
        dir: "ltr",
        font: "'Orbitron', sans-serif"
    },
    ar: {
        langText: "English",
        dir: "rtl",
        font: "'Tajawal', sans-serif"
    }
};

let currentLang = 'en';

// فەنکشنی گۆڕینی زمان
window.toggleLanguage = () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const langData = translations[currentLang];

    // گۆڕینی ئاڕاستەی لاپەڕە و فۆنت
    document.documentElement.dir = langData.dir;
    document.documentElement.lang = currentLang;
    document.body.style.fontFamily = langData.font;
    document.getElementById('lang-text').innerText = langData.langText;

    // گۆڕینی هەموو ئەو دەقانەی کە data-attribute یان هەیە
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });

    console.log(`Language switched to: ${currentLang}`);
};

// ٢. سیستەمی کارلێکی فۆرم (Reactive Button)
const payInput = document.getElementById('pay-amount');
const receiveInput = document.getElementById('receive-amount');
const swapBtn = document.getElementById('swap-btn');

payInput.addEventListener('input', (e) => {
    const value = e.target.value;
    
    if (value > 0) {
        // لێرەدا دەتوانین نرخی ڕاستەقینە دابنێین (بۆ نموونە هەر ١ ئیسێریۆم ٢٠٠٠ مێم کۆینە)
        receiveInput.value = (value * 2450.75).toFixed(2); 
        swapBtn.classList.add('active');
        swapBtn.innerText = currentLang === 'en' ? 'Swap Now' : 'بدأ التبديل الآن';
    } else {
        receiveInput.value = "";
        swapBtn.classList.remove('active');
        swapBtn.innerText = currentLang === 'en' ? 'Enter an amount' : 'أدخل المبلغ';
    }
});

// ٣. سیستەمی بەستنەوە بە واڵێت (Web3 Integration)
const connectBtn = document.getElementById('connectWallet');

window.connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // داواکردنی دەستگەیشتن بە واڵێت
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            // کورتکردنەوەی ناونیشانی واڵێت (نموونە: 0x12...abcd)
            const shortAddr = account.substring(0, 6) + "..." + account.substring(account.length - 4);
            
            connectBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${shortAddr}`;
            connectBtn.style.background = "linear-gradient(45deg, #00ff88, #00d2ff)";
            
            console.log("Connected to:", account);
        } catch (error) {
            console.error("User rejected connection");
        }
    } else {
        alert(currentLang === 'en' ? "Please install MetaMask!" : "الرجاء تثبيت محفظة MetaMask!");
    }
};

connectBtn.addEventListener('click', connectWallet);

// ٤. ئەنیمەیشنی تێکەڵ (Smooth Interactions)
document.querySelectorAll('.token-select').forEach(button => {
    button.addEventListener('click', () => {
        // لێرەدا دەتوانیت مۆدێلی هەڵبژاردنی دراوەکان زیاد بکەیت
        alert(currentLang === 'en' ? "Token selection coming soon!" : "قائمة العملات ستتوفر قریباً!");
    });
});
