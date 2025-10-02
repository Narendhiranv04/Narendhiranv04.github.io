// scripts for Long Horizon Hierarchy project page
// Merged and conflict-free: combines theme toggle, responsive nav, and active-section highlighting.

const root = document.body;

// --- NAV ELEMENTS (support both data-js and legacy class selectors) ---
const nav =
  document.querySelector('[data-js="site-nav"]') ||
  document.querySelector('.site-nav');

const navLinks = nav
  ? Array.from(nav.querySelectorAll('a[href^="#"]'))
  : Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));

// Menu toggle button (hamburger)
const menuToggle =
  document.querySelector('[data-js="menu-toggle"]') ||
  document.querySelector('.menu-toggle');

// Theme toggle button (optional)
const themeToggle =
  document.querySelector('[data-js="theme-toggle"]') ||
  document.querySelector('.theme-toggle');

const themeToggleIcon = themeToggle
  ? themeToggle.querySelector('.theme-toggle__icon')
  : null;

const themeToggleText = themeToggle
  ? themeToggle.querySelector('.theme-toggle__text')
  : null;

// --- THEME HANDLING ---
const THEME_STORAGE_KEY = 'lhh-color-theme';
const prefersDark =
  typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

const getStoredTheme = () => {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors (e.g., private browsing)
  }
};

