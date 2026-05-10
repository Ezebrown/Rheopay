/* ============================================
   RHEO — main.js
   Scroll reveal · Nav sticky · Form · Counters
   ============================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. NAV — sticky on scroll
  ────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ──────────────────────────────────────────
     2. SCROLL REVEAL — Intersection Observer
  ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ──────────────────────────────────────────
     3. STEP FLOW — animate on scroll
  ────────────────────────────────────────── */
  const steps = document.querySelectorAll('.step__num');
  if (steps.length) {
    let current = 0;
    const activateStep = () => {
      steps.forEach((s, i) => s.classList.toggle('active', i === current));
      current = (current + 1) % steps.length;
    };
    activateStep();
    setInterval(activateStep, 1400);
  }

  /* ──────────────────────────────────────────
     4. TIMELINE — highlight active item on scroll
  ────────────────────────────────────────── */
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const tlObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timelineItems.forEach((ti) => ti.classList.remove('active'));
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.6 }
    );
    timelineItems.forEach((item) => tlObserver.observe(item));
  }

  /* ──────────────────────────────────────────
     5. PROVIDER BARS — re-animate on scroll
  ────────────────────────────────────────── */
  const providerBars = document.getElementById('providerBars');
  if (providerBars) {
    const fills = providerBars.querySelectorAll('.provider-bar__fill');
    const widths = ['94%', '87%', '71%', '68%', '91%'];

    // reset and re-animate
    const animateBars = () => {
      fills.forEach((f, i) => {
        f.style.width = '0%';
        setTimeout(() => {
          f.style.transition = 'width 1.2s ease';
          f.style.width = widths[i];
        }, i * 120 + 300);
      });
    };

    const pbObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) animateBars();
      },
      { threshold: 0.3 }
    );
    pbObserver.observe(providerBars);
    // initial state
    fills.forEach((f) => { f.style.width = '0%'; f.style.transition = 'none'; });
  }

  /* ──────────────────────────────────────────
     6. COUNTER — animate number on page load
  ────────────────────────────────────────── */
  const counterEl = document.getElementById('counter');
  if (counterEl) {
    const target = 847;
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counterEl.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
    };
    // delay slightly
    setTimeout(() => requestAnimationFrame(animate), 800);
  }

  /* ──────────────────────────────────────────
     7. FORM — validation + success state
  ────────────────────────────────────────── */
  const form = document.getElementById('accessForm');
  const formWrap = document.getElementById('formWrap');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    // inline error helper
    const showError = (input, msg) => {
      let err = input.parentElement.querySelector('.field-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'field-error';
        err.style.cssText = 'display:block; color:#FF5C5C; font-size:12px; margin-top:6px; font-family:var(--font-display);';
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
      input.style.borderColor = 'rgba(255,92,92,0.5)';
    };

    const clearError = (input) => {
      const err = input.parentElement.querySelector('.field-error');
      if (err) err.remove();
      input.style.borderColor = '';
    };

    // live clear on input
    form.querySelectorAll('input, select').forEach((el) => {
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('change', () => clearError(el));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const country = form.querySelector('#country');
      const useCase = form.querySelector('#use');

      if (name && name.value.trim().length < 2) {
        showError(name, 'Please enter your full name');
        valid = false;
      }

      if (email) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email.value.trim())) {
          showError(email, 'Please enter a valid email address');
          valid = false;
        }
      }

      if (country && !country.value) {
        showError(country, 'Please select your country');
        valid = false;
      }

      if (useCase && !useCase.value) {
        showError(useCase, 'Please select a use case');
        valid = false;
      }

      if (!valid) return;

      // Simulate submission
      const btn = form.querySelector('.form__submit');
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(() => {
        if (formWrap) formWrap.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        // increment counter
        if (counterEl) {
          counterEl.textContent = (parseInt(counterEl.textContent.replace(/,/g, '')) + 1).toLocaleString();
        }
      }, 1200);
    });
  }

  /* ──────────────────────────────────────────
     8. TRANSFER CARD — cycle through routes
  ────────────────────────────────────────── */
  const transferCard = document.querySelector('.transfer-card');
  if (transferCard) {
    const routes = [
      { amount: '₦ 150,000', converted: '£ 73.84', from: '🇳🇬', to: '🇬🇧', status: 'Routing via Optimal Route' },
      { amount: '$ 200',     converted: '₦ 268,400', from: '🇺🇸', to: '🇳🇬', status: 'Routing via Optimal Route' },
      { amount: '£ 300',     converted: '₹ 31,200', from: '🇬🇧', to: '🇮🇳', status: 'Routing via Optimal Route' },
      { amount: '₦ 80,000',  converted: 'MX$ 2,140', from: '🇳🇬', to: '🇲🇽', status: 'Routing via Optimal Route' },
    ];

    let routeIdx = 0;

    const updateCard = () => {
      const r = routes[routeIdx];
      const amountEl  = transferCard.querySelector('.transfer-card__amount');
      const metaEl    = transferCard.querySelector('.transfer-card__meta');
      const fromEl    = transferCard.querySelectorAll('.route-flag')[0];
      const toEl      = transferCard.querySelectorAll('.route-flag')[1];
      const statusEl  = transferCard.querySelector('.transfer-card__status');

      if (amountEl) amountEl.textContent = r.amount;
      if (metaEl)   metaEl.innerHTML = `<span>→</span> Recipient gets <strong style="color:var(--white)">${r.converted}</strong>`;
      if (fromEl)   fromEl.textContent = r.from;
      if (toEl)     toEl.textContent   = r.to;
      if (statusEl) statusEl.textContent = r.status;

      routeIdx = (routeIdx + 1) % routes.length;
    };

    setInterval(updateCard, 4000);
  }

  /* ──────────────────────────────────────────
     9. HUB SPOKES — draw SVG connector lines
  ────────────────────────────────────────── */
  // lightweight: just ensure hub-visual is visible, CSS handles rings

})();