# 🎧 PHONO // Minimalist Studio Headphones & Shopping Experience

> **Pure Sound. Zero Distraction.**  
> A high-contrast, minimalist black-and-white e-commerce & product showcase web application designed and developed by **[Aarav (@Aarav1107)](https://github.com/Aarav1107)**.

---

## ✦ Overview

**PHONO** is a modern front-end audio shopping website and interactive product showcase. Inspired by the classic **095 Headphones Product Page** from the *100+ Mini Web Projects* series, this project elevates the concept into a complete, full-featured studio storefront with real-time acoustic frequency simulation, dynamic finish customizer, and a full shopping bag workflow.

The design strictly follows a **Minimalist Monochrome** aesthetic, utilizing deep pitch blacks, crisp off-whites, architectural typography, subtle glassmorphism, and responsive micro-interactions.

---

## ⚡ Key Features

- **🖤 Minimalist Monochrome Aesthetics**: Clean high-contrast palette with seamless **Dark Mode** and **Clean Light Mode** toggle (persisted via `localStorage`).
- **🎨 Interactive Color & Finish Customizer**:
  - Live model switcher between *01. Obsidian Black*, *02. Glacier White*, and *03. Stealth Titanium*.
  - Multi-angle views (*Studio Angle* vs *Desk Stand*).
  - Dynamic accessory bundle calculator (Aluminum Stand, Balanced 4.4mm OFC Cable).
- **🔊 Interactive Acoustics Lab & Canvas Visualizer**:
  - Real-time HTML5 Canvas animated waveform visualizer.
  - Interactive **Web Audio API** sound engine with selectable audio tuning profiles:
    - *01. Studio Reference (Flat mastering curve)*
    - *02. Dynamic Sub-Bass (Deep low-frequency harmonics)*
    - *03. Spatial Immersion (Wide acoustic binaural soundstage)*
  - Live volume slider and quick audio test header widget.
- **🛍️ Complete Shopping Bag & Cart Drawer**:
  - Slide-out cart drawer with dynamic item count badge.
  - Quantity controls (`+` / `−`), item removal, and persistent state across reloads.
  - **Dynamic Free Shipping Bar** (recalculates progress towards $100 threshold).
  - **Promo Code Engine**: Try `AARAV10` (10% off) or `STUDIO20` (20% off).
- **💳 Fast Checkout & Order Confirmation**:
  - Integrated mock checkout modal with shipping address validation and payment selection.
  - Auto-generated order reference code (e.g. `#PHONO-9525-XXXX`).
- **📊 Technical Engineering Matrix**:
  - Comprehensive specification comparison table between studio flagship, IEMs, and industry standards.
- **⭐ Community Reviews & Testimonials**:
  - Audiophile review cards with verified buyer tags.
  - Interactive **"Write a Review"** modal with 5-star rating selector that immediately adds user reviews to the page.
- **📸 Studio Lookbook & Gallery Lightbox**:
  - Architectural desk setup photo grid with click-to-expand lightbox view.
- **📱 Fully Responsive**:
  - Optimized across desktop (1440px+), tablet, and mobile viewports with smooth mobile navigation drawer.

---

## 🛠️ Built With

- **HTML5**: Semantic markup, accessible labels (`aria-*`), and metadata.
- **CSS3 (Vanilla)**:
  - CSS Custom Properties (Theme tokens for dark & light modes).
  - CSS Grid & Flexbox layouts.
  - Custom scrollbars, glassmorphism overlays (`backdrop-filter`), and keyframe animations.
- **JavaScript (ES6+ Vanilla)**:
  - Zero external framework dependencies.
  - Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
  - HTML5 Canvas 2D rendering.
  - LocalStorage state synchronization for Cart, Theme, and Reviews.

---

## 🚀 Quick Start / Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aarav1107/headphone-shopping-site.git
   cd headphone-shopping-site
   ```

2. **Run Locally**:
   - Open `index.html` directly in any modern web browser.
   - Or run with VS Code **Live Server** / Python simple server:
     ```bash
     npx serve .
     # or
     python -m http.server 8000
     ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000` (or the port shown in your terminal).

---

## 📁 Project Structure

```
headphone-shopping-site/
├── index.html              # Main application markup & structure
├── css/
│   ├── style.css           # Design tokens, monochrome styling & animations
│   └── utility.css         # Helper classes
├── js/
│   ├── app.js              # State management, Web Audio, Cart & interactive logic
│   └── script.js           # Legacy entrypoint fallback
├── img/
│   ├── headphone-black.jpg # Obsidian Black flagship headphone
│   ├── headphone-white.jpg # Glacier White studio headphone
│   ├── headphone-silver.jpg# Stealth Titanium headphone
│   ├── headphone-iem.jpg   # Dual hybrid in-ear monitors
│   ├── headphone-stand.jpg # Machined aluminum desk stand
│   └── lookbook-lifestyle.jpg# Minimalist studio desk lookbook photo
└── README.md               # Project documentation
```

---

## 👤 Author

**Aarav Kashyap**  
- GitHub: [@Aarav1107](https://github.com/Aarav1107)  
- Repository: [headphone-shopping-site](https://github.com/Aarav1107/headphone-shopping-site)

---

## 📄 License & Credits

- Inspired by the *100+ Mini Web Projects* (Project 095: Headphones Product Page).
- Designed and built with focus by **Aarav**.
- Free to use for learning and educational purposes.
