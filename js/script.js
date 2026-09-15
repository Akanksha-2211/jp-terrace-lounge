/* =========================================================
   JP TERRACE LOUNGE — Script
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.getElementById('navbar');
  const toggleNavbar = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  toggleNavbar();
  window.addEventListener('scroll', toggleNavbar);

  /* ---------- Mobile Menu Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', highlightNav);

  /* ---------- Fade-in on Scroll (IntersectionObserver) ---------- */
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: reveal everything immediately if IntersectionObserver isn't supported
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Back to Top Button ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Button Ripple Effect ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const existing = this.querySelector('.ripple-dot');
      if (existing) existing.remove();

      const dot = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      dot.className = 'ripple-dot';
      dot.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        border-radius:50%;
        background:rgba(255,255,255,0.5);
        transform:scale(0);
        pointer-events:none;
        animation:ripple-effect 0.6s ease-out;
      `;
      this.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    });
  });

  /* ---------- Floating Hero Particles ---------- */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = window.innerWidth < 768 ? 18 : 32;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = Math.random() * 3 + 2;
      p.style.left = `${Math.random() * 100}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDuration = `${Math.random() * 10 + 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      particlesContainer.appendChild(p);
    }
  }

  /* ---------- Overnight Section Stars ---------- */
  const starsContainer = document.getElementById('stars');
  if (starsContainer) {
    const starCount = 80;
    for (let i = 0; i < starCount; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(s);
    }
  }

});
