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
      src: 'ntu.png',
      alt: 'NTU Singapore logo',
    },
  },
  {
    title: 'Task & Motion Planning Intern',
    organization: 'IIIT, Hyderabad',
    timeframe: 'July 2025 – Present',
    summary:
      'Designed a contract-validated visual HRL framework for long-horizon manipulation tasks using MoE and SmolVLA controllers.',
    image: {
      src: 'iiith.jpg',
      alt: 'IIIT Hyderabad logo',
    },
  },
  {
    title: 'Assistive Robotics Intern',
    organization: 'Monash University',
    timeframe: 'Jan 2025 – May 2025',
    summary:
      'Developed a lightweight GRU for real-time torque prediction in robotic exoskeletons with a fuzzy logic-based control system.',
    image: {
      src: 'monash.svg',
      alt: 'Monash University logo',
    },
  },
  {
    title: 'Robotic Perception Intern',
    organization: 'IIT Bombay',
    timeframe: 'Jun 2024 – Feb 2025',
    summary:
      'Developed AURASeg, a model for drivable area segmentation, outperforming YOLOP in mIoU and F1-score.',
    image: {
      src: 'iitb.png',
      alt: 'IIT Bombay logo',
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

// --- PUBLICATIONS ---
const publicationGroups = [
  {
    title: 'In Preparation',
    description:
      'Finalising manuscripts that extend our embodied AI agenda before upcoming submission deadlines.',
    milestone: 'Next submissions: IROS 2026 & RA-L Q4 2025.',
    items: [
      {
        title:
          'Contrastive Latent-Action Retrieval with In-Context Memory for Robotic Manipulation',
        authors: 'N. Vijayakumar, R. Li, Z. Wang*',
        venue: 'IROS · 2026 (target)',
        status: 'Manuscript drafting',
        summary:
          'Retrieval-augmented visual-language-action policy that composes latent actions using on-the-fly memory tokens for long-horizon manipulation.',
        highlights: [
          'Contrastive retrieval bank distilled from teleoperation rollouts.',
          'Memory prompting keeps novel task success stable with minimal finetuning.',
        ],
      },
      {
        title:
          'Contract-Validated Option Selection with MoE RL for Long-Horizon Manipulation',
        authors: 'N. Vijayakumar, P. Ojha, G. Varma, A. Thomas*',
        venue: 'RA-L · 2025 (target)',
        status: 'Experiments wrapping up',
        summary:
          'Mixture-of-experts reinforcement learning stack that enforces contract-based guarantees when sequencing manipulation skills.',
        highlights: [
          'Safety contracts for reachability and force compliance baked into option selection.',
          'Bridges sim-to-real with curriculum resets and human-in-the-loop validation.',
        ],
      },
    ],
  },
  {
    title: 'Under Review',
    description: 'Peer-reviewed submissions currently in editorial pipelines.',
    milestone: 'Actively responding to reviewer feedback across three venues.',
    items: [
      {
        title:
          'Fuzzy Logic–GRU Framework for Real-Time Sit-to-Walk Joint Torque Estimation',
        authors: 'C. Perera, N. Vijayakumar, A. Agape*',
        venue: 'IEEE TNNLS · 2025 (under review)',
        status: 'Initial review cycle',
        summary:
          'Lightweight hybrid estimator for exoskeleton torque prediction that blends fuzzy rules with recurrent dynamics for comfort-critical assistive walking.',
        highlights: [
          'Adaptive membership functions tuned for sit-to-walk transitions.',
          'Embedded deployment on STM32 with <2 ms inference latency.',
        ],
      },
      {
        title:
          'AURASeg: Attention Guided Upsampling with Residual Boundary-Assistive Refinement',
        authors: 'N. Vijayakumar*, M. Sridevi',
        venue: 'Signal, Image and Video Processing · 2025 (under review)',
        status: 'Awaiting reviewer scores',
        summary:
          'Semantic segmentation pipeline for drivable area detection that sharpens occlusion boundaries with residual refinement.',
        highlights: [
          'Dual-branch attention for balancing texture cues and layout context.',
          'Residual boundary assist improves edge IoU on nuScenes val split.',
        ],
      },
      {
        title: 'Design and Validation of a Micro-UAV with Dynamic Route Planning',
        authors: 'N. Vijayakumar*, I. Ravikumar, R. Sundhar',
        venue: 'ICMRAE · 2025 (under review)',
        status: 'Camera-ready pending',
        summary:
          'Micro air vehicle platform with adaptive waypoint planning and robust failsafes for indoor autonomy demos.',
        highlights: [
          'On-board route planner adapts to moving obstacles in 3D grids.',
          'Flight-tested guidance stack with redundant telemetry and watchdogs.',
        ],
      },
    ],
  },
];

const publicationContainer = document.querySelector('[data-js="publication-groups"]');

if (publicationContainer) {
  publicationGroups.forEach((group, index) => {
    const wrapper = document.createElement('article');
    wrapper.className = 'publication-group';
    wrapper.style.setProperty('--animation-index', index.toString());

    const header = document.createElement('header');
    header.className = 'publication-group__header';

    const badge = document.createElement('span');
    badge.className = 'publication-group__badge';
    badge.textContent = group.title;

    const description = document.createElement('p');
    description.className = 'publication-group__description';
    description.textContent = group.description;

    header.append(badge, description);

    if (group.milestone) {
      const milestone = document.createElement('p');
      milestone.className = 'publication-group__milestone';
      milestone.textContent = group.milestone;
      header.appendChild(milestone);
    }

    const list = document.createElement('ul');
    list.className = 'publication-list';

    group.items.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'publication-card';

      const meta = document.createElement('div');
      meta.className = 'publication-card__meta';

      const venue = document.createElement('span');
      venue.className = 'publication-card__venue';
      venue.textContent = item.venue;

      const status = document.createElement('span');
      status.className = 'publication-card__status';
      status.textContent = item.status;

      meta.append(venue, status);

      const title = document.createElement('h3');
      title.className = 'publication-card__title';
      title.textContent = item.title;

      const authors = document.createElement('p');
      authors.className = 'publication-card__authors';
      authors.textContent = item.authors;

      const summary = document.createElement('p');
      summary.className = 'publication-card__summary';
      summary.textContent = item.summary;

      listItem.append(meta, title, authors, summary);

      if (Array.isArray(item.highlights) && item.highlights.length) {
        const highlights = document.createElement('ul');
        highlights.className = 'publication-card__highlights';

        item.highlights.forEach((highlight) => {
          const highlightItem = document.createElement('li');
          highlightItem.textContent = highlight;
          highlights.appendChild(highlightItem);
        });

        listItem.appendChild(highlights);
      }

      list.appendChild(listItem);
    });

    wrapper.append(header, list);
    publicationContainer.appendChild(wrapper);
  });

  const publicationGroupsEls = publicationContainer.querySelectorAll('.publication-group');

  if ('IntersectionObserver' in window) {
    const publicationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    publicationGroupsEls.forEach((group) => publicationObserver.observe(group));
  } else {
    publicationGroupsEls.forEach((group) => group.classList.add('is-visible'));
  }
}

