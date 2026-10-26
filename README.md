# Aura Artisan Café — Modern Café Website

A polished, fully responsive, and accessible modern café website designed and developed according to the project specification ("Website Development Project — Simple Café Website"). Built with semantic **HTML5**, modern **CSS3**, and **Vanilla JavaScript** without heavy frontend frameworks.

---

## ☕ Project Overview

- **Brand:** Aura Artisan Café
- **Visual Identity:** Warm Ivory (`#FBF8F3`), Rich Coffee Brown (`#24140E`), and Natural Sage Green (`#345C3F`)
- **Typography:** Elegant editorial serif headings (*Playfair Display*) paired with clean, readable sans-serif body (*Plus Jakarta Sans*)
- **Target Audience:** University students, nearby professionals & remote workers, neighborhood families, and visitors
- **Currency:** Mongolian Tugrik (`₮` / MNT) with thousands separator formatting (e.g. `₮9,500`)

---

## 📁 Project Structure

```text
cafe-website/
├── index.html            # 1. Homepage (Hero, Quality Pillars, Featured Items, Story, Promo, Testimonials)
├── about.html            # 2. About Page (Origins, Mission & Core Values, Atmosphere for Students/Workers/Families, Team)
├── menu.html             # 3. Menu Page (Breakfast, Lunch, Coffee & Drinks, Desserts, Search & Dynamic Filter)
├── contact.html          # 4. Contact Page (Interactive Form Validation, Live Operating Hours, Stylized Map, FAQ)
├── css/
│   ├── style.css         # Design tokens, typography, header, cards, buttons, footer, and animations
│   └── responsive.css    # Responsive breakpoints (Desktop, Tablet, Mobile 390px, Reduced Motion)
├── js/
│   ├── main.js           # Shared navigation, mobile drawer toggle, back-to-top, and notifications
│   ├── menu.js           # Dynamic category filtering, real-time search, item modal & order tray in MNT
│   └── contact.js        # Form validation, live Open/Closed badge, schedule highlighter, and FAQ accordion
├── src/utils/
│   ├── cafe-logic.ts     # Pure business logic (formatting, form rules, filtering, schedule calculations)
│   └── cafe-logic.test.ts# Fast deterministic unit tests via Node's native test runner (node:test)
├── vite.config.ts        # Multi-page build configuration
├── metadata.json         # Project metadata and permissions
└── README.md             # Complete documentation and setup guide
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The website will be available at:
`http://localhost:3000`

Direct page navigation:
- Homepage: `http://localhost:3000/index.html` (or `http://localhost:3000/`)
- About Page: `http://localhost:3000/about.html`
- Menu Page: `http://localhost:3000/menu.html`
- Contact Page: `http://localhost:3000/contact.html`

### 3. Run Unit Tests (Node:Test)
Fast unit tests verify Tugrik currency formatting, form validation constraints, category filtering, and operating hours calculation:
```bash
npx --yes tsx --test src/utils/cafe-logic.test.ts
```

### 4. Build for Production
To generate optimized static HTML/CSS/JS files:
```bash
npm run build
```
The build artifacts will be placed into the `dist/` folder, ready for deployment to any static hosting provider (e.g. Netlify, Vercel, GitHub Pages, Firebase Hosting, Cloud Run).

---

## ✨ Features Implemented

### 1. Home Page (`index.html`)
- **Sticky Navigation Bar:** Features the café icon logo, active page indicator, desktop menu links, order action, and accessible mobile drawer toggle.
- **Hero Section:** High-resolution artisan imagery, headline (*"Crafted with Heart, Brewed with Purpose"*), short brand intro, primary CTA (*"Explore Our Menu"*), secondary CTA (*"Contact Us"*), and quick proof stats.
- **Three Quality Pillars:** Highlights Specialty Coffee Quality (direct-trade single origin), Farm-Fresh Ingredients (local bakeries & farms), and Welcoming Atmosphere.
- **Featured Menu Showcase:** Quick-access cards for popular guest favorites with prices in Tugrik (`₮`).
- **Story Teaser:** Visual photo mosaic and authentic narrative introducing the café’s heart.
- **Promotional Special Offer Card:** *"The Student & Coworker Morning Bundle"* highlighting 20% discount, fiber Wi-Fi, and laptop power outlets.
- **Community Testimonials:** Honest reviews representing students, remote workers, and weekend families.
- **Masonry Image Gallery:** High-resolution responsive photo showcase below testimonials displaying café interior spaces, pour-over rituals, golden crema espresso, study mezzanine, and morning bakery goods with interactive category filtering and full-screen lightbox preview.
- **Footer:** Detailed contact info, opening hours overview, social media links, and editable sample disclaimer.

