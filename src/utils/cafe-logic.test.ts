import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMNT,
  validateContactForm,
  filterMenuItems,
  calculateOrderTotal,
  isOpenAt,
  getDefaultLazyLoadConfig,
  getLazyPlaceholderSvg,
  calculateStaggerDelay,
  filterGalleryItems,
  getGalleryGridConfig,
  getSectionRevealConfig,
  isElementInInitialViewport,
  GalleryItem,
  MenuItem,
  OpeningHourSchedule,
  normalizeReceiptId,
  trackTakeawayOrder,
} from './cafe-logic';

test('formatMNT correctly formats numbers into Tugrik (₮) with thousands separators', () => {
  assert.equal(formatMNT(8500), '₮8,500');
  assert.equal(formatMNT(12000), '₮12,000');
  assert.equal(formatMNT(0), '₮0');
  assert.equal(formatMNT(-50), '₮0');
  assert.equal(formatMNT(145000), '₮145,000');
});

test('validateContactForm checks name, valid email, and minimum message length', () => {
  // Empty test
  const emptyRes = validateContactForm({});
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.name);
  assert.ok(emptyRes.errors.email);
  assert.ok(emptyRes.errors.message);

  // Invalid email test
  const badEmailRes = validateContactForm({
    name: 'Altan',
    email: 'not-an-email',
    message: 'Hello I would like to reserve a table.',
  });
  assert.equal(badEmailRes.isValid, false);
  assert.ok(badEmailRes.errors.email);

  // Short message test
  const shortMsgRes = validateContactForm({
    name: 'Altan',
    email: 'altan@example.com',
    message: 'Too short',
  });
  assert.equal(shortMsgRes.isValid, false);
  assert.ok(shortMsgRes.errors.message);

  // Valid submission test
  const validRes = validateContactForm({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    message: 'I would like to inquire about booking the quiet upstairs room for a team coffee meeting.',
  });
  assert.equal(validRes.isValid, true);
  assert.deepEqual(validRes.errors, {});
});

test('filterMenuItems filters by category and search term correctly', () => {
  const sampleItems: MenuItem[] = [
    {
      id: '1',
      name: 'Avocado Toast Deluxe',
      category: 'breakfast',
      priceMNT: 14000,
      description: 'Sourdough bread with poached egg and chia seeds',
      image: '',
      badge: "Chef's Pick",
    },
    {
      id: '2',
      name: 'Grilled Panini Melt',
      category: 'lunch',
      priceMNT: 16500,
      description: 'Smoked ham with aged cheddar on rustic ciabatta',
      image: '',
    },
    {
      id: '3',
      name: 'Honey Oat Latte',
      category: 'coffee',
      priceMNT: 9500,
      description: 'Espresso with steamed oat milk and wild mountain honey',
      image: '',
      badge: 'Signature',
    },
    {
      id: '4',
      name: 'Pistachio Basque Cheesecake',
      category: 'desserts',
      priceMNT: 11000,
      description: 'Creamy caramelized cheesecake infused with Sicilian pistachio',
      image: '',
    },
  ];

  // Category 'all' returns all
  assert.equal(filterMenuItems(sampleItems, 'all').length, 4);

  // Filter 'coffee'
  const coffeeOnly = filterMenuItems(sampleItems, 'coffee');
  assert.equal(coffeeOnly.length, 1);
  assert.equal(coffeeOnly[0].name, 'Honey Oat Latte');

  // Search keyword 'toast'
  const searchToast = filterMenuItems(sampleItems, 'all', 'toast');
  assert.equal(searchToast.length, 1);
  assert.equal(searchToast[0].id, '1');

  // Search in description 'cheddar'
  const searchCheddar = filterMenuItems(sampleItems, 'all', 'cheddar');
  assert.equal(searchCheddar.length, 1);
  assert.equal(searchCheddar[0].name, 'Grilled Panini Melt');
});

