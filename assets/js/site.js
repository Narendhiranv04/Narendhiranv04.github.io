(() => {
  const root = document.documentElement;
  const storageKey = 'nv-theme';
  const toggle = document.querySelector('[data-theme-toggle]');
  const icon = toggle ? toggle.querySelector('.theme-toggle__icon') : null;
  const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  };

  const applyTheme = (theme, persist = true) => {
    if (!root) return;
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;

    if (toggle) {
      const isDark = nextTheme === 'dark';
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      if (icon) {
        icon.textContent = isDark ? '🌙' : '☀️';
      }
    }

    if (persist) {
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (error) {
        /* ignore storage failures */
      }
    }
  };

  const storedTheme = getStoredTheme();
  const initialTheme = storedTheme || (prefersDark && prefersDark.matches ? 'dark' : 'light');
  applyTheme(initialTheme, Boolean(storedTheme));

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.dataset.theme === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  if (prefersDark && typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', (event) => {
      const stored = getStoredTheme();
      if (!stored) {
        applyTheme(event.matches ? 'dark' : 'light', false);
      }
    });
  }

  const currentYearNode = document.getElementById('current-year');
  if (currentYearNode) {
    currentYearNode.textContent = String(new Date().getFullYear());
  }

  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const destination = document.querySelector(targetId);
      if (!destination) return;
      event.preventDefault();
      destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history.replaceState) {
        history.replaceState(null, '', targetId);
      }
    });
  });
})();
