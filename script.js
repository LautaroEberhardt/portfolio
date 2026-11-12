'use strict';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const stage = document.querySelector('.hero-stage');
const heroBottom = document.querySelector('.hero-bottom');
const menuToggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('#nav-menu');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function setMenu(open) {
  menu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (!event.target.closest('.navbar')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 1041px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

// One update per frame: the mouse stays pinned, text crosses it, hand enters.
let scrollFrame = 0;
function renderHero() {
  scrollFrame = 0;
  if (motionPreference.matches) return;
  const rect = hero.getBoundingClientRect();
  const distance = hero.offsetHeight - stage.offsetHeight;
  const progress = distance > 0 ? clamp(-rect.top / distance) : 0;
  const handProgress = clamp((progress - .18) / .65);
  const easedHand = handProgress * handProgress * (3 - 2 * handProgress);
  hero.style.setProperty('--progress', progress.toFixed(4));
  hero.style.setProperty('--title-shift', `${-progress * stage.offsetHeight * .8}px`);
  hero.style.setProperty('--hand-shift', `${(1 - easedHand) * 100}%`);
  hero.style.setProperty('--hand-opacity', String(clamp(handProgress * 5)));
  hero.style.setProperty('--copy-opacity', String(1 - clamp((progress - .15) / .25)));
  const hidden = progress > .4;
  heroBottom.inert = hidden;
  heroBottom.setAttribute('aria-hidden', String(hidden));
}
function requestHeroFrame() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(renderHero);
}
window.addEventListener('scroll', requestHeroFrame, { passive: true });
window.addEventListener('resize', requestHeroFrame);
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) {
    document.documentElement.classList.remove('js-motion');
    heroBottom.inert = false;
    heroBottom.removeAttribute('aria-hidden');
  }
  requestHeroFrame();
});
requestHeroFrame();

if ('IntersectionObserver' in window && !motionPreference.matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

const galleries = {
  rewards: [['project-images/ayv-clientes-privado.png', 'AyV Uniformes — Panel de clientes (datos personales desenfocados)']],
  clinic: [
    ['project-images/sistema-clinica-1.png', 'Centro Wagner — Agenda y turnos', { top: 163, bottom: 1 }],
    ['project-images/sistema-clinica-2.png', 'Centro Wagner — Administración', { top: 158, bottom: 0 }],
    ['project-images/sistema-clinica-3.png', 'Centro Wagner — Tratamientos', { top: 158, bottom: 46 }],
    ['project-images/sistema-clinica-4.png', 'Centro Wagner — Pacientes', { top: 158, bottom: 0 }]
  ],
  bakery: [['image.png', 'Sistema de gestión de panadería']]
};
const gallery = document.querySelector('#gallery');
const galleryImage = document.querySelector('#gallery-image');
const galleryTitle = document.querySelector('#gallery-title');
const galleryError = document.querySelector('#gallery-error');
const previous = document.querySelector('#gallery-prev');
const next = document.querySelector('#gallery-next');
let images = [];
let imageIndex = 0;
let galleryOpener;

function renderImage() {
  const [source, title, crop] = images[imageIndex];
  const imageWrap = galleryImage.parentElement;
  imageWrap.classList.toggle('clinic-crop', Boolean(crop));
  if (crop) {
    const visibleHeight = 941 - crop.top - crop.bottom;
    imageWrap.style.setProperty('--crop-ratio', `1672 / ${visibleHeight}`);
    imageWrap.style.setProperty('--crop-offset', `${-crop.top / visibleHeight * 100}%`);
    imageWrap.style.setProperty('--crop-max-width', `${68 * 1672 / visibleHeight}svh`);
  }
  galleryError.hidden = true;
  galleryImage.hidden = false;
  galleryImage.src = source;
  galleryImage.alt = title;
  galleryTitle.textContent = title;
  document.querySelector('#gallery-counter').textContent = `${imageIndex + 1} / ${images.length}`;
  previous.hidden = next.hidden = images.length < 2;
}
galleryImage.addEventListener('error', () => {
  galleryError.hidden = false;
  galleryImage.hidden = true;
});
document.querySelectorAll('.gallery-trigger').forEach(button => {
  button.addEventListener('click', () => {
    images = galleries[button.dataset.gallery];
    imageIndex = 0;
    galleryOpener = button;
    renderImage();
    gallery.showModal();
    document.body.classList.add('modal-open');
  });
});
function changeImage(direction) {
  imageIndex = (imageIndex + direction + images.length) % images.length;
  renderImage();
}
previous.addEventListener('click', () => changeImage(-1));
next.addEventListener('click', () => changeImage(1));
document.querySelector('#gallery-close').addEventListener('click', () => gallery.close());
gallery.addEventListener('click', event => {
  const rect = gallery.getBoundingClientRect();
  if (event.target === gallery && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) gallery.close();
});
gallery.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  galleryOpener?.focus();
});
gallery.addEventListener('keydown', event => {
  if (images.length < 2) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changeImage(event.key === 'ArrowLeft' ? -1 : 1);
  }
});

