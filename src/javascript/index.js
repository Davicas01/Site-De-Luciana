document.addEventListener('DOMContentLoaded', function() {
            const mobileBtn = document.getElementById('mobile_btn');
            const mobileMenu = document.getElementById('mobile_menu');
            
            if (mobileBtn && mobileMenu) {
                mobileBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    mobileMenu.classList.toggle('active');
                    console.log('Mobile menu toggled');
                });
            }
});