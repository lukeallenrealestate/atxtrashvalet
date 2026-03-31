/* ==========================================================================
   ATX Trash Valet — Main JS
   Nav scroll, mobile menu, FAQ accordion, form handling, scroll reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAV SCROLL --- */
  const nav = document.getElementById('nav');
  if (nav) {
    const setNav = () => {
      if (window.scrollY > 40) {
        nav.classList.remove('transparent');
        nav.classList.add('solid');
      } else {
        nav.classList.add('transparent');
        nav.classList.remove('solid');
      }
    };
    setNav();
    window.addEventListener('scroll', setNav, { passive: true });
  }

  /* --- MOBILE MENU --- */
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- SCROLL REVEAL --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* --- CONTACT FORM --- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('form-error');
      const successEl = document.getElementById('form-success');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Clear previous state
      errEl.classList.remove('show');
      errEl.textContent = '';

      // Get values
      const data = {
        name: form.querySelector('[name="name"]').value.trim(),
        phone: form.querySelector('[name="phone"]').value.trim(),
        property: form.querySelector('[name="property"]').value.trim(),
        units: form.querySelector('[name="units"]').value.trim(),
        message: form.querySelector('[name="message"]').value.trim(),
        source: form.querySelector('[name="source"]') ? form.querySelector('[name="source"]').value : 'website'
      };

      // Validate
      if (!data.name) {
        errEl.textContent = 'Please enter your name.';
        errEl.classList.add('show');
        return;
      }
      if (!data.phone || data.phone.length < 7) {
        errEl.textContent = 'Please enter a valid phone number.';
        errEl.classList.add('show');
        return;
      }

      // Submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          form.style.display = 'none';
          successEl.classList.add('show');
        } else {
          errEl.textContent = result.error || 'Something went wrong. Please call us at (254) 718-2567.';
          errEl.classList.add('show');
        }
      } catch (err) {
        errEl.textContent = 'Connection error. Please call us directly at (254) 718-2567.';
        errEl.classList.add('show');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* --- KEYBOARD SHORTCUT: / to focus search --- */
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const inp = document.querySelector('.search-input');
      if (inp) inp.focus();
    }
  });

});

/* --- FAQ ACCORDION --- */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

  // Toggle clicked
  if (!isOpen) item.classList.add('open');
}

/* --- SMOOTH SCROLL --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
