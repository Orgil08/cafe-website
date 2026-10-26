import { trackTakeawayOrder, formatMNT, ORDER_STAGES } from '../src/utils/cafe-logic';

/**
 * Aura Artisan Café — Shared Site Interactions
 * Mobile navigation drawer, header scroll effect, back-to-top button, order tracking, and page utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initBackToTop();
  updateCopyrightYear();
  initLazyLoading();
  initGalleryLightbox();
  initSectionReveal();
  initOrderTracker();
});

/**
 * Mobile Navigation Drawer & Accessibility Controls
 */
function initNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openDrawer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking outside content (on backdrop)
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close drawer when a link inside it is clicked
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/**
 * Subtle Header Shadow on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Back to Top Floating Action Button
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  function toggleVisibility() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/**
 * Update current year in footer copyright
 */
function updateCopyrightYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Toast Notification Helper (reusable across pages)
 */
export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: ${type === 'success' ? '#2E5339' : '#24140E'};
    color: #FBF8F3;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  `;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/**
 * Intersection Observer for Lazy Loading Images
 * Observes any image with class .lazy-image and data-src attribute.
 * Swaps data-src to src when entering viewport (with rootMargin preload buffer).
 */
export function initLazyLoading(container = document) {
  const lazyImages = container.querySelectorAll('img.lazy-image[data-src]');
  if (!lazyImages || !lazyImages.length) return;

  function loadImage(img) {
    const realSrc = img.getAttribute('data-src');
    if (!realSrc) return;

    // Remove data-src so it doesn't get processed twice
    img.removeAttribute('data-src');

    // Create a temporary Image to preload and guarantee smooth transition
    const temp = new Image();
    temp.src = realSrc;
    temp.onload = () => {
      img.src = realSrc;
      img.classList.add('loaded');
    };
    temp.onerror = () => {
      img.src = realSrc;
      img.classList.add('loaded');
    };
  }

  // Feature detection for IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    lazyImages.forEach(loadImage);
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '120px 0px',
    threshold: 0.01,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        obs.unobserve(img);
      }
    });
  }, observerOptions);

  lazyImages.forEach((img) => {
    observer.observe(img);
  });
}

// Expose on window for vanilla script compatibility
if (typeof window !== 'undefined') {
  window.initLazyLoading = initLazyLoading;
  window.showToast = showToast;
  window.initGalleryLightbox = initGalleryLightbox;
  window.initSectionReveal = initSectionReveal;
}

/**
 * Masonry Gallery Lightbox & Interactive Filtering
 */
export function initGalleryLightbox() {
  const gallerySection = document.querySelector('.gallery-section');
  if (!gallerySection) return;

  const modal = document.getElementById('gallery-lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTag = document.getElementById('lightbox-tag');

  const galleryItems = gallerySection.querySelectorAll('.gallery-item');
  const filterTabs = gallerySection.querySelectorAll('.gallery-filter-tabs .tab-btn');

  function openLightbox(item) {
    if (!modal || !lightboxImg) return;
    const fullSrc = item.getAttribute('data-full-src');
    const title = item.getAttribute('data-title') || '';
    const caption = item.getAttribute('data-caption') || '';
    const tag = item.getAttribute('data-tag') || 'Aura Moment';

    lightboxImg.src = fullSrc;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxTag) lightboxTag.textContent = tag;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Filter tabs for gallery
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterCategory = tab.getAttribute('data-filter');
      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCat === filterCategory) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // Re-trigger lazy loading for items that became visible
      initLazyLoading(gallerySection);
    });
  });
}

/**
 * Intersection Observer to reveal sections (hero, pillars, menu, story, promo, etc.)
 * with a subtle fade-up animation as the user scrolls down the page.
 */
