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
      'Built latent-action retrieval with InfoNCE tokenisers, DTW alignment, and in-context memory so Moto-VLA keys off intent.',
    image: {
      src: 'ntu.png',
      alt: 'NTU Singapore logo',
    },
    storyUrl: 'research/ntu-latent-action.html',
    primaryCta: 'Read more',
  },
  {
    title: 'Task & Motion Planning Intern',
    organization: 'IIIT, Hyderabad',
    timeframe: 'July 2025 – Present',
    summary:
      'Deployed contract-validated VLM planning with MoE-guided recovery skills so long-horizon tasks recover from failures.',
    image: {
      src: 'iiith.jpg',
      alt: 'IIIT Hyderabad logo',
    },
    storyUrl: 'research/iiith-contracts.html',
    primaryCta: 'Read more',
  },
  {
    title: 'Assistive Robotics Intern',
    organization: 'Monash University',
    timeframe: 'Jan 2025 – May 2025',
    summary:
      'Developed a lightweight GRU for real-time torque prediction in robotic exoskeletons with a fuzzy logic-based control system.',
    image: {
      src: 'monash.png',
      alt: 'Monash University logo',
    },
    storyUrl: 'research/monash-assistive.html',
    primaryCta: 'Read more',
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
    storyUrl: 'research/iitb-auraseg.html',
    primaryCta: 'Read more',
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
    content.dataset.side = index % 2 === 0 ? 'left' : 'right';

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

    const body = document.createElement('div');
    body.className = 'timeline-body';
    body.append(meta, heading, description);

    const links = Array.isArray(experience.links) ? experience.links : null;

    if (links && links.length) {
      const actions = document.createElement('div');
      actions.className = 'timeline-actions';

      links.forEach((link) => {
        const isInteractive = Boolean(link.href);
        const action = document.createElement(isInteractive ? 'a' : 'button');
        action.className = 'timeline-link';

        if (link.primary) {
          action.classList.add('timeline-link--primary');
        }

        if (isInteractive) {
          action.href = link.href;
          if (/^https?:\/\//.test(link.href)) {
            action.target = '_blank';
            action.rel = 'noopener noreferrer';
          }
          action.setAttribute('aria-label', `${experience.title} – ${link.label}`);
        } else {
          action.classList.add('timeline-link--disabled');
          action.setAttribute('aria-disabled', 'true');
          action.type = 'button';
          action.disabled = true;
          action.setAttribute('title', link.title || `${link.label} coming soon`);
        }

        if (link.icon) {
          const icon = document.createElement('span');
          icon.className = 'timeline-link__icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.textContent = link.icon;
          action.appendChild(icon);
        }

        const label = document.createElement('span');
        label.className = 'timeline-link__label';
        label.textContent = link.label;
        action.appendChild(label);

        actions.appendChild(action);
      });

      body.appendChild(actions);
    } else if (experience.storyUrl) {
      const actions = document.createElement('div');
      actions.className = 'timeline-actions';

      const primaryLink = document.createElement('a');
      primaryLink.className = 'timeline-link timeline-link--primary';
      primaryLink.href = experience.storyUrl;
      primaryLink.textContent = experience.primaryCta || 'Read the full story';
      primaryLink.setAttribute('aria-label', `${experience.title} full story`);

      actions.appendChild(primaryLink);
      body.appendChild(actions);
    }

    content.append(imageWrapper, body);

    item.append(content);
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

  const revealCards = researchTimeline.querySelectorAll('.timeline-content.has-reveal');
  revealCards.forEach((card) => card.classList.remove('has-reveal'));
}