// --- FLAGSHIP PROJECTS ---
const flagshipProjects = [
  {
    title: 'Autonomous UAS',
    focus: 'Aerial Robotics · Systems Lead',
    timeframe: 'SAE AeroTHON · 2024',
    description:
      'Led the systems team delivering a competition-ready quadcopter with full autonomy stack, resilient perception, and safety interlocks.',
    image: {
      src: 'uav.jpg',
      alt: 'Autonomous quadcopter at the SAE AeroTHON',
    },
    technologies: ['ROS 2', 'PX4 Autopilot', 'OpenCV', 'NVIDIA Jetson'],
    outcome:
      'Top-15 national finish with sustained autonomous flight across endurance, payload drop, and navigation tasks.',
  },
  {
    title: 'PixelBot Multimodal Assistant',
    focus: 'Multimodal AI · Team Lead',
    timeframe: 'Smart India Hackathon · 2024',
    description:
      'Built a co-pilot for image-centric workflows that blends grounded visual question answering with controllable generative edits.',
    image: {
      src: 'pixelbot.jpg',
      alt: 'PixelBot multimodal assistant interface mockup',
    },
    technologies: ['Python', 'LLaVA', 'SAM2', 'FastAPI', 'Redis'],
    outcome:
      'Secured 2nd place in the national qualifier while open-sourcing reusable evaluation utilities.',
  },
  {
    title: 'Parrot Mambo Autonomy Challenge',
    focus: 'Embedded Autonomy · Controls Engineer',
    timeframe: 'MathWorks Minidrone Challenge · 2023',
    description:
      'Engineered a lightweight autonomy stack for the Parrot Mambo microdrone using MATLAB/Simulink for rapid iteration.',
    image: {
      src: 'mathworks.jpg',
      alt: 'Parrot Mambo drone on display at the MathWorks challenge',
    },
    technologies: ['MATLAB', 'Simulink', 'Stateflow', 'Embedded Coder'],
    outcome:
      'Achieved fully autonomous line-following with reliable gate traversal in final demos.',
  },
  {
    title: 'Occlusion-Aware Avoidance Toolkit',
    focus: 'Independent Research · Motion Planning',
    timeframe: 'March 2024',
    description:
      'Developed a Python toolkit for navigation on dense occupancy grids with occlusion-aware path reasoning.',
    image: {
      src: 'randomized_triangle_2.jpeg',
      alt: 'Occlusion-aware navigation heatmap visualization',
    },
    technologies: ['Python', 'NumPy', 'Shapely', 'Matplotlib'],
    outcome:
      'Adopted in internal autonomy experiments for rapid what-if analysis of navigation policies.',
  },
];

