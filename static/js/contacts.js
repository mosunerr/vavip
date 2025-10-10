document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('country-select')) return;

  // Узлы
  const countrySel = document.getElementById('country-select');
  const citySel    = document.getElementById('city-select');
  const phoneLink  = document.getElementById('contacts-phone-link');
  const phoneEl    = document.querySelector('#menu-panel .dropdown-section[data-key="0"] .contacts-phone');
  const hoursText  = document.getElementById('contacts-hours-text');
  const actionsRow = document.querySelector('#menu-panel .dropdown-section[data-key="0"] .contacts-actions-row');
  const combined   = document.querySelector('#menu-panel .dropdown-section[data-key="0"] .contacts-combined');
  const overlay    = document.querySelector('#menu-panel .dropdown-section[data-key="0"] .contacts-overlay');
  const rightHost  = document.getElementById('contacts-right');

  const countryNice = document.getElementById('country-nice');
  const countryList = document.getElementById('country-list');
  const cityNice    = document.getElementById('city-nice');
  const cityList    = document.getElementById('city-list');

  // Строка «Город»: скрыта до выбора страны
  const cityRow = cityNice ? cityNice.closest('.form-row') : null;
  if (cityRow){
    cityRow.classList.add('city-row');
    cityRow.classList.add('is-collapsed');

    // После завершения анимации раскрытия пересчитываем направляющие
    cityRow.addEventListener('transitionend', (e)=>{
      if (['max-height','transform','opacity','margin-top'].includes(e.propertyName)){
        requestAnimationFrame(()=> requestAnimationFrame(placeBand));
      }
    });
  }

  // Заставка GIF по умолчанию, остальные — карты/фото
  const cityBg = {
    base: "/static/images/contacts/contacts-bg-anim.gif",
    country_ru: "/static/images/contacts/maps/map-ru.jpg",
    country_by: "/static/images/contacts/maps/map-by.jpg",
    country_ge: "/static/images/contacts/maps/map-ge.jpg",
    country_kz: "/static/images/contacts/maps/map-kz.jpg",
    country_ae: "/static/images/contacts/maps/map-ae.jpg",
    moscow: "/static/images/contacts/photo-moscow.jpg",
    spb: "/static/images/contacts/photo-spb.jpg",
    krasnodar: "/static/images/contacts/photo-krasnodar.jpg",
    rostov: "/static/images/contacts/photo-rostov.jpg",
    voronezh: "/static/images/contacts/photo-voronezh.jpg",
    samara: "/static/images/contacts/photo-samara.jpg",
    minsk: "/static/images/contacts/photo-minsk.jpg",
    tbilisi: "/static/images/contacts/photo-tbilisi.jpg",
    batumi: "/static/images/contacts/photo-batumi.jpg",
    astana: "/static/images/contacts/photo-astana.jpg",
    aktobe: "/static/images/contacts/photo-aktobe.jpg",
    abudhabi: "/static/images/contacts/photo-abudhabi.jpg",
    dubai: "/static/images/contacts/photo-dubai.jpg"
  };

  function getCountryBgKey(code){
    switch(code){
      case 'ru': return 'country_ru';
      case 'by': return 'country_by';
      case 'ge': return 'country_ge';
      case 'kz': return 'country_kz';
      case 'ae': return 'country_ae';
      default:   return 'base';
    }
  }

  // Данные справа (пример)
  const data = {
    default: { phone: '+7 (495) 000‑00‑00', tel: '+74950000000', hours: 'ПН-ПТ 09:00–19:00', photo: 'base' },
    ru: { 
      default: { phone: '+7 (495) 123‑45‑67', tel: '+74951234567', hours: 'ПН-ПТ 09:00–19:00', photo: 'base' },
      moscow:  { phone: '+7 (495) 123‑45‑67', tel: '+74951234567', hours: 'ПН-ПТ 09:00–19:00', photo: 'moscow' },
      spb:     { phone: '8‑931‑248‑70‑13',    tel: '+79312487013', hours: 'с 09:00 до 21:00 каждый день', photo: 'spb' },
      krasnodar:  { phone: '+7 (861) 000-00-00', tel: '+78610000000', hours: 'ПН-ПТ 09:00–18:00', photo: 'krasnodar' },
      rostov:     { phone: '+7 (863) 000-00-00', tel: '+78630000000', hours: 'ПН-ПТ 09:00–18:00', photo: 'rostov' },
      voronezh:   { phone: '+7 (473) 000-00-00', tel: '+74730000000', hours: 'ПН-ПТ 09:00–18:00', photo: 'voronezh' },
      samara:    { phone: '+7 (846) 000-00-00', tel: '+78460000000', hours: 'ПН-ПТ 09:00–18:00', photo: 'samara' }
    },
    by: { 
      default: { phone: '+375 (17) 000‑00‑00', tel: '+375170000000', hours: 'Скоро будет доступно', photo: 'base' },
      minsk:   { phone: '+375 (17) 000‑00‑00', tel: '+375170000000', hours: 'Скоро будет доступно', photo: 'minsk' } 
    },
    ge: { 
      default: { phone: '+995 (32) 000‑00‑00', tel: '+995320000000', hours: 'Скоро будет доступно', photo: 'base' },
      tbilisi: { phone: '+995 (32) 000‑00‑00', tel: '+995320000000', hours: 'Скоро будет доступно', photo: 'tbilisi' },
      batumi:  { phone: '+995 (422) 000‑000',  tel: '+995422000000', hours: 'Скоро будет доступно', photo: 'batumi' } 
    },
    kz: {
      default: { phone: '+77002302413', tel: '+77002302413', whatsapp: '77002302413', telegram: '+77002302413', photo: 'base', hours: 'ПН-ПТ 09:00–19:00' },
      astana:  { phone: '+77002302413', tel: '+77002302413', whatsapp: '77002302413', telegram: '+77002302413', photo: 'astana', hours: 'ПН-ПТ 09:00-19:00' }
    },
    ae: { 
      default: { phone: '+971 4 000 0000', tel: '+97140000000', hours: 'Coming soon', photo: 'base' },
      abudhabi:{ phone: '+971 2 000 0000', tel: '+97120000000', hours: 'Coming soon', photo: 'abudhabi' },
      dubai:   { phone: '+971 4 000 0000', tel: '+97140000000', hours: 'Coming soon', photo: 'dubai' } 
    }
  };

  /* ---------- Плавная подмена фона без мерцания ---------- */
  let bgToken = 0;
  function preload(src){
    return new Promise((resolve, reject)=>{
      const img = new Image();
      if ('decode' in img){ img.src = src; img.decode().then(()=>resolve(src)).catch(()=>resolve(src)); }
      else { img.onload = ()=> resolve(src); img.onerror = reject; img.src = src; }
    });
  }

  async function setCityBackgroundSmooth(kind){
    if (!combined) return;
    const url = cityBg[kind] || cityBg.base;
    const current = getComputedStyle(combined).getPropertyValue('--city-bg-current');
    if (current && current.includes(url)) return;

    const my = ++bgToken;
    const ready = await preload(url).catch(()=>url);
    if (my !== bgToken) return;

    /* 1) Готовим «next» и поднимаем его мягко */
    combined.style.setProperty('--city-bg-next', `url("${ready}")`);
    void combined.offsetWidth;
    combined.classList.add('is-bg-fading');

    /* 2) После завершения фейда фиксируем «current» и снимаем класс в следующий кадр */
    const onEnd = ()=>{
      if (my !== bgToken) return;
      combined.style.setProperty('--city-bg-current', `url("${ready}")`);
      requestAnimationFrame(()=>{
        combined.classList.remove('is-bg-fading');
        /* не очищаем next, оставляем тот же url — это исключает краткий «просвет» */
        requestAnimationFrame(()=>{
          combined.style.setProperty('--city-bg-next', `url("${ready}")`);
        });
      });
      combined.removeEventListener('transitionend', onEnd);
    };
    combined.addEventListener('transitionend', onEnd, { once:true });
  }

  /* ---------- Выставление вертикалей по макету ---------- */
  function placeBand(){
    if (!rightHost || !countryNice || !cityNice || !actionsRow || !phoneEl) return;

    const base = rightHost.getBoundingClientRect();
    const toPct = (y)=> ((y - base.top) / (base.height || 1)) * 100;

    const rCountry = countryNice.getBoundingClientRect();
    const yPhoneTop = rCountry.top;

    const rCity = cityNice.getBoundingClientRect();
    const rowH  = actionsRow.getBoundingClientRect().height || 64;
    const yActionsTop = (rCity.top + rCity.height) - rowH;

    const phoneH = phoneEl.getBoundingClientRect().height || 0;
    const yHours = (yPhoneTop + yActionsTop) / 2;

    rightHost.style.setProperty('--y-phone',       toPct(yPhoneTop).toFixed(2) + '%');
    rightHost.style.setProperty('--y-actions-top', toPct(yActionsTop).toFixed(2) + '%');
    rightHost.style.setProperty('--y-hours',       toPct(yHours).toFixed(2) + '%');

    const mid = (yPhoneTop + yActionsTop) / 2;
    overlay && overlay.style.setProperty('--band-center', toPct(mid).toFixed(2) + '%');
  }
  window.addEventListener('resize', ()=> requestAnimationFrame(placeBand));

  /* ---------- Рендер справа ---------- */
  function computeProfile(){
    const c = countrySel.value, city = citySel.value;
    if (c && data[c]) {
      if (city && data[c][city]) return { profile: data[c][city], split: true };
      return { profile: data[c].default || data.default, split: false };
    }
    return { profile: data.default, split: false };
  }



