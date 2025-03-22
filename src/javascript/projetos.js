function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
    // Após incluir todo o HTML, inicializar o carrossel
    initCarousel();
}

// Executar includeHTML quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', includeHTML);

// Carrossel aprimorado com transições suaves e efeitos visuais
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o carrossel quando o DOM estiver carregado
    initCarousel();
});

function initCarousel() {
    const track = document.querySelector('.carousel__track');
    
    // Verifica se o carrossel existe na página
    if (!track) return;
    
    // Referências importantes do carrossel
    const slides = Array.from(track.querySelectorAll('.card__article'));
    const nextButton = document.querySelector('.carousel__button--right');
    const prevButton = document.querySelector('.carousel__button--left');
    const dotsContainer = document.querySelector('.carousel__indicators');
    const autoplayControl = document.querySelector('.carousel__autoplay-control');
    
    // Verifica se temos slides suficientes
    if (slides.length < 1) return;
    
    // Configurações
    let currentIndex = 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const slideMargin = parseInt(window.getComputedStyle(slides[0]).marginRight) || 30;
    const moveAmount = slideWidth + slideMargin;
    let autoplayTimer;
    let isAutoplayEnabled = true;
    const autoplayInterval = 5000; // 5 segundos entre slides
    let isTransitioning = false; // Rastreia quando uma transição está acontecendo
    
    // Configurar os indicadores (dots)
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel__indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                animateToSlide(index);
                pauseAutoplay();
                // Reinicia autoplay após clicar se estiver habilitado
                if (isAutoplayEnabled) {
                    setTimeout(startAutoplay, autoplayInterval);
                }
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    // Configurar controle de autoplay
    if (autoplayControl) {
        autoplayControl.addEventListener('click', () => {
            toggleAutoplay();
            // Efeito visual ao clicar
            autoplayControl.classList.add('clicked');
            setTimeout(() => {
                autoplayControl.classList.remove('clicked');
            }, 300);
        });
        startAutoplay();
    }
    
    // Adicionar event listeners para os botões
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (isTransitioning) return;
            animateToSlide(currentIndex + 1);
            pauseAutoplay();
            // Reinicia autoplay após clicar se estiver habilitado
            if (isAutoplayEnabled) {
                setTimeout(startAutoplay, autoplayInterval);
            }
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (isTransitioning) return;
            animateToSlide(currentIndex - 1);
            pauseAutoplay();
            // Reinicia autoplay após clicar se estiver habilitado
            if (isAutoplayEnabled) {
                setTimeout(startAutoplay, autoplayInterval);
            }
        });
    }
    
    // Configurar touch/swipe
    setupTouchNavigation();
    
    // Funções principais
    
    // Função para animar a transição entre slides com efeitos visuais
    function animateToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Adiciona classe para efeito visual durante a transição
        track.classList.add('transitioning');
        
        // Gerenciar índice para carrossel circular
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        // Marca slide atual como ativo para efeitos visuais
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        
        // Armazena o índice anterior para efeitos direcionais
        const previousIndex = currentIndex;
        currentIndex = index;
        
        // Determina direção da animação
        const direction = previousIndex > currentIndex ? 'right' : 'left';
        track.setAttribute('data-direction', direction);
        
        // Mover o track com animação
        track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
        
        // Atualizar indicadores ativos
        updateActiveDot();
        
        // Remover classes de transição após completar
        setTimeout(() => {
            track.classList.remove('transitioning');
            isTransitioning = false;
        }, 800); // Corresponde à duração da transição no CSS
    }
    
    // Atualizar indicador ativo com efeito suave
    function updateActiveDot() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.carousel__indicator');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Iniciar autoplay com animação
    function startAutoplay() {
        if (!isAutoplayEnabled) return;
        
        // Limpar timer existente se houver
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
        
        // Iniciar novo timer com efeito de fade
        autoplayTimer = setInterval(() => {
            if (!isTransitioning) {
                animateToSlide(currentIndex + 1);
            }
        }, autoplayInterval);
        
        // Atualizar visual do botão com animação
        if (autoplayControl) {
            autoplayControl.classList.remove('paused');
            autoplayControl.style.animation = 'pulse 2s infinite';
        }
    }
    
    // Pausar autoplay com efeito visual
    function pauseAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
        
        // Atualizar visual do botão
        if (autoplayControl) {
            autoplayControl.classList.add('paused');
            autoplayControl.style.animation = 'none';
        }
    }
    
    // Alternar autoplay com feedback visual
    function toggleAutoplay() {
        isAutoplayEnabled = !isAutoplayEnabled;
        
        if (isAutoplayEnabled) {
            startAutoplay();
            // Feedback visual
            if (autoplayControl) {
                autoplayControl.classList.add('active-animation');
                setTimeout(() => {
                    autoplayControl.classList.remove('active-animation');
                }, 1000);
            }
        } else {
            pauseAutoplay();
        }
    }
    
    // Configurar navegação por toque com efeitos de feedback
    function setupTouchNavigation() {
        let startX, moveX;
        let isDragging = false;
        const threshold = 50; // Limiar para considerar como swipe
        let dragStartTime, dragEndTime;
        let velocity = 0;
        let dragDistance = 0;
        
        // Touch events (mobile)
        track.addEventListener('touchstart', (e) => {
            if (isTransitioning) return;
            
            startX = e.touches[0].clientX;
            isDragging = true;
            dragStartTime = Date.now();
            pauseAutoplay();
            
            // Prepara o track para interação
            track.style.transition = 'none';
            
            // Feedback visual
            track.classList.add('touching');
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging || isTransitioning) return;
            
            moveX = e.touches[0].clientX;
            dragDistance = moveX - startX;
            
            // Calcular a posição atual + offset do drag com resistência
            const resistance = 0.3; // Maior resistência = menos movimento
            const dragOffset = dragDistance * resistance;
            const currentOffset = -currentIndex * moveAmount;
            
            // Aplicar transformação com resistência
            track.style.transform = `translateX(${currentOffset + dragOffset}px)`;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            if (!isDragging || isTransitioning) return;
            
            isDragging = false;
            dragEndTime = Date.now();
            track.classList.remove('touching');
            
            // Restaurar a transição
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            if (!moveX) {
                // Retornar à posição original se não houve movimento
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
                return;
            }
            
            const dragDuration = dragEndTime - dragStartTime;
            velocity = Math.abs(dragDistance) / dragDuration;
            
            // Determinar se deve mudar slide baseado na distância ou velocidade
            if (Math.abs(dragDistance) > threshold || velocity > 0.5) {
                if (dragDistance > 0) {
                    // Swipe para direita - anterior
                    animateToSlide(currentIndex - 1);
                } else {
                    // Swipe para esquerda - próximo
                    animateToSlide(currentIndex + 1);
                }
            } else {
                // Retornar à posição original com animação
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
            }
            
            // Reiniciar autoplay se estiver habilitado
            if (isAutoplayEnabled) {
                setTimeout(startAutoplay, autoplayInterval);
            }
            
            // Resetar variáveis
            startX = null;
            moveX = null;
            dragDistance = 0;
        });
        
        // Mouse events (desktop) - similar ao touch mas adaptado
        track.addEventListener('mousedown', (e) => {
            if (isTransitioning) return;
            
            startX = e.clientX;
            isDragging = true;
            dragStartTime = Date.now();
            pauseAutoplay();
            
            // Prepara o track para drag
            track.style.transition = 'none';
            track.style.cursor = 'grabbing';
            track.classList.add('dragging');
            
            e.preventDefault();
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDragging || isTransitioning) return;
            
            moveX = e.clientX;
            dragDistance = moveX - startX;
            
            // Aplicar resistência ao drag para movimento mais natural
            const resistance = 0.3;
            const dragOffset = dragDistance * resistance;
            const currentOffset = -currentIndex * moveAmount;
            
            track.style.transform = `translateX(${currentOffset + dragOffset}px)`;
            e.preventDefault();
        });
        
        track.addEventListener('mouseup', (e) => {
            if (!isDragging || isTransitioning) return;
            
            isDragging = false;
            dragEndTime = Date.now();
            
            track.style.cursor = 'grab';
            track.classList.remove('dragging');
            
            // Restaurar transição suave
            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            if (!moveX) {
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
                return;
            }
            
            const dragDuration = dragEndTime - dragStartTime;
            velocity = Math.abs(dragDistance) / dragDuration;
            
            // Escolher slide baseado na distância e velocidade
            if (Math.abs(dragDistance) > threshold || velocity > 0.5) {
                if (dragDistance > 0) {
                    animateToSlide(currentIndex - 1);
                } else {
                    animateToSlide(currentIndex + 1);
                }
            } else {
                // Retornar ao slide atual
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
            }
            
            // Reiniciar autoplay
            if (isAutoplayEnabled) {
                setTimeout(startAutoplay, autoplayInterval);
            }
            
            // Resetar variáveis
            startX = null;
            moveX = null;
            dragDistance = 0;
        });
        
        track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                track.style.cursor = 'grab';
                track.classList.remove('dragging');
                
                // Restaurar transição
                track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Retornar à posição original
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
                
                // Reiniciar autoplay
                if (isAutoplayEnabled) {
                    setTimeout(startAutoplay, autoplayInterval);
                }
            }
        });
    }
    
    // Adicionar inércia ao carrossel (deslizamento contínuo após swipe rápido)
    function addInertia(velocity, direction) {
        const minVelocity = 0.5;
        const deceleration = 0.95;
        
        if (velocity < minVelocity) return;
        
        let currentVelocity = velocity;
        const inertiaTimer = setInterval(() => {
            currentVelocity *= deceleration;
            
            if (currentVelocity < minVelocity) {
                clearInterval(inertiaTimer);
                return;
            }
            
            // Mover mais um slide na direção do swipe se a velocidade for alta
            if (direction === 'left') {
                animateToSlide(currentIndex + 1);
            } else {
                animateToSlide(currentIndex - 1);
            }
        }, 300);
    }
    
    // Pause quando a página não estiver visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAutoplay();
        } else if (isAutoplayEnabled) {
            startAutoplay();
        }
    });
    
    // Redimensionamento da janela com recálculo suave
    window.addEventListener('resize', () => {
        // Pausar durante o redimensionamento para evitar saltos
        pauseAutoplay();
        
        // Recalcular dimensões
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        const newMargin = parseInt(window.getComputedStyle(slides[0]).marginRight) || 30;
        const newMoveAmount = newSlideWidth + newMargin;
        
        // Atualizar posição sem animação
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * newMoveAmount}px)`;
        
        // Forçar reflow
        void track.offsetWidth;
        
        // Restaurar transição
        track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Reiniciar autoplay após redimensionamento
        if (isAutoplayEnabled) {
            setTimeout(startAutoplay, 500);
        }
    });
    
    // Adicionar animação de focus quando o mouse passa sobre um slide
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            slides.forEach(s => s.classList.remove('focus'));
            slide.classList.add('focus');
        });
        
        slide.addEventListener('mouseleave', () => {
            slide.classList.remove('focus');
        });
    });
    
    // Adicionar efeito ao botão quando clicado
    [nextButton, prevButton].forEach(button => {
        if (!button) return;
        
        button.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });
    
    // Iniciar na primeira posição com animação suave
    animateToSlide(0);
    
    // Adicionar animações CSS quando o carrossel está visível na tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                track.classList.add('visible');
                // Iniciar autoplay quando visível
                if (isAutoplayEnabled) {
                    startAutoplay();
                }
            } else {
                track.classList.remove('visible');
                // Pausar autoplay quando não visível
                pauseAutoplay();
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(track);
}

// Executa includeHTML quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    includeHTML();
});