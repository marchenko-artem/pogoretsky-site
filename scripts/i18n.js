const I18N={supported:['de','en','pl','ru','uk'],current:'en',dict:{},
async load(lang){
  if(!this.supported.includes(lang)) lang='en';
  try{
    const res=await fetch(`i18n/${lang}.json`);
    if(!res.ok) throw new Error('i18n fetch failed');
    this.dict=await res.json(); this.current=lang;
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(this.dict[k]) el.textContent=this.dict[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{
      const k=el.getAttribute('data-i18n-html'); if(this.dict[k]) el.innerHTML=this.dict[k];
    });
  }catch(e){ console.warn(e); }
},
init(){
  const saved=localStorage.getItem('lang');
  const initial=(saved||(navigator.language||'en').slice(0,2));
  this.load(initial);
  const select=document.querySelector('#lang');
  if(select){
    select.value=this.current;
    select.addEventListener('change',e=>{
      const v=e.target.value; localStorage.setItem('lang',v); I18N.load(v);
    });
  }
}};
document.addEventListener('DOMContentLoaded',()=>I18N.init());