test('calculateOrderTotal computes subtotal, 10% tax, and total', () => {
  const cart = [
    {
      item: {
        id: '1',
        name: 'Latte',
        category: 'coffee' as const,
        priceMNT: 8000,
        description: 'Warm latte',
        image: '',
      },
      quantity: 2, // 16,000
    },
    {
      item: {
        id: '2',
        name: 'Croissant',
        category: 'breakfast' as const,
        priceMNT: 6500,
        description: 'Flaky pastry',
        image: '',
      },
      quantity: 1, // 6,500
    },
  ];

  const result = calculateOrderTotal(cart);
  assert.equal(result.subtotal, 22500);
  assert.equal(result.tax, 2250);
  assert.equal(result.total, 24750);
});

test('isOpenAt determines accurate status according to schedule', () => {
  const schedule: OpeningHourSchedule[] = [
    { day: 1, dayName: 'Monday', openHour: 8, openMinute: 0, closeHour: 20, closeMinute: 0 },
    { day: 0, dayName: 'Sunday', openHour: 9, openMinute: 0, closeHour: 18, closeMinute: 0 },
  ];

  // Monday 10:30 AM -> open
  const openTest = isOpenAt(1, 10, 30, schedule);
  assert.equal(openTest.isOpen, true);
  assert.ok(openTest.nextStatus.includes('Open now'));

  // Monday 7:30 AM -> closed, opens at 08:00
  const earlyTest = isOpenAt(1, 7, 30, schedule);
  assert.equal(earlyTest.isOpen, false);
  assert.ok(earlyTest.nextStatus.includes('Opens today at 08:00'));

  // Monday 21:00 -> closed for the day
  const lateTest = isOpenAt(1, 21, 0, schedule);
  assert.equal(lateTest.isOpen, false);
  assert.equal(lateTest.nextStatus, 'Closed for the day');
});

test('getDefaultLazyLoadConfig returns appropriate rootMargin and threshold', () => {
  const config = getDefaultLazyLoadConfig();
  assert.ok(config.rootMargin);
  assert.ok(config.rootMargin.includes('150px'));
  assert.equal(config.threshold, 0.01);
});

test('getLazyPlaceholderSvg produces a valid data URI SVG string', () => {
  const placeholder = getLazyPlaceholderSvg(700, 450);
  assert.ok(placeholder.startsWith('data:image/svg+xml'));
  assert.ok(placeholder.includes('viewBox'));
  assert.ok(placeholder.includes('700'));
  assert.ok(placeholder.includes('450'));
});

test('calculateStaggerDelay produces correct bounded millisecond delays', () => {
  assert.equal(calculateStaggerDelay(0, 40), 0);
  assert.equal(calculateStaggerDelay(1, 40), 40);
  assert.equal(calculateStaggerDelay(3, 40), 120);
  assert.equal(calculateStaggerDelay(20, 40, 300), 300); // capped at max
  assert.equal(calculateStaggerDelay(-2, 40), 0);
});

test('filterGalleryItems filters gallery items by category correctly', () => {
  const sampleGallery: GalleryItem[] = [
    { id: '1', title: 'Sunlit Window', category: 'interior', src: '', caption: 'Window nook' },
    { id: '2', title: 'Chemex Brew', category: 'signature', src: '', caption: 'Pour over' },
    { id: '3', title: 'Morning Croissants', category: 'bakery', src: '', caption: 'Bake shelf' },
  ];

  assert.equal(filterGalleryItems(sampleGallery, 'all').length, 3);
  assert.equal(filterGalleryItems(sampleGallery, 'interior').length, 1);
  assert.equal(filterGalleryItems(sampleGallery, 'interior')[0].id, '1');
  assert.equal(filterGalleryItems(sampleGallery, 'signature').length, 1);
  assert.equal(filterGalleryItems(sampleGallery, 'signature')[0].id, '2');
});

test('getSectionRevealConfig returns valid rootMargin, threshold, and target selectors', () => {
  const config = getSectionRevealConfig();
  assert.ok(config.rootMargin.includes('-50px') || config.rootMargin.includes('0px'));
  assert.ok(config.threshold > 0 && config.threshold <= 0.5);
  assert.ok(config.selectors.includes('.hero-section'));
  assert.ok(config.selectors.some((s) => s.includes('pillars')));
  assert.ok(config.selectors.some((s) => s.includes('featured')));
  assert.ok(config.selectors.some((s) => s.includes('story')));
});

