// ==========================================================================
// ZOMATO CLONE INTERACTIVE LOGIC (script.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initFeatureBadges();
    initSearchTypingEffect();
    initSearchSuggestions();
    initAuthModals();
    initAppDownloadModal();
    initOffersAction();
    initCategoryCards();
    initForms();
    initFooterInteractions();
});

/**
 * Sticky Header on Scroll with Frosted Glass Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBtn.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleBtn.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });
}

/**
 * Dynamically attach modern icon badges to feature cards
 */
function initFeatureBadges() {
    const features = document.querySelectorAll('.feature');
    const icons = ['⚡', '🍽️', '💳', '🛡️', '📍'];

    features.forEach((card, index) => {
        if (card.querySelector('.feature-icon-badge')) return;

        const badge = document.createElement('div');
        badge.className = 'feature-icon-badge';
        badge.textContent = icons[index % icons.length];
        card.insertBefore(badge, card.firstChild);
    });
}

/**
 * Animated dynamic placeholder typing effect in search input
 */
function initSearchTypingEffect() {
    const searchInput = document.querySelector('main > section:first-of-type input');
    if (!searchInput) return;

    const dishes = [
        'Search for "Biryani"...',
        'Search for "Butter Chicken"...',
        'Search for "Paneer Tikka"...',
        'Search for "Pizza & Burgers"...',
        'Search for "Kathua Famous Kalari Kulcha"...',
        'Search for "Momos & Noodles"...',
        'Search for "Coffee & Bakery"...'
    ];

    let currentDishIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;
    let isFocused = false;

    searchInput.addEventListener('focus', () => {
        isFocused = true;
        searchInput.placeholder = 'Search for restaurant, cuisine or a dish';
    });

    searchInput.addEventListener('blur', () => {
        isFocused = false;
        if (!searchInput.value) {
            typeEffect();
        }
    });

    function typeEffect() {
        if (isFocused || searchInput.value) return;

        const currentText = dishes[currentDishIndex];

        if (isDeleting) {
            searchInput.placeholder = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            searchInput.placeholder = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 1800; // Pause at full text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentDishIndex = (currentDishIndex + 1) % dishes.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
}

/**
 * Live search suggestions dropdown with popular dishes and restaurants
 */
function initSearchSuggestions() {
    const heroSection = document.querySelector('main > section:first-of-type');
    const searchInput = heroSection?.querySelector('input');
    if (!heroSection || !searchInput) return;

    const sampleDatabase = [
        { name: 'Biryani Special', type: 'Dish', icon: '🍲' },
        { name: 'Kalari Kulcha (Kathua Special)', type: 'Local Delicacy', icon: '🫓' },
        { name: 'Domino\'s Pizza', type: 'Restaurant', icon: '🍕' },
        { name: 'KFC Chicken Burgers', type: 'Fast Food', icon: '🍔' },
        { name: 'Royal Tandoori Dhaba', type: 'Dine-Out', icon: '🥘' },
        { name: 'Chai & Snacks Corner', type: 'Cafe', icon: '☕' },
        { name: 'Sweet Tooth Bakery & Cakes', type: 'Dessert', icon: '🍰' },
        { name: 'Green Salad & Healthy Bowls', type: 'Healthy Food', icon: '🥗' }
    ];

    // Create suggestions wrapper
    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'search-suggestions';
    heroSection.appendChild(suggestionsBox);

    function renderSuggestions(query = '') {
        const filtered = sampleDatabase.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            suggestionsBox.innerHTML = `
                <div class="suggestion-item" style="color: #94a3b8; justify-content: center; cursor: default;">
                    No results found for "${escapeHtml(query)}"
                </div>
            `;
        } else {
            suggestionsBox.innerHTML = filtered.map(item => `
                <div class="suggestion-item" data-query="${escapeHtml(item.name)}">
                    <span class="item-icon">${item.icon}</span>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 500;">${highlightMatch(item.name, query)}</span>
                        <span style="font-size: 12px; color: #828282;">${item.type}</span>
                    </div>
                </div>
            `).join('');
        }

        suggestionsBox.classList.add('show');
    }

    searchInput.addEventListener('input', (e) => {
        renderSuggestions(e.target.value.trim());
    });

    searchInput.addEventListener('focus', () => {
        renderSuggestions(searchInput.value.trim());
    });

    // Handle suggestion item click
    suggestionsBox.addEventListener('click', (e) => {
        const item = e.target.closest('.suggestion-item');
        if (item && item.dataset.query) {
            searchInput.value = item.dataset.query;
            suggestionsBox.classList.remove('show');
            showToast(`Exploring "${item.dataset.query}" in Kathua...`);
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.remove('show');
        }
    });

    // Handle Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            suggestionsBox.classList.remove('show');
            showToast(`Searching restaurants serving "${searchInput.value.trim()}" in Kathua...`);
        }
    });
}

