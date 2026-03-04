window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        intro.style.opacity = '0';
        intro.style.transform = 'translateY(-100%)'; // پەردەکە دەچێتە سەرەوە
        
        // دوای چرکەیەک بە تەواوی دیار نامێنێت
        setTimeout(() => {
            intro.style.display = 'none';
        }, 1000);
    }, 3000); 
});
