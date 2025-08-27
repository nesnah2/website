// Mobile Navigation Toggle - Enhanced for better mobile functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('DOM loaded, looking for menu elements...');
    console.log('Hamburger found:', hamburger);
    console.log('Nav menu found:', navMenu);
    
    // Test function to verify burger menu is working
    function testBurgerMenu() {
        console.log('Testing burger menu functionality...');
        console.log('Hamburger element:', hamburger);
        console.log('Hamburger display:', window.getComputedStyle(hamburger).display);
        console.log('Hamburger visibility:', window.getComputedStyle(hamburger).visibility);
        console.log('Hamburger opacity:', window.getComputedStyle(hamburger).opacity);
        console.log('Hamburger z-index:', window.getComputedStyle(hamburger).zIndex);
        console.log('Hamburger position:', window.getComputedStyle(hamburger).position);
        console.log('Hamburger pointer-events:', window.getComputedStyle(hamburger).pointerEvents);
    }
    
    // Only run navigation code if elements exist
    if (hamburger && navMenu) {
        console.log('Adding click event to hamburger...');
        
        // Test the burger menu initially
        testBurgerMenu();
        
        // Enhanced click handler with better touch support
        hamburger.addEventListener('click', function(e) {
            console.log('Hamburger clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active states
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log('Hamburger active:', hamburger.classList.contains('active'));
            console.log('Nav menu active:', navMenu.classList.contains('active'));
        });
        
        // Add touch events for better mobile support
        hamburger.addEventListener('touchstart', function(e) {
            console.log('Hamburger touch start!');
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active states
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log('Hamburger active:', hamburger.classList.contains('active'));
            console.log('Nav menu active:', navMenu.classList.contains('active'));
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Menu link clicked, closing menu...');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
            
            // Also add touch events for links
            link.addEventListener('touchstart', () => {
                console.log('Menu link touched, closing menu...');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    console.log('Clicking outside menu, closing...');
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
        
        // Close mobile menu when touching outside (mobile specific)
        document.addEventListener('touchstart', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    console.log('Touching outside menu, closing...');
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
        
        console.log('Mobile menu setup complete!');
        
        // Test again after setup
        setTimeout(testBurgerMenu, 1000);
    } else {
        console.error('Mobile menu elements not found!');
        console.error('Hamburger:', hamburger);
        console.error('Nav menu:', navMenu);
    }
});

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handling - Only run if contact form exists
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !service || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature, .service-card, .contact-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('btn-primary')) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add active state to navigation
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active navigation state
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: #667eea !important;
        font-weight: 600;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
    }
`;
document.head.appendChild(style);

// Cookie Consent Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieChoice');
    
    if (!cookieChoice && cookieBanner) {
        cookieBanner.style.display = 'block';
    }
    
    if (acceptCookies) {
        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }
    
    if (declineCookies) {
        declineCookies.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'declined');
            cookieBanner.style.display = 'none';
        });
    }
});

// Calendly Loading Function
function hideCalendlyLoading() {
    const loadingElement = document.getElementById('calendly-loading');
    const calendlyWidget = document.querySelector('.calendly-inline-widget');
    
    if (loadingElement && calendlyWidget) {
        setTimeout(() => {
            loadingElement.style.display = 'none';
            calendlyWidget.style.display = 'block';
        }, 1000); // Small delay to ensure widget is fully loaded
    }
}

// Booking Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookNowBtns = document.querySelectorAll('.book-now-btn');
    const serviceOptions = document.querySelectorAll('.service-option');
    const calendlyWidget = document.querySelector('.calendly-inline-widget');
    
    // Touch event support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Open modal when Book Now buttons are clicked
    bookNowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const price = this.getAttribute('data-price');
            
            // Set the active service option
            serviceOptions.forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-service') === service) {
                    option.classList.add('active');
                }
            });
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Show appropriate content based on service
            showServiceContent(service);
            
            // Add touch event listeners for mobile
            addTouchEventListeners();
        });
    });
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Touch events for mobile modal closing
    function addTouchEventListeners() {
        modal.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        });
        
        modal.addEventListener('touchmove', function(e) {
            touchEndY = e.touches[0].clientY;
        });
        
        modal.addEventListener('touchend', function(e) {
            const touchDiff = touchStartY - touchEndY;
            const modalContent = document.querySelector('.modal-content');
            const modalRect = modalContent.getBoundingClientRect();
            
            // If user swipes down significantly on the modal header, close it
            if (touchDiff < -50 && touchStartY < modalRect.top + 100) {
                closeModal();
            }
        });
    }
    
    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remove touch event listeners
        modal.removeEventListener('touchstart', function(){});
        modal.removeEventListener('touchmove', function(){});
        modal.removeEventListener('touchend', function(){});
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Service option selection
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            
            // Update active state
            serviceOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Show appropriate content based on service
            showServiceContent(service);
        });
    });
    
    // Show appropriate content based on service selection
    function showServiceContent(service) {
        const calendlyContainer = document.querySelector('.calendly-container');
        const calendlyWidget = document.querySelector('.calendly-inline-widget');
        const calendlyLoading = document.getElementById('calendly-loading');
        const contactOptions = document.getElementById('contact-options');
        
        if (service === 'discovery') {
            // Show Calendly for discovery calls
            if (contactOptions) contactOptions.style.display = 'none';
            if (calendlyLoading) calendlyLoading.style.display = 'block';
            if (calendlyWidget) calendlyWidget.style.display = 'none';
            
            // Update Calendly service and reload
            updateCalendlyService(service);
            reloadCalendlyWidget();
        } else {
            // Show contact options for paid services
            if (contactOptions) contactOptions.style.display = 'block';
            if (calendlyLoading) calendlyLoading.style.display = 'none';
            if (calendlyWidget) calendlyWidget.style.display = 'none';
            
            // Update contact options based on service
            updateContactOptions(service);
        }
    }
    
    // Update contact options based on service
    function updateContactOptions(service) {
        const contactHeader = document.querySelector('.contact-header h3');
        const contactDescription = document.querySelector('.contact-header p');
        const emailSubject = document.querySelector('.contact-method a[href^="mailto:"]');
        const whatsappText = document.querySelector('.contact-method a[href^="https://wa.me"]');
        
        if (service === 'single') {
            if (contactHeader) contactHeader.textContent = "Let's Discuss Your Single Session";
            if (contactDescription) contactDescription.textContent = "For your 50-minute intensive session, let's discuss your specific needs and goals first.";
            if (emailSubject) emailSubject.href = "mailto:contact@mikkelhansen.org?subject=Interested in Single Mentoring Session";
            if (whatsappText) whatsappText.href = "https://wa.me/4520922590?text=Hi Mikkel, I'm interested in your single mentoring session. Can we discuss my situation?";
        } else if (service === 'package') {
            if (contactHeader) contactHeader.textContent = "Let's Discuss Your Transformation Journey";
            if (contactDescription) contactDescription.textContent = "For the 3-month transformation package, let's have a detailed conversation about your goals and commitment.";
            if (emailSubject) emailSubject.href = "mailto:contact@mikkelhansen.org?subject=Interested in 3-Month Transformation Package";
            if (whatsappText) whatsappText.href = "https://wa.me/4520922590?text=Hi Mikkel, I'm interested in your 3-month transformation package. Can we discuss my situation and goals?";
        }
    }
    
    // Update Calendly service based on selection
    function updateCalendlyService(service) {
        let calendlyUrl = 'https://calendly.com/contact-mikkelhansen/30min';
        
        switch(service) {
            case 'discovery':
                calendlyUrl = 'https://calendly.com/contact-mikkelhansen/30min';
                break;
            case 'single':
                calendlyUrl = 'https://calendly.com/contact-mikkelhansen/50min';
                break;
            case 'package':
                calendlyUrl = 'https://calendly.com/contact-mikkelhansen/consultation';
                break;
        }
        
        if (calendlyWidget) {
            calendlyWidget.setAttribute('data-url', calendlyUrl);
        }
    }
    
    // Load Calendly widget
    function loadCalendlyWidget() {
        if (typeof Calendly !== 'undefined') {
            Calendly.initInlineWidget({
                url: calendlyWidget.getAttribute('data-url'),
                parentElement: calendlyWidget,
                prefill: {},
                utm: {}
            });
        } else {
            // If Calendly script hasn't loaded yet, wait for it
            const checkCalendly = setInterval(() => {
                if (typeof Calendly !== 'undefined') {
                    clearInterval(checkCalendly);
                    loadCalendlyWidget();
                }
            }, 100);
        }
    }
    
    // Reload Calendly widget with new service
    function reloadCalendlyWidget() {
        if (calendlyWidget) {
            // Clear existing widget
            calendlyWidget.innerHTML = '';
            
            // Show loading
            const loadingElement = document.getElementById('calendly-loading');
            if (loadingElement) {
                loadingElement.style.display = 'block';
            }
            
            // Reload widget
            setTimeout(() => {
                loadCalendlyWidget();
                hideCalendlyLoading();
            }, 500);
        }
    }
    
    // Hide loading when Calendly is ready
    if (typeof Calendly !== 'undefined') {
        Calendly.onEventScheduled = function() {
            hideCalendlyLoading();
        };
    }
});

// Video hover functionality
document.addEventListener('DOMContentLoaded', function() {
    // Video now plays on hover - no JavaScript needed for basic functionality
    // The CSS handles the hover effect automatically
    
    // Mobile-specific improvements
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Improve mobile navigation
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }
        
        // Improve mobile button touch targets
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
        
        // Add touch feedback for mobile
        const touchElements = document.querySelectorAll('.service-card, .testimonial-card, .faq-item');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Prevent zoom on double tap for mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Improve mobile scrolling performance
    if (isMobile) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
                
                // Smooth scroll to answer if opening
                if (!isActive) {
                    setTimeout(() => {
                        answer.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                }
            });
            
            // Add keyboard support for accessibility
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
            
            // Set proper ARIA attributes
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
            
            answer.setAttribute('id', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
            answer.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Update ARIA attributes when FAQ items are toggled
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isActive = item.classList.contains('active');
                        question.setAttribute('aria-expanded', isActive.toString());
                        answer.setAttribute('aria-hidden', (!isActive).toString());
                    }
                });
            });
            
            observer.observe(item, { attributes: true });
        }
    });
});

