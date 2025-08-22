function initParallax(){
  const bg = document.querySelector('.hero__bg');
  if(!bg) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;
  let lastY = 0;
  function onScroll(){
    const y = window.scrollY || window.pageYOffset;
    if(Math.abs(y - lastY) < 2) return;
    lastY = y;
    const offset = Math.max(-30, Math.min(30, (y * 0.1)));
    bg.style.transform = `translate3d(0, ${offset}px, 0)`;
  }
  window.addEventListener('scroll', onScroll, {passive:true});
}
