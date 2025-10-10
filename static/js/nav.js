/* 13 nav.js */
// ===== Глобальная блокировка нативной прокрутки, пока открыт дропдаун =====
const blockScrollOnOpen = (e) => {
  if (document.body.classList.contains('nav-open')) {
    // Не блокируем скролл внутри .nice-options!
    if (e.target.closest('.nice-options')) return;
    e.preventDefault();
  }
};
window.addEventListener('wheel', blockScrollOnOpen, { passive: false });
window.addEventListener('touchmove', blockScrollOnOpen, { passive: false });

// ... остальной код nav.js ...

// Добавляем поведение для появления полосы прокрутки при скролле
document.addEventListener('DOMContentLoaded', () => {
  // ... существующие инициализации выпадающих меню

  document.querySelectorAll('.nice-options').forEach(list => {
    let scrollTimer = null;
    list.addEventListener('scroll', () => {
      list.classList.add('scrolling');
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        list.classList.remove('scrolling');
      }, 400); // 0.4 секунды после последнего скролла полоска скрывается
    });
  });
});

// ===== header sizing =====
function setHeaderVars(){
  const header = document.querySelector('header');
  const h = header ? header.offsetHeight : 0;
  document.documentElement.style.setProperty('--header-h', h + 'px');
}
window.addEventListener('load', setHeaderVars);
window.addEventListener('resize', setHeaderVars);

// ===== Скролл-лок по классу nav-open =====
function lockScroll(){
  document.documentElement.classList.add('nav-open');
  document.body.classList.add('nav-open');
}
function unlockScroll(){
  document.documentElement.classList.remove('nav-open');
  document.body.classList.remove('nav-open');
}

// === Навигация: инициализация после готовности DOM ===
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.menu-item-button');
  const panel = document.getElementById('menu-panel');
  const sections = Array.from(document.querySelectorAll('.dropdown-section'));
  if (!panel || !buttons.length || !sections.length) return;

  let openKey = null;
  let closeTimer = null;
  let handoffTimer = null;      // «мостик» при уходе ВНИЗ в панель
  const GRACE_CLOSE_MS = 320;   // стандартная задержка закрытия
  const GRACE_HANDOFF_MS = 600; // увеличенная задержка на хэндофф вниз

  // ВЫРАВНИВАНИЕ: считаем левый отступ первой кнопки и пробрасываем в CSS
  function setDropdownX() {
    const panel = document.getElementById('menu-panel');
    const buttons = document.querySelectorAll('.menu-item-button');
    if (!panel || !buttons.length) return;

    const firstBtn = buttons[0];
    const lastBtn  = buttons[buttons.length - 1];
    const rectL = firstBtn.getBoundingClientRect();
    const rectR = lastBtn.getBoundingClientRect();

    const vw = window.innerWidth || document.documentElement.clientWidth;
    const left = Math.max(16, Math.round(rectL.left));           // левая направляющая: «КОНТАКТЫ»
    const rightGap = Math.max(16, Math.round(vw - rectR.right)); // правая направляющая: «МАГАЗИН»

    // Пробрасываем направляющие как CSS‑переменные панели
    panel.style.setProperty('--menu-x', left + 'px');            // слева
    panel.style.setProperty('--menu-r', rightGap + 'px');        // справа

    // Сохраняем прежнюю геометрию для остальных секций
    document.querySelectorAll('.dropdown-left').forEach(bl => { bl.style.left = left + 'px'; });
    document.querySelectorAll('.dropdown-right').forEach(br => { br.style.left = (left + 350) + 'px'; });
  }

  function showPanelForKey(key){
    // подсветка кнопок
    buttons.forEach(b => b.classList.remove('active','inactive'));
    const btn = document.querySelector('.menu-item-button[data-key="'+key+'"]');
    if (btn) {
      btn.classList.add('active');
      buttons.forEach(b => { if (b !== btn) b.classList.add('inactive'); });
    }

    // переключение секций
    sections.forEach(s => s.classList.remove('active'));
    const sec = sections.find(s => s.dataset.key === String(key));
    if (sec) sec.classList.add('active');

    // показать панель
    panel.hidden = false;            // снять из раскладки перед анимацией
    panel.setAttribute('aria-hidden','false');
    requestAnimationFrame(() => panel.classList.add('show'));

    // включить скролл-лок
    lockScroll();

    // aria-expanded
    buttons.forEach(b => b.setAttribute('aria-expanded','false'));
    if (btn) btn.setAttribute('aria-expanded','true');

    openKey = String(key);
    setDropdownX();
  }

  function closePanelNow(){
    clearTimeout(closeTimer);
    clearTimeout(handoffTimer);
    if (!panel.classList.contains('show') && panel.hidden) { openKey = null; return; }
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden','true');
    unlockScroll();
    buttons.forEach(b => { b.classList.remove('active','inactive'); b.setAttribute('aria-expanded','false'); });
    setTimeout(() => { panel.hidden = true; openKey = null; }, 240);
  }

  function scheduleClose(delay = GRACE_CLOSE_MS){
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closePanelNow, delay);
  }
  function cancelClose(){
    clearTimeout(closeTimer);
    clearTimeout(handoffTimer);
  }

  // Трекинг направления движения указателя — нужна только ось Y
  let lastY = -1;
  window.addEventListener('pointermove', (e) => { lastY = e.clientY; }, { passive:true });

  // Помощник: проверка, что relatedTarget внутри узла (надёжно для pointerleave)
  function isInto(el, target){
    if (!el || !target) return false;
    try { return el.contains(target); } catch { return false; }
  }

  // Hover/Focus/Pointer по кнопкам
