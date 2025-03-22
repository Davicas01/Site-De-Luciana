// Enhanced carousel functionality for better user experience
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components after DOM is fully loaded
    initCarousel();
    enhanceScrollReveal();
});

function initCarousel() {
    const track = document.querySelector('.carousel__track');
    
    // Exit if no carousel track exists on the page
    if (!track) return;
    
    const articles = Array.from(track.querySelectorAll('.card__article'));
    const nextButton = document.querySelector('.carousel__button--right');
    const prevButton = document.querySelector('.carousel__button--left');
    const indicatorsContainer = document.querySelector('.carousel__indicators');
    const autoplayControl = document.querySelector('.carousel__autoplay-control');
    
    // Check if we have enough articles
    if (articles.length < 1) return;
    
    // Clone first and last articles for the infinite carousel effect
    const firstCardClone = articles[0].cloneNode(true);
    const lastCardClone = articles[articles.length - 1].cloneNode(true);
    
    // Add identifying classes to the clones
    firstCardClone.classList.add('clone');
    lastCardClone.classList.add('clone');
    
    // Add clones to the track
    track.appendChild(firstCardClone);
    track.insertBefore(lastCardClone, articles[0]);
    
    // Get card dimensions for moving the carousel
    const cardWidth = articles[0].getBoundingClientRect().width;
    const cardMargin = parseInt(window.getComputedStyle(articles[0]).marginRight) || 30;
    const cardMoveDistance = cardWidth + cardMargin;
    
    // Set up carousel state
    let currentIndex = 1; // Start at index 1 (after the cloned last card)
    const totalCards = track.querySelectorAll('.card__article').length;
    const visibleCards = articles.length; // Number of original cards
    let isTransitioning = false;
    let autoplayTimer;
    let autoplayEnabled = true;
    const autoplayInterval = 5000; // 5 seconds between slides
    
    // Create indicators for the carousel
    createIndicators();
    
    // Set up autoplay controls
    setupAutoplayControl();
    
    // Position carousel at first real slide (not clone)
    updateCarousel(false);
    updateIndicators();
    
    // Create indicators function
    function createIndicators() {
        if (!indicatorsContainer) return;
        
        // Clear any existing indicators
        indicatorsContainer.innerHTML = '';
        
        // Create an indicator for each real slide (not clones)
        for (let i = 0; i < visibleCards; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel__indicator');
            indicator.dataset.index = i + 1; // +1 because first item is a clone
            
            // Add click event to jump to the corresponding slide
            indicator.addEventListener('click', () => {
                if (isTransitioning) return;
                
                goToSlide(i + 1);
                pauseAutoplay();
                if (autoplayEnabled) {
                    setTimeout(startAutoplay, autoplayInterval);
                }
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update active indicators
    function updateIndicators() {
        if (!indicatorsContainer) return;
        
        const indicators = indicatorsContainer.querySelectorAll('.carousel__indicator');
        const activeIndex = currentIndex - 1; // -1 to account for the first clone
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to current indicator
        // Use modulo to handle the case when at clone slides
        const targetIndex = (activeIndex + visibleCards) % visibleCards;
        if (indicators[targetIndex]) {
            indicators[targetIndex].classList.add('active');
        }
    }
    
    // Set up autoplay control
    function setupAutoplayControl() {
        if (!autoplayControl) return;
        
        // Toggle autoplay on click
        autoplayControl.addEventListener('click', () => {
            toggleAutoplay();
        });
        
        // Start autoplay initially
        startAutoplay();
    }
    
    // Start autoplay function
    function startAutoplay() {
        if (!autoplayEnabled) return;
        
        // Clear existing timer if any
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
        
        // Start new timer
        autoplayTimer = setInterval(() => {
            if (!isTransitioning) {
                goToSlide(currentIndex + 1);
            }
        }, autoplayInterval);
        
        // Update control button appearance
        if (autoplayControl) {
            autoplayControl.classList.remove('paused');
        }
    }
    
    // Pause autoplay function
    function pauseAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
        
        // Update control button appearance
        if (autoplayControl) {
            autoplayControl.classList.add('paused');
        }
    }
    
    // Toggle autoplay function
    function toggleAutoplay() {
        autoplayEnabled = !autoplayEnabled;
        
        if (autoplayEnabled) {
            startAutoplay();
        } else {
            pauseAutoplay();
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = index;
        
        // Handle the infinite carousel logic
        updateCarousel();
        updateIndicators();
        
        // Mark when transition ends
        setTimeout(finishTransition, 500); // Match this with the CSS transition time
    }
    
    // Update carousel position
    function updateCarousel(animate = true) {
        const translateValue = -currentIndex * cardMoveDistance;
        
        // Apply or remove transition based on whether we want animation
        track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        track.style.transform = `translateX(${translateValue}px)`;
        
        // Check if we need to snap to the other end (for infinite carousel effect)
        if (currentIndex === 0 || currentIndex === totalCards - 1) {
            setTimeout(() => {
                // After transition completes, snap without animation
                track.style.transition = 'none';
                
                // If at first clone, snap to real last item
                if (currentIndex === 0) {
                    currentIndex = totalCards - 2; // Second last (last real item)
                } 
                // If at last clone, snap to real first item
                else if (currentIndex === totalCards - 1) {
                    currentIndex = 1; // Second item (first real item)
                }
                
                const newTranslateValue = -currentIndex * cardMoveDistance;
                track.style.transform = `translateX(${newTranslateValue}px)`;
                
                updateIndicators();
            }, animate ? 500 : 0); // Match this with the CSS transition time
        }
    }
    
    // Handle transition end state
    function finishTransition() {
        isTransitioning = false;
    }
    
    // Next button click handler
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(currentIndex + 1);
                
                // Pause and restart autoplay if enabled
                pauseAutoplay();
                if (autoplayEnabled) {
                    setTimeout(startAutoplay, autoplayInterval);
                }
            }
        });
    }
    
    // Previous button click handler
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(currentIndex - 1);
                
                // Pause and restart autoplay if enabled
                pauseAutoplay();
                if (autoplayEnabled) {
                    setTimeout(startAutoplay, autoplayInterval);
                }
            }
        });
    }
    
    // Set up swipe navigation
    setupTouchNavigation();
    
    // Touch/swipe navigation 
    function setupTouchNavigation() {
        let startX, moveX, threshold = 100;
        let isDown = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDown = true;
            pauseAutoplay();
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            
            // Prevent scrolling the page when swiping the carousel
            if (Math.abs(diff) > 5) {
                e.preventDefault();
            }
        }, { passive: false });
        
        track.addEventListener('touchend', (e) => {
            isDown = false;
            
            if (!moveX) return;
            
            const diff = moveX - startX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe right - go to previous
                    goToSlide(currentIndex - 1);
                } else {
                    // Swipe left - go to next
                    goToSlide(currentIndex + 1);
                }
            }
            
            // Restart autoplay if enabled
            if (autoplayEnabled) {
                setTimeout(startAutoplay, autoplayInterval);
            }
            
            // Reset variables
            startX = null;
            moveX = null;
        }, { passive: true });
        
        // Also handle mouse events for desktop swiping
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDown = true;
            pauseAutoplay();
            track.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            moveX = e.clientX;
        });
        
        track.addEventListener('mouseup', (e) => {
            isDown = false;
            track.style.cursor = 'grab';
            
            if (!moveX) return;
            
            const diff = moveX - startX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe right - go to previous
                    goToSlide(currentIndex - 1);
                } else {
                    // Swipe left - go to next
                    goToSlide(currentIndex + 1);
                }
            }
            
            // Restart autoplay if enabled
            if (autoplayEnabled) {
                setTimeout(startAutoplay, autoplayInterval);
            }
            
            // Reset variables
            startX = null;
            moveX = null;
        });
        
        track.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                track.style.cursor = 'grab';
                
                // Restart autoplay if enabled
                if (autoplayEnabled) {
                    setTimeout(startAutoplay, autoplayInterval);
                }
            }
        });
    }
    
    // Handle window resizing
    window.addEventListener('resize', () => {
        // Recalculate dimensions on window resize
        const newCardWidth = articles[0].getBoundingClientRect().width;
        const newCardMargin = parseInt(window.getComputedStyle(articles[0]).marginRight) || 30;
        
        // Update values if they changed
        if (newCardWidth !== cardWidth) {
            // Update carousel without animation
            updateCarousel(false);
        }
    });
    
    // Pause autoplay when user hovers over carousel
    track.addEventListener('mouseenter', () => {
        pauseAutoplay();
    });
    
    // Resume autoplay when user leaves carousel
    track.addEventListener('mouseleave', () => {
        if (autoplayEnabled) {
            startAutoplay();
        }
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause when tab is not visible
            pauseAutoplay();
        } else if (autoplayEnabled) {
            // Resume when tab becomes visible again
            startAutoplay();
        }
    });
}

// Enhanced ScrollReveal for better animation effects
function enhanceScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;
    
    // Common config with improved easing
    const srConfig = {
        origin: 'bottom',
        distance: '30px',
        duration: 800,
        delay: 100,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        reset: false
    };
    
    // Home section animations
    ScrollReveal().reveal('.section-title', {
        ...srConfig,
        origin: 'top',
        delay: 100
    });
    
    ScrollReveal().reveal('.section-intro', {
        ...srConfig,
        delay: 200
    });
    
    // Services section animations
    ScrollReveal().reveal('.service-item', {
        ...srConfig,
        origin: 'right',
        interval: 100,
        delay: 300
    });
    
    // About section animations
    ScrollReveal().reveal('.about-img', {
        ...srConfig,
        origin: 'left',
        delay: 200
    });
    
    ScrollReveal().reveal('.about-text', {
        ...srConfig,
        origin: 'right',
        delay: 300
    });
    
    ScrollReveal().reveal('.highlight-item', {
        ...srConfig,
        origin: 'bottom',
        interval: 100,
        delay: 400
    });
}