export function initSectionReveal(container = document) {
  // Check for user reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Target sections: hero, pillars, menu, story, plus promo, testimonials & gallery
  const targetSelectors = [
    '.reveal-section',
    '.hero-section',
    '[aria-labelledby="pillars-heading"]',
    '.pillars-section',
    '[aria-labelledby="featured-heading"]',
    '.featured-section',
    '[aria-labelledby="story-teaser-heading"]',
    '.story-section',
    '.promo-section',
    '[aria-labelledby="testimonials-heading"]',
    '.testimonials-section',
    '.gallery-section',
    '.about-hero',
    '.menu-page-header',
    '.contact-hero',
  ];

  // Collect unique elements matching any of the target selectors
  const uniqueElements = new Set();
  targetSelectors.forEach((selector) => {
    try {
      container.querySelectorAll(selector).forEach((el) => uniqueElements.add(el));
    } catch {
      // Ignore invalid or unsupported selector queries
    }
  });

  const sections = Array.from(uniqueElements);
  if (!sections.length) return;

  // Ensure each section element has the base .reveal-section class
  sections.forEach((section) => {
    section.classList.add('reveal-section');
  });

  // Fallback for browsers without IntersectionObserver or when user prefers reduced motion
  if (typeof window === 'undefined' || !('IntersectionObserver' in window) || prefersReducedMotion) {
    sections.forEach((section) => section.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px', // triggers slightly before scrolling fully into view
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      // Reveal if intersecting OR if element has scrolled past the viewport
      if (entry.isIntersecting || entry.boundingClientRect.top < (window.innerHeight || 800)) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const viewportHeight = window.innerHeight || 800;

  sections.forEach((section) => {
    // If element is already visible within the initial upper viewport (e.g. hero section on initial page load)
    const rect = section.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.85) {
      section.classList.add('is-revealed');
    } else {
      observer.observe(section);
    }
  });

  // Safeguard for fast scrolling or jumping directly to an anchor
  function checkScrolledPast() {
    const currentVh = window.innerHeight || 800;
    sections.forEach((section) => {
      if (!section.classList.contains('is-revealed')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < currentVh) {
          section.classList.add('is-revealed');
          try {
            observer.unobserve(section);
          } catch (_) {}
        }
      }
    });
  }

  window.addEventListener('scroll', checkScrolledPast, { passive: true });
}

/**
 * Interactive Takeaway Order Tracker Widget
 */
