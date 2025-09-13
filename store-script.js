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
        
        // Add event listeners for navigation
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Pause auto-slide on hover
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);
        }
    }
    
    // Contact info interaction
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.addEventListener('click', function() {
            openContactModal();
        });
    }
    
    // Video interaction functionality with iOS compatibility
    const videoCards = document.querySelectorAll('.video-card');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    videoCards.forEach(card => {
        const video = card.querySelector('.video-player');
        const overlay = card.querySelector('.video-overlay');
        const playButton = card.querySelector('.play-button');
        
        if (video && overlay && playButton) {
            // iOS compatibility - ensure video can play inline
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('x-webkit-airplay', 'allow');
            
            // Remove any autoplay or muted attributes that might interfere
            video.removeAttribute('autoplay');
            video.removeAttribute('muted');
            video.removeAttribute('loop');
            
            // Force load video for iOS
            video.load();
            
            // Video play/pause toggle function
            function toggleVideoPlayback() {
                console.log('Toggling video playback, current state:', video.paused ? 'paused' : 'playing');
                
                if (video.paused) {
                    // Play video
                    if (isIOS) {
                        // iOS specific handling
                        video.load();
                        
                        // Wait for video to be ready
                        const tryPlay = () => {
                            if (video.readyState >= 2) {
                                video.play().then(() => {
                                    console.log('Video started playing on iOS');
                                    overlay.style.opacity = '0.3';
                                    updatePlayPauseButton();
                                }).catch(error => {
                                    console.log('iOS video play failed:', error);
                                    // Try one more time after a short delay
                                    setTimeout(() => {
                                        video.play().then(() => {
                                            console.log('Video started playing on iOS (retry)');
                                            overlay.style.opacity = '0.3';
                                            updatePlayPauseButton();
                                        }).catch(err => {
                                            console.log('iOS video play failed (retry):', err);
                                            overlay.innerHTML = '<div class="play-button play">▶</div><div class="play-text">PLAY</div><p>Tap to play video</p>';
                                        });
                                    }, 500);
                                });
                            } else {
                                // Wait for video to load
                                video.addEventListener('canplay', tryPlay, { once: true });
                            }
                        };
                        
                        tryPlay();
                    } else {
                        // Non-iOS handling
                        if (video.readyState >= 2) {
                            const playPromise = video.play();
                            
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    console.log('Video started playing');
                                    overlay.style.opacity = '0.3';
                                    updatePlayPauseButton();
                                }).catch(error => {
                                    console.log('Video play failed:', error);
                                    overlay.innerHTML = '<div class="play-button play">▶</div><div class="play-text">PLAY</div><p>Tap to play video</p>';
                                });
                            }
                        } else {
                            video.addEventListener('canplay', function() {
                                const playPromise = video.play();
                                if (playPromise !== undefined) {
                                    playPromise.then(() => {
                                        console.log('Video started playing after load');
                                        overlay.style.opacity = '0.3';
                                        updatePlayPauseButton();
                                    }).catch(error => {
                                        console.log('Video play failed after load:', error);
                                        overlay.innerHTML = '<div class="play-button play">▶</div><div class="play-text">PLAY</div><p>Tap to play video</p>';
                                    });
                                }
                            }, { once: true });
                        }
                    }
                } else {
                    // Pause video
                    video.pause();
                    console.log('Video paused');
                    overlay.style.opacity = '1';
                    updatePlayPauseButton();
                }
            }
            
            // Function to update play/pause button and text
            function updatePlayPauseButton() {
                const playButton = overlay.querySelector('.play-button');
                const playText = overlay.querySelector('.play-text');
                
                if (video.paused) {
                    playButton.innerHTML = '▶';
                    playButton.classList.remove('pause');
                    playButton.classList.add('play');
                    if (playText) {
                        playText.textContent = 'PLAY';
                        playText.style.display = 'block';
                    }
                } else {
                    playButton.innerHTML = '⏸';
                    playButton.classList.remove('play');
                    playButton.classList.add('pause');
                    if (playText) {
                        playText.textContent = 'PAUSE';
                        playText.style.display = 'block';
                    }
                }
            }
            
            // Hide overlay when video starts playing (less opacity on mobile)
            video.addEventListener('play', function() {
                if (window.innerWidth <= 768) {
                    overlay.style.opacity = '0.1'; // Very subtle on mobile
                } else {
                    overlay.style.opacity = '0.3'; // More visible on desktop
                }
                updatePlayPauseButton();
            });
            
            // Show overlay when video is paused
            video.addEventListener('pause', function() {
                overlay.style.opacity = '1';
                updatePlayPauseButton();
            });
            
            // Show overlay when video ends
            video.addEventListener('ended', function() {
                overlay.style.opacity = '1';
                updatePlayPauseButton();
            });
            
            // Handle iOS video loading issues
            video.addEventListener('loadstart', function() {
                console.log('Video loading started');
            });
            
            video.addEventListener('canplay', function() {
                console.log('Video can start playing');
            });
            
            video.addEventListener('error', function(e) {
                console.log('Video error:', e);
                overlay.innerHTML = '<div class="play-button">⚠️</div><p>Video unavailable</p>';
            });
            
            // iOS requires user interaction - use touchstart for better compatibility
            overlay.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleVideoPlayback();
            }, { passive: false });
            
            // Play/pause video when clicking the overlay
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleVideoPlayback();
            });
            
            // Play/pause video when clicking the play button
            playButton.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleVideoPlayback();
            }, { passive: false });
            
            playButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleVideoPlayback();
            });
            
            // Additional iOS touch events
            video.addEventListener('touchstart', function(e) {
                e.preventDefault();
                toggleVideoPlayback();
            }, { passive: false });
        }
    });

    // Contact modal functionality
    const modal = document.getElementById('contactModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeContactModal();
        });
    }

    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeContactModal();
            }
        });
    }
});

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
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

// Contact modal functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
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

// Contact methods
function contactViaCall() {
    // Get the current page to determine which store
    const currentPage = window.location.pathname.split('/').pop();
    let phoneNumber = '+91-9166334412';
    
    if (currentPage === 'vaibhav_accessories.html') {
        phoneNumber = '+91-9950657242';
    }
    
    showNotification(`Calling store... Please dial ${phoneNumber}`);
    closeContactModal();
}

function contactViaWhatsApp() {
    // Get the current page to determine which store
    const currentPage = window.location.pathname.split('/').pop();
    let whatsappNumber = '919166334412';
    
    if (currentPage === 'vaibhav_accessories.html') {
        whatsappNumber = '919950657242';
    }
    
    showNotification('Opening WhatsApp...');
    // In a real implementation, you would open WhatsApp with the store's number
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    closeContactModal();
}

function contactViaEmail() {
    // Get the current page to determine which store
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
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const video = card.querySelector('.video-player');
        const overlay = card.querySelector('.video-overlay');
        
        if (video && overlay) {
            if (video.paused) {
                overlay.style.opacity = '1';
            } else {
                if (window.innerWidth <= 768) {
                    overlay.style.opacity = '0.1';
                } else {
                    overlay.style.opacity = '0.3';
                }
            }
        }
    });
});