const updateThemeToggle = (currentTheme) => {
  if (!themeToggle) return;

  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${nextTheme} theme`;

  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);

  if (themeToggleIcon) {
    themeToggleIcon.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
  }
  if (themeToggleText) {
    themeToggleText.textContent =
      `${nextTheme.charAt(0).toUpperCase()}${nextTheme.slice(1)} Mode`;
  }
};

const applyTheme = (theme, { persist = true } = {}) => {
  if (!root) return;
  root.setAttribute('data-theme', theme);
  if (persist) storeTheme(theme);
  updateThemeToggle(theme);
};

const storedTheme = getStoredTheme();
const systemPrefersDark = prefersDark ? prefersDark.matches : true;
const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
applyTheme(initialTheme, { persist: false });

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const activeTheme =
      root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
  });
}

if (prefersDark) {
  const handleSystemThemeChange = (event) => {
    // Respect explicit user choice in localStorage
    if (getStoredTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light', { persist: false });
  };

  if (typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', handleSystemThemeChange);
  } else if (typeof prefersDark.addListener === 'function') {
    // Safari < 14
    prefersDark.addListener(handleSystemThemeChange);
  }
}

// --- RESPONSIVE NAV / MENU ---
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('is-open');
  });

  // Close nav when clicking outside
  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return;
    const target = event.target;
    if (target === nav || nav.contains(target) || menuToggle.contains(target)) {
      return;
    }
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  // Close with Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Close the nav after clicking a link (mobile)
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (!nav) return;
    if (window.innerWidth <= 960 && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// --- ACTIVE SECTION HIGHLIGHTING ---
/**
 * Prefer sections that nav links point to.
 * Fallback: any <main> section with an id.
 */
let sections = navLinks
  .map((link) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return null;
    return document.querySelector(targetId);
  })
  .filter(Boolean);

// Fallback if no sections resolvable from navLinks
if (!sections.length) {
  sections = Array.from(document.querySelectorAll('main section[id]'));
}

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
} else if (navLinks.length) {
  // Basic fallback: mark the first link active
  navLinks[0].classList.add('is-active');
}

// --- RESEARCH TIMELINE ---
const researchExperiences = [
  {
    title: 'Embodied AI Intern',
    organization: 'NTU, Singapore',
    timeframe: 'May 2025 – Present',
    summary:
      'Extended Moto-VLA with contrastive learning and in-context memory for retrieval-augmented VLA control.',
    image: {
      src: 'https://placehold.co/120x120?text=NTU',
      alt: 'Placeholder logo for NTU Singapore',
    },
  },
  {
    title: 'Task & Motion Planning Intern',
    organization: 'IIIT, Hyderabad',
    timeframe: 'July 2025 – Present',
    summary:
      'Designed a contract-validated visual HRL framework for long-horizon manipulation tasks using MoE and SmolVLA controllers.',
    image: {
      src: 'https://placehold.co/120x120?text=IIIT',
      alt: 'Placeholder logo for IIIT Hyderabad',
    },
  },
  {
    title: 'Assistive Robotics Intern',
    organization: 'Monash University',
    timeframe: 'Jan 2025 – May 2025',
    summary:
      'Developed a lightweight GRU for real-time torque prediction in robotic exoskeletons with a fuzzy logic-based control system.',
    image: {
      src: 'https://placehold.co/120x120?text=Monash',
      alt: 'Placeholder logo for Monash University',
    },
  },
  {
    title: 'Robotic Perception Intern',
    organization: 'IIT Bombay',
    timeframe: 'Jun 2024 – Feb 2025',
    summary:
      'Developed AURASeg, a model for drivable area segmentation, outperforming YOLOP in mIoU and F1-score.',
    image: {
      src: 'https://placehold.co/120x120?text=IIT+B',
      alt: 'Placeholder logo for IIT Bombay',
    },
  },
];

const researchTimeline = document.querySelector('[data-js="research-timeline"]');

if (researchTimeline) {
  researchExperiences.forEach((experience, index) => {
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.style.setProperty('--animation-index', index.toString());

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'timeline-image';

    const img = document.createElement('img');
    img.src = experience.image.src;
    img.alt = experience.image.alt;
    img.loading = 'lazy';
    imageWrapper.appendChild(img);

    const content = document.createElement('div');
    content.className = 'timeline-content';

    const meta = document.createElement('p');
    meta.className = 'timeline-meta';

    const strong = document.createElement('strong');
    strong.textContent = experience.organization;
    meta.append(strong);
    meta.append(document.createTextNode(` · ${experience.timeframe}`));

    const heading = document.createElement('h3');
    heading.textContent = experience.title;

    const description = document.createElement('p');
    description.className = 'timeline-description';
    description.textContent = experience.summary;

    content.append(meta, heading, description);
    item.append(imageWrapper, content);
    researchTimeline.appendChild(item);
  });

  const timelineItems = researchTimeline.querySelectorAll('.timeline-item');

  if ('IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));
  } else {
    timelineItems.forEach((item) => item.classList.add('is-visible'));
  }
}

// --- PROJECT GALLERY ---
const projects = [
  {
    title: 'Autonomous UAS',
    tag: 'Aerial Robotics',
    meta: 'SAE AeroTHON · 2024',
    summary:
      'Led the development of an autonomous quadcopter platform with custom perception pipelines and ROS 2 integrations that finished top 15 nationwide.',
    image: {
      src: 'https://placehold.co/960x720/0f172a/ffffff?text=Autonomous+UAS',
      alt: 'Placeholder hero image representing the Autonomous UAS project.',
    },
  },
  {
    title: 'PixelBot',
    tag: 'Multimodal AI',
    meta: 'Smart India Hackathon · 2024',
    summary:
      'Built a multimodal assistant for image-centric workflows using LLaVA, SAM2, and GLIGEN with staged reasoning and evaluation utilities.',
    image: {
      src: 'https://placehold.co/960x720/101935/ffffff?text=PixelBot',
      alt: 'Placeholder hero image representing the PixelBot project.',
    },
    highlights: ['Secured 2nd place in the Smart India Hackathon qualifier.'],
  },
  {
    title: 'Line-Following Parrot MAMBO',
    tag: 'Embedded Autonomy',
    meta: 'MathWorks Minidrone Challenge · 2023',
    summary:
      'Engineered a vision pipeline and Stateflow planner in Simulink to guide the Parrot Mambo microdrone around dynamic track markers.',
    image: {
      src: 'https://placehold.co/960x720/111c3d/ffffff?text=Parrot+Mambo',
      alt: 'Placeholder hero image representing the Parrot Mambo autonomy project.',
    },
  },
  {
    title: 'Occlusion Masking – Avoidance Algorithm',
    tag: 'Independent Project',
    meta: 'March 2024',
    summary:
      'Developed a Python navigation toolkit for 300×300 occupancy grids that computes tangent arcs and masks occlusions to negotiate cluttered scenes.',
    image: {
      src: 'https://placehold.co/960x720/0c1a33/ffffff?text=Occlusion+Masking',
      alt: 'Placeholder hero image representing the occlusion masking avoidance project.',
    },
    highlights: [
      'Integrated tangent-arc computation with masking techniques for obstacle avoidance.',
      'Enabled circular movement with adjustable radii and efficient paths from a 90° start orientation.',
    ],
  },
];

const projectsGallery = document.querySelector('[data-js="projects-gallery"]');

if (projectsGallery) {
  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.style.setProperty('--animation-index', index.toString());
    card.setAttribute('tabindex', '0');

    const media = document.createElement('div');
    media.className = 'project-card__media';

    const img = document.createElement('img');
    img.src = project.image.src;
    img.alt = project.image.alt;
    img.loading = 'lazy';
    media.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'project-card__overlay';

    const overlayInner = document.createElement('div');
    overlayInner.className = 'project-card__overlay-inner';

    const header = document.createElement('div');
    header.className = 'project-card__header';

    const title = document.createElement('h3');
    title.className = 'project-card__title';
    title.textContent = project.title;
    header.appendChild(title);

    if (project.tag) {
      const tag = document.createElement('span');
      tag.className = 'project-card__tag';
      tag.textContent = project.tag;
      header.appendChild(tag);
    }

    const body = document.createElement('div');
    body.className = 'project-card__body';

    if (project.meta) {
      const meta = document.createElement('p');
      meta.className = 'project-card__meta';
      meta.textContent = project.meta;
      body.appendChild(meta);
    }

    const summary = document.createElement('p');
    summary.className = 'project-card__summary';
    summary.textContent = project.summary;
    body.appendChild(summary);

    if (Array.isArray(project.highlights) && project.highlights.length) {
      const list = document.createElement('ul');
      list.className = 'project-card__highlights';
      project.highlights.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      body.appendChild(list);
    }

    overlayInner.append(header, body);
    overlay.appendChild(overlayInner);
    card.append(media, overlay);
    projectsGallery.appendChild(card);
  });

  const projectCards = projectsGallery.querySelectorAll('.project-card');

  if ('IntersectionObserver' in window) {
    const projectObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    projectCards.forEach((card) => projectObserver.observe(card));
  } else {
    projectCards.forEach((card) => card.classList.add('is-visible'));
  }

  const deactivateAll = () => {
    projectCards.forEach((card) => card.classList.remove('is-active'));
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const isActivating = !card.classList.contains('is-active');
      deactivateAll();
      if (isActivating) {
        card.classList.add('is-active');
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const isActivating = !card.classList.contains('is-active');
        deactivateAll();
        if (isActivating) {
          card.classList.add('is-active');
        }
      } else if (event.key === 'Escape') {
        card.classList.remove('is-active');
        card.blur();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!projectsGallery.contains(event.target)) {
      deactivateAll();
    }
  });
}
