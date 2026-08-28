/**
 * PHONO // Minimalist Studio Audio
 * Project: Headphone Shopping & Product Showcase (Solygambas #095 Architecture)
 * Authored by: Aarav (@Aarav1107)
 * Description: Vanilla JavaScript handling theme switching, interactive finish customizer,
 *              Web Audio API frequency synthesis, shopping bag state, and checkout flows.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. Global State & LocalStorage Helpers
    // =========================================================================
    const state = {
        theme: localStorage.getItem('phono_theme') || 'dark',
        cart: JSON.parse(localStorage.getItem('phono_cart') || '[]'),
        promoApplied: null,
        soundPlaying: false,
        audioContext: null,
        oscillator: null,
        gainNode: null,
        activeProfile: 'flat',
        customizerFinish: 'black',
        customizerPrice: 299,
        customizerAddons: { stand: false, cable: false }
    };

    // DOM Element Selectors
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartBackdrop = document.getElementById('cartBackdrop');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartEmptyState = document.getElementById('cartEmptyState');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartGrandTotalEl = document.getElementById('cartGrandTotal');
    const cartDiscountEl = document.getElementById('cartDiscount');
    const discountRow = document.getElementById('discountRow');
    const shippingProgressBar = document.getElementById('shippingProgressBar');
    const shippingProgressText = document.getElementById('shippingProgressText');
    const cartItemsCountText = document.getElementById('cartItemsCountText');
    const toastContainer = document.getElementById('toastContainer');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const closeAnnouncement = document.getElementById('closeAnnouncement');

    // =========================================================================
    // 2. Theme Management (Monochrome Dark / Clean Light)
    // =========================================================================
    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        state.theme = theme;
        localStorage.setItem('phono_theme', theme);
    }

    applyTheme(state.theme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('open'));
        });
    }

    // Close Announcement Banner
    if (closeAnnouncement) {
        closeAnnouncement.addEventListener('click', () => {
            const banner = document.querySelector('.announcement-bar');
            if (banner) banner.style.display = 'none';
        });
    }

    // =========================================================================
    // 3. Hero Finish Selector & Smooth Transition
    // =========================================================================
    const heroProductImg = document.getElementById('heroProductImg');
    const selectedColorLabel = document.getElementById('selectedColorLabel');
    const heroSwatches = document.querySelectorAll('.swatch-btn');
    const heroAddToCartBtn = document.getElementById('heroAddToCartBtn');

    heroSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            heroSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const colorName = swatch.getAttribute('data-color');
            const imgSrc = swatch.getAttribute('data-img');
            const price = swatch.getAttribute('data-price');

            if (selectedColorLabel) {
                selectedColorLabel.textContent = `01 // ${colorName}`;
            }

            // Smooth cross-fade transition
            if (heroProductImg) {
                heroProductImg.classList.add('fading');
                setTimeout(() => {
                    heroProductImg.src = imgSrc;
                    heroProductImg.classList.remove('fading');
                }, 200);
            }

            if (heroAddToCartBtn) {
                heroAddToCartBtn.setAttribute('data-title', `PHONO Pro Wireless — ${colorName}`);
                heroAddToCartBtn.setAttribute('data-price', price);
                heroAddToCartBtn.setAttribute('data-img', imgSrc);
                heroAddToCartBtn.querySelector('span').textContent = `Order Phono Pro • $${price}`;
            }
        });
    });

    // =========================================================================
    // 4. Interactive Customizer Studio Panel
    // =========================================================================
    const customizerMainImg = document.getElementById('customizerMainImg');
    const customizerPriceTag = document.getElementById('customizerPriceTag');
    const configFinalTotal = document.getElementById('configFinalTotal');
    const customizerViewBadge = document.getElementById('customizerViewBadge');
    const finishPills = document.querySelectorAll('.finish-pill');
    const viewButtons = document.querySelectorAll('.view-btn');
    const addStandCheck = document.getElementById('addStandCheck');
    const addCableCheck = document.getElementById('addCableCheck');
    const customizerAddToCartBtn = document.getElementById('customizerAddToCartBtn');

    const finishImgMap = {
        black: { front: 'img/headphone-black.jpg', desk: 'img/lookbook-lifestyle.jpg' },
        white: { front: 'img/headphone-white.jpg', desk: 'img/lookbook-lifestyle.jpg' },
        silver: { front: 'img/headphone-silver.jpg', desk: 'img/headphone-stand.jpg' }
    };

    let currentViewMode = 'front';

    function updateCustomizerPricing() {
        let basePrice = state.customizerFinish === 'silver' ? 329 : 299;
        let addonsTotal = 0;
        if (addStandCheck && addStandCheck.checked) addonsTotal += 49;
        if (addCableCheck && addCableCheck.checked) addonsTotal += 39;

        const finalTotal = basePrice + addonsTotal;
        if (customizerPriceTag) customizerPriceTag.textContent = `$${basePrice}.00`;
        if (configFinalTotal) configFinalTotal.textContent = `$${finalTotal}.00`;
        state.customizerPrice = finalTotal;
    }

    finishPills.forEach(pill => {
        pill.addEventListener('click', () => {
            finishPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const finishKey = pill.getAttribute('data-finish');
            const finishName = pill.getAttribute('data-name');
            state.customizerFinish = finishKey;

            if (customizerViewBadge) {
                customizerViewBadge.textContent = `FINISH: ${finishName.toUpperCase()}`;
            }

            if (customizerMainImg) {
                customizerMainImg.src = finishImgMap[finishKey][currentViewMode];
            }

            updateCustomizerPricing();
        });
    });

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentViewMode = btn.getAttribute('data-view');
            if (customizerMainImg) {
                customizerMainImg.src = finishImgMap[state.customizerFinish][currentViewMode];
            }
        });
    });

    if (addStandCheck) addStandCheck.addEventListener('change', updateCustomizerPricing);
    if (addCableCheck) addCableCheck.addEventListener('change', updateCustomizerPricing);

    if (customizerAddToCartBtn) {
        customizerAddToCartBtn.addEventListener('click', () => {
            const finishName = state.customizerFinish === 'black' ? 'Obsidian Black' :
                               state.customizerFinish === 'white' ? 'Glacier White' : 'Stealth Titanium';
            const img = finishImgMap[state.customizerFinish].front;

            addToCart({
                id: `phono-custom-${state.customizerFinish}`,
                title: `PHONO Pro Studio (${finishName})`,
                price: state.customizerPrice,
                img: img,
                quantity: 1
            });
        });
    }

    // =========================================================================
    // 5. Acoustics Lab & Canvas Soundwave Visualizer (Web Audio API)
    // =========================================================================
    const canvas = document.getElementById('soundCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const audioLabPlayBtn = document.getElementById('audioLabPlayBtn');
    const quickAudioBtn = document.getElementById('quickAudioBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const profileButtons = document.querySelectorAll('.profile-btn');
    const activeProfileText = document.getElementById('activeProfileText');
    const profileDescBox = document.getElementById('profileDescBox');

    let animationFrameId = null;
    let waveOffset = 0;

    // Web Audio Synthesizer Node Configuration
    function initWebAudio() {
        if (!state.audioContext) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            state.audioContext = new AudioCtx();
            state.gainNode = state.audioContext.createGain();
            state.gainNode.gain.setValueAtTime(parseFloat(volumeSlider ? volumeSlider.value : 0.5) * 0.15, state.audioContext.currentTime);
            state.gainNode.connect(state.audioContext.destination);
        }
        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    }

    function startAcousticTone() {
        initWebAudio();
        if (state.oscillator) {
            state.oscillator.stop();
            state.oscillator.disconnect();
        }

        state.oscillator = state.audioContext.createOscillator();
        
        // Calibrate frequency based on selected profile
        if (state.activeProfile === 'flat') {
            state.oscillator.type = 'sine';
            state.oscillator.frequency.setValueAtTime(440, state.audioContext.currentTime); // Pure concert pitch
        } else if (state.activeProfile === 'bass') {
            state.oscillator.type = 'triangle';
            state.oscillator.frequency.setValueAtTime(65, state.audioContext.currentTime); // Deep warm sub-harmonic C2
        } else {
            state.oscillator.type = 'sine';
            state.oscillator.frequency.setValueAtTime(528, state.audioContext.currentTime); // Spatial harmonic resonance
        }

        state.oscillator.connect(state.gainNode);
        state.oscillator.start();
        state.soundPlaying = true;
        updateAudioButtonUI(true);
    }

    function stopAcousticTone() {
        if (state.oscillator) {
            state.oscillator.stop();
            state.oscillator.disconnect();
            state.oscillator = null;
        }
        state.soundPlaying = false;
        updateAudioButtonUI(false);
    }

    function toggleAcousticAudio() {
        if (state.soundPlaying) {
            stopAcousticTone();
            showToast('Acoustic simulation paused');
        } else {
            startAcousticTone();
            showToast(`Acoustic tone active: ${state.activeProfile.toUpperCase()}`);
        }
    }

    function updateAudioButtonUI(isPlaying) {
        if (audioLabPlayBtn) {
            audioLabPlayBtn.classList.toggle('playing', isPlaying);
            const textSpan = document.getElementById('audioLabBtnText');
            if (textSpan) textSpan.textContent = isPlaying ? 'Stop Simulation' : 'Start Sound Simulation';
        }
        if (quickAudioBtn) {
            quickAudioBtn.classList.toggle('playing', isPlaying);
        }
    }

    if (audioLabPlayBtn) audioLabPlayBtn.addEventListener('click', toggleAcousticAudio);
    if (quickAudioBtn) quickAudioBtn.addEventListener('click', toggleAcousticAudio);

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (state.gainNode && state.audioContext) {
                state.gainNode.gain.setValueAtTime(parseFloat(e.target.value) * 0.15, state.audioContext.currentTime);
            }
        });
    }

    // Profile Preset Buttons
    profileButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            profileButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const profile = btn.getAttribute('data-profile');
            const desc = btn.getAttribute('data-desc');
            state.activeProfile = profile;

            if (activeProfileText) {
                activeProfileText.textContent = `PROFILE: ${profile.toUpperCase()} CALIBRATION`;
            }
            if (profileDescBox) {
                profileDescBox.innerHTML = `<p><strong>${btn.querySelector('span').textContent}:</strong> ${desc}</p>`;
            }

            if (state.soundPlaying) {
                startAcousticTone(); // Recalibrate active oscillator
            }
        });
    });

    // Render Canvas Soundwave Animation
    function renderVisualizer() {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        // Draw Subtle Grid Lines
        ctx.strokeStyle = '#181818';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x += 40) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += 30) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw Center Zero-Reference Line
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Draw Dynamic Acoustic Waveform
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = state.theme === 'dark' ? '#ffffff' : '#111111';
        ctx.beginPath();

        const amplitudeFactor = state.soundPlaying ? 1.6 : 0.6;
        const speed = state.soundPlaying ? 0.08 : 0.03;
        waveOffset += speed;

        for (let x = 0; x < width; x++) {
            let y = centerY;
            if (state.activeProfile === 'flat') {
                y += Math.sin(x * 0.03 + waveOffset) * 22 * amplitudeFactor
                   + Math.sin(x * 0.015 - waveOffset * 0.8) * 12 * amplitudeFactor;
            } else if (state.activeProfile === 'bass') {
                y += Math.sin(x * 0.012 + waveOffset) * 55 * amplitudeFactor
                   + Math.cos(x * 0.024 + waveOffset * 1.2) * 18 * amplitudeFactor;
            } else if (state.activeProfile === 'spatial') {
                y += Math.sin(x * 0.05 + waveOffset) * 28 * amplitudeFactor
                   * Math.cos(x * 0.008 + waveOffset * 0.5) * 1.5;
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        animationFrameId = requestAnimationFrame(renderVisualizer);
    }

    renderVisualizer();

    // =========================================================================
    // 6. Category Filtering for Product Grid
    // =========================================================================
    const catTabs = document.querySelectorAll('.cat-tab');
    const productCards = document.querySelectorAll('.product-card');

    catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');
            productCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Wishlist Button Handler
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            const title = btn.getAttribute('data-title') || 'Item';
            if (btn.classList.contains('active')) {
                showToast(`Saved ${title} to Wishlist`);
            } else {
                showToast(`Removed from Wishlist`);
            }
        });
    });

    // =========================================================================
    // 7. Shopping Bag (Cart) State & UI Logic
    // =========================================================================
    function openCart() {
        if (cartDrawer && cartBackdrop) {
            cartDrawer.classList.add('open');
            cartBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartDrawer && cartBackdrop) {
            cartDrawer.classList.remove('open');
            cartBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

    function addToCart(product) {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({ ...product, quantity: product.quantity || 1 });
        }

        saveCart();
        renderCartUI();
        openCart();
        showToast(`Added "${product.title}" to Bag`);
    }

    function updateCartItemQuantity(id, delta) {
        const item = state.cart.find(i => i.id === id);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            state.cart = state.cart.filter(i => i.id !== id);
        }

        saveCart();
        renderCartUI();
    }

    function removeFromCart(id) {
        state.cart = state.cart.filter(i => i.id !== id);
        saveCart();
        renderCartUI();
        showToast('Item removed from Bag');
    }

    function saveCart() {
        localStorage.setItem('phono_cart', JSON.stringify(state.cart));
    }

    function renderCartUI() {
        const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) cartCountBadge.textContent = totalItemsCount;
        if (cartItemsCountText) cartItemsCountText.textContent = `(${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'})`;

        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;

        if (state.promoApplied === 'AARAV10') discount = subtotal * 0.10;
        else if (state.promoApplied === 'STUDIO20') discount = subtotal * 0.20;

        const grandTotal = Math.max(0, subtotal - discount);

        if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (cartGrandTotalEl) cartGrandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;

        if (discountRow && cartDiscountEl) {
            if (discount > 0) {
                discountRow.style.display = 'flex';
                cartDiscountEl.textContent = `-$${discount.toFixed(2)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        // Free Shipping Progress calculation ($100 target)
        const freeShippingGoal = 100;
        const progressPercent = Math.min(100, (subtotal / freeShippingGoal) * 100);
        if (shippingProgressBar) shippingProgressBar.style.width = `${progressPercent}%`;

        if (shippingProgressText) {
            if (subtotal >= freeShippingGoal) {
                shippingProgressText.textContent = '🎉 You qualify for Free Worldwide Express Shipping!';
            } else {
                const remaining = (freeShippingGoal - subtotal).toFixed(2);
                shippingProgressText.textContent = `Add $${remaining} more for Free Worldwide Express Shipping`;
            }
        }

        // Render Cart Items List
        if (!cartItemsList) return;

        // Clear existing dynamic rows
        const existingRows = cartItemsList.querySelectorAll('.cart-item-row');
        existingRows.forEach(row => row.remove());

        if (state.cart.length === 0) {
            if (cartEmptyState) cartEmptyState.style.display = 'flex';
        } else {
            if (cartEmptyState) cartEmptyState.style.display = 'none';

            state.cart.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-row';
                itemRow.innerHTML = `
                    <div class="cart-item-thumb">
                        <img src="${item.img}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <div>
                            <h4 class="cart-item-title">${item.title}</h4>
                            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div class="cart-item-controls">
                            <div class="qty-stepper">
                                <button class="qty-btn btn-minus" data-id="${item.id}">−</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn btn-plus" data-id="${item.id}">+</button>
                            </div>
                            <span class="cart-item-remove" data-id="${item.id}">Remove</span>
                        </div>
                    </div>
                `;
                cartItemsList.appendChild(itemRow);
            });

            // Bind stepper and remove buttons
            cartItemsList.querySelectorAll('.btn-minus').forEach(btn => {
                btn.addEventListener('click', () => updateCartItemQuantity(btn.getAttribute('data-id'), -1));
            });
            cartItemsList.querySelectorAll('.btn-plus').forEach(btn => {
                btn.addEventListener('click', () => updateCartItemQuantity(btn.getAttribute('data-id'), 1));
            });
            cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
            });
        }
    }

    // Attach Add-to-Cart listeners across product buttons
    document.querySelectorAll('.btn-quick-add, #heroAddToCartBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id') || 'phono-pro';
            const title = btn.getAttribute('data-title') || 'PHONO Pro Wireless';
            const price = parseFloat(btn.getAttribute('data-price') || '299');
            const img = btn.getAttribute('data-img') || 'img/headphone-black.jpg';

            addToCart({ id, title, price, img, quantity: 1 });
        });
    });

    // Promo Code Handler
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoCodeInput = document.getElementById('promoCodeInput');
    const promoFeedback = document.getElementById('promoFeedback');

    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim().toUpperCase();
            if (code === 'AARAV10') {
                state.promoApplied = 'AARAV10';
                if (promoFeedback) {
                    promoFeedback.className = 'promo-feedback success';
                    promoFeedback.textContent = 'Code AARAV10 applied: 10% Studio Discount!';
                }
                showToast('Promo Code AARAV10 Applied!');
            } else if (code === 'STUDIO20') {
                state.promoApplied = 'STUDIO20';
                if (promoFeedback) {
                    promoFeedback.className = 'promo-feedback success';
                    promoFeedback.textContent = 'VIP Code applied: 20% Discount!';
                }
                showToast('VIP Promo Applied!');
            } else {
                if (promoFeedback) {
                    promoFeedback.className = 'promo-feedback error';
                    promoFeedback.textContent = 'Invalid promo code. Try AARAV10';
                }
            }
            renderCartUI();
        });
    }

    // Initialize Cart on Load
    renderCartUI();

    // =========================================================================
    // 8. Checkout Modal Flow
    // =========================================================================
    const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutStepForm = document.getElementById('checkoutStepForm');
    const checkoutSuccessState = document.getElementById('checkoutSuccessState');
    const modalOrderTotal = document.getElementById('modalOrderTotal');
    const confirmedOrderId = document.getElementById('confirmedOrderId');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const emptyCartShopBtn = document.getElementById('emptyCartShopBtn');

    if (emptyCartShopBtn) {
        emptyCartShopBtn.addEventListener('click', () => {
            closeCart();
            const catalogSection = document.getElementById('catalog');
            if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener('click', () => {
            if (state.cart.length === 0) {
                showToast('Your bag is currently empty.');
                return;
            }
            closeCart();
            if (checkoutModal) {
                checkoutModal.classList.add('open');
                if (checkoutStepForm) checkoutStepForm.style.display = 'block';
                if (checkoutSuccessState) checkoutSuccessState.style.display = 'none';

                const total = cartGrandTotalEl ? cartGrandTotalEl.textContent : '$299.00';
                if (modalOrderTotal) modalOrderTotal.textContent = total;
            }
        });
    }

    if (closeCheckoutModal) {
        closeCheckoutModal.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('open');
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderNum = Math.floor(1000 + Math.random() * 9000);
            if (confirmedOrderId) confirmedOrderId.textContent = `#PHONO-9525-${orderNum}`;

            if (checkoutStepForm) checkoutStepForm.style.display = 'none';
            if (checkoutSuccessState) checkoutSuccessState.style.display = 'block';

            // Clear Cart upon successful order
            state.cart = [];
            saveCart();
            renderCartUI();
            showToast('Order confirmed successfully!');
        });
    }

    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('open');
        });
    }

    // =========================================================================
    // 9. Community Reviews Modal & Submission
    // =========================================================================
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const reviewSubmitForm = document.getElementById('reviewSubmitForm');
    const starButtons = document.querySelectorAll('.star-btn');
    const reviewsContainer = document.getElementById('reviewsContainer');

    let selectedRating = 5;

    if (writeReviewBtn && reviewModal) {
        writeReviewBtn.addEventListener('click', () => reviewModal.classList.add('open'));
    }
    if (closeReviewModal && reviewModal) {
        closeReviewModal.addEventListener('click', () => reviewModal.classList.remove('open'));
    }

    starButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.getAttribute('data-rating') || '5', 10);
            starButtons.forEach(b => {
                const r = parseInt(b.getAttribute('data-rating'), 10);
                b.classList.toggle('active', r <= selectedRating);
            });
        });
    });

    if (reviewSubmitForm) {
        reviewSubmitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = document.getElementById('reviewAuthor').value.trim();
            const role = document.getElementById('reviewRole').value.trim() || 'Verified Audiophile';
            const content = document.getElementById('reviewContent').value.trim();

            const stars = '★'.repeat(selectedRating);
            const initials = author.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'AN';

            const newReviewCard = document.createElement('div');
            newReviewCard.className = 'review-card';
            newReviewCard.innerHTML = `
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${content}"</p>
                <div class="reviewer-meta">
                    <div class="reviewer-avatar">${initials}</div>
                    <div>
                        <h4 class="reviewer-name">${author} <span class="verified-tag">✓ Verified Buyer</span></h4>
                        <span class="reviewer-role">${role}</span>
                    </div>
                </div>
            `;

            if (reviewsContainer) {
                reviewsContainer.prepend(newReviewCard);
            }

            reviewSubmitForm.reset();
            if (reviewModal) reviewModal.classList.remove('open');
            showToast('Thank you! Your review has been published.');
        });
    }

    // =========================================================================
    // 10. Lookbook Lightbox Zoom
    // =========================================================================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');
    const lookbookItems = document.querySelectorAll('.lookbook-item');

    lookbookItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src') || item.querySelector('img').src;
            if (lightboxImg && lightboxModal) {
                lightboxImg.src = src;
                lightboxModal.classList.add('open');
            }
        });
    });

    if (closeLightbox && lightboxModal) {
        closeLightbox.addEventListener('click', () => lightboxModal.classList.remove('open'));
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) lightboxModal.classList.remove('open');
        });
    }

    // =========================================================================
    // 11. Newsletter Form Handler
    // =========================================================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value) {
                showToast(`Subscribed! 10% discount sent to ${emailInput.value}`);
                newsletterForm.reset();
            }
        });
    }

    // Set dynamic current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    // =========================================================================
    // 12. Toast Notification Helper
    // =========================================================================
    function showToast(message) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✦</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
});
