'use strict';

// =============================================
// 1. FOOTER YEAR
// =============================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =============================================
// 2. MOBILE NAV TOGGLE
// =============================================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('is-open', !isOpen);
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    const isInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);
    if (!isInsideNav && navMenu.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  });
}

// =============================================
// 3. HEADER SCROLL SHADOW
// =============================================
const header = document.querySelector('.site-header');

const handleScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 10);
};

window.addEventListener('scroll', handleScroll, { passive: true });

// =============================================
// 4. ACTIVE NAV LINK (Intersection Observer)
// =============================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        link.classList.toggle('active', href === id);
      });
    });
  },
  { rootMargin: `-${60}px 0px -60% 0px` }
);

sections.forEach(section => sectionObserver.observe(section));

// =============================================
// 5. CONTACT FORM VALIDATION & SUBMISSION
// =============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const fields = {
    name: {
      el: contactForm.querySelector('#name'),
      errorEl: contactForm.querySelector('#name + .form-error'),
      validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name (min. 2 characters).',
    },
    email: {
      el: contactForm.querySelector('#email'),
      errorEl: contactForm.querySelector('#email + .form-error'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    },
    message: {
      el: contactForm.querySelector('#message'),
      errorEl: contactForm.querySelector('#message + .form-error'),
      validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
    },
  };

  const successEl = contactForm.querySelector('.form-success');

  const showError = (field, msg) => {
    field.el.classList.toggle('has-error', !!msg);
    if (field.errorEl) field.errorEl.textContent = msg;
  };

  // Validate on blur
  Object.values(fields).forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => {
      showError(field, field.validate(field.el.value));
    });
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('has-error')) {
        showError(field, field.validate(field.el.value));
      }
    });
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;

    Object.values(fields).forEach(field => {
      if (!field.el) return;
      const error = field.validate(field.el.value);
      showError(field, error);
      if (error) isValid = false;
    });

    if (!isValid) return;

    // Simulate async submission
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      contactForm.reset();
      Object.values(fields).forEach(field => {
        if (field.el) field.el.classList.remove('has-error');
        if (field.errorEl) field.errorEl.textContent = '';
      });
      if (successEl) {
        successEl.textContent = 'Message sent! We will get back to you soon.';
        setTimeout(() => { successEl.textContent = ''; }, 5000);
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 1000);
  });
}