/**
 * Interactive Login & Signup Modals
 */
function initAuthModals() {
    // Create modal HTML
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'z-modal-overlay';
    modalOverlay.id = 'authModalOverlay';
    modalOverlay.innerHTML = `
        <div class="z-modal">
            <button class="z-modal-close" aria-label="Close modal">&times;</button>
            <h2 class="z-modal-title" id="authTitle">Login</h2>
            <form id="authForm">
                <div class="z-form-group" id="nameGroup" style="display: none;">
                    <label for="userName">Full Name</label>
                    <input type="text" id="userName" placeholder="Enter your full name">
                </div>
                <div class="z-form-group">
                    <label for="userPhoneEmail">Phone Number or Email</label>
                    <input type="text" id="userPhoneEmail" placeholder="e.g. +91 98765 43210" required>
                </div>
                <button type="submit" class="z-modal-btn" id="authSubmitBtn">Send One Time Password (OTP)</button>
            </form>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('.z-modal-close');
    const authTitle = modalOverlay.querySelector('#authTitle');
    const nameGroup = modalOverlay.querySelector('#nameGroup');
    const authSubmitBtn = modalOverlay.querySelector('#authSubmitBtn');
    const authForm = modalOverlay.querySelector('#authForm');

    function openModal(type) {
        if (type === 'signup') {
            authTitle.textContent = 'Sign up for Zomato';
            nameGroup.style.display = 'block';
            authSubmitBtn.textContent = 'Create Account';
        } else {
            authTitle.textContent = 'Log in to Zomato';
            nameGroup.style.display = 'none';
            authSubmitBtn.textContent = 'Send One Time Password';
        }
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        authForm.reset();
    }

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contactVal = document.getElementById('userPhoneEmail').value.trim();
        if (!contactVal) return;

        closeModal();
        showToast(`Verification OTP sent to ${contactVal}!`);
    });

    // Attach to nav buttons & links
    document.querySelectorAll('.nav-btn-login, #navLogin').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    });

    document.querySelectorAll('.nav-btn-signup, #navSignup').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('signup');
        });
    });
}

/**
 * Interactive 'Get the App' Modal with QR Code & SMS Link
 */
function initAppDownloadModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'z-modal-overlay';
    modalOverlay.id = 'appDownloadModal';
    modalOverlay.innerHTML = `
        <div class="z-modal" style="max-width: 500px;">
            <button class="z-modal-close" aria-label="Close modal">&times;</button>
            <h2 class="z-modal-title" style="margin-bottom: 8px;">Get the Zomato App</h2>
            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">
                Scan the QR code or enter your mobile number to get the direct download link.
            </p>

            <div class="app-modal-body">
                <div class="app-modal-qr">
                    <div class="qr-placeholder">
                        <div style="font-size: 32px; margin-bottom: 4px;">📲</div>
                        <span>Scan with Camera</span>
                    </div>
                    <span style="font-size: 11px; color: #64748b; font-weight: 500;">iOS & Android</span>
                </div>

                <div class="app-modal-form">
                    <form id="modalAppForm">
                        <div class="app-radio-group">
                            <label><input type="radio" name="commType" value="phone" checked> Phone</label>
                            <label><input type="radio" name="commType" value="email"> Email</label>
                        </div>
                        <div class="z-form-group">
                            <input type="text" id="modalAppContact" placeholder="Enter mobile number" required>
                        </div>
                        <button type="submit" class="z-modal-btn">Send Download Link</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('.z-modal-close');
    const modalAppForm = modalOverlay.querySelector('#modalAppForm');
    const modalAppContact = modalOverlay.querySelector('#modalAppContact');
    const radioButtons = modalOverlay.querySelectorAll('input[name="commType"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'email') {
                modalAppContact.placeholder = 'Enter email address';
                modalAppContact.type = 'email';
            } else {
                modalAppContact.placeholder = 'Enter mobile number';
                modalAppContact.type = 'tel';
            }
        });
    });

    function openAppModal() {
        modalOverlay.classList.add('active');
    }

    function closeAppModal() {
        modalOverlay.classList.remove('active');
        modalAppForm.reset();
    }

    closeBtn.addEventListener('click', closeAppModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeAppModal();
    });

    modalAppForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contactVal = modalAppContact.value.trim();
        if (!contactVal) return;

        closeAppModal();
        showToast(`📲 App download link sent successfully to ${contactVal}!`);
    });

    // Wire up any Get the App triggers
    document.querySelectorAll('[href="#get-app"], #navGetApp').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openAppModal();
        });
    });
}

