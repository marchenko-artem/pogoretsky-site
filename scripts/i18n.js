const I18N = {
  supported: ['de','en','pl','ru','uk'],
  current: 'de',
  dict: {},
  async load(lang){
    if(!I18N.supported.includes(lang)) lang = 'en';
    const res = await fetch(`/i18n/${lang}.json`).catch(()=>null);
    if(!res || !res.ok){ console.warn('i18n load failed', lang); return; }
    I18N.dict = await res.json();
    I18N.current = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(I18N.dict[key]) el.textContent = I18N.dict[key];
    });
  },
  init(){
    const saved = localStorage.getItem('lang');
    const initial = saved || (navigator.language||'en').slice(0,2);
    I18N.load(initial);
    const select = document.querySelector('#lang');
    if(select){
      select.value = I18N.current;
      select.addEventListener('change', e=>{
        const v = e.target.value;
        localStorage.setItem('lang', v);
        I18N.load(v);
      });
    }
  }
};
