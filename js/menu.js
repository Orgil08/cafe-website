/**
 * Aura Artisan Café — Menu Page Interactions & Dynamic Filtering
 * Category switching, search filter, item details modal, and order estimation in MNT (₮).
 */

import { initLazyLoading } from './main.js';

// Sample Menu Data (clearly marked as editable sample data)
const MENU_DATA = [
  // 1. Breakfast
  {
    id: 'b1',
    name: 'Artisan Avocado Sourdough',
    category: 'breakfast',
    priceMNT: 14500,
    calories: 420,
    badge: "Chef's Pick",
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',
    description: 'Freshly mashed avocado on naturally fermented rustic sourdough, topped with poached organic egg, chili flakes, and toasted hemp seeds.',
    dietary: ['Vegetarian'],
    customizable: true,
  },
  {
    id: 'b2',
    name: 'Butter Croissant & Berry Jam',
    category: 'breakfast',
    priceMNT: 7500,
    calories: 310,
    badge: 'Fresh Daily',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80',
    description: 'Golden, flaky, French-style butter pastry baked every morning at 6:30 AM, served with house-made wild lingonberry preserve.',
    dietary: ['Vegetarian'],
    customizable: false,
  },
  {
    id: 'b3',
    name: 'Organic Granola & Greek Yogurt Bowl',
    category: 'breakfast',
    priceMNT: 12000,
    calories: 380,
    badge: 'Healthy Choice',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=700&q=80',
    description: 'Artisan honey-toasted oat clusters, chia pudding layer, fresh seasonal berries, and creamy strained natural yogurt.',
    dietary: ['Vegetarian', 'Gluten-Free'],
    customizable: true,
  },
  {
    id: 'b4',
    name: 'Smoked Salmon Brioche Benedict',
    category: 'breakfast',
    priceMNT: 18500,
    calories: 540,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=700&q=80',
    description: 'Lightly toasted golden brioche bun, oak-smoked Norwegian salmon, soft poached egg, and velvety Meyer lemon hollandaise sauce.',
    dietary: [],
    customizable: false,
  },

  // 2. Lunch
  {
    id: 'l1',
    name: 'Tuscan Grilled Chicken Panini',
    category: 'lunch',
    priceMNT: 16500,
    calories: 580,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
    description: 'Rosemary marinated free-range chicken breast, melted aged provolone cheese, sun-dried tomato pesto, and crisp wild arugula on ciabatta.',
    dietary: [],
    customizable: true,
  },
  {
    id: 'l2',
    name: 'Caprese Burrata & Pesto Focaccia',
    category: 'lunch',
    priceMNT: 15000,
    calories: 490,
    badge: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=700&q=80',
    description: 'Creamy Italian burrata cheese, heirloom vine tomatoes, garden basil pesto, and aged balsamic glaze inside herb-infused sea salt focaccia.',
    dietary: ['Vegetarian'],
    customizable: true,
  },
  {
    id: 'l3',
    name: 'Harvest Quinoa & Roasted Veggie Salad',
    category: 'lunch',
    priceMNT: 13500,
    calories: 340,
    badge: 'Vegan',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
    description: 'Tri-color Andean quinoa, spiced roasted sweet potatoes, crisp kale, edamame beans, and toasted pumpkin seeds with lemon tahini vinaigrette.',
    dietary: ['Vegan', 'Gluten-Free'],
    customizable: true,
  },
  {
    id: 'l4',
    name: 'Creamy Roasted Pumpkin & Ginger Soup',
    category: 'lunch',
    priceMNT: 11000,
    calories: 280,
    badge: 'Comfort Food',
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=700&q=80',
    description: 'Velvety roasted squash soup with hints of warming ginger, coconut cream drizzle, and served with a slice of warm garlic butter baguette.',
    dietary: ['Vegan', 'Gluten-Free'],
    customizable: false,
  },

  // 3. Coffee and Drinks
  {
    id: 'c1',
    name: 'Aura Signature Honey Oat Latte',
    category: 'coffee',
    priceMNT: 9500,
    calories: 180,
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Double shot of our medium-dark Colombian espresso, micro-foamed organic oat milk, infused with raw mountain honey and a dust of Ceylon cinnamon.',
    dietary: ['Vegan Option'],
    customizable: true,
  },
  {
    id: 'c2',
    name: 'Nitro Cold Brew Reserve',
    category: 'coffee',
    priceMNT: 9000,
    calories: 5,
    badge: 'Smooth & Bold',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80',
    description: 'Steeped for 20 hours at controlled low temperatures, nitrogen-infused for a silky cascade and naturally sweet, creamy mouthfeel without dairy.',
    dietary: ['Vegan', 'Sugar-Free'],
    customizable: false,
  },
  {
    id: 'c3',
    name: 'Ceremonial Matcha Green Tea Latte',
    category: 'coffee',
    priceMNT: 10500,
    calories: 160,
    badge: 'Antioxidant',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=700&q=80',
    description: 'Authentic first-harvest stone-ground Uji matcha, whisked fresh and blended with steamed vanilla almond milk.',
    dietary: ['Vegan Option'],
    customizable: true,
  },
  {
    id: 'c4',
    name: 'Classic Flat White',
    category: 'coffee',
    priceMNT: 8000,
    calories: 130,
    badge: 'Barista Classic',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=700&q=80',
    description: 'Expertly extracted double ristretto covered with a thin, silky layer of steamed whole milk with crisp latte art.',
    dietary: [],
    customizable: true,
  },
  {
    id: 'c5',
    name: 'Spiced Chai Blossom Tea',
    category: 'coffee',
    priceMNT: 8500,
    calories: 120,
    badge: 'Caffeine-Free Option',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80',
    description: 'Brewed loose leaf black tea slow-simmered with cardamom, cloves, star anise, ginger root, and warmed honey milk.',
    dietary: ['Vegetarian'],
    customizable: true,
  },

  // 4. Desserts
  {
    id: 'd1',
    name: 'Pistachio Basque Burnt Cheesecake',
    category: 'desserts',
    priceMNT: 12500,
    calories: 410,
    badge: "Guest Favorite",
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80',
    description: 'Deeply caramelized exterior giving way to an ultra-creamy molten center infused with roasted Sicilian pistachios and sea salt.',
    dietary: ['Vegetarian', 'Gluten-Free'],
    customizable: false,
  },
  {
    id: 'd2',
    name: 'Espresso Tiramisu Jar',
    category: 'desserts',
    priceMNT: 11000,
    calories: 360,
    badge: 'House Made',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80',
    description: 'Traditional Italian ladyfingers steeped in our signature espresso roast, layered with whipped mascarpone cream and Valrhona dark cocoa powder.',
    dietary: ['Vegetarian'],
    customizable: false,
  },
  {
    id: 'd3',
    name: 'Warm Apple Cinnamon Crumble Tart',
    category: 'desserts',
    priceMNT: 9500,
    calories: 320,
    badge: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=700&q=80',
    description: 'Caramelized honeycrisp apples baked in an all-butter shortcrust pastry, topped with buttery spiced oat crumble and vanilla bean drizzle.',
    dietary: ['Vegetarian'],
    customizable: false,
  },
  {
    id: 'd4',
    name: 'Dark Chocolate Lava Cake',
    category: 'desserts',
    priceMNT: 11500,
    calories: 450,
    badge: 'Decadent',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
    description: '70% single-origin Belgian dark chocolate soufflé cake with a warm flowing ganache center, served with a scoop of Madagascar vanilla gelato.',
    dietary: ['Vegetarian'],
    customizable: false,
  },
];

