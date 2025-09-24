/* Merged main.js (conflicts resolved) */
(() => {
  'use strict';

  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // Mobile navigation toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      siteNav.dataset.open = String(!isExpanded);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.dataset.open = 'false';
      });
    });
  }

  // Theme handling
  const applyTheme = (theme, persist = true) => {
    if (!body) return;
    body.dataset.theme = theme;
    if (themeToggle) {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggle.setAttribute('aria-label', label);
    }
    if (persist) {
      try {
        localStorage.setItem('preferred-theme', theme);
      } catch (_) {
        /* ignore storage errors */
      }
    }
  };

  const getStoredTheme = () => {
    try {
      return localStorage.getItem('preferred-theme');
    } catch (_) {
      return null;
    }
  };

  const storedTheme = getStoredTheme();
  const initialTheme = storedTheme || (prefersDark && prefersDark.matches ? 'dark' : 'light');
  applyTheme(initialTheme, Boolean(storedTheme));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  if (prefersDark && typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', (event) => {
      const saved = getStoredTheme();
      if (!saved) {
        applyTheme(event.matches ? 'dark' : 'light', false);
      }
    });
  }

  // Reduced motion & intersection observers
  const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const shouldReduceMotion = reduceMotionQuery ? reduceMotionQuery.matches : false;

  const timeline = document.querySelector('[data-animate-line]');
  const timelineItems = document.querySelectorAll('.timeline__item');
  const projectCards = document.querySelectorAll('.project-card');

  if (shouldReduceMotion) {
    if (timeline) timeline.classList.add('is-visible');
    timelineItems.forEach((item) => item.classList.add('is-visible'));
    projectCards.forEach((card) => card.classList.add('is-visible'));
  } else {
    if ('IntersectionObserver' in window) {
      if (timeline) {
        const lineObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.3 }
        );
        lineObserver.observe(timeline);
      }

      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );

      [...timelineItems, ...projectCards].forEach((el, index) => {
        el.style.setProperty('--delay', `${index * 0.12}s`);
        revealObserver.observe(el);
      });
    } else {
      // Fallback for older browsers
      if (timeline) timeline.classList.add('is-visible');
      timelineItems.forEach((item) => item.classList.add('is-visible'));
      projectCards.forEach((card) => card.classList.add('is-visible'));
    }
  }

  // Footer year helper
  const yearNode = document.getElementById('current-year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
})();