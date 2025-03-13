document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('header');
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    let lastScrollTop = 0; // Guarda a posição anterior do scroll

    // Função para adicionar a classe 'active' ao link correspondente na navbar
    function setActiveLink() {
        // Obtém o caminho atual e trata casos especiais
        let currentPath = window.location.pathname.split('/').pop();
        
        // Se estiver na raiz ou se o caminho estiver vazio, considere como "index.html"
        if (!currentPath || currentPath === '' || currentPath === '/' || currentPath.includes('index')) {
            currentPath = 'index.html';
        }
        
        console.log('Página atual:', currentPath);
        
        // Remove a classe 'active' de todos os links primeiro
        const links = document.querySelectorAll('#nav_list a, #mobile_nav_list a');
        links.forEach(link => {
            link.classList.remove('active');
        });
        
        // Adiciona a classe 'active' ao link correspondente
        let foundActiveLink = false;
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Compara a URL atual com o href do link
            if (href.includes(currentPath)) {
                link.classList.add('active');
                foundActiveLink = true;
                console.log('Link ativo:', link.textContent);
            }
        });

        // Se nenhum link for encontrado, tente novamente após um pequeno atraso
        // para garantir que o DOM foi completamente carregado
        if (!foundActiveLink) {
            setTimeout(setActiveLink, 500);
        }
    }

    // Chama a função após um pequeno atraso para garantir que o DOM está pronto
    setTimeout(setActiveLink, 100);

    // Também tenta aplicar quando o conteúdo da página terminar de carregar
    window.addEventListener('load', setActiveLink);

    // Adiciona evento de clique para atualizar o link ativo
    document.body.addEventListener('click', function(e) {
        const link = e.target.closest('#nav_list a, #mobile_nav_list a');
        if (link) {
            document.querySelectorAll('#nav_list a, #mobile_nav_list a').forEach(l => {
                l.classList.remove('active');
            });
            link.classList.add('active');
        }
    });

    // Adiciona evento de clique para o botão do menu mobile
    mobileBtn.addEventListener('click', function() {
        console.log('Botão do menu móvel clicado'); // Log de depuração
        mobileMenu.classList.toggle('active');
        console.log('Classe active alternada no menu móvel:', mobileMenu.classList.contains('active')); // Log de depuração
        mobileBtn.querySelector('i').classList.toggle('fa-bars');
        mobileBtn.querySelector('i').classList.toggle('fa-times');
    });

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Verifica a direção do scroll
        if (currentScroll > lastScrollTop) {
            // Rolar para baixo - esconder navbar
            gsap.to(navbar, {
                y: -navbar.offsetHeight, // Move a navbar para fora da tela
                duration: 0.3, // Duração da animação
                ease: "power2.out" // Tipo de easing
            });
        } else {
            // Rolar para cima - mostrar navbar
            gsap.to(navbar, {
                y: 0, // Move a navbar de volta para a tela
                duration: 0.3, // Duração da animação
                ease: "power2.out" // Tipo de easing
            });
            navbar.classList.add('shrink'); // Adiciona a classe para a navbar menor
        }

        // Atualiza a posição anterior do scroll
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});
