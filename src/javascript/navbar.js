document.addEventListener('DOMContentLoaded', function() {
    console.log("Script da navbar carregado!");

    const navbar = document.querySelector('header');
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    let lastScrollTop = 0;

    console.log("Mobile button:", mobileBtn);
    console.log("Mobile menu:", mobileMenu);

    // Função específica para controlar o menu mobile
    function toggleMobileMenu() {
        console.log("Toggling mobile menu");
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            console.log("Mobile menu active:", mobileMenu.classList.contains('active'));
        }
        if (mobileBtn) {
            mobileBtn.classList.toggle('active');
        }
    }

    // Adicionar evento de clique diretamente no botão mobile
    if (mobileBtn) {
        console.log("Adding click event listener to mobile button");
        mobileBtn.onclick = function(e) {
            e.preventDefault();
            toggleMobileMenu();
        };
    }

    // Resto do código permanece o mesmo
    function setActiveLink() {
        let currentPath = window.location.pathname.split('/').pop();
        if (!currentPath || currentPath === '' || currentPath === '/' || currentPath.includes('index')) {
            currentPath = 'index.html';
        }
        const links = document.querySelectorAll('#nav_list a, #mobile_nav_list a');
        links.forEach(link => {
            link.classList.remove('active');
        });
        let foundActiveLink = false;
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes(currentPath)) {
                link.classList.add('active');
                foundActiveLink = true;
            }
        });
        if (!foundActiveLink) {
            setTimeout(setActiveLink, 500);
        }
    }

    setTimeout(setActiveLink, 100);
    window.addEventListener('load', setActiveLink);
    document.body.addEventListener('click', function(e) {
        const link = e.target.closest('#nav_list a, #mobile_nav_list a');
        if (link) {
            document.querySelectorAll('#nav_list a, #mobile_nav_list a').forEach(l => {
                l.classList.remove('active');
            });
            link.classList.add('active');

            // Fechar o menu mobile ao clicar em um link
            if (link.closest('#mobile_nav_list') && mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        }
    });

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop) {
            gsap.to(navbar, {
                y: -navbar.offsetHeight,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            gsap.to(navbar, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
            navbar.classList.add('shrink');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});