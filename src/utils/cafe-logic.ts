/**
 * Core Café Business & UI Logic
 * Form validation, menu filtering, currency formatting (MNT), and operating hours calculations.
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'coffee' | 'desserts';
  priceMNT: number;
  description: string;
  image: string;
  badge?: string;
  calories?: number;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
}

export interface OpeningHourSchedule {
  day: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  dayName: string;
  openHour: number; // 0-23
  openMinute: number;
  closeHour: number;
  closeMinute: number;
  isClosed?: boolean;
}

/**
 * Format amounts into Mongolian Tugrik (₮) with thousands separators.
 * Example: 8500 -> "₮8,500"
 */
export function formatMNT(amount: number): string {
  if (isNaN(amount) || amount < 0) return '₮0';
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₮${formatted}`;
}

/**
 * Validate contact form fields
 */
export function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Please enter your name.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).';
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Please enter your message.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filter and search menu items by category and query
 */
export function filterMenuItems(
  items: MenuItem[],
  selectedCategory: string,
  searchQuery: string = ''
): MenuItem[] {
  const query = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    // Category match: 'all' matches everything
    const matchesCategory =
      !selectedCategory ||
      selectedCategory.toLowerCase() === 'all' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!matchesCategory) return false;

    // Search query match against name and description
    if (!query) return true;

    const matchesName = item.name.toLowerCase().includes(query);
    const matchesDesc = item.description.toLowerCase().includes(query);
    const matchesBadge = item.badge ? item.badge.toLowerCase().includes(query) : false;

    return matchesName || matchesDesc || matchesBadge;
  });
}

/**
 * Calculate total price of selected items in MNT
 */
export function calculateOrderTotal(
  cart: Array<{ item: MenuItem; quantity: number }>
): { subtotal: number; tax: number; total: number } {
  const subtotal = cart.reduce((acc, curr) => acc + curr.item.priceMNT * curr.quantity, 0);
  // Optional VAT / local tax calculation (10%)
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

/**
 * Determine whether café is open given current day, hour, and minute
 */
export function isOpenAt(
  day: number,
  hour: number,
  minute: number,
  schedule: OpeningHourSchedule[]
): { isOpen: boolean; nextStatus: string } {
  const daySchedule = schedule.find((s) => s.day === day);
  if (!daySchedule || daySchedule.isClosed) {
    return { isOpen: false, nextStatus: 'Closed today' };
  }

  const currentMinutes = hour * 60 + minute;
  const openMinutes = daySchedule.openHour * 60 + daySchedule.openMinute;
  const closeMinutes = daySchedule.closeHour * 60 + daySchedule.closeMinute;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const hoursLeft = Math.floor((closeMinutes - currentMinutes) / 60);
    const minsLeft = (closeMinutes - currentMinutes) % 60;
    const closingTimeStr = `${daySchedule.closeHour.toString().padStart(2, '0')}:${daySchedule.closeMinute.toString().padStart(2, '0')}`;
    return {
      isOpen: true,
      nextStatus: `Open now until ${closingTimeStr} (${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft}m remaining)`,
    };
  }

  if (currentMinutes < openMinutes) {
    const openingTimeStr = `${daySchedule.openHour.toString().padStart(2, '0')}:${daySchedule.openMinute.toString().padStart(2, '0')}`;
    return { isOpen: false, nextStatus: `Opens today at ${openingTimeStr}` };
  }

  return { isOpen: false, nextStatus: 'Closed for the day' };
}

/**
 * Default IntersectionObserver options for image lazy-loading
 */
export interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function getDefaultLazyLoadConfig(): LazyLoadOptions {
  return {
    rootMargin: '150px 0px',
    threshold: 0.01,
  };
}

/**
 * Generate a tiny lightweight inline SVG placeholder with custom dimensions
 */
export function getLazyPlaceholderSvg(width = 700, height = 450, fillColor = '%23f3ecdf'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${fillColor}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Calculate staggered animation delay for cards in milliseconds
 */
export function calculateStaggerDelay(index: number, staggerMs = 40, maxDelayMs = 400): number {
  if (index < 0) return 0;
  return Math.min(index * staggerMs, maxDelayMs);
}

/**
 * Gallery item interface and category filter
 */
export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'interior' | 'signature' | 'bakery';
  src: string;
  caption: string;
  aspect?: 'tall' | 'wide' | 'square';
}

export interface GalleryGridConfig {
  columnsDesktop: number;
  columnsTablet: number;
  columnsMobile: number;
  itemHeightDesktop: number;
  itemHeightMobile: number;
  aspectRatio: string;
  gap: string;
  isUniformSize: boolean;
}

export function getGalleryGridConfig(): GalleryGridConfig {
  return {
    columnsDesktop: 3,
    columnsTablet: 2,
    columnsMobile: 1,
    itemHeightDesktop: 280,
    itemHeightMobile: 260,
    aspectRatio: '4/3',
    gap: '1.75rem',
    isUniformSize: true,
  };
}

export function filterGalleryItems(items: GalleryItem[], category: string): GalleryItem[] {
  if (!category || category === 'all') return items;
  return items.filter((item) => item.category === category);
}

/**
 * Configuration and pure math for section scroll reveal observer
 */
export interface SectionRevealConfig {
  rootMargin: string;
  threshold: number;
  selectors: string[];
}

export function getSectionRevealConfig(): SectionRevealConfig {
  return {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08,
    selectors: [
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
      '.reveal-section',
    ],
  };
}

/**
 * Determine if an element's bounding client rect is in initial viewport threshold
 */
export function isElementInInitialViewport(
  rect: { top: number; bottom: number },
  viewportHeight: number,
  thresholdRatio = 0.85
): boolean {
  if (viewportHeight <= 0) return false;
  return rect.top < viewportHeight * thresholdRatio && rect.bottom > 0;
}

/**
 * Order Tracking Types & Business Logic
 */
export type OrderPickupStage = 'received' | 'preparing' | 'ready' | 'completed';

export interface OrderItemSummary {
  name: string;
  qty: number;
  priceMNT: number;
  options?: string;
}

export interface OrderTrackingInfo {
  receiptId: string;
  customerName: string;
  stage: OrderPickupStage;
  statusLabel: string;
  statusMessage: string;
  pickupCounter: string;
  estimatedWaitMinutes: number;
  orderedAtTime: string;
  readyAtTime?: string;
  baristaNote: string;
  items: OrderItemSummary[];
  totalMNT: number;
  isReadyForPickup: boolean;
}

export interface StageDefinition {
  id: OrderPickupStage;
  label: string;
  description: string;
  iconName: 'receipt' | 'coffee' | 'bell' | 'check';
}

export interface TrackOrderResult {
  success: boolean;
  normalizedId: string;
  order?: OrderTrackingInfo;
  error?: string;
  currentStageIndex: number; // 0=received, 1=preparing, 2=ready, 3=completed, -1=error
}

export const ORDER_STAGES: StageDefinition[] = [
  { id: 'received', label: 'Received', description: 'Order ticket registered at brew bar', iconName: 'receipt' },
  { id: 'preparing', label: 'Brewing & Warming', description: 'Baristas crafting espresso & baked goods', iconName: 'coffee' },
  { id: 'ready', label: 'Ready for Pickup', description: 'Packaged & hot at Pickup Counter', iconName: 'bell' },
  { id: 'completed', label: 'Picked Up', description: 'Order handed to customer', iconName: 'check' },
];

/**
 * Normalizes user-entered receipt ID
 * Supports: "#AURA-1042", "aura-1042", "1042", "AURA 1042", "#1042"
 */
export function normalizeReceiptId(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().replace(/^#+/, '').trim();
  cleaned = cleaned.replace(/[\s_]+/g, '-').toUpperCase();

  // If user only typed 3-5 digits like "1042", prepend "AURA-"
  if (/^\d{3,5}$/.test(cleaned)) {
    return `AURA-${cleaned}`;
  }

  // If user typed "AURA1042" without hyphen
  if (/^AURA\d+$/i.test(cleaned)) {
    return `AURA-${cleaned.slice(4)}`;
  }

  return cleaned;
}

/**
 * Predefined realistic demo orders
 */
export const KNOWN_ORDERS: Record<string, OrderTrackingInfo> = {
  'AURA-1042': {
    receiptId: 'AURA-1042',
    customerName: 'Bat-Erdene',
    stage: 'ready',
    statusLabel: 'Ready for Pickup!',
    statusMessage: 'Your order is packaged with a hot sleeve and waiting at Counter 1.',
    pickupCounter: 'Counter 1 (Main Brew Bar)',
    estimatedWaitMinutes: 0,
    orderedAtTime: '10:12 AM',
    readyAtTime: '10:22 AM',
    baristaNote: 'Packaged in eco-friendly kraft bag. Napkins & wooden stirrers included.',
    items: [
      { name: 'Honey Oat Latte (Oat Milk, Cinnamon)', qty: 1, priceMNT: 9500 },
      { name: 'Pistachio Basque Cheesecake', qty: 1, priceMNT: 12500 },
    ],
    totalMNT: 22000,
    isReadyForPickup: true,
  },
  'AURA-1043': {
    receiptId: 'AURA-1043',
    customerName: 'Saruul M.',
    stage: 'preparing',
    statusLabel: 'Brewing & Preparing',
    statusMessage: 'Our baristas are steaming milk and warming your artisan sourdough toast.',
    pickupCounter: 'Counter 2 (Takeaway Window)',
    estimatedWaitMinutes: 3,
    orderedAtTime: '10:24 AM',
    baristaNote: 'Pour-over on manual drip station. Toast in convection oven.',
    items: [
      { name: 'Single-Origin Ethiopian Pour-Over', qty: 2, priceMNT: 8500 },
      { name: 'Avocado Sourdough Toast', qty: 1, priceMNT: 14500 },
    ],
    totalMNT: 31500,
    isReadyForPickup: false,
  },
  'AURA-1041': {
    receiptId: 'AURA-1041',
    customerName: 'Anar G.',
    stage: 'completed',
    statusLabel: 'Order Completed',
    statusMessage: 'This order was picked up at Counter 1. Thank you for visiting Aura Café!',
    pickupCounter: 'Counter 1 (Main Brew Bar)',
    estimatedWaitMinutes: 0,
    orderedAtTime: '10:02 AM',
    readyAtTime: '10:14 AM',
    baristaNote: 'Order collected by customer.',
    items: [
      { name: 'Golden Crema Espresso', qty: 1, priceMNT: 7500 },
      { name: 'Fresh Morning Butter Croissant', qty: 2, priceMNT: 6500 },
    ],
    totalMNT: 20500,
    isReadyForPickup: false,
  },
  'AURA-1044': {
    receiptId: 'AURA-1044',
    customerName: 'Munkh-Od T.',
    stage: 'received',
    statusLabel: 'Order Received',
    statusMessage: 'Ticket confirmed and routed to the barista station queue.',
    pickupCounter: 'Counter 1 (Main Brew Bar)',
    estimatedWaitMinutes: 7,
    orderedAtTime: '10:28 AM',
    baristaNote: 'Ticket #1044 is 2nd in queue.',
    items: [
      { name: 'Iced Matcha Green Tea Oat Latte', qty: 1, priceMNT: 9500 },
      { name: 'Lemon Poppyseed Sourdough Muffin', qty: 1, priceMNT: 7500 },
    ],
    totalMNT: 17000,
    isReadyForPickup: false,
  },
};

/**
 * Deterministic generator for arbitrary receipt IDs entered by users
 * Ensures that whatever custom receipt number a visitor types, they get a realistic simulated ticket!
 */
function generateDynamicOrder(normalizedId: string): OrderTrackingInfo {
  // Simple deterministic hash based on characters
  let hash = 0;
  for (let i = 0; i < normalizedId.length; i++) {
    hash = (hash * 31 + normalizedId.charCodeAt(i)) & 0xffffff;
  }

  const stageOptions: OrderPickupStage[] = ['preparing', 'ready', 'ready', 'received'];
  const stage = stageOptions[Math.abs(hash) % stageOptions.length];
  const isReady = stage === 'ready';

  const sampleNames = ['Guest', 'Tuvshin', 'Bilguun', 'Enkhjin', 'Solongo', 'Temuulen'];
  const customerName = sampleNames[Math.abs(hash) % sampleNames.length];

  const counters = ['Counter 1 (Main Brew Bar)', 'Counter 2 (Takeaway Window)'];
  const pickupCounter = counters[Math.abs(hash) % counters.length];

  const sampleItemsList: OrderItemSummary[][] = [
    [
      { name: 'Honey Oat Latte (Specialty Oat)', qty: 1, priceMNT: 9500 },
      { name: 'Almond Croissant', qty: 1, priceMNT: 8000 },
    ],
    [
      { name: 'Ethiopia Yirgacheffe V60 Pour-Over', qty: 1, priceMNT: 9000 },
      { name: 'Avocado Toast with Poached Egg', qty: 1, priceMNT: 14500 },
    ],
    [
      { name: 'Caramel Macchiato Double Shot', qty: 2, priceMNT: 19000 },
      { name: 'Basque Burnt Cheesecake Slice', qty: 1, priceMNT: 12500 },
    ],
  ];

  const items = sampleItemsList[Math.abs(hash) % sampleItemsList.length];
  const totalMNT = items.reduce((sum, item) => sum + item.priceMNT * item.qty, 0);

  let statusLabel = 'Ready for Pickup!';
  let statusMessage = 'Your takeaway order is packaged and waiting at the counter.';
  let waitMins = 0;
  let baristaNote = 'Freshly prepared and kept warm at the pickup zone.';

  if (stage === 'received') {
    statusLabel = 'Order Received';
    statusMessage = 'Ticket registered at our espresso bar. Preparation begins in moments.';
    waitMins = 8;
    baristaNote = 'Baristas reviewing your ticket.';
  } else if (stage === 'preparing') {
    statusLabel = 'In Barista Preparation';
    statusMessage = 'Your coffee is being pulled and food items are fresh from the oven.';
    waitMins = 4;
    baristaNote = 'Steaming milk and plating takeaway container.';
  } else if (stage === 'completed') {
    statusLabel = 'Order Picked Up';
    statusMessage = 'Order has already been collected. Have a wonderful day!';
    waitMins = 0;
    baristaNote = 'Completed receipt.';
  }

  return {
    receiptId: normalizedId,
    customerName,
    stage,
    statusLabel,
    statusMessage,
    pickupCounter,
    estimatedWaitMinutes: waitMins,
    orderedAtTime: 'Just now',
    readyAtTime: isReady ? 'Ready Now' : undefined,
    baristaNote,
    items,
    totalMNT,
    isReadyForPickup: isReady,
  };
}

/**
 * Core order lookup function
 */
export function trackTakeawayOrder(rawInput: string): TrackOrderResult {
  const normalized = normalizeReceiptId(rawInput);

  if (!normalized || normalized.length < 3) {
    return {
      success: false,
      normalizedId: normalized,
      error: 'Please enter your Receipt or Order ID (e.g. #AURA-1042 or 1042).',
      currentStageIndex: -1,
    };
  }

  // Look for exact match in known orders
  if (KNOWN_ORDERS[normalized]) {
    const order = KNOWN_ORDERS[normalized];
    const stageIndex = ORDER_STAGES.findIndex((s) => s.id === order.stage);
    return {
      success: true,
      normalizedId: normalized,
      order,
      currentStageIndex: stageIndex,
    };
  }

  // If receipt pattern is valid alphanumeric (e.g., AURA-XXXX, or 3-8 characters), provide simulated order
  if (/^[A-Z0-9-]+$/i.test(normalized)) {
    const dynamicOrder = generateDynamicOrder(normalized);
    const stageIndex = ORDER_STAGES.findIndex((s) => s.id === dynamicOrder.stage);
    return {
      success: true,
      normalizedId: normalized,
      order: dynamicOrder,
      currentStageIndex: stageIndex,
    };
  }

  return {
    success: false,
    normalizedId: normalized,
    error: 'Invalid receipt format. Please enter alphanumeric characters (e.g. #AURA-1042).',
    currentStageIndex: -1,
  };
}