/**
 * Offers & Deals Action
 */
function initOffersAction() {
    const offersBtn = document.getElementById('navOffers');
    if (!offersBtn) return;

    offersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🎉 Use code ZOMATO50 at checkout for 50% OFF (up to ₹100) on your order!');
    });
}

/**
 * Category Cards Interaction (Order Online, Dining Out, Nightlife)
 */
function initCategoryCards() {
    const searchInput = document.querySelector('main > section:first-of-type input');

    const cardOnline = document.getElementById('cardOrderOnline');
    if (cardOnline) {
        cardOnline.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) {
                searchInput.value = 'Fast Delivery';
                searchInput.focus();
                showToast('Displaying 100+ restaurants delivering fast to Kathua!');
            }
        });
    }

    const cardDining = document.getElementById('cardDiningOut');
    if (cardDining) {
        cardDining.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) {
                searchInput.value = 'Dine-Out';
                searchInput.focus();
                showToast('Discovering top dining venues & cafes in Kathua!');
            }
        });
    }

    const cardNight = document.getElementById('cardNightlife');
    if (cardNight) {
        cardNight.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) {
                searchInput.value = 'Cafe & Drinks';
                searchInput.focus();
                showToast('Discovering evening hangout spots & cafes!');
            }
        });
    }
}

/**
 * Form submissions (App SMS and Restaurant Registration)
 */
function initForms() {
    // In-page SMS App link form
    const appSmsForm = document.getElementById('appSmsForm');
    if (appSmsForm) {
        appSmsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneVal = document.getElementById('appPhoneInput')?.value.trim();
            if (phoneVal) {
                showToast(`📲 App download link sent to ${phoneVal}!`);
                appSmsForm.reset();
            }
        });
    }

    // Restaurant registration form on add-restaurant.html
    const restForm = document.getElementById('restaurantRegisterForm');
    if (restForm) {
        restForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const restName = document.getElementById('restName')?.value.trim();
            const ownerPhone = document.getElementById('ownerPhone')?.value.trim();
            showToast(`🎉 Application for "${restName || 'Restaurant'}" received! An onboarding specialist will call ${ownerPhone || 'you'} within 24 hours.`);
            restForm.reset();
        });
    }
}

/**
 * Footer Country & Language Selector Interactivity
 */
function initFooterInteractions() {
    const countryPicker = document.getElementById('footerCountryPicker');
    if (countryPicker) {
        countryPicker.addEventListener('click', () => {
            showToast('🇮🇳 Selected delivery region: India (Kathua, J&K)');
        });
    }

    const langPicker = document.getElementById('footerLangPicker');
    if (langPicker) {
        langPicker.addEventListener('click', () => {
            showToast('🌐 Language: English (Default)');
        });
    }
}

/**
 * Toast Notification Utility
 */
function showToast(message) {
    let toast = document.querySelector('.z-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'z-toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>🛵</span> <span>${escapeHtml(message)}</span>`;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3600);
}

// Helpers
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHtml(text).replace(regex, '<span style="color: #e23744; font-weight: 600;">$1</span>');
}
