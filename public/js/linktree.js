// Linktree Page JavaScript - Simplified version without mobile menu functionality

document.addEventListener('DOMContentLoaded', function() {
    // Booking functionality
    const bookCallButtons = document.querySelectorAll('.book-now-btn');
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close');
    const serviceOptions = document.querySelectorAll('.service-option');
    const calendlyWidget = document.querySelector('.calendly-inline-widget');
    const calendlyLoading = document.getElementById('calendly-loading');
    const contactOptions = document.getElementById('contact-options');

    // Open booking modal
    bookCallButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.dataset.service;
            const price = this.dataset.price;
            
            // Update service selection
            serviceOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.service === service) {
                    option.classList.add('active');
                }
            });
            
            // Show appropriate content based on service
            if (service === 'discovery') {
                calendlyWidget.style.display = 'block';
                contactOptions.style.display = 'none';
                calendlyLoading.style.display = 'none';
            } else {
                calendlyWidget.style.display = 'none';
                contactOptions.style.display = 'block';
                calendlyLoading.style.display = 'none';
            }
            
            bookingModal.style.display = 'block';
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            bookingModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Service option selection
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            serviceOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            const service = this.dataset.service;
            
            // Show appropriate content
            if (service === 'discovery') {
                calendlyWidget.style.display = 'block';
                contactOptions.style.display = 'none';
                calendlyLoading.style.display = 'none';
            } else {
                calendlyWidget.style.display = 'none';
                contactOptions.style.display = 'block';
                calendlyLoading.style.display = 'none';
            }
        });
    });

    // Initialize Calendly widget
    if (typeof Calendly !== 'undefined') {
        Calendly.initInlineWidget({
            url: 'https://calendly.com/contact-mikkelhansen/30min',
            parentElement: calendlyWidget,
            onEventScheduled: function() {
                // Handle successful booking
                console.log('Event scheduled successfully');
            }
        });
    } else {
        // Fallback if Calendly script hasn't loaded yet
        window.addEventListener('load', function() {
            if (typeof Calendly !== 'undefined') {
                Calendly.initInlineWidget({
                    url: 'https://calendly.com/contact-mikkelhansen/30min',
                    parentElement: calendlyWidget,
                    onEventScheduled: function() {
                        console.log('Event scheduled successfully');
                    }
                });
            }
        });
    }

    // Smooth scrolling for anchor links (if any)
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

    // Add loading animation for Calendly
    if (calendlyLoading) {
        setTimeout(() => {
            if (calendlyLoading.style.display !== 'none') {
                calendlyLoading.style.display = 'none';
            }
        }, 3000); // Hide loading after 3 seconds
    }
});
