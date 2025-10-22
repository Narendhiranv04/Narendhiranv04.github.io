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
    spotlight: `<button class="timeline-reveal__close" type="button" aria-label="Close"></button>
<div class="timeline-reveal__inner" tabindex="0">
  <div class="timeline-reveal__narrative">
<strong>Spark.</strong> I walked into this thinking robot manipulation was kind of “solved” and “saturated”. How naive of me. Then I found VLAs and realized how wrong that was. Got me intrigued about generalist policies and “Embodied AI” – sounded way too interesting for me to ignore. As I read randomly through a lot of papers, I realized the space is exciting and chaotic at the same time–lots of big demos, but also lots of cases where the robot looks at a scene, finds something that looks similar, and still doesn’t know what to do. That pushed me to a simple question: instead of retrieving by appearance, can we retrieve by robot action instead?<br/>
<strong>Idea.</strong> The core idea is to represent short chunks of motion as compact “latent action” snippets—little summaries of intent and phase like “approach,” “close,” “lift,” rather than just pixels. I started by training a contrastive model (InfoNCE) to learn these embeddings from demonstrations, so segments that do the same thing end up close together, even if they look different. From there, I built a small retrieval system: slice trajectories into sub-trajectories, align them with DTW so timing lines up, index them with FAISS, and then score neighbors with cosine similarity. The point is to fetch the right action examples for the current moment, not just the most similar frame.<br/>
<strong>First look.</strong> At first, this worked—but only a little. Latent-action retrieval beat plain image retrieval in a few rollouts (better contact timing, fewer failures), but the gains were thin. Two problems popped out. One: my “positives” were too loose. Clips that looked similar weren’t always in the same phase. Tightening positives to phase-aligned windows and mining harder negatives made the embedding space sharper. Two: I was teaching the model with latent actions during training but asking it to rely on images at test time. That mismatch was the bigger issue.<br/>
<strong>Closing the gap.</strong> To fix it, I added an in-context memory at inference. For each step, I retrieve the top-K latent-action snippets and hand them to the policy as simple, structured context—“here are a few examples of what to do now.” The policy can then attend to those action cues while deciding the next move. That change felt small on paper, but it made the difference: the policy actually uses action structure at test time, not just during training.<br/>
<strong>Annoying struggles.</strong> There was a fair amount of engineering glue to make this stable. I standardized everything to a clean [B, T, D] shape contract, added checks to avoid the usual time-dim confusion, chunked FAISS queries to keep memory in check, cached neighbors between steps, and moved heavy paths to mixed precision. None of that is glamorous, but it turned “sometimes works” into “runs reliably enough to iterate” and actually publishable, and not just showcasing a few good rollouts.<br/>
<strong>Why it matters.</strong> Where this fits in the bigger VLA picture: a lot of current systems blur appearance with intent. They can find a scene that looks right and still miss the moment to make contact or the tempo of a motion. By retrieving and conditioning on actions, the policy gets a lightweight prior about what should happen next. It doesn’t solve everything (long-horizon chaining is still tricky, and sim-to-real will always be the real test), but it’s a clean way to push beyond “it looks similar, so try this.”<br/>
<strong>Status.</strong> Right now I have three pieces wired together: a latent-action tokenizer (trained with InfoNCE), a FAISS index over DTW-aligned sub-trajectories, and an in-context cache that hands the policy a few retrieved action snippets at test time. When it helps, it’s for very specific reasons: repeated sub-motions line up better, and the policy stops second-guessing short, well-defined phases. When it doesn’t help, it’s also clear why: cluttered scenes or lighting shifts pull the wrong neighbors, and a bad retrieval can nudge the policy off course. There’s a small latency tax from retrieval, but it stays reasonable if I keep K tiny and cache across steps.<br/>
<strong>Next up.</strong> What I still need to nail down are the boring but important choices: the window length for tokenization, how much DTW slack is healthy, which distance works best beyond plain cosine, and how many examples (K) actually add signal before the context turns noisy. After that, I’ll try it on xArm manipulator to find the failure modes I can’t see in sim. A lot of exciting stuff is yet to be done!<br/>
<br/>
If I had to sum it up in one line: Isn’t the real goal to stop matching by how things look and instead retrieve, and condition on what to do, so the robot learns intent rather than just images?
  </div>
</div>`,
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
    spotlight: `
      <button class="timeline-reveal__close" type="button" aria-label="Close IIITH research spotlight"></button>
      <div class="timeline-reveal__inner">
        <p class="timeline-reveal__tag">Hierarchical Policies · Reliability</p>
        <h4 class="timeline-reveal__title">IIIT Hyderabad · Task & Motion Planning</h4>
        <div class="timeline-reveal__section">
          <h5>Why Contracts</h5>
          <p>
            Long-horizon manipulation breaks when sub-policies go rogue, so I wrapped every option in temporal logic style
            contracts. The controller must prove pre- and post-conditions before it ever touches the arm.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Stack</h5>
          <p>
            A visual encoder distils SmolVLA features, a Mixture-of-Experts actor selects options, and a symbolic monitor rejects
            bad choices. When the planner hesitates, a low-latency MPC fallback steps in.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Breakthrough</h5>
          <p>
            A “contract buffer” that carries risk scores between stages gave me a safety margin without freezing exploration. It
            keeps high-level plans adventurous but still checkable in real time.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>System View</h5>
          <p>
            Sim traces stream into an orbit of dashboards—trajectory slack, LTL violations, MoE gating entropy—so I can spot the
            second an option starts hallucinating.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Now</h5>
          <p>
            We are mid-way through cluttered-shelf benchmarks, verifying that contract learning still holds once perception noise
            and occlusions pile in.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Next</h5>
          <p>
            Hybrid rollouts with a physical Franka arm and a reset-free tabletop scene to validate whether the monitor can keep
            up at 20 Hz without fraying latency.
          </p>
        </div>
        <p class="timeline-reveal__closing">Reliability is the feature—not the afterthought.</p>
      </div>
    `,
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
    spotlight: `
      <button class="timeline-reveal__close" type="button" aria-label="Close Monash research spotlight"></button>
      <div class="timeline-reveal__inner">
        <p class="timeline-reveal__tag">Human-in-the-Loop · Assistive Robotics</p>
        <h4 class="timeline-reveal__title">Monash University · Assistive Robotics Intern</h4>
        <div class="timeline-reveal__section">
          <h5>Challenge</h5>
          <p>
            Sit-to-walk transitions punish latency. Our exoskeleton needed torque predictions inside 20 ms or the wearer felt the
            lag as a drag.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Approach</h5>
          <p>
            I built a compact GRU with feature-pruned IMU and EMG signals, then wrapped it in a fuzzy supervisor that throttled
            assistance based on gait phase confidence.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Iterating</h5>
          <p>
            The magic moment was distilling the model to 68k parameters without losing fidelity. Quantisation plus tensor core
            inference made real-time possible on an embedded Jetson.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>What We Learned</h5>
          <p>
            The fuzzy layer smoothed out spurious spikes, especially during imperfect foot contact. We dropped peak torque error
            by 18% and users stopped noticing the controller catching up.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Reflection</h5>
          <p>
            Assistive robotics is equal parts empathy and engineering—every watt delivered must feel invisible.
          </p>
        </div>
        <p class="timeline-reveal__closing">Lightweight models can still feel heavy—unless you design for the human.</p>
      </div>
    `,
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
    spotlight: `
      <button class="timeline-reveal__close" type="button" aria-label="Close IIT Bombay research spotlight"></button>
      <div class="timeline-reveal__inner">
        <p class="timeline-reveal__tag">Perception · Urban Autonomy</p>
        <h4 class="timeline-reveal__title">IIT Bombay · Robotic Perception Intern</h4>
        <div class="timeline-reveal__section">
          <h5>Problem Space</h5>
          <p>
            Dense Indian roads confuse standard drivable-area segmenters. Reflections, puddles, and stray tar patches all look
            “road enough” to cause disasters.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Solution</h5>
          <p>
            I designed AURASeg—Attention-guided Upsampling with Residual boundary refinements—to trace both texture and geometry.
            A tiny auxiliary edge detector feeds into the decoder so curbs stay crisp.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Moments</h5>
          <p>
            When we beat YOLOP on mIoU and F1 we celebrated, but the real win was a wet-road night sequence where AURASeg kept the
            drivable ribbon tight instead of drifting into headlights.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Deployment</h5>
          <p>
            We pruned and quantised the network for Jetson Xavier, then wrote a ROS 2 node that streams segmentation masks with a
            12 ms budget.
          </p>
        </div>
        <div class="timeline-reveal__section">
          <h5>Outlook</h5>
          <p>
            Next iteration pushes for domain-adaptive finetuning so fog, dust, and rain all feel native—not rare edge cases.
          </p>
        </div>
        <p class="timeline-reveal__closing">Robust perception is the quiet confidence behind autonomous navigation.</p>
      </div>
    `,
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

    content.append(imageWrapper, body);

    if (experience.spotlight) {
      content.classList.add('has-reveal');
      content.setAttribute('tabindex', '0');
      content.setAttribute('role', 'button');
      content.setAttribute('aria-expanded', 'false');
      content.setAttribute('aria-label', `${experience.title} deep dive`);

      const glow = document.createElement('span');
      glow.className = 'timeline-hover-glow';

      const reveal = document.createElement('aside');
      reveal.className = 'timeline-reveal';
      reveal.innerHTML = experience.spotlight;

      content.append(glow, reveal);
    }

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

  const revealCards = researchTimeline.querySelectorAll(
    '.timeline-content.has-reveal'
  );
  const supportsHover =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(hover: hover)').matches
      : true;

  if (revealCards.length) {
    const overlay = document.createElement('div');
    overlay.className = 'timeline-reveal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    let activeCard = null;

    const lockBody = () => {
      if (!document.body.dataset.revealPrevOverflow) {
        document.body.dataset.revealPrevOverflow =
          document.body.style.overflow ||
          getComputedStyle(document.body).overflow ||
          '';
      }
      if (!document.body.dataset.revealPrevPadding) {
        document.body.dataset.revealPrevPadding =
          document.body.style.paddingRight || '';
      }

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    };

    const unlockBody = () => {
      const prevOverflow = document.body.dataset.revealPrevOverflow || '';
      const prevPadding = document.body.dataset.revealPrevPadding || '';

      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;

      delete document.body.dataset.revealPrevOverflow;
      delete document.body.dataset.revealPrevPadding;
    };

    const focusableSelector =
      'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = (rootEl) =>
      Array.from(rootEl.querySelectorAll(focusableSelector)).filter(
        (el) =>
          !el.hasAttribute('disabled') &&
          el.getAttribute('aria-hidden') !== 'true' &&
          el.offsetParent !== null
      );

    const attachFocusTrap = (reveal) => {
      const handleKeydown = (event) => {
        if (event.key !== 'Tab') return;
        const nodes = getFocusable(reveal);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const handleFocusIn = (event) => {
        if (!reveal.contains(event.target)) {
          const nodes = getFocusable(reveal);
          if (nodes.length) {
            nodes[0].focus({ preventScroll: true });
          }
        }
      };

      reveal.addEventListener('keydown', handleKeydown);
      document.addEventListener('focusin', handleFocusIn);

      reveal._trapKeydown = handleKeydown;
      reveal._focusGuard = handleFocusIn;
    };

    const removeFocusTrap = (reveal) => {
      if (reveal._trapKeydown) {
        reveal.removeEventListener('keydown', reveal._trapKeydown);
        delete reveal._trapKeydown;
      }
      if (reveal._focusGuard) {
        document.removeEventListener('focusin', reveal._focusGuard);
        delete reveal._focusGuard;
      }
    };

    const closeActive = ({ restoreFocus = true, immediate = false } = {}) => {
      if (!activeCard) return Promise.resolve();

      return new Promise((resolve) => {
        const card = activeCard;
        const reveal = card.querySelector('.timeline-reveal');

        const finishClose = () => {
          removeFocusTrap(reveal);
          card.classList.remove('is-active');
          card.setAttribute('aria-expanded', 'false');
          activeCard = null;
          document.body.classList.remove('timeline-reveal-active');
          overlay.setAttribute('aria-hidden', 'true');
          unlockBody();
          if (restoreFocus) {
            requestAnimationFrame(() =>
              card.focus({ preventScroll: true })
            );
          }
          resolve();
        };

        if (immediate) {
          finishClose();
          return;
        }

        const cardRect = card.getBoundingClientRect();
        const revealRect = reveal.getBoundingClientRect();
        const dx =
          cardRect.left + cardRect.width / 2 -
          (revealRect.left + revealRect.width / 2);
        const dy =
          cardRect.top + cardRect.height / 2 -
          (revealRect.top + revealRect.height / 2);
        const sx = Math.max(
          0.01,
          cardRect.width / Math.max(1, revealRect.width)
        );
        const sy = Math.max(
          0.01,
          cardRect.height / Math.max(1, revealRect.height)
        );

        const animation = reveal.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1,1)', opacity: 1 },
            {
              transform: `translate(-50%,-50%) translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
              opacity: 0.001,
            },
          ],
          { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );

        overlay.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 200, easing: 'ease-in', fill: 'forwards' }
        );

        animation.addEventListener('finish', finishClose, { once: true });
      });
    };

    const activateReveal = async (card) => {
      if (activeCard === card) return;

      await closeActive({ restoreFocus: false });

      const reveal = card.querySelector('.timeline-reveal');
      if (!reveal) return;

      activeCard = card;

      if (!reveal.hasAttribute('role')) {
        reveal.setAttribute('role', 'dialog');
        reveal.setAttribute('aria-modal', 'true');
      }
      if (!reveal.getAttribute('aria-label')) {
        const heading = card.querySelector('h3');
        reveal.setAttribute(
          'aria-label',
          heading ? `${heading.textContent} spotlight` : 'Research spotlight'
        );
      }

      lockBody();
      document.body.classList.add('timeline-reveal-active');
      overlay.setAttribute('aria-hidden', 'false');

      card.classList.add('is-active');
      card.setAttribute('aria-expanded', 'true');

      reveal.style.visibility = 'hidden';
      reveal.style.opacity = '0';
      reveal.style.transform = 'translate(-50%,-50%)';
      reveal.getBoundingClientRect();

      const cardRect = card.getBoundingClientRect();
      const revealRect = reveal.getBoundingClientRect();
      const dx =
        cardRect.left + cardRect.width / 2 -
        (revealRect.left + revealRect.width / 2);
      const dy =
        cardRect.top + cardRect.height / 2 -
        (revealRect.top + revealRect.height / 2);
      const sx = Math.max(
        0.01,
        cardRect.width / Math.max(1, revealRect.width)
      );
      const sy = Math.max(
        0.01,
        cardRect.height / Math.max(1, revealRect.height)
      );

      reveal.style.visibility = '';
      reveal.style.opacity = '';
      reveal.style.transform = '';

      const animation = reveal.animate(
        [
          {
            transform: `translate(-50%,-50%) translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            opacity: 0.001,
          },
          { transform: 'translate(-50%,-50%) scale(1,1)', opacity: 1 },
        ],
        { duration: 460, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
      );

      overlay.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 220, easing: 'ease-out', fill: 'forwards' }
      );

      attachFocusTrap(reveal);

      animation.addEventListener(
        'finish',
        () => {
          const focusTarget =
            reveal.querySelector('.timeline-reveal__close') ||
            getFocusable(reveal)[0] ||
            reveal;
          focusTarget.focus({ preventScroll: true });
        },
        { once: true }
      );
    };

    const deactivateReveal = () => {
      void closeActive();
    };

    overlay.addEventListener('click', deactivateReveal);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        deactivateReveal();
      }
    });

    revealCards.forEach((card) => {
      if (supportsHover) {
        card.addEventListener('pointerenter', () => {
          card.classList.add('is-hovered');
        });
        card.addEventListener('pointermove', (event) => {
          const rect = card.getBoundingClientRect();
          const px = event.clientX
            ? event.clientX - rect.left
            : rect.width / 2;
          const py = event.clientY
            ? event.clientY - rect.top
            : rect.height / 2;
          const nx = px / rect.width - 0.5;
          const ny = py / rect.height - 0.5;
          card.style.setProperty('--tiltX', `${(-ny * 9).toFixed(2)}deg`);
          card.style.setProperty('--tiltY', `${(nx * 9).toFixed(2)}deg`);
          const glow = card.querySelector('.timeline-hover-glow');
          if (glow) {
            glow.style.opacity = '1';
            glow.style.transform = `translate(${nx * 10}px, ${ny * 10}px)`;
          }
        });
        card.addEventListener('pointerleave', () => {
          card.classList.remove('is-hovered');
          card.style.removeProperty('--tiltX');
          card.style.removeProperty('--tiltY');
          const glow = card.querySelector('.timeline-hover-glow');
          if (glow) {
            glow.style.opacity = '0';
            glow.style.transform = '';
          }
        });
      }

      card.addEventListener('focusin', () => {
        card.classList.add('is-hovered');
      });

      card.addEventListener('focusout', () => {
        card.classList.remove('is-hovered');
        card.style.removeProperty('--tiltX');
        card.style.removeProperty('--tiltY');
      });

      card.addEventListener('click', () => activateReveal(card));

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activateReveal(card);
        }
      });

      const closeButton = card.querySelector('.timeline-reveal__close');
      if (closeButton) {
        closeButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          deactivateReveal();
        });
      }
    });
  }
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
