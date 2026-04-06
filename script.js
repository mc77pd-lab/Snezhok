/**
 * ═══════════════════════════════════════════════════════════
 * ТАКСОПАРК SNEZHOK — JAVASCRIPT
 * ═══════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════
  // 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (Светлая / Тёмная)
  // ═══════════════════════════════════════════════════════════
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 2. ЯЗЫКОВОЕ МЕНЮ
  // ═══════════════════════════════════════════════════════════
  const langToggle = document.getElementById('lang-toggle');
  const langMenu = document.getElementById('lang-menu');
  const langOptions = document.querySelectorAll('.lang-option');
  const currentFlagContainer = document.getElementById('current-flag-container');
  const currentLangLabel = document.getElementById('current-lang-label');

  function openLangMenu() {
    langMenu.classList.add('active');
    langToggle.classList.add('open');
  }

  function closeLangMenu() {
    langMenu.classList.remove('active');
    langToggle.classList.remove('open');
  }

  if (langToggle && langMenu) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.contains('active') ? closeLangMenu() : openLangMenu();
    });

    document.addEventListener('click', (e) => {
      if (!langMenu.contains(e.target) && e.target !== langToggle) {
        closeLangMenu();
      }
    });
  }

  function highlightCurrentLang() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    langOptions.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentFile;
      link.classList.toggle('active', isActive);

      if (isActive && currentFlagContainer && currentLangLabel) {
        currentFlagContainer.innerHTML = link.querySelector('.flag').outerHTML;
        currentLangLabel.textContent = link.querySelector('span').textContent;
      }
    });
  }
  highlightCurrentLang();

  // ═══════════════════════════════════════════════════════════
  // 3. АККОРДЕОН
  // ═══════════════════════════════════════════════════════════
  const accordions = document.querySelectorAll('.accordion-block:not(.static-block)');
  const STORAGE_KEY = 'snezok_accordion_states';

  function toggleBlock(block, isOpen, save = true) {
    const btn = block.querySelector('.accordion-toggle');
    block.classList.toggle('open', isOpen);
    if (btn) {
      btn.setAttribute('data-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
    }
    if (save) saveStates();
  }

  function saveStates() {
    const states = {};
    accordions.forEach(acc => {
      states[acc.id] = acc.classList.contains('open');
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  }

  function initAccordions() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let hasValidSaved = false;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (accordions.every(acc => parsed.hasOwnProperty(acc.id))) {
          hasValidSaved = true;
          accordions.forEach(acc => toggleBlock(acc, parsed[acc.id], false));
        }
      } catch (e) {
        console.warn('Ошибка чтения состояний аккордеона:', e);
      }
    }

    if (!hasValidSaved) {
      accordions.forEach((acc, index) => toggleBlock(acc, index === 0, false));
      saveStates();
    }

    accordions.forEach(acc => {
      const btn = acc.querySelector('.accordion-toggle');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBlock(acc, !acc.classList.contains('open'), true);
        });
      }
    });
  }
  initAccordions();

  // ═══════════════════════════════════════════════════════════
  // 4. КАРУСЕЛИ (Документы + Осмотр автомобиля + Контакты)
  // ═══════════════════════════════════════════════════════════
  function initCarousel(carouselId, indicatorsId) {
    const carousel = document.getElementById(carouselId);
    const indicators = document.querySelectorAll(`${indicatorsId} .indicator`);

    if (carousel && indicators.length > 0) {
      let currentIndex = 0;
      // Поддерживаем оба типа слайдов: carousel-slide и operator-card
      const slides = carousel.querySelectorAll('.carousel-slide, .operator-card');
      const slideCount = slides.length;

      const syncIndicators = () => {
        const slideWidth = carousel.offsetWidth;
        if (slideWidth === 0) return;
        const newIndex = Math.round(carousel.scrollLeft / slideWidth);
        if (newIndex >= 0 && newIndex < slideCount && newIndex !== currentIndex) {
          currentIndex = newIndex;
          indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
        }
      };

      carousel.addEventListener('scroll', syncIndicators, { passive: true });

      indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
          currentIndex = i;
          const targetScroll = currentIndex * carousel.offsetWidth;
          carousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
          indicators.forEach((el, idx) => el.classList.toggle('active', idx === currentIndex));
        });
      });

      const ro = new ResizeObserver(() => {
        if (carousel.offsetParent) syncIndicators();
      });
      ro.observe(carousel);

      setTimeout(syncIndicators, 150);
    }
  }

    // Инициализация всех каруселей
  initCarousel('doc-carousel', '#doc-indicators');
  initCarousel('inspection-carousel', '#inspection-indicators');
  initCarousel('contacts-carousel-1', '#contacts-indicators-1');
  initCarousel('contacts-carousel-2', '#contacts-indicators-2');
  initCarousel('yandex-pro-carousel', '#yandex-pro-indicators');
  initCarousel('parking-reg-carousel', '#parking-reg-indicators');
  initCarousel('parking-pay-carousel', '#parking-pay-indicators');
  initCarousel('children-carousel', '#children-indicators'); 

});