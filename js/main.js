// Jayanthi Catering Service & Restaurant (ஜெயந்தி ஹோட்டல்)
// Main Application Script
// Proprietor: JANARDHANAN REDDY K | WhatsApp: 9380414248 | Phone: 98844 14248

function initApp() {
  initMobileDrawer();
  initMenuRenderer();
  initCateringQuoteModal();
  initAddressCopy();
  initGalleryLightbox();
  initScrollAnimations();
}

// Ensure execution even if DOMContentLoaded already fired (common on mobile or module scripts)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// 1. Mobile Drawer Navigation
function initMobileDrawer() {
  const openBtn = document.getElementById('btn-open-drawer');
  const closeBtn = document.getElementById('btn-close-drawer');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = drawer ? drawer.querySelectorAll('.drawer-nav-link') : [];

  if (!drawer || !openBtn) return;

  function openDrawer(e) {
    if (e) e.preventDefault();
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(e) {
    if (e) e.preventDefault();
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Remove existing listeners if any, then attach
  openBtn.onclick = openDrawer;
  if (closeBtn) closeBtn.onclick = closeDrawer;

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 2. Menu Renderer & Category Filters
let currentCategory = 'all';
let currentDietFilter = 'all'; // 'all', 'veg', 'nonveg'

function initMenuRenderer() {
  const menuContainer = document.getElementById('menu-items-grid');
  const categoryTabs = document.querySelectorAll('.menu-category-tab');
  const dietPills = document.querySelectorAll('.diet-filter-pill');

  if (!menuContainer) return;

  // Category Tab clicks
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active-tab', 'bg-maroon', 'text-white'));
      categoryTabs.forEach(t => t.classList.add('bg-white', 'text-coffee', 'border-warm'));

      tab.classList.add('active-tab', 'bg-maroon', 'text-white');
      tab.classList.remove('bg-white', 'text-coffee');

      currentCategory = tab.dataset.category;
      renderMenuItems();
    });
  });

  // Diet Pills (All, Pure Veg, Non-Veg)
  dietPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dietPills.forEach(p => p.classList.remove('bg-maroon', 'text-white', 'border-maroon'));
      dietPills.forEach(p => p.classList.add('bg-white', 'text-coffee'));

      pill.classList.add('bg-maroon', 'text-white', 'border-maroon');
      pill.classList.remove('bg-white', 'text-coffee');

      currentDietFilter = pill.dataset.diet;
      renderMenuItems();
    });
  });

  renderMenuItems();
}

