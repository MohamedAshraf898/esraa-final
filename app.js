/* Framework-free interactions. GSAP is bundled locally; content remains usable without it. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const projectCards = [...document.querySelectorAll('.project-card')];
const projectDialog = document.querySelector('#project-dialog');
projectCards.forEach(card => card.addEventListener('click', () => {
    const img = card.querySelector('img');
    document.querySelector('#project-image').src = img.src;
    document.querySelector('#project-image').alt = img.alt;
    document.querySelector('#project-title').textContent = card.querySelector('strong').textContent;
    document.querySelector('#project-meta').textContent = card.querySelector('.project-caption>span').innerText.replace(/\n/g, ' — ');
    document.querySelector('#project-description').textContent = card.dataset.description || '';
    projectDialog.showModal();
}));
document.querySelector('#contact-open').addEventListener('click', () => document.querySelector('#contact-dialog').showModal());
const heroPreview = document.querySelector('.hero-preview');
if (heroPreview) heroPreview.addEventListener('click', event => { event.preventDefault(); document.querySelector(`.project-card[data-project="${heroPreview.dataset.projectLink}"]`)?.click(); });
/* Googly eyes: the whole eye pair leans toward the pointer, and pupils track inside each eye on top of that. */
const eyes = [...document.querySelectorAll('.eye')];
const eyeGroups = [...document.querySelectorAll('.eyes-lean')];
if (eyes.length && !reducedMotion.matches) {
    const pupils = eyes.map(eye => eye.querySelector('.pupil'));
    const moveEyes = (x, y) => {
        eyes.forEach((eye, index) => {
            const rect = eye.getBoundingClientRect();
            const dx = x - (rect.left + rect.width / 2), dy = y - (rect.top + rect.height / 2);
            const angle = Math.atan2(dy, dx), maxRadius = rect.width * 0.22;
            const distance = Math.min(Math.hypot(dx, dy) / 6, maxRadius);
            pupils[index].style.transform = `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px)`;
        });
        eyeGroups.forEach(group => {
            const rect = group.getBoundingClientRect();
            const dx = x - (rect.left + rect.width / 2), dy = y - (rect.top + rect.height / 2);
            const angle = Math.atan2(dy, dx), maxLean = 12;
            const distance = Math.min(Math.hypot(dx, dy) / 14, maxLean);
            group.style.transform = `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px)`;
        });
    };
    window.addEventListener('pointermove', event => moveEyes(event.clientX, event.clientY), { passive: true });
}
document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
});
/* Opens the visitor's email client with the brief pre-filled, addressed to Esraa directly. */
document.querySelector('#contact-form').addEventListener('submit', event => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const subject = `Project enquiry from ${form.get('name')}`;
    const body = `Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`;
    window.location.href = `mailto:esraahosam570@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector('#contact-status').textContent = 'Opening your email app to send this to Esraa…';
});
document.querySelectorAll('.faq-list details, .service-list details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) detail.parentElement.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
}));
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { document.querySelectorAll('.dock a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); } });
}, { rootMargin: '-30% 0px -40% 0px' });
document.querySelectorAll('main>section,footer').forEach(section => sectionObserver.observe(section));
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero .wordmark', { y: -25, opacity: 0, duration: .8 });
        gsap.from('.profile', { y: 40, opacity: 0, duration: 1, delay: .15, ease: 'power3.out' });
        gsap.from('.hero h1', { y: 65, opacity: 0, duration: 1.1, delay: .3, ease: 'power3.out' });
        gsap.from('.dock', { y: 120, opacity: 0, duration: 1, delay: .55, ease: 'back.out(1.5)' });
        gsap.from('.hero>.sticker', { scale: 0, opacity: 0, duration: .85, delay: .8, stagger: .15, ease: 'back.out(1.7)' });
        document.querySelectorAll('.sticker').forEach((sticker, index) => gsap.to(sticker, { y: index % 2 ? 8 : -8, rotation: '+=4', duration: 2.5 + index % 3, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        document.querySelectorAll('.sticker b').forEach((badge, index) => gsap.to(badge, { rotation: index % 2 ? 10 : -10, duration: 1.7 + index % 2 * .5, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        gsap.from('.hero-eyes', { scale: 0, opacity: 0, duration: .7, delay: 1, ease: 'back.out(1.7)' });
        gsap.from('.about-eyes', { scale: 0, opacity: 0, duration: .6, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.about-eyes', start: 'top 85%', once: true } });
        gsap.from('.hero-tagline', { x: -40, opacity: 0, duration: .9, delay: .55, ease: 'power3.out' });
        gsap.from('.hero-stack', { y: 40, opacity: 0, duration: .8, delay: .7, ease: 'power3.out' });
        gsap.from('.hero-preview', { y: 50, opacity: 0, duration: .8, delay: .85, ease: 'power3.out' });
        gsap.to('.hero-stack', { y: -8, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.hero-preview', { y: -6, rotation: 0, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        document.querySelectorAll('.section-heading,.intro,.pin-button').forEach(el => gsap.from(el, { y: 45, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 91%', once: true } }));
        document.querySelectorAll('.note').forEach((el, index) => gsap.from(el, { x: index % 2 ? 100 : -100, y: 90, rotation: index % 2 ? 15 : -15, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 93%', once: true } }));
        projectCards.forEach((el, index) => {
            gsap.from(el, { y: 100, rotation: index % 2 ? -14 : 14, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
            el.addEventListener('pointerenter', () => gsap.to(el, { scale: 1.04, rotation: 0, duration: .35, overwrite: 'auto' }));
            el.addEventListener('pointerleave', () => gsap.to(el, { scale: 1, rotation: index % 2 ? -4 : 7, duration: .45, overwrite: 'auto' }));
        });
        document.querySelectorAll('.service-list details').forEach(el => gsap.from(el, { y: 60, opacity: 0, duration: .7, scrollTrigger: { trigger: el, start: 'top 94%', once: true } }));
        document.querySelectorAll('.landscape-image').forEach(el => {
            /* The hero sits at the very top of the page, so at scroll 0 it has no "entering from below" phase like lower sections do — starting its progress at 'top bottom' would pre-scale/shift it before the user has scrolled at all, pulling it away from the viewport edges. Start it at 'top top' instead so it sits flush at load and only parallaxes once the user actually scrolls it away. */
            const start = el.closest('.hero') ? 'top top' : 'top bottom';
            gsap.to(el, { yPercent: 9, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el.parentElement, start, end: 'bottom top', scrub: 1 } });
        });
    });
}