test('isElementInInitialViewport correctly detects elements inside or outside viewport threshold', () => {
  const viewportHeight = 800;

  // Hero section sitting at the top of the page
  const heroRect = { top: 0, bottom: 600 };
  assert.equal(isElementInInitialViewport(heroRect, viewportHeight), true);

  // Element slightly down within 85% of viewport
  const midRect = { top: 400, bottom: 900 };
  assert.equal(isElementInInitialViewport(midRect, viewportHeight), true);

  // Element far below viewport (e.g., story section before scroll)
  const belowRect = { top: 1200, bottom: 1800 };
  assert.equal(isElementInInitialViewport(belowRect, viewportHeight), false);

  // Element scrolled far past above (bottom <= 0)
  const pastRect = { top: -1000, bottom: -200 };
  // Zero or invalid viewport height
  assert.equal(isElementInInitialViewport(heroRect, 0), false);
});

test('getGalleryGridConfig configures uniform size, aspect ratio, and responsive columns', () => {
  const config = getGalleryGridConfig();
  assert.equal(config.isUniformSize, true);
  assert.equal(config.columnsDesktop, 3);
  assert.equal(config.columnsTablet, 2);
  assert.equal(config.columnsMobile, 1);
  assert.equal(config.itemHeightDesktop, 280);
  assert.equal(config.itemHeightMobile, 260);
  assert.equal(config.aspectRatio, '4/3');
});

test('normalizeReceiptId handles hashes, lowercase, whitespace, and raw digits', () => {
  assert.equal(normalizeReceiptId('#AURA-1042'), 'AURA-1042');
  assert.equal(normalizeReceiptId('aura-1042'), 'AURA-1042');
  assert.equal(normalizeReceiptId('  #1042  '), 'AURA-1042');
  assert.equal(normalizeReceiptId('1042'), 'AURA-1042');
  assert.equal(normalizeReceiptId('aura 1043'), 'AURA-1043');
  assert.equal(normalizeReceiptId('AURA1044'), 'AURA-1044');
  assert.equal(normalizeReceiptId(''), '');
});

test('trackTakeawayOrder retrieves pre-configured orders and their ready status', () => {
  // Test Ready order (AURA-1042)
  const readyResult = trackTakeawayOrder('#AURA-1042');
  assert.equal(readyResult.success, true);
  assert.equal(readyResult.order?.stage, 'ready');
  assert.equal(readyResult.order?.isReadyForPickup, true);
  assert.equal(readyResult.order?.pickupCounter, 'Counter 1 (Main Brew Bar)');
  assert.equal(readyResult.currentStageIndex, 2);

  // Test Preparing order (AURA-1043)
  const preparingResult = trackTakeawayOrder('1043');
  assert.equal(preparingResult.success, true);
  assert.equal(preparingResult.order?.stage, 'preparing');
  assert.equal(preparingResult.order?.isReadyForPickup, false);
  assert.equal(preparingResult.currentStageIndex, 1);

  // Test Completed order (AURA-1041)
  const completedResult = trackTakeawayOrder('aura-1041');
  assert.equal(completedResult.success, true);
  assert.equal(completedResult.order?.stage, 'completed');
  assert.equal(readyResult.order?.items.length, 2);

  // Test Empty / invalid input
  const emptyResult = trackTakeawayOrder('');
  assert.equal(emptyResult.success, false);
  assert.ok(emptyResult.error);
});

test('trackTakeawayOrder supports arbitrary user-typed valid receipt IDs without error', () => {
  const customResult = trackTakeawayOrder('ORDER-991');
  assert.equal(customResult.success, true);
  assert.ok(customResult.order);
  assert.ok(['received', 'preparing', 'ready', 'completed'].includes(customResult.order.stage));
  assert.ok(customResult.order.items.length > 0);
  assert.ok(customResult.order.totalMNT > 0);
});