### 2. About Page (`about.html`)
- **Founding Story:** Authentic narrative of how the café was created in 2021 by two craft baristas.
- **Mission & Core Values:** Ethical sourcing, honest ingredients, inclusive hospitality, and mindful pacing.
- **Target Audience Atmosphere:** Dedicated breakdowns for **Students** (quiet study mezzanine, outlets, Wi-Fi), **Professionals** (quick lunches, booths), and **Families** (spacious seating, kid-friendly drinks).
- **Meet the Team:** Profiles for the Head Barista & Roaster, Master Pastry Chef, Culinary Lead, and Hospitality Coordinator.

### 3. Menu Page (`menu.html`)
- **Four Required Categories:**
  1. Breakfast (Avocado Sourdough, French Butter Croissants, Granola Bowls, Salmon Brioche)
  2. Lunch (Tuscan Chicken Panini, Caprese Burrata Focaccia, Andean Quinoa Salad, Pumpkin Ginger Soup)
  3. Coffee and Drinks (Signature Honey Oat Latte, Nitro Cold Brew, Ceremonial Matcha, Flat White, Chai)
  4. Desserts (Pistachio Basque Burnt Cheesecake, Espresso Tiramisu, Apple Cinnamon Crumble, Lava Cake)
- **Interactive JavaScript Category Filtering:** Instant switching with smooth CSS cross-fade, translation, and staggered card entrance animations (`@keyframes cardEntrance`) instead of abrupt snaps.
- **Real-Time Live Search:** Filter items as you type across names, descriptions, and dietary tags.
- **Dietary Badges:** Vegetarian, Vegan, Gluten-Free, and kcal indicators.
- **Item Details Modal:** Quick view dialog with large imagery, flavor profile, and ingredient notes.
- **Interactive Order Estimator Tray:** Client-side prototype calculating real-time subtotals in Tugrik (`₮`).

### 4. Contact Page (`contact.html`)
- **Contact Form with JavaScript Validation:**
  - Real-time error feedback as the user types
  - Validation rules for name (≥ 2 chars), email format regex, and message (≥ 10 chars)
  - Clear success banner explaining the demo environment without falsely claiming backend email delivery.
- **Live Business Operating Hours:**
  - Calculates whether the café is currently **Open** or **Closed** based on the client's current time.
  - Automatically highlights today’s row in the operating schedule table.
- **Direct Contact Coordinates:** Editable sample phone numbers, email, and address on Peace Avenue.
- **Interactive Vector Location Map:** Stylized SVG map with streets, landmarks, and parking instructions.
- **Accessible FAQ Accordion:** Common questions about Wi-Fi speed, table reservations, and dietary accommodations.

---

## ⚡ Performance & Intersection Observer Lazy-Loading
- **Native IntersectionObserver Implementation:** Both the Home page (`index.html`) and Menu page (`menu.html`) use an `IntersectionObserver` instance with a `120px` preload root margin buffer.
- **Dynamic Category & Search Re-observation:** In `menu.js`, when a user switches categories or filters items via the search input, newly created DOM cards are registered with the observer so offscreen items do not fetch network data prematurely.
- **Zero Layout Shifts:** Lightweight inline SVG placeholders preserve aspect ratios (`700x450` and `900x600`) before images load.
- **Graceful Fade-In Transitions:** Images apply `.lazy-image` with opacity transitions that gracefully fade in upon the `load` event.
- **Legacy Fallback:** If `IntersectionObserver` is unavailable in legacy browsers, images immediately load `dataset.src` without degradation.

---

## ♿ Accessibility & Usability
- Semantic HTML elements throughout (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Native form labels and `aria-describedby` associations for form errors.
- Visual focus outlines (`:focus-visible`) styled with high contrast natural green.
- Keyboard navigation support for modals, drawers, and accordions (including `Escape` key close).
- Fully responsive across mobile (390px), tablets (768px), and wide monitors (1440px).
- Respects `prefers-reduced-motion` to disable non-essential animations.

---

## 📝 Note on Sample Content
As specified in the project guidelines, all contact details (e.g. phone numbers, email addresses, and team bios) are provided as clearly marked **editable sample data** to serve as a high-fidelity starting point for any real café brand.
