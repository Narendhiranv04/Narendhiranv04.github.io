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

const publicationGroups = [
  {
    title: 'In Preparation',
    description:
      'Finalising manuscripts that before upcoming submission deadlines.',
    milestone: 'Next submissions: IROS 2026 & RA-L Q4 2025.',
    items: [
      {
        title:
          'Contrastive Latent-Action Retrieval with In-Context Memory for Robotic Manipulation',
        authors: 'N. Vijayakumar, R. Li, Z. Wang*',
        venue: 'IROS · 2026 (target)',
        status: 'Manuscript drafting',
        links: [
          { label: 'arXiv (soon)', href: null },
          {
            label: 'Project Page',
            href: 'https://narendhiranv04.github.io/#projects',
          },
        ],
      },
      {
        title:
          'Contract-Validated Option Selection with MoE RL for Long-Horizon Manipulation',
        authors: 'N. Vijayakumar, P. Ojha, G. Varma, A. Thomas*',
        venue: 'RA-L · 2025 (target)',
        status: 'Experiments wrapping up',
        links: [
          { label: 'arXiv (soon)', href: null },
          {
            label: 'Project Page',
            href: 'https://narendhiranv04.github.io/#projects',
          },
        ],
      },
    ],
  },
  {
    title: 'Under Review',
    description: 'Peer-reviewed submissions currently in editorial pipelines.',
    milestone: 'Waiting for reviewer feedbacks',
    items: [
      {
        title:
          'Fuzzy Logic–GRU Framework for Real-Time Sit-to-Walk Joint Torque Estimation',
        authors: 'C. Perera, N. Vijayakumar, A. Agape*',
        venue: 'IEEE TNNLS · 2025 (under review)',
        status: 'Submitted',
        links: [
          { label: 'arXiv (soon)', href: null },
          {
            label: 'Project Page',
            href: 'https://narendhiranv04.github.io/#projects',
          },
        ],
      },
      {
        title:
          'AURASeg: Attention Guided Upsampling with Residual Boundary-Assistive Refinement',
        authors: 'N. Vijayakumar*, M. Sridevi',
        venue: 'Signal, Image and Video Processing · 2025 (under review)',
        status: 'Initial Review Cycle',
        links: [
          { label: 'arXiv (soon)', href: null },
          {
            label: 'Project Page',
            href: 'https://narendhiranv04.github.io/#projects',
          },
        ],
      },
      {
        title: 'Design and Validation of a Micro-UAV with Dynamic Route Planning',
        authors: 'N. Vijayakumar*, I. Ravikumar, R. Sundhar',
        venue: 'ICMRAE · 2025 (Accepted)',
        status: 'Camera-ready pending',
        links: [
          { label: 'arXiv (soon)', href: null },
          {
            label: 'Project Page',
            href: 'https://narendhiranv04.github.io/#projects',
          },
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

      listItem.append(meta, title, authors);

      if (Array.isArray(item.links) && item.links.length) {
        const actions = document.createElement('div');
        actions.className = 'publication-card__actions';

        item.links.forEach((link) => {
          let action;

          if (link.href) {
            action = document.createElement('a');
            action.href = link.href;
            action.target = '_blank';
            action.rel = 'noopener';
          } else {
            action = document.createElement('button');
            action.type = 'button';
            action.disabled = true;
            action.setAttribute('aria-disabled', 'true');
          }

          action.className = 'publication-card__action';
          action.textContent = link.label;
          actions.appendChild(action);
        });

        listItem.appendChild(actions);
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
    technologies: ['ROS 2', 'PX4 Autopilot', 'OpenCV', 'Raspberry Pi'],
    outcome:
      'Top-15 national finish for autonomous flight across endurance, payload drop, and navigation tasks.',
    story: {
      openLabel: 'Read the flight log',
      closeLabel: 'Hide flight log',
      body: `
        <div class="project-story">
          <p class="project-story__tag">Flight deck memo</p>
          <h4 class="project-story__title">From wind-tunnel scribbles to a self-reliant sortie</h4>
          <div class="project-story__grid">
            <div class="project-story__section">
              <h5>Ignition</h5>
              <p>It started with a blank PX4 stack and a mandate to survive gusty coastal winds. We carved the airframe around airflow sims, then staged every avionics line like it was a mission-critical checklist.</p>
            </div>
            <div class="project-story__section">
              <h5>Brains</h5>
              <p>A dual-loop architecture split fast attitude control on the Pixhawk from higher-level ROS 2 nodes. Vision-based navigation fused AprilTag relocalisation with optical flow to keep position estimates sane when GPS hiccupped.</p>
            </div>
            <div class="project-story__section">
              <h5>Moments</h5>
              <p>The wow moment was a sunset endurance test where the quad sliced through checkpoints autonomously, payload drop and all, while our safety interlocks quietly vetoed every out-of-envelope manoeuvre.</p>
            </div>
          </div>
          <p class="project-story__closing">Every safe landing was a systems engineering love letter.</p>
        </div>
      `,
    },
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
    technologies: ['Python', 'PyTorch','FastAPI'],
    outcome:
      'Secured 2nd place in the national qualifier while open-sourcing reusable evaluation utilities.',
    story: {
      openLabel: 'Open the build diary',
      closeLabel: 'Hide the build diary',
      body: `
        <div class="project-story">
          <p class="project-story__tag">Studio log</p>
          <h4 class="project-story__title">Designing a multimodal co-pilot that feels like a creative partner</h4>
          <div class="project-story__grid">
            <div class="project-story__section">
              <h5>North Star</h5>
              <p>PixelBot had to ground edits in the image, not hallucinate. We chained CLIP-based localisation with lightweight diffusion controls so every brush stroke stayed truthful.</p>
            </div>
            <div class="project-story__section">
              <h5>Stack</h5>
              <p>FastAPI orchestrated a PyTorch backend that juggled grounding, captioning, and mask-aware editing. A tiny feedback memory let PixelBot remember the last three user intents.</p>
            </div>
            <div class="project-story__section">
              <h5>Human Touch</h5>
              <p>We spent nights tuning copy and micro-interactions—glowing cursors, contextual tips, and a “show your work” panel so users saw why PixelBot suggested a move.</p>
            </div>
          </div>
          <p class="project-story__closing">AI feels magical when it makes the designer braver, not redundant.</p>
        </div>
      `,
    },
  },
  {
    title: 'Parrot Mambo Autonomy Challenge',
    focus: 'Embedded Autonomy · Controls Engineer',
    timeframe: 'MathWorks Minidrone Challenge · 2024',
    description:
      'Engineered a lightweight autonomy stack for the Parrot Mambo microdrone using MATLAB/Simulink for rapid iteration.',
    image: {
      src: 'mathworks.jpg',
      alt: 'Parrot Mambo drone on display at the MathWorks challenge',
    },
    technologies: ['MATLAB', 'Simulink', 'Stateflow'],
    outcome:
      'Achieved fully autonomous line-following with reliable gate traversal in final demos.',
    story: {
      openLabel: 'Peek into the control room',
      closeLabel: 'Close the control room',
      body: `
        <div class="project-story">
          <p class="project-story__tag">Lab note</p>
          <h4 class="project-story__title">Taming the Parrot Mambo with model-based wizardry</h4>
          <div class="project-story__grid">
            <div class="project-story__section">
              <h5>Blueprint</h5>
              <p>We modelled the quad in Simulink with parameter sweeps straight from on-board logs, then auto-generated code to keep every tweak flight-ready within minutes.</p>
            </div>
            <div class="project-story__section">
              <h5>Control</h5>
              <p>A Stateflow supervisor blended PID tracking with event-driven manoeuvres, letting the drone pivot around tight gates without overshooting.</p>
            </div>
            <div class="project-story__section">
              <h5>Debugging</h5>
              <p>We built a neon diagnostic HUD that streamed error cones and motor duty cycles live—our secret weapon for shaving milliseconds off lap times.</p>
            </div>
          </div>
          <p class="project-story__closing">Model-based design turned a tiny drone into a disciplined racer.</p>
        </div>
      `,
    },
  },
  {
    title: 'Occlusion-Aware Avoidance Toolkit',
    focus: 'Motion Planning',
    timeframe: 'March 2024',
    description:
      'Developed a Python toolkit for navigation on dense occupancy grids with occlusion-aware path reasoning.',
    image: {
      src: 'randomized_triangle_2.jpeg',
      alt: 'Occlusion-aware navigation heatmap visualization',
    },
    technologies: ['Python', 'NumPy', 'Matplotlib'],
    outcome:
      'Independent Assignment Project',
    story: {
      openLabel: 'Unpack the research notes',
      closeLabel: 'Hide the research notes',
      body: `
        <div class="project-story">
          <p class="project-story__tag">Notebook excerpt</p>
          <h4 class="project-story__title">Rewriting shortest paths when the map lies</h4>
          <div class="project-story__grid">
            <div class="project-story__section">
              <h5>Context</h5>
              <p>Classic A* ignores occlusions—it only sees inflated obstacles. I wanted planners to reason about what they cannot see yet.</p>
            </div>
            <div class="project-story__section">
              <h5>Core Idea</h5>
              <p>An uncertainty-aware frontier cost guessed the risk of hidden obstacles using local visibility cones and prior traversals, nudging the robot to scout smartly.</p>
            </div>
            <div class="project-story__section">
              <h5>Outcome</h5>
              <p>Stress tests on random mazes showed smoother trajectories and fewer oscillations than vanilla A* or D* Lite, especially when corridors collapsed mid-run.</p>
            </div>
          </div>
          <p class="project-story__closing">Path planners should be curious, not just cautious.</p>
        </div>
      `,
    },
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

    if (project.story) {
      const footnote = document.createElement('div');
      footnote.className = 'project-case__footnote';

      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'project-case__cta';
      const openLabel = project.story.openLabel || 'Read more';
      const closeLabel = project.story.closeLabel || 'Close';
      cta.setAttribute('aria-expanded', 'false');

      const ctaIcon = document.createElement('span');
      ctaIcon.className = 'project-case__cta-icon';
      ctaIcon.setAttribute('aria-hidden', 'true');
      ctaIcon.textContent = '✧';

      const ctaLabel = document.createElement('span');
      ctaLabel.className = 'project-case__cta-label';
      ctaLabel.textContent = openLabel;

      cta.append(ctaIcon, ctaLabel);

      const storyPanel = document.createElement('div');
      storyPanel.className = 'project-case__story';
      const storyId = `project-story-${index}`;
      storyPanel.id = storyId;
      storyPanel.setAttribute('aria-hidden', 'true');
      storyPanel.style.maxHeight = '0px';
      storyPanel.innerHTML = project.story.body;

      cta.setAttribute('aria-controls', storyId);

      footnote.append(cta, storyPanel);
      content.appendChild(footnote);

      const updateLabels = (expanded) => {
        ctaLabel.textContent = expanded ? closeLabel : openLabel;
      };

      const syncHeight = () => {
        if (!article.classList.contains('is-expanded')) return;
        storyPanel.style.maxHeight = `${storyPanel.scrollHeight}px`;
      };

      cta.addEventListener('click', () => {
        const isExpanded = article.classList.toggle('is-expanded');
        if (isExpanded) {
          storyPanel.setAttribute('aria-hidden', 'false');
          storyPanel.style.maxHeight = `${storyPanel.scrollHeight}px`;
          requestAnimationFrame(syncHeight);
          cta.setAttribute('aria-expanded', 'true');
          cta.classList.add('is-active');
          updateLabels(true);
        } else {
          storyPanel.style.maxHeight = `${storyPanel.scrollHeight}px`;
          storyPanel.offsetHeight; // force reflow for transition
          storyPanel.style.maxHeight = '0px';
          storyPanel.setAttribute('aria-hidden', 'true');
          cta.setAttribute('aria-expanded', 'false');
          cta.classList.remove('is-active');
          updateLabels(false);
        }
      });

      window.addEventListener('resize', syncHeight);
    }

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
