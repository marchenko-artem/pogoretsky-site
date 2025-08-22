const Consent = {
  key: 'consent-v1',
  get(){ try{ return JSON.parse(localStorage.getItem(this.key)||'{}'); }catch(e){ return {}; } },
  set(v){ localStorage.setItem(this.key, JSON.stringify(v)); },
  showBanner(){
    const data = this.get();
    if(data.choice) return;
    const banner = document.querySelector('.cookie-banner');
    if(banner) banner.style.display = 'block';
    banner.querySelector('.accept').addEventListener('click', ()=>{
      this.set({choice:'accept', ts:Date.now()});
      this.apply();
      banner.remove();
    });
    banner.querySelector('.decline').addEventListener('click', ()=>{
      this.set({choice:'decline', ts:Date.now()});
      banner.remove();
    });
  },
  apply(){
    // Example: load GA only after consent
    const data = this.get();
    if(data.choice === 'accept'){
      // placeholder for analytics
      // const s = document.createElement('script'); s.src='https://www.googletagmanager.com/gtag/js?id=G-XXXX'; s.async=true; document.head.appendChild(s);
    }
  },
  init(){ this.apply(); this.showBanner(); }
};
