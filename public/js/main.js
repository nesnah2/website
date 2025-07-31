// Professional Men's Mentoring Website - Main JavaScript
class MensMentoringApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnalytics();
    this.setupPerformanceMonitoring();
    this.initializeServiceWorker();
    this.setupFormHandlers();
    this.setupAnimations();
    this.setupNavigation();
  }

  setupEventListeners() {
    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        this.trackEvent('navigation', 'mobile_menu_toggle');
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          this.trackEvent('navigation', 'smooth_scroll', anchor.getAttribute('href'));
        }
      });
    });

    // Intersection Observer for animations
    this.setupIntersectionObserver();
  }

  setupFormHandlers() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
    }

    // Session booking form
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.handleBookingForm(e));
    }
  }

  async handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Validate form
      if (!this.validateContactForm(data)) {
        return;
      }

      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Thank you for your message. I\'ll get back to you within 24 hours.', 'success');
        form.reset();
        this.trackEvent('form', 'contact_submitted');
      } else {
        this.showNotification(result.message || 'Something went wrong. Please try again.', 'error');
      }

    } catch (error) {
      console.error('Contact form error:', error);
      this.showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleNewsletterForm(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Successfully subscribed to the newsletter!', 'success');
        form.reset();
        this.trackEvent('form', 'newsletter_subscribed');
      } else {
        this.showNotification(result.message || 'Subscription failed.', 'error');
      }

    } catch (error) {
      console.error('Newsletter error:', error);
      this.showNotification('Subscription failed. Please try again.', 'error');
    }
  }

  async handleBookingForm(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      const response = await fetch('/api/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Booking request received. I\'ll contact you within 24 hours to confirm.', 'success');
        form.reset();
        this.trackEvent('form', 'session_booked', data.package);
      } else {
        this.showNotification(result.message || 'Booking failed.', 'error');
      }

    } catch (error) {
      console.error('Booking error:', error);
      this.showNotification('Booking failed. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  validateContactForm(data) {
    const { name, email, message } = data;
    
    if (!name || !email || !message) {
      this.showNotification('Please fill in all required fields.', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showNotification('Please provide a valid email address.', 'error');
      return false;
    }

    if (message.length < 10) {
      this.showNotification('Please provide a more detailed message.', 'error');
      return false;
    }

    return true;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.trackEvent('scroll', 'section_viewed', entry.target.id);
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  setupAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
    `;
    document.head.appendChild(style);
  }

  setupNavigation() {
    // Sticky navigation
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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
  }

  initializeAnalytics() {
    // Google Analytics
    if (window.gtag) {
      this.trackEvent('page_view', 'homepage_loaded');
    }

    // Custom analytics
    this.trackPageView();
  }

  trackEvent(category, action, label = null) {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }

    // Custom tracking
    console.log('Event tracked:', { category, action, label });
  }

  trackPageView() {
    const page = window.location.pathname;
    this.trackEvent('page_view', page);
  }

  setupPerformanceMonitoring() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.trackEvent('performance', 'lcp', Math.round(entry.startTime));
          }
          if (entry.entryType === 'first-input') {
            this.trackEvent('performance', 'fid', Math.round(entry.processingStart - entry.startTime));
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }

    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.trackEvent('performance', 'page_load_time', Math.round(loadTime));
    });
  }

  async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MensMentoringApp();
});

// Export for use in other modules
window.MensMentoringApp = MensMentoringApp; 