// Optimized JavaScript for Men's Mentoring Website

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initLazyLoading();
    initQuiz();
    initContactForm();
    initPerformanceOptimizations();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        // Toggle navigation menu
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close navigation menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });

        // Close navigation menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    }

    // Add scroll-based navbar styling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    if (window.scrollY > 50) {
                        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
                    } else {
                        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Quiz functionality
function initQuiz() {
    const quizForm = document.getElementById('defaultModeQuiz');
    const quizResults = document.getElementById('quizResults');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const resultMessage = document.getElementById('resultMessage');

    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            let totalScore = 0;
            let answeredQuestions = 0;
            
            // Calculate score
            for (let i = 1; i <= 5; i++) {
                const answer = formData.get(`q${i}`);
                if (answer) {
                    totalScore += parseInt(answer);
                    answeredQuestions++;
                }
            }
            
            if (answeredQuestions === 5) {
                const averageScore = totalScore / 5;
                displayQuizResults(averageScore);
            } else {
                alert('Please answer all questions to get your results.');
            }
        });
    }

    function displayQuizResults(averageScore) {
        let resultText = '';
        let message = '';
        
        if (averageScore <= 1.5) {
            resultText = 'Low Default Mode';
            message = 'You\'re living authentically and making conscious choices. Keep up the great work!';
        } else if (averageScore <= 2.5) {
            resultText = 'Moderate Default Mode';
            message = 'You have some awareness but may be operating on autopilot in certain areas. This is a great opportunity for growth.';
        } else if (averageScore <= 3.5) {
            resultText = 'High Default Mode';
            message = 'You\'re likely feeling stuck and disconnected from your authentic self. This is exactly what we work on together.';
        } else {
            resultText = 'Very High Default Mode';
            message = 'You\'re deeply entrenched in default mode patterns. The good news? You\'re ready for transformation.';
        }
        
        scoreDisplay.innerHTML = `
            <div style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">${resultText}</div>
            <div style="font-size: 1.2rem; margin-bottom: 2rem;">Score: ${averageScore.toFixed(1)}/4</div>
        `;
        
        resultMessage.innerHTML = `<p style="font-size: 1.1rem; line-height: 1.6;">${message}</p>`;
        
        document.getElementById('defaultModeQuiz').style.display = 'none';
        quizResults.style.display = 'block';
        
        // Smooth scroll to results
        quizResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success response
                formResponse.textContent = 'Thank you! Your message has been sent. I\'ll get back to you within 24 hours.';
                formResponse.style.color = '#059669';
                formResponse.style.display = 'block';
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Improve touch targets
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.touchAction = 'manipulation';
    });

    // Add loading states for better UX
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.id.includes('contactForm')) {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'Processing...';
                    submitBtn.disabled = true;
                    
                    // Reset button after 3 seconds (simulate form submission)
                    setTimeout(() => {
                        submitBtn.textContent = 'Submit';
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        }
    });

    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        document.querySelectorAll('.expectation-card, .testimonial-card, .pricing-option, .faq-item').forEach(el => {
            animationObserver.observe(el);
        });
    }

    // Preload critical resources
    const criticalResources = [
        '/assets/mentor.jpg',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.includes('.jpg') ? 'image' : 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Analytics tracking (if needed)
function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    // Add other analytics tracking here
}

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 