export function initOrderTracker() {
  const form = document.getElementById('order-tracker-form');
  const input = document.getElementById('receipt-id-input');
  const clearBtn = document.getElementById('tracker-clear-btn');
  const idleView = document.getElementById('tracker-idle-view');
  const activeView = document.getElementById('tracker-active-view');
  const errorView = document.getElementById('tracker-error-view');
  const samplePills = document.querySelectorAll('.sample-receipt-pill');

  if (!form || !input || !activeView) return;

  function updateClearBtnVisibility() {
    if (clearBtn) {
      clearBtn.style.display = input.value.trim().length > 0 ? 'flex' : 'none';
    }
  }

  input.addEventListener('input', updateClearBtnVisibility);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      updateClearBtnVisibility();
      input.focus();
      resetToIdle();
    });
  }

  samplePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const receipt = pill.getAttribute('data-receipt');
      if (receipt) {
        input.value = receipt;
        updateClearBtnVisibility();
        handleLookup(receipt);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    handleLookup(query);
  });

  function resetToIdle() {
    if (idleView) idleView.style.display = 'flex';
    if (activeView) activeView.style.display = 'none';
    if (errorView) errorView.style.display = 'none';
  }

  function handleLookup(receiptQuery) {
    const result = trackTakeawayOrder(receiptQuery);

    if (!result.success || !result.order) {
      if (idleView) idleView.style.display = 'none';
      if (activeView) activeView.style.display = 'none';
      if (errorView) {
        errorView.style.display = 'flex';
        errorView.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <span>${result.error || 'Receipt ID not found.'}</span>
            <span style="display:block; font-size: 0.82rem; margin-top: 0.2rem; opacity: 0.85;">
              Try testing with one of the sample pills above, e.g. <strong>#AURA-1042</strong> or <strong>1042</strong>.
            </span>
          </div>
        `;
        errorView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    // Success! Render order details
    if (idleView) idleView.style.display = 'none';
    if (errorView) errorView.style.display = 'none';
    if (activeView) {
      activeView.style.display = 'block';
      renderActiveOrder(result.order, result.currentStageIndex);
      activeView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function renderActiveOrder(order, stageIndex) {
    const isReady = order.stage === 'ready';
    const fillPercent = Math.min(Math.max((stageIndex / (ORDER_STAGES.length - 1)) * 100, 0), 100);

    // Build stage nodes
    const stagesHtml = ORDER_STAGES.map((s, idx) => {
      let nodeClass = 'step-node';
      let iconContent = `${idx + 1}`;

      if (idx < stageIndex) {
        nodeClass += ' completed';
        iconContent = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      } else if (idx === stageIndex) {
        nodeClass += ' current';
        if (s.id === 'ready') nodeClass += ' ready';
        if (s.id === 'ready') {
          iconContent = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          `;
        } else if (s.id === 'preparing') {
          iconContent = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            </svg>
          `;
        }
      } else {
        nodeClass += ' pending';
      }

      return `
        <div class="${nodeClass}">
          <div class="step-circle" aria-hidden="true">${iconContent}</div>
          <div class="step-label">${s.label}</div>
          <div class="step-desc">${s.description}</div>
        </div>
      `;
    }).join('');

    // Build items rows
    const itemsRowsHtml = order.items.map(item => `
      <tr>
        <td>
          <span class="item-qty-badge">${item.qty}×</span>
          <strong>${item.name}</strong>
        </td>
        <td class="item-price-col">${formatMNT(item.priceMNT * item.qty)}</td>
      </tr>
    `).join('');

    activeView.innerHTML = `
      <div class="active-status-card">
        <!-- Status Highlight Banner -->
        <div class="status-highlight-banner stage-${order.stage}">
          <div class="banner-left">
            <div class="banner-icon-badge" aria-hidden="true">
              ${isReady ? `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ` : order.stage === 'preparing' ? `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              ` : order.stage === 'completed' ? `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#351e15" stroke-width="2.2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ` : `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              `}
            </div>
            <div>
              <h3>${order.statusLabel}</h3>
              <p>${order.statusMessage}</p>
            </div>
          </div>
          <div class="banner-right-badge">
            <span class="pickup-station-tag ${isReady ? 'pulse-ready' : ''}">
              📍 ${order.pickupCounter}
            </span>
            ${order.estimatedWaitMinutes > 0 ? `
              <span class="pickup-timer">⏱ ~${order.estimatedWaitMinutes} mins estimated</span>
            ` : `
              <span class="pickup-timer" style="color: #2e7d32; font-weight:700;">✓ Ready Right Now</span>
            `}
          </div>
        </div>

        <!-- 4-Stage Stepper -->
        <div class="order-stepper" aria-label="Order pickup progression">
          <div class="stepper-track-bg"></div>
          <div class="stepper-track-fill" style="width: ${fillPercent}%;"></div>
          ${stagesHtml}
        </div>

        <!-- Details Grid -->
        <div class="tracker-details-grid">
          <!-- Items Column -->
          <div class="detail-card">
            <div class="detail-card-title">
              <span>Order Summary (${order.items.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span>Ticket #${order.receiptId}</span>
            </div>
            <table class="order-items-table">
              <tbody>
                ${itemsRowsHtml}
              </tbody>
            </table>
            <div class="order-total-row">
              <span>Total Amount (MNT)</span>
              <span class="total-amount">${formatMNT(order.totalMNT)}</span>
            </div>
          </div>

          <!-- Pickup & Barista Column -->
          <div class="detail-card">
            <div class="detail-card-title">
              <span>Pickup Instructions</span>
              <span>Guest: ${order.customerName}</span>
            </div>
            <div class="pickup-station-box">
              <div class="pickup-station-header">Collect At</div>
              <div class="pickup-station-name">${order.pickupCounter}</div>
              <p class="barista-note-text">
                <strong>Barista Note:</strong> ${order.baristaNote}
              </p>
            </div>
            <div class="order-meta-list">
              <div>
                <span>Ordered Time:</span>
                <strong>${order.orderedAtTime}</strong>
              </div>
              <div>
                <span>Estimated Wait:</span>
                <strong>${order.estimatedWaitMinutes > 0 ? `${order.estimatedWaitMinutes} minutes` : 'Ready now'}</strong>
              </div>
              <div>
                <span>Order Status:</span>
                <strong style="text-transform: capitalize;">${order.stage}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Tracker Actions -->
        <div class="tracker-actions-row">
          <button type="button" class="btn btn-sm btn-secondary reset-tracker-btn">
            ← Check Another Receipt
          </button>
          <div style="font-size: 0.85rem; color: var(--color-text-light);">
            Need customized adjustments? Speak directly to our baristas at the express counter.
          </div>
        </div>
      </div>
    `;

    // Attach click to "Check Another Receipt" button
    const resetBtn = activeView.querySelector('.reset-tracker-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        input.value = '';
        updateClearBtnVisibility();
        input.focus();
        resetToIdle();
      });
    }
  }
}

// Expose on window for vanilla script compatibility
if (typeof window !== 'undefined') {
  window.initLazyLoading = initLazyLoading;
  window.showToast = showToast;
  window.initGalleryLightbox = initGalleryLightbox;
  window.initSectionReveal = initSectionReveal;
  window.initOrderTracker = initOrderTracker;
}



