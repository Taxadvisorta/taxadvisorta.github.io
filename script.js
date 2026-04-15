/**
 * Tax Advisor Website - Main JavaScript
 * Features: Theme toggle, mobile nav, animations, form handling, accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================
    // 🎨 THEME TOGGLE
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const html = document.documentElement;
    
    // Load saved theme or default to dark
   const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   const savedTheme = localStorage.getItem('taxadvisor-theme');
   const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
   
    html.setAttribute('data-theme', initialTheme);
if (themeLabel) {
    themeLabel.textContent = initialTheme === 'dark' ? 'Dark' : 'Light';
}

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('taxadvisor-theme', next);
            if (themeLabel) {
                themeLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
            }
        });

        // Keyboard accessibility for theme toggle
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }

    // ========================================
    // 📱 MOBILE NAVIGATION
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        const isActive = nav?.classList.contains('active');
        isActive ? closeMenu() : openMenu();
    }

    function openMenu() {
        if (!nav || !overlay || !hamburger) return;
        nav.classList.add('active');
        overlay.style.display = 'block';
        requestAnimationFrame(() => overlay.classList.add('active'));
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!nav || !overlay || !hamburger) return;
        nav.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (overlay.style.display !== 'none') {
                overlay.style.display = 'none';
            }
        }, 300);
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // ========================================
    // 📌 STICKY HEADER & ACTIVE NAV LINKS
    // ========================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    
    function updateHeaderAndNav() {
        if (header) {
            header.classList.toggle('scrolled', window.pageYOffset > 50);
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateHeaderAndNav);
    updateHeaderAndNav();

    // ========================================
    // ✨ SCROLL ANIMATIONS
    // ========================================
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
        
        animatedElements.forEach(el => animObserver.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ========================================
    // 🔢 COUNTER ANIMATION FOR STATS
    // ========================================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = +counter.dataset.count;
                    const duration = 2000;
                    const start = performance.now();
                    
                    function update(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                });
            }
        }, { threshold: 0.5 });
        
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) counterObserver.observe(heroStats);
    }

    // ========================================
    // ⬆️ BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.getElementById('backToTop');
    
    function updateBackToTop() {
        if (backToTop) {
            backToTop.classList.toggle('visible', window.pageYOffset > 500);
        }
    }
    
    window.addEventListener('scroll', updateBackToTop);
    
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // 📧 CONTACT FORM HANDLING (FIXED)
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    function showError(input, errorId, msg) {
        if (!input) return;
        input.classList.add('error');
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.textContent = msg;
    }

    function clearError(input) {
        if (!input) return;
        input.classList.remove('error');
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const errorEl = formGroup.querySelector('.error-msg');
            if (errorEl) errorEl.textContent = '';
        }
    }

    if (contactForm) {
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => clearError(input));
            input.addEventListener('blur', () => clearError(input));
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
            
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            if (!name || name.value.trim().length < 2) { 
                showError(name, 'nameError', 'Please enter your full name'); 
                isValid = false; 
            }
            
            if (!phone || !/^\+?[\d\s-]{8,15}$/.test(phone.value.trim())) { 
                showError(phone, 'phoneError', 'Enter a valid phone number (8-15 digits)'); 
                isValid = false; 
            }
            
            if (!message || message.value.trim().length < 10) { 
                showError(message, 'messageError', 'Message must be at least 10 characters'); 
                isValid = false; 
            }

            if (!isValid) {
                const firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }
            
            const btnText = submitBtn?.querySelector('.btn-text');
            const btnLoader = submitBtn?.querySelector('.btn-loader');
            const btnSuccess = submitBtn?.querySelector('.btn-success');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnText) btnText.style.display = 'none';
                if (btnLoader) btnLoader.style.display = 'inline';
            }
            
            try {
                console.log('📤 Submitting to:', contactForm.action);
                
                const formData = new FormData(contactForm);
                
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                
                console.log('📥 Response status:', response.status);
                
                if (response.ok) {
                    if (btnLoader) btnLoader.style.display = 'none';
                    if (btnSuccess) btnSuccess.style.display = 'inline';
                    
                    setTimeout(() => {
                        if (successModal) successModal.classList.add('active');
                        contactForm.reset();
                        
                        setTimeout(() => {
                            if (btnText) btnText.style.display = 'inline';
                            if (btnSuccess) btnSuccess.style.display = 'none';
                            if (submitBtn) submitBtn.disabled = false;
                        }, 2000);
                    }, 800);
                    
                } else {
                    const errorText = await response.text();
                    console.error('❌ Server error:', errorText);
                    throw new Error('Status: ' + response.status);
                }
                
            } catch (error) {
                console.error('💥 Fetch error:', error);
                
                if (btnLoader) btnLoader.style.display = 'none';
                if (btnText) btnText.style.display = 'inline';
                if (submitBtn) submitBtn.disabled = false;
                
                alert('⚠️ Unable to send message. Please try again or call 077366 71447');
            }
        });
    }

    if (closeModal && successModal) {
        closeModal.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // ========================================
    // 🔗 SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, href);
            }
        });
    });

    // ========================================
    // ⌨️ KEYBOARD ACCESSIBILITY
    // ========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            if (successModal) successModal.classList.remove('active');
        }
        
        if ((e.key === 'Enter' || e.key === ' ') && themeToggle && document.activeElement === themeToggle) {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // ========================================
    // 📱 RESIZE HANDLER
    // ========================================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024 && nav?.classList.contains('active')) {
                closeMenu();
            }
            updateHeaderAndNav();
        }, 250);
    });

    // ========================================
    // 🎯 LAZY LOAD MAP (Optional)
    // ========================================
    const mapIframe = document.querySelector('.map-wrapper iframe');
    if (mapIframe && 'IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !mapIframe.src) {
                    const dataSrc = mapIframe.dataset.src;
                    if (dataSrc) mapIframe.src = dataSrc;
                    mapObserver.unobserve(mapIframe);
                }
            });
        }, { threshold: 0.1 });
        mapObserver.observe(mapIframe);
    }

    // ========================================
    // 🎉 INIT COMPLETE
    // ========================================
    console.log('✅ Tax Advisor website loaded successfully');
    console.log('📧 FormSubmit endpoint:', contactForm?.action || 'Not configured');
});
