/**
 * Coşkun Yaycı - Analytics Module
 * Google Analytics 4, Meta Pixel, özel event tracking
 */

const Analytics = (function() {
  'use strict';

  const CONFIG = {
    // GERÇEK ID'LERİ EKLEYİN - Placeholder olarak kalmışsa analytics çalışmaz
    ga4Id: 'G-XXXXXXXXXX', // Örnek: G-ABC123DEF45
    gtmId: 'GTM-XXXXXX',   // Örnek: GTM-K5X9L7M
    metaPixelId: 'XXXXXXXXXX' // Örnek: 123456789012345
  };

  let isInitialized = false;
  let eventQueue = [];

  function init() {
    if (isInitialized) return;
    
    loadGA4();
    loadGTM();
    loadMetaPixel();
    setupAutoTracking();
    
    isInitialized = true;
    
    // Process queued events
    eventQueue.forEach(event => track(event.name, event.params));
    eventQueue = [];
  }

  // Load Google Analytics 4
  function loadGA4() {
    // Placeholder ise yükleme
    if (!CONFIG.ga4Id || CONFIG.ga4Id.includes('XXXX')) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4Id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.ga4Id, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
      custom_map: {
        'custom_parameter_1': 'category',
        'custom_parameter_2': 'product_name'
      }
    });
  }

  // Load Google Tag Manager
  function loadGTM() {
    // Placeholder ise yükleme
    if (!CONFIG.gtmId || CONFIG.gtmId.includes('XXXX')) return;
    
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${CONFIG.gtmId}');
    `;
    document.head.appendChild(script);

    // GTM noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${CONFIG.gtmId}"
              height="0" width="0" 
              style="display:none;visibility:hidden"></iframe>
    `;
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  // Load Meta Pixel
  function loadMetaPixel() {
    // Placeholder ise yükleme
    if (!CONFIG.metaPixelId || CONFIG.metaPixelId.includes('XXXX')) return;
    
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${CONFIG.metaPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }

  // Track custom event
  function track(eventName, params = {}) {
    if (!isInitialized) {
      eventQueue.push({ name: eventName, params });
      return;
    }

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, {
        ...params,
        event_timestamp: new Date().toISOString(),
        page_location: window.location.href,
        page_title: document.title
      });
    }

    // Meta Pixel
    if (window.fbq) {
      const pixelEvents = {
        'add_to_cart': 'AddToCart',
        'purchase': 'Purchase',
        'view_item': 'ViewContent',
        'search': 'Search',
        'add_to_favorites': 'AddToWishlist'
      };
      
      const pixelEvent = pixelEvents[eventName] || 'CustomEvent';
      window.fbq('track', pixelEvent, params);
    }

    // Console log in development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('📊 Analytics:', eventName, params);
    }
  }

  // E-commerce specific events
  function trackViewItem(product) {
    track('view_item', {
      currency: 'TRY',
      value: parsePrice(product.price),
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: 'Baklava',
        price: parsePrice(product.price)
      }]
    });
  }

  function trackBeginCheckout(cart) {
    const total = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    track('begin_checkout', {
      currency: 'TRY',
      value: total,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.priceValue,
        quantity: item.quantity
      }))
    });
  }

  // Setup automatic tracking
  function setupAutoTracking() {
    // Track page views on route change (for SPA behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        track('page_view', { page_path: location.pathname });
      }
    }).observe(document, { subtree: true, childList: true });

    // Track engagement time
    let engagementStart = Date.now();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const duration = Math.round((Date.now() - engagementStart) / 1000);
        if (duration > 10) {
          track('user_engagement', { engagement_time_msec: duration * 1000 });
        }
      } else {
        engagementStart = Date.now();
      }
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        track('scroll_depth', { percent_scrolled: scrollPercent });
      }
    }, { passive: true });
  }

  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  }

  // Public API
  return {
    init,
    track,
    trackViewItem,
    trackBeginCheckout,
    CONFIG
  };
})();

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Analytics.init);
} else {
  Analytics.init();
}

window.Analytics = Analytics;
