
const Consent={key:'consent-v1',get(){try{return JSON.parse(localStorage.getItem(this.key)||'{}')}catch(e){return{}}},
set(v){localStorage.setItem(this.key,JSON.stringify(v))},
show(){const d=this.get(); if(d.choice) return; const b=document.querySelector('.cookie-banner'); if(!b) return; b.style.display='block';
  b.querySelector('.accept').onclick=()=>{this.set({choice:'accept',ts:Date.now()}); b.remove();};
  b.querySelector('.decline').onclick=()=>{this.set({choice:'decline',ts:Date.now()}); b.remove();};},
init(){this.show();}}; document.addEventListener('DOMContentLoaded',()=>Consent.init());
