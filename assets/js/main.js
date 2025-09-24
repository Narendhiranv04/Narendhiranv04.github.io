const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.querySelector('[data-theme-toggle]');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

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
    } catch (error) {
      console.warn('Unable to persist theme preference:', error);
    }
  }
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem('preferred-theme');
  } catch (error) {
    return null;
  }
};

const storedTheme = getStoredTheme();
const initialTheme = storedTheme || (prefersDark.matches ? 'dark' : 'light');
applyTheme(initialTheme, Boolean(storedTheme));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

prefersDark.addEventListener('change', (event) => {
  const saved = getStoredTheme();
  if (!saved) {
    applyTheme(event.matches ? 'dark' : 'light', false);
  }
});

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const shouldReduceMotion = reduceMotionQuery.matches;

const timeline = document.querySelector('[data-animate-line]');
const timelineItems = document.querySelectorAll('.timeline__item');
const projectCards = document.querySelectorAll('.project-card');

if (shouldReduceMotion) {
  timeline?.classList.add('is-visible');
  timelineItems.forEach((item) => item.classList.add('is-visible'));
  projectCards.forEach((card) => card.classList.add('is-visible'));
} else {
  if (timeline) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    lineObserver.observe(timeline);
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  [...timelineItems, ...projectCards].forEach((element, index) => {
    element.style.setProperty('--delay', `${index * 0.12}s`);
    revealObserver.observe(element);
  });
}

const yearNode = document.getElementById('current-year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
