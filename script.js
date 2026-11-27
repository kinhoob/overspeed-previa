/* ===== CONFIG — edite aqui os dados reais ===== */
const CONFIG = {
  address: "Rua Itacari 217, Recife - PE",
  whatsapp: "5581996579577"
};
/* ============================================== */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;
  $('#yr').textContent = new Date().getFullYear();

  if (CONFIG.address) {
    const q = encodeURIComponent(CONFIG.address);
    $('#addr').textContent = $('#addr2').textContent = CONFIG.address;
    $('#map').innerHTML = `<iframe loading="lazy" title="Mapa" src="https://www.google.com/maps?q=${q}&output=embed"></iframe>`;
    $('#route').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  }
  if (CONFIG.whatsapp) {
    const wa = `https://wa.me/${CONFIG.whatsapp}`;
    $('#wa-li').hidden = false; const a = $('#wa'); a.href = wa; a.textContent = '+' + CONFIG.whatsapp;
    $$('[data-contact]').forEach(el => { el.href = wa; el.target = '_blank'; el.rel = 'noopener'; });
  }

  // Imagens: mostram placeholder até o arquivo existir
  $$('img[data-src]').forEach(img => {
    const p = img.closest('.ph'); p && p.classList.add('nofile');
    img.onload = () => p && p.classList.remove('nofile');
    img.onerror = () => img.remove();
    img.loading = 'lazy'; img.src = img.dataset.src;
  });

  // Menu mobile
  const burger = $('.burger'), nav = $('#nav');
  const toggle = o => { burger.setAttribute('aria-expanded', o); nav.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.onclick = () => toggle(burger.getAttribute('aria-expanded') !== 'true');
  $$('a', nav).forEach(a => a.addEventListener('click', () => toggle(false)));

  // Lightbox
  const lb = $('.lb'), lbi = $('img', lb);
  $$('.g').forEach(g => g.onclick = () => { const i = $('img', g); if (!i) return; lbi.src = i.src; lb.hidden = false; });
  lb.onclick = () => lb.hidden = true;
  addEventListener('keydown', e => e.key === 'Escape' && (lb.hidden = true, toggle(false)));

  // Header sólido + barra de progresso
  const header = $('.header'), bar = $('.progress');
  const onScroll = () => {
    header.classList.toggle('solid', scrollY > 60);
    bar.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight || 1)})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!hasGsap || reduce) { $('.loader').style.display = 'none'; return; }
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t); } }));
  }

  // Abertura cinematográfica (~2s)
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.loader .logo-txt', { y: 20, opacity: 0, duration: .5 })
    .to('.loader', { yPercent: -100, duration: .7, ease: 'power4.inOut', delay: .5 })
    .to('.hero-bg', { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.inOut' }, '-=.4')
    .fromTo('.hero-bg img', { scale: 1.3 }, { scale: 1, duration: 1.8 }, '<')
    .to('.ln>span', { y: 0, duration: .9, stagger: .12 }, '-=.9')
    .to('.hero-a', { opacity: 1, y: 0, stagger: .1, duration: .7 }, '-=.5');

  gsap.to('.hero-bg img', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Reveals
  $$('[data-reveal]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  $$('.img-reveal').forEach(el => gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } }));
  ScrollTrigger.batch('.card', { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, stagger: .15, duration: .9, overwrite: true }) });
  ScrollTrigger.batch('.dif-grid>div', { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, stagger: .12, duration: .9, overwrite: true }) });

  // Parallax da galeria (desktop)
  ScrollTrigger.matchMedia({ '(min-width: 901px)': () => {
    $$('[data-speed]').forEach(img => gsap.fromTo(img, { scale: 1.15, y: 0 }, { y: -img.dataset.speed * 300, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } }));
  }});

  // Seção Performance: zoom, linhas, texto e roda ligados ao scroll
  gsap.timeline({ scrollTrigger: { trigger: '.perf', start: 'top top', end: 'bottom bottom', scrub: .6 }, defaults: { ease: 'none' } })
    .to('.perf-bg', { scale: 1.35, yPercent: -6 }, 0)
    .to('.perf-lines path', { strokeDashoffset: 0, stagger: .2, duration: .6 }, 0)
    .fromTo('.perf-txt h2', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: .25 }, 0)
    .to('.perf-txt .t2', { opacity: 1, duration: .15 }, .4)
    .to('.wheel', { rotation: 720, ease: 'power2.out', transformOrigin: '50% 50%', duration: 1 }, 0)
    .fromTo('.wheel', { x: 200, scale: .8 }, { x: 0, scale: 1, duration: .5 }, 0);

  gsap.fromTo('.cta-bg img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cta', scrub: true } });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
