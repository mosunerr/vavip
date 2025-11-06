/* static/js/contacts.js — Контакты: города, фото, телефон и панель действий
   БАЗА: твой вариант. Правки: динамические пути к фото из HTML (--tile-img-1),
   console.log для отладки (убери после), принудительный z-index/opacity в showRightUI.
   Подсветка работает — фокус на фоне .contacts-left.
*/

document.addEventListener('DOMContentLoaded', () => {
  const scope        = document.querySelector('.dropdown-section[data-key="0"]');
  if (!scope) return;

  // Левая колонка / навигация
  const leftCol      = scope.querySelector('.contacts-left');
  const tilesHost    = scope.querySelector('.contacts-tiles');
  const tilesGrid    = scope.querySelector('.contacts-tiles');
  const locationPage = scope.querySelector('.contacts-location');
  const header       = scope.querySelector('.location-mini-header');
  const title        = scope.querySelector('.location-title');
  const countries    = scope.querySelector('.countries-list');
  const backBtn      = scope.querySelector('.back-to-countries');

  // Правая колонка / слои
  const infoArea     = scope.querySelector('#contacts-info');
  const basics       = scope.querySelector('#contacts-basics');
  const actionsRow   = scope.querySelector('.contacts-actions-row');
  const cityInfo     = scope.querySelector('#contacts-city-info');
  const cityPhoto    = scope.querySelector('#city-photo');
  const cityContacts = scope.querySelector('#city-contacts');
  const rightCol     = scope.querySelector('.contacts-right-col');
  const combined     = scope.querySelector('.contacts-combined');

  // Данные городов (без изменений)
  const citiesData = {
    ru: ['МОСКВА', 'САНКТ-ПЕТЕРБУРГ', 'КРАСНОДАР', 'РОСТОВ-НА-ДОНУ', 'ВОРОНЕЖ', 'САМАРА'],
    by: ['МИНСК'],
    kz: ['АСТАНА'],
    ge: ['ТБИЛИСИ', 'БАТУМИ'],
    ae: ['АБУ-ДАБИ', 'ДУБАЙ']
  };

  const cityPhotoMap = {
    'АБУ-ДАБИ': 'abudhabi',
    'АКТОБЕ': 'aktobe',
    'АСТАНА': 'astana',
    'БАТУМИ': 'batumi',
    'ДУБАЙ': 'dubai',
    'КРАСНОДАР': 'krasnodar',
    'МИНСК': 'minsk',
    'МОСКВА': 'moscow',
    'РОСТОВ-НА-ДОНУ': 'rostov',
    'САМАРА': 'samara',
    'САНКТ-ПЕТЕРБУРГ': 'spb',
    'ТБИЛИСИ': 'tbilisi',
    'ВОРОНЕЖ': 'voronezh'
  };

  // Карты стран (без изменений)
  const mapByCountry = {
    ae: '/static/images/contacts/maps/map-ae.jpg',
    by: '/static/images/contacts/maps/map-by.jpg',
    ge: '/static/images/contacts/maps/map-ge.jpg',
    kz: '/static/images/contacts/maps/map-kz.jpg',
    ru: '/static/images/contacts/maps/map-ru.jpg'
  };
  const setRightMap = (countryKey) => {
    if (!rightCol) return;
    const url = mapByCountry[countryKey];
    if (url) {
      rightCol.style.setProperty('--right-bg', `url("${url}")`);
      rightCol.style.backgroundImage = `url("${url}")`;
    }
  };
  const clearRightMap = () => {
    if (!rightCol) return;
    rightCol.style.removeProperty('--right-bg');
    rightCol.style.backgroundImage = '';
  };
  const setRightDark = () => {
    if (!rightCol) return;
    rightCol.style.setProperty('--right-bg', 'none');
    rightCol.style.backgroundImage = 'none';
    rightCol.style.backgroundColor = '#000';
  };

  // Состояние
  let currentCountryKey = null;
  let isSectionMode = false;

  // Исходный HTML списка стран
  const initialCountriesHTML = countries ? countries.innerHTML : '';

  // Динамические пути к фото: извлекаем из --tile-img-1 плиток (из HTML url_for)
  const getSectionBg = () => {
    const sectionBg = {};
    tilesHost?.querySelectorAll('.tile').forEach(tile => {
      const key = tile.dataset.tile;
      if (['project', 'montage', 'shop'].includes(key)) {
        const bgUrl = getComputedStyle(tile).getPropertyValue('--tile-img-1').trim();
        sectionBg[key] = bgUrl ? bgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') : `/static/images/contacts/words/word-${key === 'project' ? 2 : key === 'montage' ? 3 : 4}.jpg`;
      }
    });
    console.log('Extracted sectionBg:', sectionBg); // Отладка: проверьте в Console
    return sectionBg;
  };
  const sectionBg = getSectionBg(); // Инициализируем

  // Подсветка мини-шапки (без изменений, работает)
  const setMiniActive = (key) => {
    if (!header) return;
    header.querySelectorAll('.mini-link').forEach(b => b.classList.remove('is-active'));
    header.querySelector(`.mini-link[data-section="${key}"]`)?.classList.add('is-active');
  };
  const clearMiniActive = () => {
    if (!header) return;
    header.querySelectorAll('.mini-link').forEach(b => b.classList.remove('is-active'));
  };

  // Утилиты (hideRightUI без изменений)
  const hideRightUI = () => {
    if (basics)      basics.hidden = true;
    if (actionsRow)  actionsRow.hidden = true;
    if (cityInfo)    cityInfo.hidden = true;
    if (cityPhoto) {
      cityPhoto.removeAttribute('src');
      cityPhoto.style.display = 'none';
    }
    if (cityContacts) cityContacts.innerHTML = '';
    if (combined) combined.classList.remove('city-selected');
  };

  const clearLeftNavigation = () => {
    if (title)     title.hidden = true;
    if (countries) countries.hidden = true;
  };
  const showLeftNavigation = (isCities = false) => {
    if (title) {
      title.hidden = false;
      title.textContent = isCities ? 'ВЫБЕРИТЕ ГОРОД' : 'ВЫБЕРИТЕ МЕСТОПОЛОЖЕНИЕ';
    }
    if (countries) {
      countries.hidden = false;
      if (!isCities) countries.innerHTML = initialCountriesHTML;
    }
  };

  // Показ правой панели: ключевой фикс — принудительный стиль для фона + лог
  const showRightUI = (isSection = false, whichSection = null) => {
    if (basics)      basics.hidden = false;
    if (actionsRow)  actionsRow.hidden = false;
    if (cityInfo)    cityInfo.hidden = false;

    if (isSection && whichSection && leftCol) {
      const bg = sectionBg[whichSection] || '';
      console.log(`Setting background for ${whichSection}: ${bg}`); // Отладка: путь в Console
      leftCol.style.backgroundImage = bg ? `url("${bg}")` : '';
      leftCol.style.backgroundPosition = 'center';
      leftCol.style.backgroundSize = 'cover';
      leftCol.style.backgroundRepeat = 'no-repeat';
      leftCol.style.opacity = '1'; // Принудительно показать
      leftCol.style.zIndex = '1'; // Выше overlay
      if (cityPhoto) cityPhoto.style.display = 'none';
      console.log('leftCol styles after set:', getComputedStyle(leftCol).backgroundImage); // Отладка: реальный стиль
    }

    if (combined) combined.classList.add('city-selected');
    setRightDark();
  };

  // Показ города (без изменений)
  const showRightUIForCity = (cityKey, cityText) => {
    if (basics)      basics.hidden = false;
    if (actionsRow)  actionsRow.hidden = false;
    if (cityInfo)    cityInfo.hidden = false;

    if (leftCol) leftCol.style.backgroundImage = '';
    if (cityPhoto) {
      cityPhoto.src = `/static/images/contacts/photo-${cityKey}.jpg`;
      cityPhoto.alt = cityText;
      cityPhoto.style.display = 'block';
    }

    if (combined) combined.classList.add('city-selected');

    clearLeftNavigation();
    if (leftCol) leftCol.classList.remove('left-dark');
    setRightDark();
    clearMiniActive();
  };

  // Инициализация (без изменений)
  hideRightUI();
  if (leftCol) leftCol.classList.remove('left-dark');
  clearRightMap();

  // 1) Плитки: отключение переходов (без изменений)
  if (tilesHost) {
    tilesHost.querySelectorAll('.tile').forEach(tile => {
      if (tile.tagName === 'A' && tile.hasAttribute('href')) {
        tile.dataset.href = tile.getAttribute('href') || '';
        tile.setAttribute('href', '#');
      }
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
    });
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.contacts-tiles .tile')) e.preventDefault();
  }, { capture: true, passive: false });
  document.addEventListener('keydown', e => {
    if (!['Enter', ' ', 'Spacebar'].includes(e.key)) return;
    if (e.target.closest('.contacts-tiles .tile')) e.preventDefault();
  }, { capture: true, passive: false });

  // 2) Из плиток к секциям (без изменений, кроме лога)
  if (tilesHost) {
    tilesHost.addEventListener('click', e => {
      const btn = e.target.closest('.tile');
      if (!btn) return;
      const key = btn.dataset.tile;
      console.log('Clicked tile key:', key); // Отладка: какой key

      if (key === 'uzel') {
        hideRightUI();
        isSectionMode = false;
        scope.classList.remove('project-selected');

        tilesGrid.style.opacity = '0';
        tilesGrid.style.pointerEvents = 'none';
        setTimeout(() => {
          tilesGrid.hidden = true;
          locationPage.hidden = false;
          requestAnimationFrame(() => {
            locationPage.classList.add('active');
            if (header) {
              header.querySelectorAll('.mini-link').forEach(b => b.classList.remove('is-active'));
              header.querySelector('.mini-link[data-section="uzel"]')?.classList.add('is-active');
            }
            if (backBtn) backBtn.hidden = false;

            showLeftNavigation(false);
            if (leftCol) leftCol.classList.add('left-dark');
            clearRightMap();
          });
        }, 150);
        return;
      }

      if (['project', 'montage', 'shop'].includes(key)) {
        hideRightUI();
        isSectionMode = true;
        scope.classList.add('project-selected');

        tilesGrid.style.opacity = '0';
        tilesGrid.style.pointerEvents = 'none';
        setTimeout(() => {
          tilesGrid.hidden = true;
          locationPage.hidden = false;

          clearLeftNavigation();
          showRightUI(true, key); // ← Здесь фон + лог

          requestAnimationFrame(() => {
            locationPage.classList.add('active');
            setMiniActive(key);
            if (backBtn) backBtn.hidden = false;
          });
        }, 150);
        return;
      }
    });
  }

  // 2.1) Мини‑шапка: клик/Enter/Space → инициируем клик по соответствующей плитке (узел/проект/монтаж/магазин)
  if (header && tilesHost) {
    header.addEventListener('click', (e) => {
      const btn = e.target.closest('.mini-link');
      if (!btn) return;
      e.preventDefault();
      const key = btn.dataset.section; // 'uzel' | 'project' | 'montage' | 'shop'
      const tile = tilesHost.querySelector(`.tile[data-tile="${key}"]`);
      if (!tile) return;
      tile.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    header.addEventListener('keydown', (e) => {
      if (!['Enter', ' ', 'Spacebar'].includes(e.key)) return;
      const btn = e.target.closest('.mini-link');
      if (!btn) return;
      e.preventDefault();
      const key = btn.dataset.section;
      const tile = tilesHost.querySelector(`.tile[data-tile="${key}"]`);
      if (!tile) return;
      tile.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
  }

  // 3-5) Страны/города/назад (без изменений, но сброс фона)
  if (countries) {
    countries.addEventListener('click', e => {
      const btn = e.target.closest('.country-link:not(.city-link)');
      if (!btn) return;
      const li  = btn.closest('li');
      if (!li) return;

      let countryKey = btn.dataset.country || '';
      if (!countryKey) {
        const text = li.textContent.trim().toUpperCase();
        switch (text) {
          case 'РОССИЯ': countryKey = 'ru'; break;
          case 'БЕЛАРУСЬ': countryKey = 'by'; break;
          case 'КАЗАХСТАН': countryKey = 'kz'; break;
          case 'ГРУЗИЯ': countryKey = 'ge'; break;
          case 'ОАЭ': countryKey = 'ae'; break;
        }
      }
      if (!countryKey || !citiesData[countryKey]) return;

      currentCountryKey = countryKey;
      isSectionMode = false;
      scope.classList.remove('project-selected');
      clearMiniActive();

      if (title) title.textContent = 'ВЫБЕРИТЕ ГОРОД';
      countries.innerHTML = citiesData[countryKey]
        .map(city => `<li><button type="button" class="country-link city-link">${city}</button></li>`)
        .join('');

      hideRightUI();
      if (backBtn) backBtn.hidden = false;

      showLeftNavigation(true);
      setRightMap(currentCountryKey);
      if (leftCol) leftCol.style.backgroundImage = '';
      if (cityPhoto) cityPhoto.style.display = 'block';
    });
  }

  scope.addEventListener('click', e => {
    const btn = e.target.closest('.countries-list .country-link.city-link');
    if (!btn) return;

    const cityText = btn.textContent.trim().toUpperCase();
    const cityKey  = cityPhotoMap[cityText];
    if (!cityKey) return;

    isSectionMode = false;
    scope.classList.remove('project-selected');
    showRightUIForCity(cityKey, cityText);
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (isSectionMode) {
        locationPage.classList.remove('active');
        scope.classList.remove('project-selected');
        isSectionMode = false;

        setTimeout(() => {
          locationPage.hidden = true;
          tilesGrid.hidden = false;
          tilesGrid.style.opacity = '1';
          tilesGrid.style.pointerEvents = 'auto';

          backBtn.hidden = true;

          clearMiniActive();
          hideRightUI();
          if (leftCol) {
            leftCol.classList.remove('left-dark');
            leftCol.style.backgroundImage = '';
            leftCol.style.zIndex = ''; // Сброс
          }
          if (cityPhoto) cityPhoto.style.display = 'block';
          clearRightMap();
        }, 150);
        return;
      }

      if (cityInfo && !cityInfo.hidden && currentCountryKey) {
        if (title) title.textContent = 'ВЫБЕРИТЕ ГОРОД';
        countries.innerHTML = citiesData[currentCountryKey]
          .map(city => `<li><button type="button" class="country-link city-link">${city}</button></li>`)
          .join('');
        showLeftNavigation(true);
        hideRightUI();
        if (leftCol) leftCol.classList.add('left-dark');
        setRightMap(currentCountryKey);
        return;
      }

      if (title && title.textContent === 'ВЫБЕРИТЕ ГОРОД') {
        showLeftNavigation(false);
        hideRightUI();
        if (leftCol) leftCol.classList.add('left-dark');
        clearRightMap();
        currentCountryKey = null;
        return;
      }

      if (!tilesGrid || !locationPage) return;

      locationPage.classList.remove('active');
      setTimeout(() => {
        locationPage.hidden = true;
        tilesGrid.hidden = false;
        tilesGrid.style.opacity = '1';
        tilesGrid.style.pointerEvents = 'auto';

        backBtn.hidden = true;

        showLeftNavigation(false);
        clearMiniActive();
        hideRightUI();
        if (leftCol) leftCol.classList.remove('left-dark');
        clearRightMap();
        currentCountryKey = null;
      }, 150);
    });
  }

  // 6) Фон для плиток (без изменений)
  const BG = [
    '/static/images/contacts/words/word-1.jpg',
    '/static/images/contacts/words/word-2.jpg',
    '/static/images/contacts/words/word-3.jpg',
    '/static/images/contacts/words/word-4.jpg'
  ];
  if (tilesHost) {
    tilesHost.querySelectorAll('.tile').forEach((t, i) => {
      t.style.setProperty('--tile-bg', `url("${BG[i] || BG.at(-1)}")`);
    });
  }
});
