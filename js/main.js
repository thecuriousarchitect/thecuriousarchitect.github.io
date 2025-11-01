// ==========================
// Main JavaScript
// ==========================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initNewsletterForm();
    initLazyLoading();
    initScrollReveal();
    initFeaturedStory();
    initCategoryCards();
});

// ==========================
// Navigation
// ==========================

function initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Add shadow to nav on scroll
    const nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 50) {
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }, 100));
    }
}

// ==========================
// Newsletter Form
// ==========================

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showMessage(newsletterMessage, 'Please enter a valid email address.', 'error');
                return;
            }
            
            // Save to localStorage (in production, this would submit to a backend)
            const subscribers = getLocalStorage('newsletter_subscribers') || [];
            
            if (subscribers.includes(email)) {
                showMessage(newsletterMessage, 'You are already subscribed!', 'info');
                return;
            }
            
            subscribers.push(email);
            setLocalStorage('newsletter_subscribers', subscribers);
            
            showMessage(newsletterMessage, 'Thank you for subscribing! Welcome to The Curious Architect community.', 'success');
            emailInput.value = '';
            
            // In production, you would send this to a service like Mailchimp, ConvertKit, etc.
            console.log('New subscriber:', email);
        });
    }
}

function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `newsletter-message ${type}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// ==========================
// Lazy Loading
// ==========================

function initLazyLoading() {
    lazyLoadImages();
}

// ==========================
// Scroll Reveal
// ==========================

function initScrollReveal() {
    // Add reveal class to elements that should animate on scroll
    const elementsToReveal = document.querySelectorAll('.featured-story, .categories, .newsletter');
    elementsToReveal.forEach(el => el.classList.add('reveal'));
    
    revealOnScroll();
}

// ==========================
// Featured Story (Homepage)
// ==========================

async function initFeaturedStory() {
    const featuredStoryContainer = document.getElementById('featuredStory');
    
    if (!featuredStoryContainer) return;
    
    try {
        const data = await fetchJSON('data/buildings.json');
        
        if (!data || !data.buildings) {
            featuredStoryContainer.innerHTML = '<p>Unable to load featured story. Please check back later.</p>';
            return;
        }
        
        // Find featured building
        const featuredBuilding = data.buildings.find(b => b.featuredOnHomepage) || data.buildings[0];
        
        if (!featuredBuilding) {
            featuredStoryContainer.innerHTML = '<p>No featured story available.</p>';
            return;
        }
        
        // Render featured story
        const readingTime = calculateReadingTime(featuredBuilding.fullStory || featuredBuilding.description);
        
        featuredStoryContainer.innerHTML = `
            <div class="featured-image-wrapper">
                <img src="${featuredBuilding.mainImage}" alt="${featuredBuilding.title}" class="featured-image" loading="lazy">
            </div>
            <div class="featured-text">
                <h3>${featuredBuilding.title}</h3>
                <div class="featured-meta">
                    <span>📍 ${featuredBuilding.location}</span>
                    <span>👤 ${featuredBuilding.architect}</span>
                    ${featuredBuilding.yearBuilt ? `<span>📅 ${featuredBuilding.yearBuilt}</span>` : ''}
                </div>
                <p class="read-time">${readingTime} min read</p>
                <p>${featuredBuilding.description}</p>
                <a href="stories/${featuredBuilding.id}.html" class="btn btn-primary">Read Full Story</a>
            </div>
        `;
        
        featuredStoryContainer.classList.add('fade-in');
    } catch (error) {
        console.error('Error loading featured story:', error);
        featuredStoryContainer.innerHTML = '<p>Unable to load featured story. Please check back later.</p>';
    }
}

// ==========================
// Category Cards
// ==========================

function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `gallery.html?category=${category}`;
        });
        
        // Add stagger animation
        const index = Array.from(categoryCards).indexOf(card);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// ==========================
// Contact Form (if on contact page)
// ==========================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('#name').value.trim(),
            email: contactForm.querySelector('#email').value.trim(),
            subject: contactForm.querySelector('#subject').value.trim(),
            message: contactForm.querySelector('#message').value.trim()
        };
        
        // Validate
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormMessage(formMessage, 'Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showFormMessage(formMessage, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // In production, this would submit to Formspree or similar service
        // For now, simulate submission
        setTimeout(() => {
            showFormMessage(formMessage, 'Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            
            // Log to console (in production, this would be sent to backend)
            console.log('Form submission:', formData);
        }, 1000);
    });
}

function showFormMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `form-message ${type}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}
