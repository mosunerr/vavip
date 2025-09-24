// ===== header sizing =====
function setHeaderVars(){
  const bottom = document.querySelector('.header-bottom');
  if (bottom) {
    const rect = bottom.getBoundingClientRect();
    const h = Math.round(rect.bottom + window.scrollY);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
}
window.addEventListener('load', setHeaderVars);
window.addEventListener('resize', setHeaderVars);

// === Навигация: инициализация после готовности DOM ===
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.menu-item-button');
  const panel = document.getElementById('menu-panel');
  const sections = Array.from(document.querySelectorAll('.dropdown-section'));
  if (!panel || !buttons.length || !sections.length) return;

  let openKey = null;
  let closeTimer = null;

  function setDropdownX() {
    const firstBtn = document.querySelector('.menu-item-button');
    if (!firstBtn) return;
    const rect = firstBtn.getBoundingClientRect();
    const left = rect.left;
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
    if (panel.hidden) panel.hidden = false; // hidden скрывает элемент на уровне UA; снять перед показом [web:205]
    requestAnimationFrame(() => panel.classList.add('show'));
    document.body.classList.add('nav-open');

    // aria-expanded
    buttons.forEach(b => b.setAttribute('aria-expanded','false'));
    if (btn) btn.setAttribute('aria-expanded','true');

    openKey = key;
    setDropdownX();
  }

  function ensureOpenOnHover(key){
    clearTimeout(closeTimer);
    showPanelForKey(key);
  }

  function closePanel(){
    clearTimeout(closeTimer);
    panel.classList.remove('show');
    setTimeout(() => {
      panel.hidden = true; // вернуть hidden после анимации [web:205]
      openKey = null;
    }, 220);
    document.body.classList.remove('nav-open');
    // сброс подсветки
    buttons.forEach(b => { b.classList.remove('active','inactive'); b.setAttribute('aria-expanded','false'); });
  }

  // Наведение/фокус/клик по кнопкам
  buttons.forEach(btn => {
    const key = btn.dataset.key;
    btn.addEventListener('mouseenter', () => ensureOpenOnHover(key));
    btn.addEventListener('focus', () => ensureOpenOnHover(key));
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (openKey === key && panel.classList.contains('show')) {
        closePanel();
      } else {
        ensureOpenOnHover(key);
      }
    });
  });

  // Управление закрытием при уходе курсора
  const headerBottom = document.querySelector('.header-bottom');
  function armCloseSoon(){
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { closePanel(); }, 220);
  }
  function cancelClose(){ clearTimeout(closeTimer); }
  if (headerBottom) {
    headerBottom.addEventListener('mouseenter', cancelClose);
    headerBottom.addEventListener('mouseleave', armCloseSoon);
  }
  panel.addEventListener('mouseenter', cancelClose);
  panel.addEventListener('mouseleave', armCloseSoon);

  // Глобальные обработчики
  window.addEventListener('click', (e) => {
    const inside = e.target.closest('.header-bottom, #menu-panel, .menu-item-button, .menu-label');
    if (!inside) closePanel();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
  });
  window.addEventListener('scroll', () => { closePanel(); });

  // Раскладка колонок при resize
  window.addEventListener('resize', ()=>setTimeout(setDropdownX, 30));
});
