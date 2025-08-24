// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
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
        });
    });
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
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
});