function renderMenuItems() {
  const container = document.getElementById('menu-items-grid');
  if (!container) return;
  if (!window.RESTAURANT_MENU || !Array.isArray(window.RESTAURANT_MENU)) {
    setTimeout(renderMenuItems, 50);
    return;
  }

  const filtered = window.RESTAURANT_MENU.filter(item => {
    const matchCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchDiet = currentDietFilter === 'all' ||
      (currentDietFilter === 'veg' && item.isVeg) ||
      (currentDietFilter === 'nonveg' && !item.isVeg);
    return matchCategory && matchDiet;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-warm p-6">
        <p class="text-lg text-taupe font-serif">No items found matching your current filter.</p>
        <button onclick="resetMenuFilters()" class="mt-4 px-5 py-2.5 bg-maroon text-white rounded-full text-sm font-semibold hover:bg-maroon-dark transition">
          Show All Dishes
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="menu-item-card bg-ivory rounded-2xl p-4 sm:p-5 border border-[rgba(122,31,26,0.12)] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between" data-category="${item.category}">
      <div>
        <!-- Badges & Timing Row -->
        <div class="flex items-center justify-between gap-2 mb-2.5">
          <div class="flex items-center gap-2">
            <span class="${item.isVeg ? 'indicator-veg' : 'indicator-nonveg'} shadow-sm flex-shrink-0" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
            ${item.badge ? `<span class="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs ${item.isVeg ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-maroon border border-red-200'}">${item.badge}</span>` : ''}
          </div>
          ${item.timing ? `<span class="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-100/80 text-coffee border border-amber-200/60">${item.timing}</span>` : ''}
        </div>

        <!-- Dish Title & Price Row -->
        <div class="flex items-start justify-between gap-3 mb-1.5">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-coffee font-serif leading-snug">${item.name}</h3>
            <p class="text-xs sm:text-sm text-saffron font-bold">${item.tamilName}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-xl sm:text-2xl font-bold text-maroon font-serif leading-none">₹${item.price}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs sm:text-sm text-taupe leading-relaxed mt-1.5 mb-3">${item.description}</p>
      </div>

      <!-- Action Row -->
      <div class="pt-3 border-t border-[rgba(122,31,26,0.08)] flex items-center justify-between">
        <span class="text-[11px] text-taupe font-semibold flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-saffron fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          ${item.rating}
        </span>
        <button onclick="orderDishOnWhatsApp('${item.name.replace(/'/g, "\\'")}', '${item.tamilName.replace(/'/g, "\\'")}', ${item.price})"
          class="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-leaf-green text-white rounded-full text-xs font-bold hover:bg-emerald-800 transition active:scale-95 shadow-sm"
          title="Order on WhatsApp">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.705 1.554zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          <span>Order</span>
        </button>
      </div>
    </article>
  `).join('');
}

window.resetMenuFilters = function() {
  currentCategory = 'all';
  currentDietFilter = 'all';

  document.querySelectorAll('.menu-category-tab').forEach(t => {
    t.classList.remove('active-tab', 'bg-maroon', 'text-white');
    if (t.dataset.category === 'all') {
      t.classList.add('active-tab', 'bg-maroon', 'text-white');
    } else {
      t.classList.add('bg-white', 'text-coffee');
    }
  });

  document.querySelectorAll('.diet-filter-pill').forEach(p => {
    p.classList.remove('bg-maroon', 'text-white', 'border-maroon');
    if (p.dataset.diet === 'all') {
      p.classList.add('bg-maroon', 'text-white', 'border-maroon');
    } else {
      p.classList.add('bg-white', 'text-coffee');
    }
  });

  renderMenuItems();
};

// 3. WhatsApp Direct Dish Ordering (Always routes to 9380414248)
window.orderDishOnWhatsApp = function(dishName, tamilName, price) {
  const phone = '919380414248'; // Directly to 9380414248 as requested
  const text = encodeURIComponent(
    `Vanakkam Jayanthi Hotel (Jana K Reddy)!\n\nI would like to order:\n🍛 *${dishName}* (${tamilName}) - ₹${price}\n\n📍 Delivery/Takeaway: 42, Pioneer Mill Road, Peelamedu, Coimbatore.\nPlease confirm availability and timing.`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
};

// 4. Catering Quote Modal & Form Submission to WhatsApp (Directly to 9380414248)
function initCateringQuoteModal() {
  const modal = document.getElementById('catering-quote-modal');
  const openButtons = document.querySelectorAll('.btn-open-catering-modal');
  const closeButton = document.getElementById('btn-close-catering-modal');
  const quoteForm = document.getElementById('catering-quote-form');

  if (!modal) return;

  function openModal(defaultPackage = '') {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (defaultPackage && quoteForm) {
      const pkgSelect = quoteForm.querySelector('#quote-event-type');
      if (pkgSelect) {
        pkgSelect.value = defaultPackage;
      }
    }
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = btn.dataset.package || '';
      openModal(pkg);
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle form submit
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quote-name').value.trim();
      const phoneNum = document.getElementById('quote-phone').value.trim();
      const date = document.getElementById('quote-date').value;
      const guests = document.getElementById('quote-guests').value;
      const eventType = document.getElementById('quote-event-type').value;
      const notes = document.getElementById('quote-notes').value.trim();

      const phone = '919380414248'; // Directly to 9380414248
      const msg = encodeURIComponent(
        `Vanakkam Janardhanan Reddy Sir (Jayanthi Catering)!\n\nI would like an instant catering quote for our bulk order / function:\n\n` +
        `👤 *Contact Person:* ${name}\n` +
        `📞 *Phone:* ${phoneNum}\n` +
        `📅 *Event Date:* ${date}\n` +
        `👥 *Number of Guests / Leaf Count:* ${guests}\n` +
        `🎉 *Occasion:* ${eventType}\n` +
        (notes ? `📝 *Special Menu Requests:* ${notes}\n\n` : '\n') +
        `Please share the best bulk menu options and pricing.`
      );

      closeModal();
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    });
  }
}

// 5. Copy Address Button with Toast
function initAddressCopy() {
  const copyBtn = document.getElementById('btn-copy-address');
  const toast = document.getElementById('copy-toast');
  const fullAddress = window.RESTAURANT_INFO.address || "42, Pioneer Mill Road, Peelamedu, Coimbatore, Tamil Nadu - 641004";

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullAddress);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = fullAddress;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      showToast("Address copied to clipboard!");
    } catch (err) {
      showToast("Address: 42, Pioneer Mill Road, Peelamedu");
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;

  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// 6. Gallery Lightbox Modal
function initGalleryLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('btn-close-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-thumb-item');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || img.alt || '';

      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption;
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// 7. Scroll Animations & Reveal
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-6');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.02,
    rootMargin: '0px 0px 100px 0px'
  });

  revealElements.forEach(el => {
    // If element is already in viewport or is the menu items container, do not hide it
    if (el.id === 'menu-items-grid') {
      el.classList.add('opacity-100');
      return;
    }
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700', 'ease-out');
    observer.observe(el);
  });
}
