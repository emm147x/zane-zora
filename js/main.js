document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const status = document.getElementById('form-status');
      const submitButton = form.querySelector('button[type="submit"]');

      status.textContent = 'Sending your enquiry...';
      status.className = 'status-msg show';
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Unable to send your enquiry right now.');
        }

        status.textContent = result.message;
        status.className = 'status-msg show status-ok';
        form.reset();
      } catch (error) {
        status.textContent = error.message || 'Something went wrong. Please try again.';
        status.className = 'status-msg show status-err';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Enquiry';
      }
    });
  }
});