const email = 'lautaroeberhardt8@gmail.com';
const copyButton = document.querySelector('#copy-email');
const copyFeedback = document.querySelector('#copy-feedback');
let copyTimer;
copyButton.addEventListener('click', async () => {
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = '¡Email copiado! Nos leemos pronto.';
  } catch {
    copyFeedback.textContent = `Podés copiarlo manualmente: ${email}`;
  }
  copyTimer = setTimeout(() => { copyFeedback.textContent = ''; }, 7000);
});
document.querySelector('#year').textContent = new Date().getFullYear();

// One accessible list plus a decorative copy for a seamless loop.
const toolsCarousel = document.querySelector('.tools-carousel');
const toolsTrack = toolsCarousel.querySelector('.tools-track');
const toolsGroup = toolsCarousel.querySelector('.tools-group');
const toolsToggle = toolsCarousel.querySelector('.tools-toggle');
const toolsCopy = toolsGroup.cloneNode(true);
toolsCopy.setAttribute('aria-hidden', 'true');
toolsCopy.inert = true;
toolsTrack.append(toolsCopy);
toolsCarousel.classList.add('is-animated');
function syncToolsMotion() {
  toolsToggle.hidden = motionPreference.matches;
}
syncToolsMotion();
motionPreference.addEventListener('change', syncToolsMotion);
toolsToggle.addEventListener('click', () => {
  const paused = toolsCarousel.classList.toggle('is-paused');
  toolsToggle.querySelector('.tools-toggle-label').textContent = paused ? 'Reanudar' : 'Pausar';
  toolsToggle.querySelector('[aria-hidden]').textContent = paused ? '▷' : 'Ⅱ';
});

// Update only on actual mouse movement, at most once per animation frame.
const cursorAura = document.querySelector('.cursor-aura');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let auraFrame = 0;
let auraX = 0;
let auraY = 0;
function hideCursorAura() {
  cancelAnimationFrame(auraFrame);
  auraFrame = 0;
  cursorAura.classList.remove('is-visible');
}
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !finePointer.matches || motionPreference.matches) {
    hideCursorAura();
    return;
  }
  auraX = event.clientX;
  auraY = event.clientY;
  if (auraFrame) return;
  auraFrame = requestAnimationFrame(() => {
    cursorAura.style.setProperty('--pointer-x', `${auraX}px`);
    cursorAura.style.setProperty('--pointer-y', `${auraY}px`);
    cursorAura.classList.add('is-visible');
    auraFrame = 0;
  });
}, { passive: true });
document.documentElement.addEventListener('pointerleave', hideCursorAura);
window.addEventListener('blur', hideCursorAura);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hideCursorAura();
});
finePointer.addEventListener('change', hideCursorAura);
motionPreference.addEventListener('change', hideCursorAura);