// --- PUBLICATIONS ---
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
            href: 'research/ntu-latent-action.html',
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
            href: 'research/iiith-contracts.html',
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
          'AURASeg: Attention Guided Upsampling with Residual Boundary-Assistive Refinement',
        authors: 'N. Vijayakumar*, M. Sridevi',
        venue: 'Signal, Image and Video Processing · 2025 (under review)',
        status: 'Initial Review Cycle',
        links: [
          { label: 'arXiv (soon)', href: null },
          {
            label: 'Project Page',
            href: 'research/iitb-auraseg.html',
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
            href: '#project-autonomous-uas',
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

        const linkIcons = {
          'arxiv': '📄',
          'arxiv (soon)': '📄',
          'project page': '🌐',
        };

        item.links.forEach((link) => {
          let action;

          if (link.href) {
            action = document.createElement('a');
            action.href = link.href;
            if (/^https?:\/\//.test(link.href)) {
              action.target = '_blank';
              action.rel = 'noopener noreferrer';
            }
          } else {
            action = document.createElement('button');
            action.type = 'button';
            action.disabled = true;
            action.setAttribute('aria-disabled', 'true');
          }

          action.className = 'publication-card__action';

          const labelKey = link.label.trim().toLowerCase();
          const iconGlyph = linkIcons[labelKey];

          if (iconGlyph) {
            const icon = document.createElement('span');
            icon.className = 'publication-card__action-icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = iconGlyph;

            const text = document.createElement('span');
            text.className = 'publication-card__action-text';
            text.textContent = link.label;

            action.append(icon, text);
          } else {
            action.textContent = link.label;
          }

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

// --- COMPETITION PROJECTS ---
const flagshipProjects = [
  {
    title: 'Autonomous UAS',
    slug: 'project-autonomous-uas',
    focus: 'Aerial Robotics · Systems Lead',
    timeframe: 'SAE AeroTHON · 2024',
    description:
      'Led the systems team delivering a competition-ready quadcopter with onboard vision and dynamic replanning.',
    image: {
      src: 'uav.jpg',
      alt: 'Autonomous quadcopter at the SAE AeroTHON',
    },
    gallery: [
      {
        src: 'assets/images/extracurriculars/unnamed.jpg',
        alt: 'Autonomous UAS systems team preparing the quadcopter before flight',
      },
      {
        src: 'assets/images/extracurriculars/aerothon.jpg',
        alt: 'Autonomous quadcopter ready on the launch pad at SAE AeroTHON',
      },
    ],
    technologies: ['ROS 2', 'uXRCE-DDS', 'PX4', 'Raspberry Pi 5', 'OpenCV', 'QGroundControl'],
    outcome:
      'Top-15 national finish across endurance, payload-drop, and navigation.',
    codeUrl:
      'https://drive.google.com/drive/folders/1kKaMLSFk3kYxo7mgzinFKQgGFMAoyrcK?usp=sharing',
    story: {
      openLabel: 'Read more',
      closeLabel: 'Less',
      body: `
        <div class="project-story">
          <div class="project-story__window">
            <p class="project-story__tag">IMPLEMENTATION DETAILS</p>
            <h4 class="project-story__title">Onboard stack</h4>
            <div class="project-story__body">
              <p>Raspberry Pi 5 runs vision and the route planner. SSD-MobileNet-v2 was converted to NCNN, delivering ~20&nbsp;ms per frame. ROS 2 over uXRCE-DDS links the Pi to PX4 on a Pixhawk 6C via a 921&nbsp;kbit/s serial connection; a micro-agent publishes <code>/roi_array</code>, and PX4’s XRCE-DDS client maps it to the uORB <code>vehicle_trajectory_waypoint</code> for low-latency updates. Telemetry (<code>vehicle_gps_position</code>, <code>battery_status</code>) streams to QGroundControl for live monitoring.</p>
              <p>SWEEP coverage alternates with SERVICE nearest-neighbour updates, inserting fresh ROIs immediately so the path reshapes in flight. Safety layers include GPS geofence → return-to-home, RF-loss → return-to-home after ~10&nbsp;s, and battery thresholds that warn at 20% and auto-land at 15%.</p>
            </div>
          </div>
        </div>
      `,
    },
  },
  {
    title: 'PixelBot Multimodal Assistant',
    slug: 'project-pixelbot-multimodal-assistant',
    focus: 'Multimodal AI · Team Lead',
    timeframe: 'Smart India Hackathon · 2024',
    description:
      'Developed a multimodal conversational image recognition chatbot for segmentation, inpainting, and generation',
    image: {
      src: 'pixelbot.jpg',
      alt: 'PixelBot multimodal assistant interface mockup',
    },
    gallery: [
      {
        src: 'assets/images/extracurriculars/sih_chatbot.png',
        alt: 'PixelBot multimodal assistant interface answering a user prompt',
      },
      {
        src: 'assets/images/extracurriculars/sih_interface.png',
        alt: 'PixelBot chatbot workflow showing multimodal editing tools',
      },
    ],
    technologies: ['Python', 'PyTorch', 'React', 'TypeScript'],
    outcome:
      'Secured 2nd place in the national qualifier while open-sourcing reusable evaluation utilities.',
    codeUrl:
      'https://github.com/Narendhiranv04/Multimodal-Conversational-Image-Recognition-Chatbot.git',
    story: {
      openLabel: 'Read more',
      closeLabel: 'Less',
      body: `
        <div class="project-story">
          <div class="project-story__window">
            <p class="project-story__tag">IMPLEMENTATION DETAILS</p>
            <h4 class="project-story__title">Multimodal pipeline for conversational image editing</h4>
            <div class="project-story__body">
              <p>The chatbot fuses LLaVA Interactive, SAM2, and Stable Diffusion/GLIGEN into a single multimodal pipeline capable of describe–segment–inpaint–generate interactions through dialogue.</p>
              <p>An LSTM memory buffer maintains conversational continuity, enabling keyword refinement and contextual recall across turns.</p>
              <p>Frontend runs on React + TypeScript + Tailwind, while a Flask–MongoDB backend orchestrates PyTorch models through REST APIs.</p>
              <p>Image queries are parsed using RAKE/YAKE/TextRank for iterative keyword extraction, feeding downstream visual modules for region-based responses.</p>
            </div>
          </div>
        </div>
      `,
    },
  },
  {
    title: 'Parrot Mambo Autonomy Challenge',
    slug: 'project-parrot-mambo-autonomy',
    focus: 'Embedded Autonomy · Controls Engineer',
    timeframe: 'MathWorks Minidrone Challenge · 2024',
    description:
      'a lightweight autonomy stack for the Parrot Mambo minidrone using MATLAB/Simulink',
    image: {
      src: 'mathworks.jpg',
      alt: 'Parrot Mambo drone on display at the MathWorks challenge',
    },
    gallery: [
      {
        src: 'assets/images/extracurriculars/mathworks_real.png',
        alt: 'MathWorks Minidrone competition arena with the Parrot Mambo on track',
      },
      {
        src: 'assets/images/extracurriculars/mathworks_simulink.png',
        alt: 'Simulink environment visualising the Parrot Mambo autonomy stack',
      },
    ],
    technologies: ['MATLAB', 'Simulink', 'Stateflow'],
    outcome:
      'Achieved fully autonomous line-following with reliable gate traversal in final demos.',
    codeUrl:
      'https://drive.google.com/drive/folders/1aYSyzn0AptxgAfXk2vBQw_lc9TUsJ8UO?usp=sharing',
    story: {
      openLabel: 'Read more',
      closeLabel: 'Less',
      body: `
        <div class="project-story">
          <div class="project-story__window">
            <p class="project-story__tag">IMPLEMENTATION DETAILS</p>
            <h4 class="project-story__title">Framework details</h4>
            <div class="project-story__body">
              <p>A custom image-processing pipeline performs path detection via channel filtering, binarization, and morphological erosion, extracting clean contours for trajectory estimation.</p>
              <p>A Stateflow path-planner in Simulink drives cascaded PID loops for roll, pitch, and yaw, enabling Virtual Target Point (VTP) tracking and marker-based navigation on the Parrot Mambo micro-drone.</p>
              <p>The system achieves stable line following and autonomous course correction under varying lighting and path curvature.</p>
            </div>
          </div>
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

    if (project.slug) {
      article.id = project.slug;
    }

    const galleryFrames = [];

    if (project.image?.src) {
      const media = document.createElement('figure');
      media.className = 'project-case__media';

      const mediaGrid = document.createElement('div');
      mediaGrid.className = 'project-case__media-grid';

      const mainFrame = document.createElement('div');
      mainFrame.className = 'project-case__media-main';

      const img = document.createElement('img');
      img.src = project.image.src;
      img.alt = project.image.alt || `${project.title} illustration`;
      img.loading = 'lazy';
      img.decoding = 'async';

      mainFrame.appendChild(img);
      mediaGrid.appendChild(mainFrame);

      if (Array.isArray(project.gallery)) {
        project.gallery.slice(0, 2).forEach((mediaItem, galleryIdx) => {
          if (!mediaItem?.src) return;
          const secondaryFrame = document.createElement('div');
          secondaryFrame.className = `project-case__media-secondary project-case__media-secondary--${galleryIdx + 1}`;
          secondaryFrame.hidden = true;
          secondaryFrame.setAttribute('aria-hidden', 'true');
          secondaryFrame.style.setProperty('--media-reveal-delay', `${(galleryIdx + 1) * 0.1}s`);

          const secondaryImg = document.createElement('img');
          secondaryImg.src = mediaItem.src;
          secondaryImg.alt =
            mediaItem.alt || `${project.title} supporting visual ${galleryIdx + 1}`;
          secondaryImg.loading = 'lazy';
          secondaryImg.decoding = 'async';

          secondaryFrame.appendChild(secondaryImg);
          mediaGrid.appendChild(secondaryFrame);
          galleryFrames.push(secondaryFrame);
        });
      }

      media.appendChild(mediaGrid);
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

      const actions = document.createElement('div');
      actions.className = 'project-case__actions';

      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'project-case__cta';
      const openLabel = project.story.openLabel || 'Read more';
      const closeLabel = project.story.closeLabel || 'Less';
      cta.setAttribute('aria-expanded', 'false');

      const ctaIcon = document.createElement('span');
      ctaIcon.className = 'project-case__cta-icon';
      ctaIcon.setAttribute('aria-hidden', 'true');
      ctaIcon.textContent = '✧';

      const ctaLabel = document.createElement('span');
      ctaLabel.className = 'project-case__cta-label';
      ctaLabel.textContent = openLabel;

      cta.append(ctaIcon, ctaLabel);

      actions.appendChild(cta);

      if (project.codeUrl) {
        const codeLink = document.createElement('a');
        codeLink.className = 'project-case__cta project-case__cta--code';
        codeLink.href = project.codeUrl;
        codeLink.target = '_blank';
        codeLink.rel = 'noopener noreferrer';
        codeLink.setAttribute(
          'aria-label',
          `${project.title} code and artefacts (opens in a new tab)`
        );

        const codeIcon = document.createElement('span');
        codeIcon.className = 'project-case__cta-icon';
        codeIcon.setAttribute('aria-hidden', 'true');
        codeIcon.textContent = '💻';

        const codeLabel = document.createElement('span');
        codeLabel.className = 'project-case__cta-label';
        codeLabel.textContent = 'Code';

        codeLink.append(codeIcon, codeLabel);
        actions.appendChild(codeLink);
      }

      const storyPanel = document.createElement('div');
      storyPanel.className = 'project-case__story';
      const storyId = `project-story-${index}`;
      storyPanel.id = storyId;
      storyPanel.setAttribute('aria-hidden', 'true');
      storyPanel.style.maxHeight = '0px';
      storyPanel.innerHTML = project.story.body;

      cta.setAttribute('aria-controls', storyId);

      footnote.append(actions, storyPanel);
      content.appendChild(footnote);

      const updateLabels = (expanded) => {
        ctaLabel.textContent = expanded ? closeLabel : openLabel;
      };

      const toggleGallery = (expanded) => {
        galleryFrames.forEach((frame) => {
          frame.hidden = !expanded;
          frame.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        });
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
          toggleGallery(true);
        } else {
          storyPanel.style.maxHeight = `${storyPanel.scrollHeight}px`;
          storyPanel.offsetHeight; // force reflow for transition
          storyPanel.style.maxHeight = '0px';
          storyPanel.setAttribute('aria-hidden', 'true');
          cta.setAttribute('aria-expanded', 'false');
          cta.classList.remove('is-active');
          updateLabels(false);
          toggleGallery(false);
        }
      });

      toggleGallery(false);
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
