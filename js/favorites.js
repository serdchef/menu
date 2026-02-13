/**
 * Coşkun Yaycı - Favorites Module
 * Favori ürünleri yönetme, LocalStorage, liste görünümü
 */

const Favorites = (function() {
  'use strict';

  const STORAGE_KEY = 'coskun_favorites';
  let favorites = [];

  function init() {
    loadFromStorage();
    updateAllFavoriteButtons();
  }

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        favorites = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Favorites load error:', e);
      favorites = [];
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));
    } catch (e) {
      console.error('Favorites save error:', e);
    }
  }

  function add(product) {
    if (!isFavorite(product.id)) {
      favorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        addedAt: Date.now()
      });
      saveToStorage();
      updateAllFavoriteButtons();
      showNotification(`${product.name} favorilere eklendi! ❤️`);
      
      if (window.Analytics) {
        Analytics.track('add_to_favorites', { item_name: product.name });
      }
    }
    return favorites;
  }

  function remove(productId) {
    const product = favorites.find(f => f.id === productId);
    favorites = favorites.filter(f => f.id !== productId);
    saveToStorage();
    updateAllFavoriteButtons();
    
    if (product) {
      showNotification(`${product.name} favorilerden çıkarıldı`);
    }
    
    return favorites;
  }

  function toggle(product) {
    if (isFavorite(product.id)) {
      return remove(product.id);
    } else {
      return add(product);
    }
  }

  function isFavorite(productId) {
    return favorites.some(f => f.id === productId);
  }

  function getAll() {
    return [...favorites];
  }

  function clear() {
    favorites = [];
    saveToStorage();
    updateAllFavoriteButtons();
    showNotification('Tüm favoriler temizlendi');
    return favorites;
  }

  function updateAllFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      const productId = parseInt(btn.dataset.id);
      const isFav = isFavorite(productId);
      btn.innerHTML = isFav ? '❤️' : '🤍';
      btn.classList.toggle('active', isFav);
      btn.setAttribute('aria-pressed', isFav);
    });
  }

  function showNotification(message) {
    const existing = document.querySelector('.fav-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'fav-notification cart-notification';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Kapat">✕</button>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });
  }

  // Create favorites view modal
  function showFavoritesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal favorites-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'favModalTitle');

    const items = favorites.map(f => `
      <div class="fav-item" data-id="${f.id}">
        <img src="${f.img}" alt="" loading="lazy" onerror="this.src='img/pattern.png'">
        <div class="fav-item-info">
          <h4>${f.name}</h4>
          <span class="price">${f.price}</span>
        </div>
        <div class="fav-item-actions">
          <button class="add-from-fav" data-id="${f.id}" aria-label="Sepete ekle">🛒</button>
          <button class="remove-fav" data-id="${f.id}" aria-label="Kaldır">🗑️</button>
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-sheet">
        <button class="modal-close" aria-label="Kapat">✕</button>
        <div class="modal-content">
          <h2 id="favModalTitle">❤️ Favorilerim (${favorites.length})</h2>
          <div class="favorites-list">
            ${favorites.length ? items : '<p class="empty-favorites">Henüz favori ürününüz yok.</p>'}
          </div>
          ${favorites.length ? `
            <div class="fav-actions">
              <button class="secondary clear-all-favs">Tümünü Temizle</button>
              <button class="primary add-all-favs">Hepsini Sepete Ekle</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Show animation
    requestAnimationFrame(() => {
      modal.setAttribute('aria-hidden', 'false');
    });

    // Close handlers
    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Add from favorites
    modal.querySelectorAll('.add-from-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const product = window.products?.find(p => p.id === id);
        if (product) window.Cart?.add(product);
      });
    });

    // Remove from favorites
    modal.querySelectorAll('.remove-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        remove(id);
        btn.closest('.fav-item').remove();
        if (favorites.length === 0) {
          modal.querySelector('.favorites-list').innerHTML = '<p class="empty-favorites">Henüz favori ürününüz yok.</p>';
          modal.querySelector('.fav-actions')?.remove();
        }
      });
    });

    // Clear all
    modal.querySelector('.clear-all-favs')?.addEventListener('click', () => {
      if (confirm('Tüm favorileriniz silinecek. Emin misiniz?')) {
        clear();
        closeModal();
      }
    });

    // Add all to cart
    modal.querySelector('.add-all-favs')?.addEventListener('click', () => {
      favorites.forEach(f => {
        const product = window.products?.find(p => p.id === f.id);
        if (product) window.Cart?.add(product);
      });
      showNotification('Tüm favoriler sepete eklendi! 🛒');
    });

    // Escape to close
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  // Public API
  return {
    init,
    add,
    remove,
    toggle,
    isFavorite,
    getAll,
    clear,
    showFavoritesModal,
    updateAllFavoriteButtons
  };
})();

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Favorites.init);
} else {
  Favorites.init();
}

window.Favorites = Favorites;
