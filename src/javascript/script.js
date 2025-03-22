$(document).ready(function() {
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });

    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop() - header.outerHeight();

        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
        }

        sections.each(function(i) {
            const section = $(this);
            const sectionTop = section.offset().top - 96;
            const sectionBottom = sectionTop+ section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        })

        navItems.removeClass('highlight');
        $(navItems[activeSectionIndex]).addClass('highlight');
    });

    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('.dish', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#testimonial_chef', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })
});

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain attribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}
includeHTML();

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('header');
    let lastScrollTop = 0; // Guarda a posição anterior do scroll

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

document.addEventListener('DOMContentLoaded', function () {
    // Aguarde o carregamento completo do DOM e imagens
    window.addEventListener('load', initCarousel);

    function initCarousel() {
        const track = document.querySelector('.carousel__track');
        if (!track) return; // Sai da função se o carrossel não existir na página
        
        const articles = Array.from(track.querySelectorAll('.card__article'));
        const nextButton = document.querySelector('.carousel__button--right');
        const prevButton = document.querySelector('.carousel__button--left');
        const indicatorsContainer = document.querySelector('.carousel__indicators');
        const autoplayControl = document.querySelector('.carousel__autoplay-control');
        
        // Verificar se temos artigos suficientes
        if (articles.length < 1) return;
        
        // Clone o primeiro e último artigo para o carrossel infinito
        const firstCardClone = articles[0].cloneNode(true);
        const lastCardClone = articles[articles.length - 1].cloneNode(true);
        
        // Adiciona classes para identificar os clones
        firstCardClone.classList.add('clone');
        lastCardClone.classList.add('clone');
        
        // Adiciona os clones ao início e ao fim
        track.appendChild(firstCardClone);
        track.insertBefore(lastCardClone, articles[0]);
        
        // Configurações do carrossel
        const cardWidth = articles[0].getBoundingClientRect().width;
        const cardMargin = 30; // margem entre cards (conforme CSS)
        const cardMoveDistance = cardWidth + cardMargin;
        let currentIndex = 1; // Começamos do índice 1 (após o clone do último)
        const totalCards = track.querySelectorAll('.card__article').length;
        const visibleCards = articles.length; // Número de cartões originais/visíveis
        let isTransitioning = false;
        let autoplayTimer;
        let autoplayEnabled = true;
        const autoplayInterval = 5000; // 5 segundos entre slides
        
        // Criar indicadores de slides
        createIndicators();
        
        // Configurar controle de autoplay
        setupAutoplayControl();
        
        // Posicionar inicialmente o carrossel no primeiro item real (não no clone)
        updateCarousel(false);
        updateIndicators();
        
        // Função para criar os indicadores de slides
        function createIndicators() {
            if (!indicatorsContainer) return;
            
            // Limpar qualquer indicador existente
            indicatorsContainer.innerHTML = '';
            
            // Criar um indicador para cada slide real (não clones)
            for (let i = 0; i < visibleCards; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel__indicator');
                indicator.setAttribute('data-index', i);
                
                // Adicionar evento de clique para navegar para o slide correspondente
                indicator.addEventListener('click', () => {
                    // +1 porque os índices reais começam após o primeiro clone
                    goToSlide(i + 1);
                });
                
                indicatorsContainer.appendChild(indicator);
            }
        }
        
        // Função para atualizar os indicadores ativos
        function updateIndicators() {
            if (!indicatorsContainer) return;
            
            const indicators = indicatorsContainer.querySelectorAll('.carousel__indicator');
            const activeIndex = currentIndex - 1; // -1 porque os índices reais começam após o primeiro clone
            
            // Remover classe ativa de todos os indicadores
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
            
            // Adicionar classe ativa ao indicador atual
            // Usamos módulo para lidar com o caso de estar no clone
            const targetIndex = (activeIndex + visibleCards) % visibleCards;
            if (indicators[targetIndex]) {
                indicators[targetIndex].classList.add('active');
            }
        }
        
        // Função para configurar o controle de autoplay
        function setupAutoplayControl() {
            if (!autoplayControl) return;
            
            // Adicionar ícone de play para quando pausado
            const playIcon = document.createElement('i');
            playIcon.classList.add('fas', 'fa-play');
            autoplayControl.appendChild(playIcon);
            
            // Alternar autoplay ao clicar no botão
            autoplayControl.addEventListener('click', () => {
                toggleAutoplay();
            });
            
            // Iniciar autoplay
            startAutoplay();
        }
        
        // Função para iniciar autoplay
        function startAutoplay() {
            if (!autoplayEnabled) return;
            
            // Limpar timer existente se houver
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
            }
            
            // Iniciar novo timer
            autoplayTimer = setInterval(() => {
                if (!isTransitioning && document.visibilityState === 'visible') {
                    currentIndex++;
                    updateCarousel();
                }
            }, autoplayInterval);
            
            // Atualizar visual do botão
            if (autoplayControl) {
                autoplayControl.classList.remove('paused');
                autoplayControl.setAttribute('aria-label', 'Pausar apresentação automática');
            }
        }
        
        // Função para pausar autoplay
        function pauseAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
            
            // Atualizar visual do botão
            if (autoplayControl) {
                autoplayControl.classList.add('paused');
                autoplayControl.setAttribute('aria-label', 'Iniciar apresentação automática');
            }
        }
        
        // Função para alternar autoplay
        function toggleAutoplay() {
            autoplayEnabled = !autoplayEnabled;
            
            if (autoplayEnabled) {
                startAutoplay();
            } else {
                pauseAutoplay();
            }
        }
        
        // Função para ir para um slide específico
        function goToSlide(index) {
            if (isTransitioning) return;
            
            currentIndex = index;
            updateCarousel();
        }
        
        // Função para atualizar a posição do carrossel
        function updateCarousel(animate = true) {
            const moveAmount = -currentIndex * cardMoveDistance;
            
            if (animate) {
                isTransitioning = true;
                track.style.transition = 'transform 0.5s ease';
                track.addEventListener('transitionend', finishTransition, { once: true });
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(${moveAmount}px)`;
            updateIndicators();
        }
        
        // Função que verifica quando a transição termina
        function finishTransition() {
            isTransitioning = false;
            
            // Se chegamos no clone do primeiro (último item real + 1)
            if (currentIndex >= totalCards - 1) {
                currentIndex = 1;
                track.style.transition = 'none';
                updateCarousel(false);
            }
            
            // Se chegamos no clone do último (primeiro item real - 1)
            if (currentIndex <= 0) {
                currentIndex = totalCards - 2;
                track.style.transition = 'none';
                updateCarousel(false);
            }
        }
        
        // Evento para o botão "próximo"
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (isTransitioning) return;
                currentIndex++;
                updateCarousel();
            });
        }
        
        // Evento para o botão "anterior"
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (isTransitioning) return;
                currentIndex--;
                updateCarousel();
            });
        }
        
        // Configurar navegação por toque (swipe)
        setupTouchNavigation();
        
        // Configura a navegação por toque (swipe)
        function setupTouchNavigation() {
            let touchStartX = 0;
            let touchEndX = 0;
            
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                
                // Pausar autoplay temporariamente durante a interação
                if (autoplayTimer) {
                    pauseAutoplay();
                }
            }, {passive: true});
            
            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                
                // Retomar autoplay após a interação, se estiver habilitado
                if (autoplayEnabled) {
                    startAutoplay();
                }
            }, {passive: true});
            
            function handleSwipe() {
                const swipeThreshold = 50; // mínimo de pixels para considerar um swipe
                
                if (touchStartX - touchEndX > swipeThreshold) {
                    // Swipe para a esquerda - próximo slide
                    if (!isTransitioning) {
                        currentIndex++;
                        updateCarousel();
                    }
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    // Swipe para a direita - slide anterior
                    if (!isTransitioning) {
                        currentIndex--;
                        updateCarousel();
                    }
                }
            }
        }
        
        // Adicionar resposta a mudanças de tamanho da tela
        window.addEventListener('resize', () => {
            // Recalcular largura do card caso a tela mude de tamanho
            const newCardWidth = track.querySelector('.card__article').getBoundingClientRect().width;
            const newCardMoveDistance = newCardWidth + cardMargin;
            
            // Atualiza a posição com novas dimensões
            const moveAmount = -currentIndex * newCardMoveDistance;
            track.style.transition = 'none';
            track.style.transform = `translateX(${moveAmount}px)`;
        });
        
        // Pausar autoplay quando o usuário interage com o carrossel
        track.addEventListener('mouseenter', () => {
            if (autoplayEnabled) {
                pauseAutoplay();
            }
        });
        
        // Retomar autoplay quando o usuário sai do carrossel
        track.addEventListener('mouseleave', () => {
            if (autoplayEnabled) {
                startAutoplay();
            }
        });
        
        // Pausar autoplay quando o documento fica invisível
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                if (autoplayTimer) {
                    pauseAutoplay();
                }
            } else if (autoplayEnabled) {
                startAutoplay();
            }
        });
    }
});