let hoverTimer = null; // в начале DOMContentLoaded

buttons.forEach(btn => {
  const key = btn.dataset.key;

  btn.addEventListener('pointerenter', () => {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      cancelClose();
      showPanelForKey(key);
    }, 200); // задержка 0.2 секунды
  });

  btn.addEventListener('pointerleave', () => {
    clearTimeout(hoverTimer);
    scheduleClose(GRACE_CLOSE_MS);
  });

  btn.addEventListener('focus', () => {
    clearTimeout(hoverTimer);
    cancelClose();
    showPanelForKey(key);
  });

  btn.addEventListener('blur', () => {
    clearTimeout(hoverTimer);
    scheduleClose(GRACE_CLOSE_MS);
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(hoverTimer);
    if (openKey === String(key) && panel.classList.contains('show')) {
      closePanelNow();
    } else {
      cancelClose();
      showPanelForKey(key);
    }
  });
});


  // Удерживаем панель открытой пока указатель/фокус внутри
  const headerBottom = document.querySelector('.header-bottom');

  // Ключевой фикс: «хэндофф вниз» — если курсор уходит с полосы слов в панель, не закрывать
  if (headerBottom) {
    headerBottom.addEventListener('pointerenter', cancelClose);
    headerBottom.addEventListener('pointerleave', (e) => {
      const goingDown = (typeof e.clientY === 'number' && lastY !== -1) ? (e.clientY > lastY) : true; // эвристика вниз
      if (goingDown && isInto(panel, e.relatedTarget)) { // relatedTarget указывает новый целевой элемент [MDN relatedTarget]
        cancelClose(); // уже зашли в панель — ничего не делаем
        return;
      }
      if (goingDown && !isInto(panel, e.relatedTarget)) {
        // Даём расширенное «окно хэндоффа», чтобы успеть попасть в панель даже при микропросвете
        cancelClose();
        handoffTimer = setTimeout(() => scheduleClose(GRACE_CLOSE_MS), GRACE_HANDOFF_MS);
        return;
      }
      scheduleClose(GRACE_CLOSE_MS); // уходим не вниз — стандартно закрываем
    });
  }

  // Вход/выход панели
  panel.addEventListener('pointerenter', cancelClose);
  panel.addEventListener('pointerleave', (e) => {
    // Если уходим обратно к полосе слов — остаёмся открытыми
    if (isInto(headerBottom, e.relatedTarget)) { cancelClose(); return; }
    scheduleClose(GRACE_CLOSE_MS);
  });
  panel.addEventListener('pointerdown', (e) => e.stopPropagation()); // клики внутри — не закрывают

  // «Клик вне» — закрыть
  window.addEventListener('pointerdown', (e) => {
    const inside = e.target.closest('.header-bottom, #menu-panel, .menu-item-button, .menu-label');
    if (!inside) closePanelNow();
  }, { capture: true });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanelNow(); }, { passive: true });

  // Закрытие по завершению прокрутки + фолбэк
  if ('onscrollend' in document) {
    document.addEventListener('scrollend', () => { if (openKey !== null) closePanelNow(); }, { passive: true });
  } else {
    let scrollCloseT;
    window.addEventListener('scroll', () => {
      if (openKey === null) return;
      clearTimeout(scrollCloseT);
      scrollCloseT = setTimeout(() => closePanelNow(), 200);
    }, { passive: true });
  }

  // Наблюдаем за изменением размеров шапки
  const headerEl = document.querySelector('header');
  if (window.ResizeObserver && headerEl) {
    const ro = new ResizeObserver(() => { setHeaderVars(); setDropdownX(); });
    ro.observe(headerEl);
  }

  // начальная раскладка
  setHeaderVars();
  setDropdownX();

  // Пересчёт после resize
  window.addEventListener('resize', () => { setHeaderVars(); setTimeout(setDropdownX, 40); }, { passive: true });
});
