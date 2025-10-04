/* 12  home.js*/
const videoSections = document.querySelectorAll('.video-section');
const fourth = document.getElementById('fourth-section');
const footer = document.getElementById('video-footer');

/* Состояния для 4-й секции */
let footerOpen = false;
let fourthArmed = false;               // можно ли показывать футер
let fourthReadyToShow = false;         // короткая "grace" после арминга
let fourthFirstDownConsumed = false;   // первый "вниз" после арминга игнорируем
let fourthArmTimer = 0;
let fourthReadyTimer = 0;

/* Функции арминга */
function armFourthAfterScrollEnd(){
  fourthArmed = true;
  clearTimeout(fourthReadyTimer);
  fourthReadyToShow = false;
  fourthReadyTimer = setTimeout(() => { fourthReadyToShow = true; }, 140);
}
function rearmFourth(){
  // Локальный пере-арм после скрытия футера на 4-й секции (без ухода со слайда)
  fourthArmed = true;
  fourthFirstDownConsumed = false;
  clearTimeout(fourthReadyTimer);
  fourthReadyToShow = false;
  fourthReadyTimer = setTimeout(() => { fourthReadyToShow = true; }, 140);
}
function resetFourthState(){
  fourthArmed = false;
  fourthReadyToShow = false;
  fourthFirstDownConsumed = false;
  clearTimeout(fourthArmTimer);
  clearTimeout(fourthReadyTimer);
}

/* Активатор секций + арминг 4-й + автопауза видео */
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const vid = entry.target.querySelector('video');
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (vid) {
        vid.muted = true;                  // для устойчивого автоплея
        vid.play?.().catch(() => {});      // play() возвращает Promise — безопасно игнорим отклонения
      }
      if (entry.target === fourth) {
        resetFourthState();
        // Арминг после завершения снапа/скролла + фолбэк-таймер
        document.addEventListener('scrollend', armFourthAfterScrollEnd, { once: true });
        fourthArmTimer = setTimeout(armFourthAfterScrollEnd, 420);
      }
    } else {
      entry.target.classList.remove('active');
      if (vid) { try { vid.pause?.(); } catch(e){} } // гарантированная пауза вне вьюпорта
      if (entry.target === fourth) {
        hideFooterImmediate();
        resetFourthState();
      }
    }
  });
}, observerOptions);
videoSections.forEach(section => observer.observe(section));


/* Компенсация header */
function setScrollPaddingForHeader(){
  const h = document.querySelector('header')?.offsetHeight || 0;
  document.documentElement.style.setProperty('--header-h', h + 'px');
}
window.addEventListener('load', setScrollPaddingForHeader);
window.addEventListener('resize', setScrollPaddingForHeader);

/* Reduced motion */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function applyReducedMotion(e){
  if (e.matches){
    document.querySelectorAll('.video-section video').forEach(v => {
      v.removeAttribute('autoplay');
      try { v.pause(); } catch(e){}
      v.setAttribute('controls','');
      v.preload = 'none';
    });
  }
}
applyReducedMotion(reduceMotion);
reduceMotion.addEventListener?.('change', applyReducedMotion);

/* Показ/скрытие футера */
function showFooter(){
  if (footerOpen) return;
  footer.style.display = 'block';
  requestAnimationFrame(() => {
    footer.classList.remove('hidden');
    footer.classList.add('shown');
    document.body.classList.add('footer-visible');
    footerOpen = true;
  });
}
function hideFooter(){ // используется, когда уходим с 4-й секции
  if (!footerOpen) return;
  document.body.classList.remove('footer-visible');
  footer.classList.remove('shown');
  footer.classList.add('hidden');
  footer.addEventListener('transitionend', () => {
    if (footer.classList.contains('hidden')) {
      footer.style.display = 'none';
      footerOpen = false;
      resetFourthState(); // полный сброс только при уходе со слайда
    }
  }, { once: true });
}
function hideFooterStay(){ // прячем футер, остаёмся на 4-й и сразу пере-армим
  if (!footerOpen) return;
  document.body.classList.remove('footer-visible');
  footer.classList.remove('shown');
  footer.classList.add('hidden');
  const finalize = () => {
    footer.style.display = 'none';
    footerOpen = false;
    rearmFourth(); // готовим к следующему показу
  };
  footer.addEventListener('transitionend', finalize, { once: true });
  setTimeout(finalize, 650); // фолбэк
}
function hideFooterThenScrollPrev(prevSection){
  const goPrev = () => {
    if (!prevSection) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scrollToSection(prevSection);
    }));
  };
  if (!footerOpen) { goPrev(); return; }
  document.body.classList.remove('footer-visible');
  footer.classList.remove('shown');
  footer.classList.add('hidden');
  const onEnd = () => {
    footer.style.display = 'none';
    footerOpen = false;
    resetFourthState();
    goPrev();
  };
  footer.addEventListener('transitionend', onEnd, { once: true });
  setTimeout(onEnd, 650);
}
function hideFooterImmediate(){
  footer.classList.remove('shown');
  footer.classList.add('hidden');
  footer.style.display = 'none';
  document.body.classList.remove('footer-visible');
  footerOpen = false;
  // тут полный сброс уместен (используется при уходе/старте)
  resetFourthState();
}

