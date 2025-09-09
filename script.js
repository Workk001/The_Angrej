// Modern Showcase JavaScript with Animations

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.store-card, .header-content, .floating-shapes').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for floating shapes
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Card hover effects
function setupCardEffects() {
    const cards = document.querySelectorAll('.store-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-20px) rotateX(5deg) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
        });
        
        // Mouse move parallax effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Smooth scroll for any internal links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading animation
function setupLoadingAnimation() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Start counter animation after a short delay
        setTimeout(() => {
            animateCounters();
        }, 500);
    });
}

// Navigation function
function navigateToStore(storeType) {
    // Add exit animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // Navigate to the appropriate store page
        switch(storeType) {
            case 'clothing1':
                window.location.href = 'clothing1.html';
                break;
            case 'clothing2':
                window.location.href = 'clothing2.html';
                break;
            case 'accessories':
                window.location.href = 'accessories.html';
                break;
            default:
                console.log('Unknown store type:', storeType);
        }
    }, 300);
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    setupParallax();
    setupCardEffects();
    setupSmoothScroll();
    setupLoadingAnimation();
    
    // Add loading class for initial animation
    document.body.classList.add('loading');
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    .loading {
        opacity: 0;
        transform: scale(0.95);
        transition: all 0.5s ease;
    }
    
    .loaded {
        opacity: 1;
        transform: scale(1);
    }
    
    .animate {
        animation-play-state: running !important;
    }
`;
document.head.appendChild(style);