// Client State
let currentCategory = 'all';
let currentSearch = '';
const orderCart = [];

/**
 * Format Tugrik Price
 */
function formatTugrik(amount) {
  if (isNaN(amount) || amount < 0) return '₮0';
  return '₮' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

document.addEventListener('DOMContentLoaded', () => {
  initMenuFilters();
  initSearch();
  renderMenuItems();
  initModal();
});

let filterTransitionTimeout = null;

/**
 * Category Filter Buttons with Smooth Transitions
 */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.category-tabs .tab-btn');
  const container = document.getElementById('menu-items-grid');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-category');
      if (selectedCategory === currentCategory) return;

      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (filterTransitionTimeout) {
        clearTimeout(filterTransitionTimeout);
      }

      if (!container) {
        currentCategory = selectedCategory;
        renderMenuItems();
        return;
      }

      // Smooth exit transition: smoothly fade and translate
      container.classList.add('is-transitioning');

      filterTransitionTimeout = setTimeout(() => {
        currentCategory = selectedCategory;
        renderMenuItems();

        // Restore container and trigger smooth card entrance animation
        requestAnimationFrame(() => {
          container.classList.remove('is-transitioning');
        });
      }, 160);
    });
  });
}

/**
 * Search Input Filter
 */
function initSearch() {
  const searchInput = document.getElementById('menu-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderMenuItems();
  });
}

