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
    
    // Video interaction functionality with comprehensive iOS support
    const videoCards = document.querySelectorAll('.video-card');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    console.log('iOS detected:', isIOS);
    
    videoCards.forEach((card, index) => {
        const video = card.querySelector('.video-player');
        const overlay = card.querySelector('.video-overlay');
        const playButton = card.querySelector('.play-button');
        
        if (video && overlay && playButton) {
            console.log(`Setting up video ${index + 1}`);
            
            // iOS-specific setup
            if (isIOS) {
                // Set all iOS-required attributes
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('x-webkit-airplay', 'allow');
                video.setAttribute('muted', 'true'); // Start muted for iOS
                video.setAttribute('preload', 'none'); // Don't preload on iOS
                
                // Remove any problematic attributes
                video.removeAttribute('autoplay');
                video.removeAttribute('loop');
                
                // Force reload for iOS
                video.load();
            } else {
                // Non-iOS setup - ensure audio works
                video.removeAttribute('muted'); // Remove muted for non-iOS
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('x-webkit-airplay', 'allow');
            }
            
            // Platform-optimized play function
            function playVideo() {
                console.log('Attempting to play video...');
                
                if (isIOS) {
                    // iOS requires user interaction and muted start
                    video.muted = true;
                    
                    const playPromise = video.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log('Video started playing on iOS (muted)');
                            overlay.style.opacity = window.innerWidth <= 768 ? '0.1' : '0.3';
                            updatePlayPauseButton();
                            
                            // Try to unmute after video starts
                            setTimeout(() => {
                                video.muted = false;
                                console.log('Video unmuted on iOS');
                            }, 500);
                        }).catch(error => {
                            console.log('iOS video play failed:', error);
                            
                            // Show error message
                            overlay.innerHTML = '<div class="play-button play">▶</div><div class="play-text">TAP TO PLAY</div><p>Tap to play video</p>';
                        });
                    }
                } else {
                    // Non-iOS handling - ensure audio is enabled
                    video.muted = false; // Ensure not muted for non-iOS
                    
                    const playPromise = video.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log('Video started playing with audio on non-iOS');
                            overlay.style.opacity = window.innerWidth <= 768 ? '0.1' : '0.3';
                            updatePlayPauseButton();
                        }).catch(error => {
                            console.log('Video play failed:', error);
                            overlay.innerHTML = '<div class="play-button play">▶</div><div class="play-text">PLAY</div><p>Tap to play video</p>';
                        });
                    }
                }
            }
            
            // Function to pause video
            function pauseVideo() {
                video.pause();
                overlay.style.opacity = '1';
                updatePlayPauseButton();
            }
            
            // Main toggle function
            function toggleVideoPlayback() {
                console.log('Video toggle clicked, paused:', video.paused);
                
                if (video.paused) {
                    playVideo();
                } else {
                    pauseVideo();
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
            
            // iOS-specific event handling
            if (isIOS) {
                // Use touchstart for iOS
                overlay.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('iOS touchstart on overlay');
                    toggleVideoPlayback();
                }, { passive: false });
                
                playButton.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('iOS touchstart on button');
                    toggleVideoPlayback();
                }, { passive: false });
                
                video.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('iOS touchstart on video');
                    toggleVideoPlayback();
                }, { passive: false });
                
                // Also add click as fallback
                overlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('iOS click on overlay');
                    toggleVideoPlayback();
                });
                
                playButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('iOS click on button');
                    toggleVideoPlayback();
                });
            } else {
                // Standard click events for non-iOS
                overlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    toggleVideoPlayback();
                });
                
                playButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    toggleVideoPlayback();
                });
            }
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
