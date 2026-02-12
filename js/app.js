// Product data is loaded from js/products.js which defines `window.products`.
if (typeof products === 'undefined') window.products = [];

const grid = document.getElementById('productGrid');
const modal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');

// Modal overlay elementi oluştur
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
modal.insertBefore(modalOverlay, modal.firstChild);

function createCard(p){
  const el = document.createElement('article');
  el.className = 'card';
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${p.name} - ${p.price}`);
  
  // Hata yakalama için görsel yükleme
  const imgError = `this.onerror=null;this.src='img/pattern.png';`;
  
  el.innerHTML = `
    <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="${imgError}">
    <div class="card-body">
      <h3 class="title">${p.name}</h3>
      <div class="price">${p.price}</div>
      <div class="badges">${p.badges.map((b,i)=>`<span class="badge" style="animation-delay:${i*60}ms">${b}</span>`).join('')}</div>
    </div>
  `;
  
  el.addEventListener('click', ()=>openModal(p));
  el.addEventListener('keypress', (e)=>{ 
    if(e.key==='Enter' || e.key===' ') {
      e.preventDefault();
      openModal(p); 
    }
  });
  
  return el;
}

function render(){
  grid.innerHTML = '';
  
  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">Ürünler yükleniyor...</div>';
    return;
  }
  
  products.forEach((p,i)=>{
    const card = createCard(p);
    card.style.animationDelay = `${i * 40}ms`;
    grid.appendChild(card);
    requestAnimationFrame(()=> card.style.opacity = '1');
  });
}

function openModal(p){
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalMeta = document.getElementById('modalMeta');
  const modalBadges = document.getElementById('modalBadges');
  const primaryBtn = document.querySelector('.modal-actions .primary');
  
  // Görsel hata kontrolü
  modalImg.onerror = function() {
    this.src = 'img/pattern.png';
  };
  
  modalImg.src = p.img;
  modalImg.alt = p.name;
  modalTitle.textContent = p.name;
  modalPrice.textContent = p.price;
  modalDesc.textContent = p.desc;
  modalMeta.textContent = p.meta || '';
  modalBadges.innerHTML = p.badges.map((b,i)=>`<span class="badge" style="animation-delay:${i*40}ms">${b}</span>`).join('');
  
  // Sipariş butonu - WhatsApp linki
  primaryBtn.textContent = '📞 Sipariş Ver';
  primaryBtn.onclick = () => {
    const message = `Merhaba, ${p.name} siparişi vermek istiyorum. Fiyat: ${p.price}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  modal.setAttribute('aria-hidden','false');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Kapatma olayları
modalClose.addEventListener('click', closeModal);

// İkinci kapatma butonu (modal içindeki)
const modalCloseBtn = document.getElementById('modalCloseBtn');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

// Overlay'e tıklayarak kapatma
modalOverlay.addEventListener('click', closeModal);

// Modal dışına tıklayarak kapatma
modal.addEventListener('click', (e)=>{ 
  if(e.target === modal) closeModal(); 
});

// Escape tuşu ile kapatma
document.addEventListener('keydown',(e)=>{ 
  if(e.key==='Escape' && modal.getAttribute('aria-hidden') === 'false') {
    closeModal(); 
  }
});

// Başlangıç
render();

// Ürünler yüklenirken yeniden render et
window.addEventListener('load', () => {
  if (products.length > 0) {
    render();
  }
});