/**
 * Render Menu Items based on category and search query
 */
function renderMenuItems() {
  const container = document.getElementById('menu-items-grid');
  const countEl = document.getElementById('item-count-label');
  if (!container) return;

  const filtered = MENU_DATA.filter((item) => {
    // Category match
    const matchesCategory =
      currentCategory === 'all' || item.category === currentCategory;

    // Search query match
    if (!currentSearch) return matchesCategory;

    const matchesName = item.name.toLowerCase().includes(currentSearch);
    const matchesDesc = item.description.toLowerCase().includes(currentSearch);
    const matchesBadge = item.badge ? item.badge.toLowerCase().includes(currentSearch) : false;

    return matchesCategory && (matchesName || matchesDesc || matchesBadge);
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">☕</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-espresso); margin-bottom: 0.5rem;">No items found</h3>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; max-width: 400px; margin: 0 auto 1.5rem;">We couldn't find any delicious items matching "${currentSearch}". Try another search or select a different category.</p>
        <button id="reset-filter-btn" class="btn btn-secondary btn-sm">Clear Search</button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const input = document.getElementById('menu-search');
        if (input) input.value = '';
        currentSearch = '';
        renderMenuItems();
      });
    }
    return;
  }

  const SVG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 450'%3E%3Crect width='100%25' height='100%25' fill='%23f3ecdf'/%3E%3C/svg%3E";

  container.innerHTML = filtered
    .map(
      (item, index) => `
      <article class="menu-card" data-id="${item.id}" style="--card-index: ${index};">
        <div class="menu-card-image-wrap">
          <img
            src="${SVG_PLACEHOLDER}"
            data-src="${item.image}"
            alt="${item.name}"
            class="menu-card-img lazy-image"
            loading="lazy"
          />
          ${
            item.badge
              ? `<span class="badge badge-coffee menu-card-badge">${item.badge}</span>`
              : ''
          }
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header">
            <h3 class="menu-item-name">${item.name}</h3>
            <span class="menu-item-price">${formatTugrik(item.priceMNT)}</span>
          </div>
          <p class="menu-item-desc">${item.description}</p>
          <div class="menu-card-footer">
            <div class="item-tags">
              ${item.dietary.map((d) => `<span class="badge badge-green" style="font-size:0.68rem; padding:0.2rem 0.5rem;">${d}</span>`).join(' ')}
              ${item.calories ? `<span style="font-size:0.75rem; color:var(--color-text-light); align-self:center;">${item.calories} kcal</span>` : ''}
            </div>
            <button class="btn btn-sm btn-secondary view-details-btn" data-id="${item.id}" aria-label="Details for ${item.name}">
              Details
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  // Trigger IntersectionObserver to observe newly rendered cards
  if (typeof initLazyLoading === 'function') {
    initLazyLoading(container);
  } else if (typeof window !== 'undefined' && window.initLazyLoading) {
    window.initLazyLoading(container);
  }

  // Attach Details Button handlers
  container.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openItemModal(id);
    });
  });
}

/**
 * Item Details Modal
 */
function initModal() {
  const modal = document.getElementById('item-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openItemModal(id) {
  const item = MENU_DATA.find((m) => m.id === id);
  const modal = document.getElementById('item-modal');
  const modalContent = document.getElementById('modal-item-content');

  if (!item || !modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="position: relative; height: 260px; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
      <img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" />
      ${item.badge ? `<span class="badge badge-caramel" style="position:absolute; bottom:16px; left:16px;">${item.badge}</span>` : ''}
    </div>
    <div style="padding: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; gap:1rem;">
        <div>
          <span style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-green-primary); font-weight:700;">${item.category.toUpperCase()}</span>
          <h2 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--color-espresso); line-height:1.2; margin-top:0.25rem;">${item.name}</h2>
        </div>
        <span style="font-family:var(--font-sans); font-size:1.5rem; font-weight:700; color:var(--color-green-primary);">${formatTugrik(item.priceMNT)}</span>
      </div>
      
      <p style="color:var(--color-text-muted); font-size:0.95rem; line-height:1.65; margin-bottom:1.5rem;">${item.description}</p>
      
      <div style="background-color:var(--color-cream-warm); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:1.5rem;">
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--color-espresso); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Dietary & Quality Notes</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; font-size:0.85rem; color:var(--color-text-muted);">
          <span>🌿 Fresh organic ingredients</span>
          <span>•</span>
          <span>${item.calories ? `${item.calories} Calories` : 'Nutritious & artisan crafted'}</span>
          ${item.dietary.length ? `<span>•</span><span>${item.dietary.join(', ')}</span>` : ''}
        </div>
      </div>

      <div style="display:flex; gap:1rem; align-items:center;">
        <button id="modal-add-to-tray-btn" class="btn btn-primary" style="flex:1;">
          Add to Sample Tray (${formatTugrik(item.priceMNT)})
        </button>
      </div>
      <p style="text-align:center; font-size:0.78rem; color:var(--color-text-light); margin-top:0.75rem;">
        Editable sample item • Demo pricing in Mongolian Tugrik (₮)
      </p>
    </div>
  `;

  const addToTrayBtn = document.getElementById('modal-add-to-tray-btn');
  if (addToTrayBtn) {
    addToTrayBtn.addEventListener('click', () => {
      addToOrderTray(item);
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * Order Tray / Estimation Calculator
 */
function addToOrderTray(item) {
  const existing = orderCart.find((c) => c.item.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    orderCart.push({ item, quantity: 1 });
  }

  updateOrderTrayUI();

  // Show quick toast notification
  const count = orderCart.reduce((sum, c) => sum + c.quantity, 0);
  const toastMsg = `Added ${item.name} to sample tray (${count} items)`;
  if (window.showToast) {
    window.showToast(toastMsg, 'success');
  }
}

function updateOrderTrayUI() {
  const trayBar = document.getElementById('order-tray-bar');
  const countBadge = document.getElementById('tray-count');
  const totalPrice = document.getElementById('tray-total-price');

  if (!trayBar) return;

  const totalQuantity = orderCart.reduce((sum, c) => sum + c.quantity, 0);
  const totalMNT = orderCart.reduce((sum, c) => sum + c.item.priceMNT * c.quantity, 0);

  if (totalQuantity > 0) {
    trayBar.style.display = 'flex';
    if (countBadge) countBadge.textContent = totalQuantity;
    if (totalPrice) totalPrice.textContent = formatTugrik(totalMNT);
  } else {
    trayBar.style.display = 'none';
  }
}

// Hook up tray reset button if present
document.addEventListener('DOMContentLoaded', () => {
  const clearTrayBtn = document.getElementById('clear-tray-btn');
  if (clearTrayBtn) {
    clearTrayBtn.addEventListener('click', () => {
      orderCart.length = 0;
      updateOrderTrayUI();
    });
  }
});
