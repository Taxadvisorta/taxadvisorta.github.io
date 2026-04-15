document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('taxadvisor-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeLabel.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('taxadvisor-theme', next);
        themeLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
    });

    // Mobile Nav
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        const isActive = nav.classList.contains('active');
        isActive ? closeMenu() : openMenu();
    }
    function openMenu() {
        nav.classList.add('active');
        overlay.style.display = 'block';
        requestAnimationFrame(() => overlay.classList.add('active'));
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => overlay.style.display = 'none', 300);
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Sticky Header & Active Nav
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    animatedElements.forEach(el => animObserver.observe(el));

    // Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counters.forEach(counter => {
                const target = +counter.dataset.count;
                const duration = 2000;
                const start = performance.now();
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    counter.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
            });
        }
    }, { threshold: 0.5 });
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    // Back to Top
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.pageYOffset > 500));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        let isValid = true;
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');

        if (name.value.trim().length < 2) { showError(name, 'nameError', 'Please enter your name'); isValid = false; }
        if (!/^\+?[\d\s-]{8,}$/.test(phone.value.trim())) { showError(phone, 'phoneError', 'Enter a valid phone number'); isValid = false; }
        if (message.value.trim().length < 10) { showError(message, 'messageError', 'Message must be at least 10 characters'); isValid = false; }

        if (isValid) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                    successModal.classList.add('active');
                    contactForm.reset();
                }, 1500);
            }, 2000);
        }
    });

    function showError(input, errorId, msg) {
        input.classList.add('error');
        document.getElementById(errorId).textContent = msg;
    }

    closeModal.addEventListener('click', () => successModal.classList.remove('active'));
    successModal.addEventListener('click', (e) => { if (e.target === successModal) successModal.classList.remove('active'); });
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const err = input.closest('.form-group').querySelector('.error-msg');
            if (err) err.textContent = '';
        });
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
            }
        });
    });

    // Keyboard Accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeMenu(); successModal.classList.remove('active'); }
    });
});
