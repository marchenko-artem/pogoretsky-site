
/*! Consent Manager v1.1 (GA4/Matomo after consent only) */
(function(){
  const KEY = 'consent.choice.v1';
  const banner = document.querySelector('.cookie-banner');
  const reopenBtn = document.querySelector('[data-action="cookies-open"]');

  // ---- CONFIG: choose analytics provider and set IDs ----
  const ANALYTICS_PROVIDER = 'none'; // 'ga4' or 'matomo' or 'none'
  const GA_MEASUREMENT_ID = 'G-XXXXXXX';
  const MATOMO_URL = 'https://matomo.example.com/'; // trailing slash
  const MATOMO_SITE_ID = '1';

  function loadGA4(){
    if(!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID==='G-XXXXXXX') return;
    if(document.getElementById('ga4-tag')) return;
    const gtagScript = document.createElement('script');
    gtagScript.setAttribute('id','ga4-tag');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gtagScript);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function loadMatomo(){
    if(!MATOMO_URL || MATOMO_URL.includes('example.com')) return;
    if(document.getElementById('matomo-tag')) return;
    const _paq = window._paq = window._paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['setDoNotTrack', true]);
    (function() {
      const u=MATOMO_URL;
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', MATOMO_SITE_ID]);
      const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.id='matomo-tag'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
  }

  function apply(choice){
    if(choice === 'accept'){
      if(ANALYTICS_PROVIDER === 'ga4'){ loadGA4(); }
      if(ANALYTICS_PROVIDER === 'matomo'){ loadMatomo(); }
    }
  }

  function openBanner(){ if(banner) banner.style.display = 'block'; }
  function closeBanner(){ if(banner) banner.style.display = 'none'; }

  const saved = localStorage.getItem(KEY);
  if(!saved){ openBanner(); } else { apply(saved); }

  if(banner){
    const btnAccept = banner.querySelector('.accept');
    const btnDecline = banner.querySelector('.decline');
    if(btnAccept) btnAccept.addEventListener('click', ()=>{
      localStorage.setItem(KEY, 'accept'); closeBanner(); apply('accept');
    });
    if(btnDecline) btnDecline.addEventListener('click', ()=>{
      localStorage.setItem(KEY, 'decline'); closeBanner(); apply('decline');
    });
  }

  if(reopenBtn){
    reopenBtn.addEventListener('click', (e)=>{ e.preventDefault(); openBanner(); });
  }

  window.consentManager = {
    open: openBanner,
    reset: ()=>{ localStorage.removeItem(KEY); openBanner(); }
  };
})();
