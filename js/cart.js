/**
 * Coşkun Yaycı - Shopping Cart Module
 * Sepet yönetimi: Ekleme, çıkarma, güncelleme, localStorage
 */

const Cart = (function() {
  'use strict';

  const STORAGE_KEY = 'coskun_cart';
  const EVENT_KEY = 'cartUpdated';
  
  let cart = {
    items: [],
    createdAt: null,
    updatedAt: null
  };

  // Initialize cart from localStorage
  function init() {
    loadFromStorage();
    updateCartUI();
    setupEventListeners();
  }

  // Load cart from localStorage
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        cart = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Cart load error:', e);
      cart = { items: [], createdAt: Date.now(), updatedAt: Date.now() };
    }
  }

  // Save cart to localStorage
  function saveToStorage() {
    try {
      cart.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      dispatchUpdate();
    } catch (e) {
      console.error('Cart save error:', e);
    }
  }

  // Dispatch custom event for UI updates
  function dispatchUpdate() {
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: cart }));
  }

  // Add product to cart
  function add(product, quantity = 1) {
    const existingIndex = cart.items.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        priceValue: parsePrice(product.price),
        img: product.img,
        quantity: quantity,
        addedAt: Date.now()
      });
    }
    
    if (!cart.createdAt) cart.createdAt = Date.now();
    saveToStorage();
    showNotification(`${product.name} sepete eklendi! 🛒`);
    
    // Analytics
    if (window.Analytics) {
      Analytics.track('add_to_cart', {
        currency: 'TRY',
        value: parsePrice(product.price) * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: parsePrice(product.price),
          quantity: quantity
        }]
      });
    }
    
    return cart;
  }

  // Remove product from cart
  function remove(productId) {
    const item = cart.items.find(i => i.id === productId);
    cart.items = cart.items.filter(item => item.id !== productId);
    saveToStorage();
    
    if (item && window.Analytics) {
      Analytics.track('remove_from_cart', {
        currency: 'TRY',
        value: item.priceValue * item.quantity,
        items: [{
          item_id: item.id,
          item_name: item.name,
          price: item.priceValue,
          quantity: item.quantity
        }]
      });
    }
    
    return cart;
  }

  // Update quantity
  function updateQuantity(productId, quantity) {
    const item = cart.items.find(i => i.id === productId);
    if (!item) return cart;
    
    if (quantity <= 0) {
      return remove(productId);
    }
    
    item.quantity = quantity;
    saveToStorage();
    return cart;
  }

  // Clear entire cart
  function clear() {
    cart.items = [];
    saveToStorage();
    return cart;
  }

  // Get cart total
  function getTotal() {
    return cart.items.reduce((total, item) => {
      return total + (item.priceValue * item.quantity);
    }, 0);
  }

  // Get total item count
  function getCount() {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Parse price string to number
  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  }

  // Format price for display
  function formatPrice(price) {
    return price.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    });
  }

  // Show notification toast
  function showNotification(message) {
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'cart-notification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Kapat">✕</button>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto hide
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });
  }

  // Update cart UI elements
  function updateCartUI() {
    const count = getCount();
    
    // Update cart badge if exists
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
    
    // Update cart total displays
    const totalElements = document.querySelectorAll('.cart-total');
    totalElements.forEach(el => {
      el.textContent = formatPrice(getTotal());
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    window.addEventListener(EVENT_KEY, updateCartUI);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        loadFromStorage();
        updateCartUI();
      }
    });
  }

  // Generate WhatsApp order message
  function generateOrderMessage() {
    if (cart.items.length === 0) return null;
    
    let message = `*Coşkun Yaycı Siparişi* 🧁\n\n`;
    message += `*Ürünler:*\n`;
    
    cart.items.forEach(item => {
      message += `• ${item.name} x${item.quantity} - ${item.price}\n`;
    });
    
    message += `\n*Toplam:* ${formatPrice(getTotal())}\n`;
    message += `\nLütfen teslimat bilgilerimi alın.`;
    
    return encodeURIComponent(message);
  }

  // Public API
  return {
    init,
    add,
    remove,
    updateQuantity,
    clear,
    getItems: () => [...cart.items],
    getTotal,
    getCount,
    formatPrice,
    generateOrderMessage,
    parsePrice
  };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Cart.init);
} else {
  Cart.init();
}

// Expose to global scope
window.Cart = Cart;
