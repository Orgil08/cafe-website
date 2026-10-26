/**
 * Aura Artisan Café — Contact Page Interactions
 * Real-time form validation, live opening hours status calculation, and FAQ accordion.
 */

// Café Operating Schedule (0 = Sunday, 1 = Monday ... 6 = Saturday)
const OPENING_SCHEDULE = [
  { day: 1, name: 'Monday', open: '07:30', close: '20:30', openH: 7.5, closeH: 20.5 },
  { day: 2, name: 'Tuesday', open: '07:30', close: '20:30', openH: 7.5, closeH: 20.5 },
  { day: 3, name: 'Wednesday', open: '07:30', close: '20:30', openH: 7.5, closeH: 20.5 },
  { day: 4, name: 'Thursday', open: '07:30', close: '20:30', openH: 7.5, closeH: 20.5 },
  { day: 5, name: 'Friday', open: '07:30', close: '21:30', openH: 7.5, closeH: 21.5 },
  { day: 6, name: 'Saturday', open: '08:30', close: '21:30', openH: 8.5, closeH: 21.5 },
  { day: 0, name: 'Sunday', open: '09:00', close: '19:00', openH: 9.0, closeH: 19.0 },
];

document.addEventListener('DOMContentLoaded', () => {
  initContactFormValidation();
  initOpeningHoursStatus();
  initFaqAccordion();
});

/**
 * Contact Form Validation & Submission Feedback
 */
function initContactFormValidation() {
  const form = document.getElementById('cafe-contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const successBox = document.getElementById('form-success-alert');
  const errorBox = document.getElementById('form-error-alert');

  function validateField(input, condition, errorElId) {
    const errorEl = document.getElementById(errorElId);
    if (!condition) {
      input.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('error');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  }

  // Real-time input listener to clear error as user types
  nameInput?.addEventListener('input', () => {
    validateField(nameInput, nameInput.value.trim().length >= 2, 'name-error');
  });

  emailInput?.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'email-error');
  });

  messageInput?.addEventListener('input', () => {
    validateField(messageInput, messageInput.value.trim().length >= 10, 'message-error');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset alert visibility
    if (successBox) successBox.style.display = 'none';
    if (errorBox) errorBox.style.display = 'none';

    const nameValid = validateField(nameInput, nameInput.value.trim().length >= 2, 'name-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'email-error');
    const messageValid = validateField(messageInput, messageInput.value.trim().length >= 10, 'message-error');

    if (!nameValid || !emailValid || !messageValid) {
      if (errorBox) {
        errorBox.textContent = 'Please fix the highlighted fields above before submitting.';
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    // Honest feedback - not falsely claiming email sent to server
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Validating & Simulating...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (successBox) {
        successBox.innerHTML = `
          <strong>Validation Successful!</strong><br>
          Thank you, <em>${escapeHTML(nameInput.value.trim())}</em>. Your inquiry has been verified in this demonstration environment.<br>
          <span style="font-size:0.82rem; opacity:0.9; margin-top:4px; display:inline-block;">
            Note: This is a frontend demo interface. To send real emails in production, integrate a backend mail API (e.g. Resend, SendGrid) or server endpoint.
          </span>
        `;
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    }, 600);
  });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Calculate Live "Open Now" or "Closed" Status and Highlight Today's Row
 */
function initOpeningHoursStatus() {
  const statusPill = document.getElementById('live-status-pill');
  const statusText = document.getElementById('live-status-text');
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun
  const currentHours = now.getHours() + now.getMinutes() / 60;

  // Highlight today in schedule table
  const todayRow = document.querySelector(`.hours-table tr[data-day="${currentDay}"]`);
  if (todayRow) {
    todayRow.classList.add('today');
    const dayLabel = todayRow.querySelector('td:first-child');
    if (dayLabel) {
      dayLabel.innerHTML += ' <span style="font-size:0.75rem; text-transform:uppercase; color:var(--color-green-primary); font-weight:700;">(Today)</span>';
    }
  }

  // Find schedule for today
  const todaySchedule = OPENING_SCHEDULE.find((s) => s.day === currentDay);
  if (!todaySchedule || !statusPill || !statusText) return;

  if (currentHours >= todaySchedule.openH && currentHours < todaySchedule.closeH) {
    statusPill.className = 'live-status-pill open';
    statusText.textContent = `Open Now • Closes at ${todaySchedule.close}`;
  } else if (currentHours < todaySchedule.openH) {
    statusPill.className = 'live-status-pill closed';
    statusText.textContent = `Closed Now • Opens today at ${todaySchedule.open}`;
  } else {
    statusPill.className = 'live-status-pill closed';
    statusText.textContent = `Closed for the day • Opens tomorrow at ${getTomorrowOpenTime(currentDay)}`;
  }
}

function getTomorrowOpenTime(today) {
  const tomorrow = (today + 1) % 7;
  const sched = OPENING_SCHEDULE.find((s) => s.day === tomorrow);
  return sched ? sched.open : '08:00';
}

/**
 * FAQ Accordion Expansion Logic
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion UX
      faqItems.forEach((i) => {
        i.classList.remove('active');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
