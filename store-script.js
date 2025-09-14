// Store-specific JavaScript functionality

// Hero Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-slide functionality
let slideInterval;

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider
    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
        
        // Pause auto-slide on hover
        slides.forEach(slide => {
            slide.addEventListener('mouseenter', stopAutoSlide);
            slide.addEventListener('mouseleave', startAutoSlide);
        });
    }
    
    // Contact info click handler
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.addEventListener('click', function() {
            openContactModal();
        });
    }
    
    // Vimeo video functionality
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Add iOS class to body for CSS targeting
    if (isIOS) {
        document.body.classList.add('ios-device');
    }
    
    // Initialize Vimeo players when API is loaded
    function initializeVimeoPlayers() {
        const iframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]');
        
        iframes.forEach((iframe, index) => {
            console.log(`Setting up Vimeo player ${index + 1} - iOS: ${isIOS}`);
            
            // Create Vimeo player instance
            const player = new Vimeo.Player(iframe);
            
            // Vimeo player events
            player.ready().then(function() {
                console.log('Vimeo player ready');
            });
            
            player.on('play', function() {
                console.log('Vimeo video started playing');
            });
            
            player.on('pause', function() {
                console.log('Vimeo video paused');
            });
            
            player.on('ended', function() {
                console.log('Vimeo video ended');
            });
            
            player.on('error', function(error) {
                console.log('Vimeo player error:', error);
            });
        });
    }
    
    // Wait for Vimeo API to load
    if (typeof Vimeo !== 'undefined') {
        initializeVimeoPlayers();
    } else {
        // Wait for Vimeo API script to load
        window.addEventListener('load', function() {
            if (typeof Vimeo !== 'undefined') {
                initializeVimeoPlayers();
            }
        });
    }

    // Contact modal functionality
    const modal = document.getElementById('contactModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeContactModal();
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
});

// Contact modal functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Contact functions with dynamic contact details
function contactViaCall() {
    const currentPage = window.location.pathname.split('/').pop();
    let phone = '+1 (555) 123-4567';
    
    if (currentPage === 'vaibhav_accessories.html') {
        phone = '+91 98765 43210';
    }
    
    showNotification('Opening phone dialer...');
    window.location.href = `tel:${phone}`;
    closeContactModal();
}

function contactViaWhatsApp() {
    const currentPage = window.location.pathname.split('/').pop();
    let phone = '+15551234567';
    let message = 'Hello! I am interested in your products.';
    
    if (currentPage === 'vaibhav_accessories.html') {
        phone = '+919876543210';
        message = 'Hello! I am interested in your accessories.';
    }
    
    showNotification('Opening WhatsApp...');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeContactModal();
}

function contactViaEmail() {
    const currentPage = window.location.pathname.split('/').pop();
    let email = 'store@example.com';
    
    if (currentPage === 'vaibhav_accessories.html') {
        email = 'vaibhavaccessories@gmail.com';
    }
    
    showNotification('Opening email client...');
    // In a real implementation, you would open the default email client
    window.location.href = `mailto:${email}`;
    closeContactModal();
}

// Smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle window resize for mobile/desktop switching
window.addEventListener('resize', function() {
    // This function is no longer needed since we're using native controls
    console.log('Window resized - using native video controls');
});

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
