async function loadConcerts(limit=4){
  const box = document.querySelector('#upcoming');
  if(!box) return;
  try{
    const res = await fetch('/data/concerts.json');
    const all = await res.json();
    const now = new Date();
    const upcoming = all.filter(e => new Date(e.dateTimeStart) >= now).sort((a,b)=> new Date(a.dateTimeStart)-new Date(b.dateTimeStart));
    const items = (limit? upcoming.slice(0,limit):upcoming);
    box.innerHTML = items.map(e=>`
      <article class="card">
         <div class="badge">${new Date(e.dateTimeStart).toLocaleDateString()}</div>
         <h3>${e.city}, ${e.country}</h3>
         <p>${e.venue||''}</p>
         <p>${e.program||''}</p>
         <p>
           ${e.ticketUrl? `<a href="${e.ticketUrl}" target="_blank" rel="noopener">Tickets</a>`:''}
           ${e.moreInfoUrl? ` · <a href="${e.moreInfoUrl}" target="_blank" rel="noopener">Details</a>`:''}
         </p>
      </article>`).join('');
  }catch(e){
    console.warn('concerts load failed', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  I18N.init();
  initParallax();
  Consent.init();
  loadConcerts(4);
});
