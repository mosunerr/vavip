document.addEventListener('DOMContentLoaded', function() {
  // Контакты: инициализация только если есть элемент
  if (!document.getElementById('country-select')) return;
  
  const countrySel = document.getElementById('country-select');
  const citySel    = document.getElementById('city-select');
  const infoArea   = document.getElementById('contacts-info');
  const heroTitle  = document.getElementById('contacts-hero-title');
  const phoneLink  = document.getElementById('contacts-phone-link');
  const hoursText  = document.getElementById('contacts-hours-text');
  const combined   = document.querySelector('#menu-panel .dropdown-section[data-key="0"] .contacts-combined');
  const overlay    = document.querySelector('#menu-panel .dropdown-section[data-key="0"] .contacts-overlay');

  const cityBg = {
    base: "/static/images/contacts/contacts-bg-map.jpg",
    country_ru: "/static/images/contacts/maps/map-ru.jpg",
    country_by: "/static/images/contacts/maps/map-by.jpg",
    country_ge: "/static/images/contacts/maps/map-ge.jpg",
    country_kz: "/static/images/contacts/maps/map-kz.jpg",
    country_ae: "/static/images/contacts/maps/map-ae.jpg",
    moscow: "/static/images/contacts/photo-moscow.jpg",
    spb: "/static/images/contacts/photo-spb.jpg",
    minsk: "/static/images/contacts/photo-minsk.jpg",
    tbilisi: "/static/images/contacts/photo-tbilisi.jpg",
    batumi: "/static/images/contacts/photo-batumi.jpg",
    astana: "/static/images/contacts/photo-astana.jpg",
    aktobe: "/static/images/contacts/photo-aktobe.jpg",
    abudhabi: "/static/images/contacts/photo-abudhabi.jpg",
    dubai: "/static/images/contacts/photo-dubai.jpg"
  };

  function setCityBackground(kind){
    const url = cityBg[kind] || cityBg.base;
    combined?.style.setProperty('--city-bg', `url("${url}")`);
  }
  
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
  
  const data = {
    default: { phone: '+7 (495) 000‑00‑00', tel: '+74950000000', hours: 'пн‑пт 09:00–19:00', photo: 'base' },
    ru: { 
      default: { phone: '+7 (495) 123‑45‑67', tel: '+74951234567', hours: 'пн‑пт 09:00–19:00', photo: 'base' },
      moscow:  { phone: '+7 (495) 123‑45‑67', tel: '+74951234567', hours: 'пн‑пт 09:00–19:00', photo: 'moscow' },
      spb:     { phone: '8‑931‑248‑70‑13',    tel: '+79312487013', hours: 'с 09:00 до 21:00 каждый день', photo: 'spb' } 
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
      default: { phone: '+77002302413', tel: '+77002302413', hours: 'пн‑пт 09:00–19:00', photo: 'base' },
      astana:  { phone: '+77002302413', tel: '+77002302413', hours: 'пн‑пт 09:00–19:00', photo: 'astana' },
      aktobe:  { phone: '+77002302413', tel: '+77002302413', hours: 'пн‑пт 09:00–19:00', photo: 'aktobe' } 
    },
    ae: { 
      default: { phone: '+971 4 000 0000', tel: '+97140000000', hours: 'Coming soon', photo: 'base' },
      abudhabi:{ phone: '+971 2 000 0000', tel: '+97120000000', hours: 'Coming soon', photo: 'abudhabi' },
      dubai:   { phone: '+971 4 000 0000', tel: '+97140000000', hours: 'Coming soon', photo: 'dubai' } 
    }
  };

  function computeProfile(){
    const c = countrySel.value, city = citySel.value;
    if (c && data[c]) {
      if (city && data[c][city]) return { profile: data[c][city], split: true };
      return { profile: data[c].default || data.default, split: false };
    }
    return { profile: data.default, split: false };
  }

  function applyProfile(profile, split){
    // НЕ трогаем состояние, если ничего не выбрано
    if (!countrySel.value) return;
    
    const bgKey = split ? profile.photo : getCountryBgKey(countrySel.value);
    setCityBackground(bgKey);
    phoneLink.textContent = profile.phone;
    phoneLink.setAttribute('href', 'tel:' + profile.tel.replace(/\D/g,''));
    hoursText.textContent = profile.hours;
    document.getElementById('contacts-info').hidden = !split;
    document.getElementById('contacts-hero-title').hidden = split ? true : false;
    placeBand();
  }

  function updateCityOptions() {
    if (countrySel.value === 'ru') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="moscow">МОСКВА</option>
        <option value="spb">САНКТ-ПЕТЕРБУРГ</option>
      `;
    } else if (countrySel.value === 'by') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="minsk">МИНСК</option>
      `;
    } else if (countrySel.value === 'ge') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="tbilisi">ТБИЛИСИ</option>
        <option value="batumi">БАТУМИ</option>
      `;
    } else if (countrySel.value === 'kz') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="astana">АСТАНА</option>
      `;
    } else if (countrySel.value === 'ae') {
      citySel.disabled = false;
      citySel.innerHTML = `
        <option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>
        <option value="abudhabi">АБУ-ДАБИ</option>
        <option value="dubai">ДУБАЙ</option>
      `;
    } else {
      citySel.disabled = true;
      citySel.innerHTML = '<option value="" selected disabled hidden>ВЫБЕРИТЕ ГОРОД</option>';
    }
    syncNiceFromSelect(citySel, cityNice, cityList);
    cityNice.setAttribute('aria-disabled', citySel.disabled ? 'true' : 'false');
  }

  function placeBand(){
    if (!overlay) return;
    const overlayRect = overlay.getBoundingClientRect();
    let cy;
    if (!document.getElementById('contacts-info').hidden) {
      const r = document.getElementById('contacts-info').getBoundingClientRect();
      cy = r.top + r.height / 2;
    } else {
      cy = overlayRect.top + overlayRect.height * 0.58;
    }
    const py = ((cy - overlayRect.top) / overlayRect.height) * 100;
    overlay.style.setProperty('--band-center', py.toFixed(2) + '%');
  }

  function updateAll(source){
    if (source === 'country') { updateCityOptions(); }
    const { profile, split } = computeProfile();
    applyProfile(profile, split);
  }

  // Custom select implementation
  const countryNice = document.getElementById('country-nice');
  const countryList = document.getElementById('country-list');
  const cityNice    = document.getElementById('city-nice');
  const cityList    = document.getElementById('city-list');

  function optionId(selectEl, value){ 
    const safe = String(value).replace(/[^a-z0-9_-]/gi,''); 
    return selectEl.id + '-opt-' + safe; 
  }

  function buildOptions(selectEl, listEl){
    const frag = document.createDocumentFragment();
    const opts = Array.from(selectEl.options).filter(o => !(o.hidden && o.disabled));
    listEl.innerHTML = '';
    if (!opts.length){
      const li = document.createElement('div'); 
      li.className = 'nice-empty'; 
      li.textContent = 'Нет опций'; 
      listEl.appendChild(li); 
      return;
    }
    opts.forEach(o=>{
      const div = document.createElement('div');
      div.className='nice-option'; 
      div.setAttribute('role','option');
      div.id = optionId(selectEl, o.value); 
      div.dataset.value = o.value; 
      div.textContent = o.textContent;
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
        const on = el.dataset.value===value; 
        el.setAttribute('aria-selected', on ? 'true':'false');
      }
    });
    const nice = selectEl.id==='country-select'? countryNice : cityNice;
    nice.querySelector('.label').textContent = opt.textContent || '';
    closeList(nice);
    if (user){ selectEl.dispatchEvent(new Event('change', {bubbles:true})); }
  }

  function openList(nice){
    const listId = nice.getAttribute('aria-controls'); 
    const list = document.getElementById(listId); 
    if (!list) return;
    closeAllLists();
    nice.setAttribute('aria-expanded','true'); 
    list.hidden = false;
    const selectEl = document.getElementById(nice.dataset.for);
    const cur = list.querySelector('#' + optionId(selectEl, selectEl.value)) || list.querySelector('.nice-option');
    if (cur){ setActiveOption(nice, list, cur); cur.scrollIntoView({block:'nearest'}); }
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

  function closeAllLists(){ 
    [countryNice, cityNice].forEach(n=> n && closeList(n)); 
  }

  function syncNiceFromSelect(selectEl, nice, list){
    buildOptions(selectEl, list);
    const selOpt = selectEl.options[selectEl.selectedIndex];
    nice.querySelector('.label').textContent = selOpt ? selOpt.textContent : (selectEl.id==='country-select'?'ВЫБЕРИТЕ СТРАНУ':'ВЫБЕРИТЕ ГОРОД');
  }

  function bindNice(nice){
    const selectEl = document.getElementById(nice.dataset.for);
    const listEl = document.getElementById(nice.getAttribute('aria-controls'));
    const formRow = nice.closest('.form-row');
    
    nice.addEventListener('click', ()=> {
      if (nice.getAttribute('aria-disabled')==='true') return;
      const expanded = nice.getAttribute('aria-expanded')==='true';
      expanded ? closeList(nice) : openList(nice);
    });
    
    // Автозакрытие при уходе мыши с form-row + выпадающего списка
    let closeTimeout;
    
    const scheduleClose = () => {
      closeTimeout = setTimeout(() => {
        closeList(nice);
      }, 300); // задержка 300мс
    };
    
    const cancelClose = () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    };
    
    // Уход мыши с form-row
    formRow.addEventListener('mouseleave', (e) => {
      // Проверяем, что мышь не перешла на выпадающий список
      if (!listEl.contains(e.relatedTarget)) {
        scheduleClose();
      }
    });
    
    // Вход мыши в form-row отменяет закрытие
    formRow.addEventListener('mouseenter', cancelClose);
    
    // Уход мыши с выпадающего списка
    listEl.addEventListener('mouseleave', (e) => {
      // Проверяем, что мышь не вернулась к form-row
      if (!formRow.contains(e.relatedTarget)) {
        scheduleClose();
      }
    });
    
    // Вход мыши в выпадающий список отменяет закрытие
    listEl.addEventListener('mouseenter', cancelClose);
    
    listEl.addEventListener('mouseover', (e)=>{
      const opt = e.target.closest('.nice-option'); 
      if (opt){ setActiveOption(nice, listEl, opt); }
    });
    
    listEl.addEventListener('mouseleave', ()=>{
      listEl.querySelectorAll('.nice-option').forEach(x=>x.classList.remove('is-active'));
      nice.setAttribute('aria-activedescendant','');
    });
    
    nice.addEventListener('keydown', (e)=>{
      if (nice.getAttribute('aria-disabled')==='true') return;
      const list = listEl;
      const items = Array.from(list.querySelectorAll('.nice-option'));
      const active = list.querySelector('.nice-option.is-active') || list.querySelector('.nice-option[aria-selected="true"]');
      let idx = items.indexOf(active);
      
      const goto = (i)=>{ 
        if (!items.length) return; 
        idx = Math.max(0, Math.min(i, items.length-1)); 
        setActiveOption(nice, list, items[idx]); 
        items[idx].scrollIntoView({block:'nearest'}); 
      };
      
      const commit = ()=>{ 
        const el = list.querySelector('.nice-option.is-active') || list.querySelector('.nice-option[aria-selected="true"]'); 
        if (el){ setValue(selectEl, list, el.dataset.value, true); } 
      };
      
      switch(e.key){
        case ' ':
        case 'Enter':
          if (nice.getAttribute('aria-expanded')!=='true'){ openList(nice); }
          else { commit(); }
          e.preventDefault();
          break;
        case 'Escape':
          closeList(nice); e.preventDefault(); break;
        case 'ArrowDown':
          if (nice.getAttribute('aria-expanded')!=='true'){ openList(nice); e.preventDefault(); break; }
          goto((idx<0?0:idx+1)); e.preventDefault(); break;
        case 'ArrowUp':
          if (nice.getAttribute('aria-expanded')!=='true'){ openList(nice); e.preventDefault(); break; }
          goto((idx<0?items.length-1:idx-1)); e.preventDefault(); break;
        case 'Home': goto(0); e.preventDefault(); break;
        case 'End': goto(items.length-1); e.preventDefault(); break;
        default:
          if (e.key.length===1){
            const q = e.key.toLowerCase();
            const found = items.findIndex(el=>el.textContent.trim().toLowerCase().startsWith(q));
            if (found>=0){ goto(found); }
          }
      }
    });
    
    document.addEventListener('click', (evt)=>{
      if (!nice.contains(evt.target) && !listEl.contains(evt.target)){ 
        closeList(nice); 
      }
    });
  }

  // Инициализация — НЕ вызываем updateAll
  syncNiceFromSelect(countrySel, countryNice, countryList);
  syncNiceFromSelect(citySel, cityNice, cityList);
  bindNice(countryNice);
  bindNice(cityNice);
  
  countrySel.addEventListener('change', ()=>{ 
    citySel.value = ''; 
    updateCityOptions(); 
    updateAll('country'); 
  });
  
  citySel.addEventListener('change', ()=> updateAll('city'));
});