function applyProfile(profile, split){
  if (!countrySel.value) return;

  const bgKey = split ? profile.photo : getCountryBgKey(countrySel.value);
  setCityBackgroundSmooth(bgKey);

  phoneLink.textContent = profile.phone;
  phoneLink.setAttribute('href', 'tel:' + profile.tel.replace(/\D/g,''));
  hoursText.textContent = profile.hours;

  const whatsappIcon = document.querySelector('.social-icon.whatsapp');
  const telegramIcon = document.querySelector('.social-icon.telegram');

  // WhatsApp: убрать все кроме цифр (формат нужен для wa.me)
  if (whatsappIcon && profile.whatsapp) {
    whatsappIcon.setAttribute('href', 'https://wa.me/' + profile.whatsapp.replace(/\D/g,''));
  } else if (whatsappIcon) {
    whatsappIcon.setAttribute('href', 'https://wa.me/79312487013');
  }

  // Telegram: НЕ удалять плюс, использовать как есть
  if (telegramIcon && profile.telegram) {
    telegramIcon.setAttribute('href', 'https://t.me/' + profile.telegram);
  } else if (telegramIcon) {
    telegramIcon.setAttribute('href', 'https://t.me/karen_vavip');
  }

  document.getElementById('contacts-info').hidden = !split;
  document.getElementById('contacts-hero-title').hidden = !!split;

  requestAnimationFrame(() => requestAnimationFrame(placeBand));
}




  /* ---------- Опции города и появление строки ---------- */
  function updateCityOptions() {
    const hasCountry = !!countrySel.value;

    if (hasCountry && countrySel.value === 'ru') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="moscow">МОСКВА</option>
        <option value="spb">САНКТ-ПЕТЕРБУРГ</option>
        <option value="krasnodar">КРАСНОДАР</option>
        <option value="rostov">РОСТОВ-НА-ДОНУ</option>
        <option value="voronezh">ВОРОНЕЖ</option>
        <option value="samara">САМАРА</option>`;     
    } else if (hasCountry && countrySel.value === 'by') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="minsk">МИНСК</option>`;
    } else if (hasCountry && countrySel.value === 'ge') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="tbilisi">ТБИЛИСИ</option>
        <option value="batumi">БАТУМИ</option>`;
    } else if (hasCountry && countrySel.value === 'kz') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="astana">АСТАНА</option>`;
    } else if (hasCountry && countrySel.value === 'ae') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="abudhabi">АБУ-ДАБИ</option>
        <option value="dubai">ДУБАЙ</option>`;
    } else {
      citySel.disabled = true;
      citySel.innerHTML = '<option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>';
    }

    if (cityRow){
      if (hasCountry){
        cityRow.classList.remove('is-collapsed');
      }else{
        cityRow.classList.add('is-collapsed');
      }
    }

    // Кастомный селект «Город»
    syncNiceFromSelect(citySel, cityNice, cityList);
    cityNice.setAttribute('aria-disabled', citySel.disabled ? 'true' : 'false');

    // Пересчёт после анимации (на случай мгновенного открытия списка)
    requestAnimationFrame(()=> requestAnimationFrame(placeBand));
  }

  function computeAndApply(source){
    if (source === 'country') updateCityOptions();
    const { profile, split } = computeProfile();
    applyProfile(profile, split);
  }

  /* ---------- Кастомный select ---------- */
  function optionId(selectEl, value){ const safe = String(value).replace(/[^a-z0-9_-]/gi,''); return selectEl.id + '-opt-' + safe; }
  function buildOptions(selectEl, listEl){
    const frag = document.createDocumentFragment();
    const opts = Array.from(selectEl.options).filter(o => !(o.hidden && o.disabled));
    listEl.innerHTML = '';
    if (!opts.length){ const li = document.createElement('div'); li.className='nice-empty'; li.textContent='Нет опций'; listEl.appendChild(li); return; }
    opts.forEach(o=>{
      const div = document.createElement('div');
      div.className='nice-option'; div.setAttribute('role','option');
      div.id = optionId(selectEl, o.value);
      div.dataset.value = o.value;
      const t = document.createElement('span'); t.className = 't'; t.textContent = o.textContent;
      div.appendChild(t);
      if (o.selected) div.setAttribute('aria-selected','true');
      div.addEventListener('click', ()=> setValue(selectEl, listEl, o.value, true));
      frag.appendChild(div);
    });
    listEl.appendChild(frag);
  }
  function setActiveOption(nice, list, el){
    if (!el || !el.classList.contains('nice-option')) return;
    list.querySelectorAll('.nice-option').forEach(x=>x.classList.remove('is-active'));
    el.classList.add('is-active');
    nice.setAttribute('aria-activedescendant', el.id || '');
  }
  function setValue(selectEl, listEl, value, user){
    const opt = Array.from(selectEl.options).find(o=>o.value===value);
    if (!opt) return;
    selectEl.value = value;
    Array.from(listEl.children).forEach(el=>{
      if (el.classList.contains('nice-option')){
        el.setAttribute('aria-selected', el.dataset.value===value ? 'true' : 'false');
      }
    });
    const nice = selectEl.id==='country-select' ? countryNice : cityNice;
    nice.querySelector('.label').textContent = opt.textContent || '';
    closeList(nice);
    if (user) selectEl.dispatchEvent(new Event('change', {bubbles:true}));
  }
  function openList(nice){
    if (nice.getAttribute('aria-disabled')==='true') return;
    const listId = nice.getAttribute('aria-controls');
    const list = document.getElementById(listId);
    if (!list) return;
    closeAllLists();
    nice.setAttribute('aria-expanded','true');
    list.hidden = false;
    const selectEl = document.getElementById(nice.dataset.for);
    const cur = list.querySelector('#' + optionId(selectEl, selectEl.value)) || list.querySelector('.nice-option');
    if (cur){ cur.scrollIntoView({block:'nearest'}); }
  }
  function closeList(nice){
    const listId = nice.getAttribute('aria-controls');
    const list = document.getElementById(listId);
    if (!list) return;
    nice.setAttribute('aria-expanded','false');
    list.hidden = true;
    list.querySelectorAll('.nice-option').forEach(x=>x.classList.remove('is-active'));
    nice.setAttribute('aria-activedescendant','');
  }
  function closeAllLists(){ [countryNice, cityNice].forEach(n=> n && closeList(n)); }
  function syncNiceFromSelect(selectEl, nice, list){
    buildOptions(selectEl, list);
    const selOpt = selectEl.options[selectEl.selectedIndex];
    nice.querySelector('.label').textContent = selOpt ? selOpt.textContent : (selectEl.id==='country-select'?'ВЫБЕРИТЕ СТРАНУ':'ВЫБЕРИТЕ ГОРОД');
  }
  function bindNice(nice){
    const listEl = document.getElementById(nice.getAttribute('aria-controls'));
    const formRow  = nice.closest('.form-row');
    nice.addEventListener('click', ()=>{
      if (nice.getAttribute('aria-disabled')==='true') return;
      const expanded = nice.getAttribute('aria-expanded')==='true';
      expanded ? closeList(nice) : openList(nice);
    });
    let closeTimeout;
    const scheduleClose = ()=>{ closeTimeout = setTimeout(()=> closeList(nice), 300); };
    const cancelClose   = ()=>{ if (closeTimeout){ clearTimeout(closeTimeout); closeTimeout = null; } };
    formRow.addEventListener('mouseleave', (e)=>{ if (!listEl.contains(e.relatedTarget)) scheduleClose(); });
    formRow.addEventListener('mouseenter', cancelClose);
    listEl.addEventListener('mouseleave', (e)=>{ if (!formRow.contains(e.relatedTarget)) scheduleClose(); });
    listEl.addEventListener('mouseenter', cancelClose);
    listEl.addEventListener('mouseover', (e)=>{ const opt = e.target.closest('.nice-option'); if (opt) setActiveOption(nice, listEl, opt); });
    listEl.addEventListener('mouseleave', ()=>{ listEl.querySelectorAll('.nice-option').forEach(x=>x.classList.remove('is-active')); nice.setAttribute('aria-activedescendant',''); });
    document.addEventListener('click', (evt)=>{ if (!nice.contains(evt.target) && !listEl.contains(evt.target)) closeList(nice); });
  }

  // Инициализация
  syncNiceFromSelect(countrySel, countryNice, countryList);
  syncNiceFromSelect(citySel,    cityNice,    cityList);
  bindNice(countryNice);
  bindNice(cityNice);

  // «Город» недоступен и скрыт до выбора страны
  citySel.disabled = true;
  cityNice.setAttribute('aria-disabled', 'true');

  // Первичная раскладка
  requestAnimationFrame(()=> requestAnimationFrame(placeBand));

  // Слушатели
  countrySel.addEventListener('change', ()=> computeAndApply('country'));
  citySel.addEventListener('change',   ()=> computeAndApply('city'));
});