/* Навигация по секциям */
let isScrolling = false;
function scrollToSection(section) {
  if (!section) return;
  const top = section.offsetTop;
  const already = Math.abs((window.scrollY || window.pageYOffset) - top) < 2;
  if (already) {
    // Якорим без "smooth", чтобы не блокировать жесты флагом isScrolling
    window.scrollTo({ top });
    return;
  }
  isScrolling = true;
  window.scrollTo({ top, behavior: 'smooth' });
  setTimeout(() => { isScrolling = false; }, 500);
}

/* Wheel: 1–3 — нативный snap; 4 — управляем показом/скрытием футера и якорим секцию */
const WHEEL_THRESHOLD = 10;
window.addEventListener('wheel', (e) => {
  const current = document.querySelector('.video-section.active');
  if (!current) return;

  if (current !== fourth) {
    // 1–3: нативный CSS scroll-snap, не мешаем
    return;
  }

  const dy = e.deltaY || 0;
  if (Math.abs(dy) < 1) return;
  if (isScrolling) return;

  if (dy > WHEEL_THRESHOLD) {
    // Вниз: показываем футер после арминга и "первого" съеденного жеста
    if (!footerOpen && fourthArmed && fourthReadyToShow) {
      if (!fourthFirstDownConsumed) { fourthFirstDownConsumed = true; e.preventDefault(); return; }
      e.preventDefault();
      showFooter();
    } else {
      // Перехватываем, чтобы не улететь скроллом
      e.preventDefault();
      scrollToSection(fourth);
    }
    return;
  }

  if (dy < -WHEEL_THRESHOLD) {
    // Вверх на 4-й: прячем футер (если открыт) и якорим на 4-й, не уходим на 3-ю
    e.preventDefault();
    if (footerOpen) {
      hideFooterStay();           // пере-армим для следующих циклов
      scrollToSection(fourth);    // якорим
      return;
    }
    scrollToSection(fourth);
    return;
  }
}, { passive: false }); // важно: непассивный, иначе preventDefault не сработает

/* Touch: 1–3 — нативный snap; 4 — явная логика тоггла */
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const delta = touchStartY - touchEndY; /* >0 — свайп вверх (вниз по контенту) */
  const current = document.querySelector('.video-section.active');
  if (!current) return;

  const TOUCH_THRESHOLD = 30;
  if (Math.abs(delta) < TOUCH_THRESHOLD) return;

  if (current === fourth) {
    if (delta > 0) {
      // Свайп вверх: показываем футер после арминга
      if (!footerOpen && fourthArmed && fourthReadyToShow) {
        if (!fourthFirstDownConsumed) { fourthFirstDownConsumed = true; return; }
        showFooter();
      } else {
        scrollToSection(fourth);
      }
      return;
    } else {
      // Свайп вниз: прячем футер и остаёмся на 4-й, без перехода к 3-й
      if (footerOpen) {
        hideFooterStay();
      }
      scrollToSection(fourth);
      return;
    }
  }
  // 1–3: нативный snap
}, { passive: true });

/* Стартовые фиксы */
window.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.video-section.active')) {
    videoSections[0]?.classList.add('active');
  }
});
window.addEventListener('load', () => {
  hideFooterImmediate();
  setScrollPaddingForHeader();
  if (!document.querySelector('.video-section.active')) {
    videoSections[0]?.classList.add('active');
  }
  window.scrollBy(0, 0);
});
