// Product data is loaded from js/products.js which defines `window.products`.
// Use the global `products` variable below.
if (typeof products === 'undefined') window.products = [];

const grid = document.getElementById('productGrid');
const modal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');

function createCard(p){
  const el = document.createElement('article');
  el.className = 'card';
  el.tabIndex = 0;
  el.innerHTML = `
    <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <h3 class="title">${p.name}</h3>
      <div class="price">${p.price}</div>
      <div class="badges">${p.badges.map((b,i)=>`<span class="badge" style="animation-delay:${i*60}ms">${b}</span>`).join('')}</div>
    </div>
  `;
  el.addEventListener('click', ()=>openModal(p));
  el.addEventListener('keypress', (e)=>{ if(e.key==='Enter') openModal(p); });
  return el;
}

function render(){
  grid.innerHTML = '';
  products.forEach((p,i)=>{
    const card = createCard(p);
    // stagger entrance animations
    card.style.animationDelay = `${i * 60}ms`;
    grid.appendChild(card);
    // ensure animation triggers
    requestAnimationFrame(()=> card.style.opacity = '1');
  });
}

function openModal(p){
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalPrice').textContent = p.price;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalMeta').textContent = p.meta;
  document.getElementById('modalBadges').innerHTML = p.badges.map((b,i)=>`<span class="badge" style="animation-delay:${i*40}ms">${b}</span>`).join('');
  modal.setAttribute('aria-hidden','false');
  modal.classList.add('open');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modal.classList.remove('open');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });

render();