const projectShowcase = document.querySelector('[data-js="project-showcase"]');

if (projectShowcase) {
  flagshipProjects.forEach((project, index) => {
    const article = document.createElement('article');
    article.className = 'project-case';
    article.style.setProperty('--animation-index', index.toString());

    if (project.image?.src) {
      const media = document.createElement('figure');
      media.className = 'project-case__media';

      const img = document.createElement('img');
      img.src = project.image.src;
      img.alt = project.image.alt || `${project.title} illustration`;

      media.appendChild(img);
      article.appendChild(media);
    }

    const summary = document.createElement('div');
    summary.className = 'project-case__summary';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'project-case__eyebrow';
    eyebrow.textContent = `${project.focus}`;

    const title = document.createElement('h3');
    title.className = 'project-case__title';
    title.textContent = project.title;

    const description = document.createElement('p');
    description.className = 'project-case__description';
    description.textContent = project.description;

    summary.append(eyebrow, title, description);

    const details = document.createElement('div');
    details.className = 'project-case__details';

    const timelineBlock = document.createElement('div');
    timelineBlock.className = 'project-case__meta-block';

    const timelineLabel = document.createElement('span');
    timelineLabel.className = 'project-case__meta-label';
    timelineLabel.textContent = 'Stage';

    const timelineValue = document.createElement('span');
    timelineValue.className = 'project-case__meta-value';
    timelineValue.textContent = project.timeframe;

    timelineBlock.append(timelineLabel, timelineValue);
    details.appendChild(timelineBlock);

    if (project.technologies && project.technologies.length) {
      const techBlock = document.createElement('div');
      techBlock.className = 'project-case__meta-block';

      const techLabel = document.createElement('span');
      techLabel.className = 'project-case__meta-label';
      techLabel.textContent = 'Stack';

      const techList = document.createElement('ul');
      techList.className = 'project-case__tech-list';

      project.technologies.forEach((tech) => {
        const techItem = document.createElement('li');
        techItem.textContent = tech;
        techList.appendChild(techItem);
      });

      techBlock.append(techLabel, techList);
      details.appendChild(techBlock);
    }

    if (project.outcome) {
      const outcomeBlock = document.createElement('div');
      outcomeBlock.className = 'project-case__meta-block project-case__meta-block--accent';

      const outcomeLabel = document.createElement('span');
      outcomeLabel.className = 'project-case__meta-label';
      outcomeLabel.textContent = 'Outcome';

      const outcomeValue = document.createElement('span');
      outcomeValue.className = 'project-case__meta-value';
      outcomeValue.textContent = project.outcome;

      outcomeBlock.append(outcomeLabel, outcomeValue);
      details.appendChild(outcomeBlock);
    }

    const content = document.createElement('div');
    content.className = 'project-case__content';
    content.append(summary, details);

    article.appendChild(content);
    projectShowcase.appendChild(article);
  });

  const projectCases = projectShowcase.querySelectorAll('.project-case');

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
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    projectCases.forEach((card) => projectObserver.observe(card));
  } else {
    projectCases.forEach((card) => card.classList.add('is-visible'));
  }
}
