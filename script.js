import { siteContent } from "./content.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App root not found.");
}

const signatureRevealPaths = Array.isArray(window.SIGNATURE_REVEAL_PATHS) ? window.SIGNATURE_REVEAL_PATHS : [];

app.innerHTML = PageShell(siteContent);

const pageShell = app.querySelector("[data-page-shell]");
const sharedThemeToggle = app.querySelector("[data-window-theme-toggle]");
const homeButton = app.querySelector("[data-home-button]");
const heroAnchor = app.querySelector("[data-hero-anchor]");
const heroSignature = app.querySelector('[data-signature-role="hero"]');
const introOverlay = app.querySelector("[data-intro-overlay]");
const introBackdrop = app.querySelector("[data-intro-backdrop]");
const introStack = app.querySelector("[data-intro-stack]");
const introWordmarkText = app.querySelector("[data-intro-wordmark-text]");
const introSignature = app.querySelector('[data-signature-role="intro"]');
const portraitCanvas = app.querySelector("[data-scribble-canvas]");
const resetButton = app.querySelector("[data-scribble-reset]");
const view1Scene = app.querySelector('[data-scene="view1"]');
const view2Scene = app.querySelector('[data-scene="view2"]');
const view3Scene = app.querySelector('[data-scene="view3"]');
const sceneFrames = {
  view1: app.querySelector('[data-scene-frame="view1"]'),
  view2: app.querySelector('[data-scene-frame="view2"]'),
  view3: app.querySelector('[data-scene-frame="view3"]'),
};
const scrollCues = {
  view1: view1Scene?.querySelector("[data-scroll-cue]") ?? null,
  view2: view2Scene?.querySelector("[data-scroll-cue]") ?? null,
  view3: view3Scene?.querySelector("[data-scroll-cue]") ?? null,
};
const view2Panel = app.querySelector("[data-view2-panel]");
const view2Overview = app.querySelector("[data-view2-overview]");
const view2HeadingLeft = app.querySelector('[data-view2-heading="left"]');
const view2HeadingRight = app.querySelector('[data-view2-heading="right"]');
const view2LeftItems = app.querySelectorAll('[data-view2-item="left"]');
const view2RightItems = app.querySelectorAll('[data-view2-item="right"]');
const view3Panel = app.querySelector("[data-view3-panel]");
const view3Frame = sceneFrames.view3;
const view3Entry = app.querySelector("[data-view3-entry]");
const view3Extras = app.querySelector("[data-view3-extras]");
const view3Footer = app.querySelector("[data-view3-footer]");
const marqueeTracks = app.querySelectorAll("[data-marquee-track]");
const researchPreviewButtons = app.querySelectorAll("[data-research-preview]");
const colorRevealFrames = app.querySelectorAll("[data-color-reveal]");
const researchLightbox = app.querySelector("[data-research-lightbox]");
const researchLightboxImage = app.querySelector("[data-research-lightbox-image]");
const researchLightboxTitle = app.querySelector("[data-research-lightbox-title]");
const researchLightboxCloseButtons = app.querySelectorAll("[data-research-lightbox-close]");

initTheme(sharedThemeToggle ? [sharedThemeToggle] : []);
setSignatureState(heroSignature, "static");
initScribble(portraitCanvas, resetButton);
initPointReveal(colorRevealFrames);
initResearchLightbox(researchPreviewButtons, researchLightbox, researchLightboxImage, researchLightboxTitle, researchLightboxCloseButtons);
initHeroIntro({
  pageShell,
  overlay: introOverlay,
  backdrop: introBackdrop,
  stack: introStack,
  wordmarkText: introWordmarkText,
  introSignature,
  heroAnchor,
  heroSignature,
  wordmark: siteContent.hero.wordmark,
});
initSceneScroll({
  pageShell,
  scrollCues,
  scenes: {
    view1: view1Scene,
    view2: view2Scene,
    view3: view3Scene,
  },
  sceneFrames,
  themeToggle: sharedThemeToggle,
  homeButton,
  view2Panel,
  view2Overview,
  view2HeadingLeft,
  view2HeadingRight,
  view2LeftItems,
  view2RightItems,
  view3Panel,
  view3Frame,
  view3Entry,
  view3Extras,
  view3Footer,
  marqueeTracks,
});

function initTheme(toggleNodes) {
  const toggles = Array.from(toggleNodes).filter((node) => node instanceof HTMLButtonElement);
  const storedTheme = localStorage.getItem("naren-theme");
  const initialTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";

  applyTheme(initialTheme, toggles);

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("naren-theme", nextTheme);
      applyTheme(nextTheme, toggles);
    });
  });
}

function applyTheme(theme, toggles) {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;

  const themeColor = document.querySelector("meta[name='theme-color']");
  if (themeColor) {
    themeColor.setAttribute("content", theme === "dark" ? "#050505" : "#ffffff");
  }

  toggles.forEach((toggle) => {
    const iconNode = toggle.querySelector("[data-theme-icon]");
    const labelNode = toggle.querySelector("[data-theme-label]");
    const isDark = theme === "dark";

    if (iconNode) {
      iconNode.textContent = isDark ? "☀" : "☾";
    }

    if (labelNode) {
      labelNode.textContent = isDark ? "Light" : "Dark";
    }

    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  });
}

function setSignatureState(node, state) {
  if (!node) {
    return;
  }

  node.classList.remove("is-static", "is-animated");
  if (state === "animated") {
    window.requestAnimationFrame(() => {
      node.classList.add("is-animated");
    });
    return;
  }

  node.classList.add("is-static");
}

function initScribble(canvas, resetButtonNode) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const portraitStage = canvas.closest(".portrait-stage");
  const portraitImage = portraitStage?.querySelector(".portrait-stage__image--base");
  const context = canvas.getContext("2d");
  if (!(portraitStage instanceof HTMLElement) || !context || !(portraitImage instanceof HTMLImageElement)) {
    return;
  }

  const state = {
    drawing: false,
    pointerId: null,
    lastPoint: null,
    hasMarks: false,
    colorLayer: null,
    displaySize: null,
    pattern: null,
  };

  const drawCoverImage = (targetContext, source, destWidth, destHeight) => {
    const sourceWidth = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
    const sourceHeight = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

    if (!sourceWidth || !sourceHeight) {
      return;
    }

    const scale = Math.max(destWidth / sourceWidth, destHeight / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const offsetX = (destWidth - drawWidth) / 2;
    const offsetY = (destHeight - drawHeight) / 2;

    targetContext.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
  };

  const configureContext = async () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
    state.displaySize = {
      width: rect.width,
      height: rect.height,
    };

    const colorLayer = document.createElement("canvas");
    colorLayer.width = Math.max(1, Math.floor(rect.width));
    colorLayer.height = Math.max(1, Math.floor(rect.height));

    const colorContext = colorLayer.getContext("2d");
    if (colorContext) {
      if (!portraitImage.complete) {
        await portraitImage.decode().catch(() => undefined);
      }

      drawCoverImage(colorContext, portraitImage, colorLayer.width, colorLayer.height);
      state.colorLayer = colorLayer;
      state.pattern = context.createPattern(colorLayer, "no-repeat");
    }
  };

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const setDirty = (value) => {
    state.hasMarks = value;
    resetButtonNode?.toggleAttribute("hidden", !value);
  };

  const showHoverBlob = (point) => {
    portraitStage.style.setProperty("--portrait-hover-x", `${point.x}px`);
    portraitStage.style.setProperty("--portrait-hover-y", `${point.y}px`);
    portraitStage.classList.add("is-hovering");
  };

  const hideHoverBlob = () => {
    portraitStage.classList.remove("is-hovering");
  };

  const revealAt = (point) => {
    if (!state.pattern) {
      return;
    }

    context.save();
    context.beginPath();
    context.arc(point.x, point.y, 15, 0, Math.PI * 2);
    context.fillStyle = state.pattern;
    context.fill();
    context.restore();
  };

  const revealStroke = (fromPoint, toPoint) => {
    if (!state.pattern) {
      return;
    }

    context.beginPath();
    context.moveTo(fromPoint.x, fromPoint.y);
    context.lineTo(toPoint.x, toPoint.y);
    context.lineWidth = 30;
    context.strokeStyle = state.pattern;
    context.stroke();
  };

  const startDrawing = (event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    state.drawing = true;
    state.pointerId = event.pointerId ?? "mouse";
    state.lastPoint = getPoint(event);
    canvas.setPointerCapture?.(event.pointerId);
    showHoverBlob(state.lastPoint);
    revealAt(state.lastPoint);
    setDirty(true);
  };

  const draw = (event) => {
    const nextPoint = getPoint(event);
    showHoverBlob(nextPoint);

    if (!state.drawing || state.pointerId !== (event.pointerId ?? "mouse") || !state.lastPoint) {
      return;
    }

    revealStroke(state.lastPoint, nextPoint);
    state.lastPoint = nextPoint;
    setDirty(true);
  };

  const stopDrawing = (event) => {
    if (state.pointerId !== (event.pointerId ?? "mouse")) {
      return;
    }

    state.drawing = false;
    state.pointerId = null;
    state.lastPoint = null;

    if (
      event.type === "pointerleave" ||
      event.type === "pointercancel" ||
      (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen")
    ) {
      hideHoverBlob();
    }
  };

  const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    setDirty(false);
  };

  const configureAndClear = async () => {
    await configureContext();
    clear();
  };

  configureAndClear();
  window.addEventListener("resize", () => {
    configureAndClear();
  });

  canvas.addEventListener("pointerenter", (event) => {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }

    showHoverBlob(getPoint(event));
  });
  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", (event) => {
    stopDrawing(event);
    hideHoverBlob();
  });
  canvas.addEventListener("pointercancel", stopDrawing);
  resetButtonNode?.addEventListener("click", clear);
}

function PageShell(content) {
  return `
    ${IntroOverlay(content.hero, content.about.signatureLabel)}
    ${WindowChrome()}
    <div class="scene-stack">
      ${View1Scene(content)}
      ${View2Scene(content.competitions, content.experiments)}
      ${View3Scene(content.projects, content.extracurriculars, content.footerCta)}
    </div>
    ${ResearchLightbox()}
  `;
}

function View1Scene(content) {
  return `
    <section class="scene scene--view1" data-scene="view1">
      <div class="scene__panel scene__panel--view1">
        <div class="scene__frame" data-scene-frame="view1">
          <div class="scene__viewport">
            <div class="page-shell" data-page-shell>
              ${WordmarkCell(content.hero, content.about.signatureLabel)}
              ${LinksCell(content.socialLinks)}
              ${AboutCell(content.about)}
              ${PortraitCell(content.portraitCard)}
              ${CompaniesCell(content.companyLogos)}
            </div>
          </div>
        </div>
        ${ScrollCue()}
      </div>
    </section>
  `;
}

function View2Scene(competitionSection, researchSection) {
  return `
    <section class="scene scene--view2" data-scene="view2">
      <div class="scene__panel scene__panel--view2" data-view2-panel>
        <div class="scene__frame" data-scene-frame="view2">
          <div class="scene__viewport">
            <div class="view2-stage">
              <div class="view2-shell view2-shell--overview" data-view2-overview>
                ${CompetitionColumn(competitionSection)}
                ${ResearchColumn(researchSection)}
              </div>
            </div>
          </div>
        </div>
        ${ScrollCue()}
      </div>
    </section>
  `;
}

function View3Scene(projects, extracurriculars, footerCta) {
  return `
    <section class="scene scene--view3" data-scene="view3">
      <div class="scene__panel scene__panel--view3" data-view3-panel>
        <div class="scene__frame scene__frame--view3" data-scene-frame="view3">
          <div class="scene__viewport">
            <div class="view3-shell">
              <div class="view3-sections">
                <div class="view3-section view3-entry" data-view3-entry>
                  <div class="section-kicker section-kicker--work view3-heading" data-view3-heading>
                    ${escapeHtml(projects.label)}
                  </div>
                  ${ProjectsMarquee(projects)}
                </div>
                <div class="view3-section view3-section--extras" data-view3-extras>
                  <div class="section-kicker section-kicker--extras view3-heading">
                    ${escapeHtml(extracurriculars.label)}
                  </div>
                  ${ExtracurricularMarquee(extracurriculars)}
                </div>
              </div>
            </div>
          </div>
        </div>
        ${FooterCta(footerCta)}
        ${ScrollCue()}
      </div>
    </section>
  `;
}

function WindowChrome() {
  return `
    <div class="window-chrome" data-window-chrome>
      <button class="window-theme-toggle" data-window-theme-toggle type="button" aria-label="Switch to dark mode" title="Switch to dark mode" hidden>
        <span class="window-theme-toggle__icon" data-theme-icon aria-hidden="true">☾</span>
        <span class="window-theme-toggle__label" data-theme-label>Dark</span>
      </button>
      <button class="window-home-button" data-home-button type="button" aria-label="Back to home" title="Back to home" hidden>
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  `;
}

function WordmarkCell(hero, signatureLabel) {
  return `
    <section class="cell cell--wordmark" aria-labelledby="hero-heading">
      <div class="hero-stack" data-hero-anchor>
        <h1 class="wordmark" id="hero-heading">${escapeHtml(hero.wordmark)}</h1>
        <div class="signature-wrap signature-wrap--hero" aria-hidden="true">
          ${SignatureMarkup(signatureLabel, "hero")}
        </div>
      </div>
    </section>
  `;
}

function ScrollCue() {
  return `
    <div class="scroll-cue" data-scroll-cue aria-hidden="true">
      <span class="scroll-cue__mouse">
        <span class="scroll-cue__wheel"></span>
      </span>
    </div>
  `;
}

function LinksCell(links) {
  return `
    <aside class="cell cell--favorite" aria-label="Find me at">
      <span class="cell-tag cell-tag--links">Find me at</span>
      <div class="links-grid">
        ${links.map((link) => LinksCellItem(link)).join("")}
      </div>
    </aside>
  `;
}

function LinksCellItem(link) {
  return `
    <a
      class="top-link"
      href="${escapeAttribute(link.href)}"
      aria-label="${escapeAttribute(link.label)}"
      ${link.href.startsWith("http") ? 'target="_blank" rel="noreferrer noopener"' : ""}
    >
      <span class="top-link__icon" aria-hidden="true">${iconMarkup(link.icon)}</span>
      <span class="top-link__label">${escapeHtml(link.label)}</span>
    </a>
  `;
}

function AboutCell(about) {
  return `
    <section class="cell cell--about" id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">${escapeHtml(about.heading)}</h2>
      <div class="about-copy">
        ${about.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
    </section>
  `;
}

function IntroOverlay(hero, signatureLabel) {
  return `
    <div class="intro-overlay" data-intro-overlay aria-hidden="true">
      <div class="intro-overlay__backdrop" data-intro-backdrop></div>
      <div class="intro-overlay__stack" data-intro-stack>
        <div class="intro-wordmark" aria-label="${escapeAttribute(hero.wordmark)}">
          <span data-intro-wordmark-text></span>
          <span class="intro-wordmark__caret" aria-hidden="true"></span>
        </div>
        <div class="signature-wrap signature-wrap--intro" aria-hidden="true">
          ${SignatureMarkup(signatureLabel, "intro")}
        </div>
      </div>
    </div>
  `;
}

function SignatureMarkup(signatureLabel, role = "default") {
  if (role !== "intro" || signatureRevealPaths.length === 0) {
    return `
      <svg
        class="signature signature--${escapeAttribute(role)}"
        data-signature
        data-signature-role="${escapeAttribute(role)}"
        viewBox="0 0 3054 1376"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="${escapeAttribute(signatureLabel)} signature"
      >
        <image
          class="signature__image"
          href="./assets/signature-narendhiran.png"
          width="3054"
          height="1376"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    `;
  }

  const maskId = `signature-mask-${role}`;
  const revealMarkup = signatureRevealPaths
    .map(
      (segment) => `
          <path
            class="signature__reveal-path"
            d="${escapeAttribute(segment.d)}"
            pathLength="1"
            style="--signature-delay:${escapeAttribute(String(segment.delay))}s; --signature-duration:${escapeAttribute(String(segment.duration))}s"
          />
        `,
    )
    .join("");

  return `
    <svg
      class="signature signature--${escapeAttribute(role)}"
      data-signature
      data-signature-role="${escapeAttribute(role)}"
      viewBox="0 0 3054 1376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="${escapeAttribute(signatureLabel)} signature"
    >
      <defs>
        <mask id="${escapeAttribute(maskId)}" maskUnits="userSpaceOnUse" x="0" y="0" width="3054" height="1376">
          <rect width="3054" height="1376" fill="black" />
          ${revealMarkup}
        </mask>
      </defs>
      <image
        class="signature__image"
        href="./assets/signature-narendhiran.png"
        width="3054"
        height="1376"
        preserveAspectRatio="xMidYMid meet"
        mask="url(#${escapeAttribute(maskId)})"
      />
    </svg>
  `;
}

function PortraitCell(portrait) {
  return `
    <section class="cell cell--portrait" aria-labelledby="portrait-heading">
      <div class="portrait-stage-shell">
        <div class="portrait-stage__annotation" aria-hidden="true">
          <svg class="portrait-stage__arrow" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M61 10C59 29 50 41 36 47C28 51 20 56 16 66" />
            <path d="M16 66L17 54" />
            <path d="M16 66L26 59" />
          </svg>
          <span>${escapeHtml(portrait.fileName)}</span>
        </div>
        <div class="portrait-stage">
          <img class="portrait-stage__image portrait-stage__image--base" src="${escapeAttribute(portrait.image)}" alt="${escapeAttribute(portrait.alt)}" />
          <img class="portrait-stage__image portrait-stage__image--hover" src="${escapeAttribute(portrait.image)}" alt="" aria-hidden="true" />
          <canvas class="portrait-stage__canvas" data-scribble-canvas></canvas>
          <button class="portrait-stage__reset" data-scribble-reset type="button" hidden>Reset</button>
          <small class="portrait-stage__hint">${escapeHtml(portrait.helper)}</small>
        </div>
      </div>
      <h2 id="portrait-heading" class="sr-only">Portrait</h2>
    </section>
  `;
}

function ResearchColumn(experiments) {
  return `
    <section class="view2-column view2-column--research" aria-labelledby="experiments-heading">
      <div class="section-kicker section-kicker--research view2-heading" id="experiments-heading" data-view2-heading="right">
        ${escapeHtml(experiments.label)}
      </div>
      <div class="experiment-list">
        ${experiments.items
          .map(
            (item) => `
              <article class="experiment-item" data-view2-item="right">
                <a class="experiment-item__link" href="${escapeAttribute(item.href)}" ${
                  item.href.startsWith("http") ? 'target="_blank" rel="noreferrer noopener"' : ""
                } aria-label="${escapeAttribute(item.title)}">
                  <span class="experiment-item__copy">
                    <strong>${escapeHtml(item.title)}</strong>
                    <span>${escapeHtml(item.description)}</span>
                  </span>
                </a>
                <button
                  class="experiment-item__media-frame"
                  data-research-preview
                  data-color-reveal
                  data-preview-src="${escapeAttribute(item.image)}"
                  data-preview-alt="${escapeAttribute(item.imageAlt)}"
                  data-preview-title="${escapeAttribute(item.title)}"
                  type="button"
                  aria-label="Open larger ${escapeAttribute(item.title)} preview"
                >
                  <span class="experiment-item__media-stack" aria-hidden="true">
                    <img
                      class="experiment-item__media experiment-item__media--mono"
                      src="${escapeAttribute(item.image)}"
                      alt=""
                      loading="lazy"
                    />
                    <img
                      class="experiment-item__media experiment-item__media--color"
                      src="${escapeAttribute(item.image)}"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span class="experiment-item__zoom" aria-hidden="true">${magnifyIconMarkup()}</span>
                </button>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function CompetitionColumn(competitionSection) {
  return `
    <section class="view2-column view2-column--competitions" aria-labelledby="competition-heading">
      <div class="section-kicker section-kicker--competitions view2-heading" id="competition-heading" data-view2-heading="left">
        ${escapeHtml(competitionSection.label)}
      </div>
      <div class="competition-list">
        ${competitionSection.items
          .map(
            (item) => `
              <article class="competition-item" data-view2-item="left">
                <div class="competition-item__head">
                  <strong>${escapeHtml(item.competitionLabel)}</strong>
                  <span>${escapeHtml(item.projectTitle)}</span>
                </div>
                <p>${escapeHtml(item.summary)}</p>
                ${
                  item.codeUrl
                    ? `<a class="competition-item__link" href="${escapeAttribute(item.codeUrl)}" target="_blank" rel="noreferrer noopener">View more</a>`
                    : ""
                }
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function ResearchLightbox() {
  return `
    <div class="research-lightbox" data-research-lightbox hidden>
      <div class="research-lightbox__backdrop" data-research-lightbox-close></div>
      <div class="research-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="research-lightbox-title">
        <div class="research-lightbox__header">
          <strong class="research-lightbox__title" id="research-lightbox-title" data-research-lightbox-title></strong>
          <button class="research-lightbox__close" data-research-lightbox-close type="button" aria-label="Close preview">
            Close
          </button>
        </div>
        <img class="research-lightbox__image" data-research-lightbox-image alt="" />
      </div>
    </div>
  `;
}

function initResearchLightbox(buttons, lightbox, imageNode, titleNode, closeButtons) {
  if (!(lightbox instanceof HTMLElement) || !(imageNode instanceof HTMLImageElement) || !(titleNode instanceof HTMLElement)) {
    return;
  }

  let activeTrigger = null;

  const open = (previewButton) => {
    if (!(previewButton instanceof HTMLButtonElement)) {
      return;
    }

    const src = previewButton.dataset.previewSrc;
    const alt = previewButton.dataset.previewAlt ?? "";
    const title = previewButton.dataset.previewTitle ?? "";

    if (!src) {
      return;
    }

    activeTrigger = previewButton;
    imageNode.src = src;
    imageNode.alt = alt;
    titleNode.textContent = title;
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
  };

  const close = () => {
    lightbox.hidden = true;
    imageNode.removeAttribute("src");
    imageNode.alt = "";
    titleNode.textContent = "";
    document.body.classList.remove("is-lightbox-open");
    activeTrigger?.focus?.();
    activeTrigger = null;
  };

  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      open(button);
    });
  });

  closeButtons.forEach((button) => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      close();
    });
  });

  lightbox.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest("[data-research-lightbox-close]") instanceof HTMLElement || target === lightbox) {
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      close();
    }
  });
}

function initPointReveal(nodes) {
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    let revealTimer = null;

    const primeReveal = (event) => {
      const rect = node.getBoundingClientRect();
      const clientX = "clientX" in event ? event.clientX : rect.left + rect.width / 2;
      const clientY = "clientY" in event ? event.clientY : rect.top + rect.height / 2;
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      const maxRadius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) + 18;

      node.style.setProperty("--reveal-x", `${x}px`);
      node.style.setProperty("--reveal-y", `${y}px`);
      node.style.setProperty("--reveal-max", `${maxRadius}px`);
      node.classList.remove("is-revealed");
      void node.offsetWidth;
    };

    const triggerReveal = (forceVisible = false, delay = 0) => {
      window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(() => {
        if (forceVisible || node.matches(":hover") || node.matches(":focus-visible")) {
          node.classList.add("is-revealed");
        }
      }, delay);
    };

    node.addEventListener("pointerenter", (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      primeReveal(event);
      triggerReveal(true, 90);
    });

    node.addEventListener("pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      if (!node.matches(":hover")) {
        return;
      }

      primeReveal(event);
      triggerReveal(true, 45);
    });

    node.addEventListener("pointerdown", (event) => {
      primeReveal(event);
      triggerReveal(true, 0);
    });

    node.addEventListener("focus", () => {
      const rect = node.getBoundingClientRect();
      primeReveal(
        {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        },
      );
      triggerReveal(true, 90);
    });

    node.addEventListener("pointerleave", () => {
      window.clearTimeout(revealTimer);
      node.classList.remove("is-revealed");
    });

    node.addEventListener("blur", () => {
      window.clearTimeout(revealTimer);
      node.classList.remove("is-revealed");
    });
  });
}

function CompaniesCell(companyLogos) {
  return `
    <section class="cell cell--companies" aria-labelledby="companies-heading">
      <h2 id="companies-heading">${escapeHtml(companyLogos.heading)}</h2>
      <div class="logo-grid">
        ${companyLogos.logos.map((logo) => CollaborationLogoItem(logo)).join("")}
      </div>
    </section>
  `;
}

function CollaborationLogoItem(logo) {
  return `
    <a
      class="logo-lockup logo-lockup--${escapeAttribute(logo.id)}"
      href="${escapeAttribute(logo.href)}"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="${escapeAttribute(logo.name)}"
    >
      ${collaborationLogoMarkup(logo)}
    </a>
  `;
}

function collaborationLogoMarkup(logo) {
  const wordmarks = {
    utdallas: `
      <span class="logo-lockup__row">
        <span class="logo-lockup__major">UT</span>
        <span class="logo-lockup__minor logo-lockup__minor--wide">Dallas</span>
      </span>
    `,
    ntu: `
      <span class="logo-lockup__stack">
        <span class="logo-lockup__major">NTU</span>
        <span class="logo-lockup__minor">Singapore</span>
      </span>
    `,
    iiith: `
      <span class="logo-lockup__stack">
        <span class="logo-lockup__major">IIIT</span>
        <span class="logo-lockup__minor">Hyderabad</span>
      </span>
    `,
    monash: `
      <span class="logo-lockup__stack">
        <span class="logo-lockup__major">Monash</span>
        <span class="logo-lockup__minor">University</span>
      </span>
    `,
    iitbombay: `
      <span class="logo-lockup__stack">
        <span class="logo-lockup__major">IIT</span>
        <span class="logo-lockup__minor">Bombay</span>
      </span>
    `,
    nittrichy: `
      <span class="logo-lockup__stack">
        <span class="logo-lockup__major">NIT</span>
        <span class="logo-lockup__minor">Trichy</span>
      </span>
    `,
  };

  return wordmarks[logo.id] ?? `<span class="logo-lockup__major">${escapeHtml(logo.name)}</span>`;
}

function ProjectsMarquee(projects) {
  return `
    <div class="projects-marquee">
      <div class="projects-marquee__track" data-marquee-track data-direction="rtl" data-speed="24">
        ${ProjectMarqueeGroup(projects.items, { interactive: true, role: "base" })}
        ${ProjectMarqueeGroup(projects.items, { interactive: false, role: "clone" })}
      </div>
    </div>
  `;
}

function ProjectMarqueeGroup(projects, options) {
  const { interactive, role } = options;
  return `
    <div
      class="projects-marquee__group ${interactive ? "" : "projects-marquee__group--clone"}"
      data-marquee-group="${escapeAttribute(role)}"
      ${interactive ? "" : 'aria-hidden="true"'}
    >
      ${projects.map((project) => ProjectCardMarkup(project, { interactive })).join("")}
    </div>
  `;
}

function ExtracurricularMarquee(section) {
  return `
    <div class="projects-marquee projects-marquee--extras">
      <div class="projects-marquee__track" data-marquee-track data-direction="ltr" data-speed="30">
        ${ExtracurricularMarqueeGroup(section.items, { role: "base" })}
        ${ExtracurricularMarqueeGroup(section.items, { role: "clone", hidden: true })}
      </div>
    </div>
  `;
}

function ExtracurricularMarqueeGroup(items, options) {
  const { role, hidden = false } = options;
  return `
    <div class="projects-marquee__group projects-marquee__group--extras ${hidden ? "projects-marquee__group--clone" : ""}" data-marquee-group="${escapeAttribute(role)}" ${hidden ? 'aria-hidden="true"' : ""}>
      ${items.map((item) => ExtracurricularCardMarkup(item, { interactive: !hidden })).join("")}
    </div>
  `;
}

function ExtracurricularCardMarkup(item, options = {}) {
  const { interactive = true } = options;
  const loading = interactive ? "eager" : "lazy";
  return `
    <article class="extra-card">
      <div class="extra-card__media-frame" data-color-reveal ${interactive ? 'tabindex="0"' : ""}>
        <span class="extra-card__media-stack" aria-hidden="true">
          <img class="extra-card__media extra-card__media--mono" src="${escapeAttribute(item.image)}" alt="" loading="${loading}" />
          <img class="extra-card__media extra-card__media--color" src="${escapeAttribute(item.image)}" alt="" loading="${loading}" />
        </span>
      </div>
      <div class="extra-card__copy">
        <p class="extra-card__role">${escapeHtml(item.role)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `;
}

function ProjectCardMarkup(project, options) {
  const { interactive } = options;
  return `
    <article class="project-card project-card--${escapeAttribute(project.theme)}">
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      ${ProjectCardAction(project, interactive)}
    </article>
  `;
}

function FooterCta(footerCta) {
  return `
    <footer class="view3-footer view3-footer--strip" data-view3-footer>
      <p>
        ${escapeHtml(footerCta.text)}
        <a href="${escapeAttribute(footerCta.href)}">${escapeHtml(footerCta.linkLabel)}</a>
      </p>
      <small>&copy; ${new Date().getFullYear()} Narendhiran Vijayakumar</small>
    </footer>
  `;
}

function ProjectCardAction(project, interactive = true) {
  if (!interactive || !project.href) {
    return `<span class="project-card__status">${escapeHtml(project.ctaLabel)}</span>`;
  }

  return `
    <a href="${escapeAttribute(project.href)}" ${
      project.href.startsWith("http") ? 'target="_blank" rel="noreferrer noopener"' : ""
    }>${escapeHtml(project.ctaLabel)}</a>
  `;
}

function initSceneScroll(config) {
  const {
    pageShell: view1Panel,
    scrollCues: cues,
    scenes,
    sceneFrames,
    themeToggle: themeToggleNode,
    homeButton: homeButtonNode,
    view2Panel: secondPanel,
    view2Overview: secondOverview,
    view2HeadingLeft: secondHeadingLeft,
    view2HeadingRight: secondHeadingRight,
    view2LeftItems: secondLeftItems,
    view2RightItems: secondRightItems,
    view3Panel: thirdPanel,
    view3Frame: thirdFrame,
    view3Entry: thirdEntry,
    view3Extras: thirdExtras,
    view3Footer: thirdFooter,
    marqueeTracks: marqueeNodes,
  } = config;

  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);
  const easeInOut = (value) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2);
  const segment = (value, start, end) => clamp((value - start) / (end - start));
  const metrics = {};
  let renderQueued = false;
  let homeButtonReturnLock = false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const marquees = Array.from(marqueeNodes)
    .map((track) => {
      if (!(track instanceof HTMLElement)) {
        return null;
      }

      const baseGroup = track.querySelector('[data-marquee-group="base"]');
      if (!(baseGroup instanceof HTMLElement)) {
        return null;
      }

      return {
        track,
        baseGroup,
        loopWidth: 0,
        offset: 0,
        velocity: 0,
        targetVelocity: 0,
        direction: track.dataset.direction === "ltr" ? "ltr" : "rtl",
        speed: Number.parseFloat(track.dataset.speed || "24") || 24,
      };
    })
    .filter(Boolean);
  let lastMarqueeTimestamp = 0;

  const setTransformOpacity = (node, progress, options = {}) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    const {
      xFrom = 0,
      yFrom = 0,
      scaleFrom = 1,
      opacityBoost = 1,
      pointerThreshold = 0.9,
    } = options;
    const eased = easeOut(progress);
    const x = xFrom * (1 - eased);
    const y = yFrom * (1 - eased);
    const scale = scaleFrom + (1 - scaleFrom) * eased;

    node.style.opacity = String(clamp(eased * opacityBoost));
    node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    node.style.pointerEvents = progress >= pointerThreshold ? "auto" : "none";
  };

  const setElementVisibility = (node, opacity, transform, pointerThreshold = 0.96) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.style.opacity = String(clamp(opacity));
    node.style.transform = transform;
    node.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
    node.style.pointerEvents = opacity > pointerThreshold ? "auto" : "none";
  };

  const setCueVisibility = (node, visible, opacity = 0.72) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.hidden = !visible;
    node.style.opacity = visible ? String(opacity) : "0";
    node.style.transform = `translate3d(-50%, ${visible ? "0px" : "10px"}, 0)`;
  };

  const positionFloatingControl = (node, rect, anchor) => {
    if (!(node instanceof HTMLElement) || !rect) {
      return;
    }

    if (anchor === "top") {
      const nodeHeight = node.getBoundingClientRect().height || 26;
      node.style.left = `${rect.left + rect.width / 2}px`;
      node.style.top = `${Math.max(nodeHeight + 8, rect.top - 6)}px`;
      return;
    }

    node.style.left = `${rect.right - 14}px`;
    node.style.top = `${rect.bottom - 14}px`;
  };

  const updateChrome = (activeView) => {
    const frame = sceneFrames?.[activeView];
    const scene = scenes?.[activeView];
    const frameRect = frame instanceof HTMLElement ? frame.getBoundingClientRect() : null;
    const panel = scene instanceof HTMLElement ? scene.querySelector(".scene__panel") : null;
    const panelRect = panel instanceof HTMLElement ? panel.getBoundingClientRect() : null;
    const introComplete = document.body.dataset.introState === "complete";

    if (themeToggleNode instanceof HTMLElement) {
      const shouldShowToggle = introComplete && frameRect;
      themeToggleNode.hidden = !shouldShowToggle;
      if (shouldShowToggle) {
        positionFloatingControl(themeToggleNode, frameRect, "top");
      } else {
        themeToggleNode.style.left = "";
        themeToggleNode.style.top = "";
      }
    }

    if (homeButtonNode instanceof HTMLButtonElement) {
      const shouldShowHome = introComplete && activeView !== "view1" && frameRect && !homeButtonReturnLock;
      homeButtonNode.hidden = !shouldShowHome;
      if (shouldShowHome) {
        positionFloatingControl(homeButtonNode, frameRect, "corner");
      } else {
        homeButtonNode.style.left = "";
        homeButtonNode.style.top = "";
      }
    }
  };

  if (homeButtonNode instanceof HTMLButtonElement && scenes.view1 instanceof HTMLElement) {
    homeButtonNode.addEventListener("click", () => {
      homeButtonReturnLock = true;
      homeButtonNode.hidden = true;
      homeButtonNode.style.left = "";
      homeButtonNode.style.top = "";
      scenes.view1.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  if (prefersReducedMotion) {
    document.body.dataset.activeView = "reduced";
    Object.values(cues ?? {}).forEach((node) => {
      if (node instanceof HTMLElement) {
        node.hidden = true;
      }
    });
    updateChrome("view1");
    if (homeButtonNode instanceof HTMLElement) {
      homeButtonNode.hidden = true;
    }
    return;
  }

  const measure = () => {
    Object.entries(scenes).forEach(([key, node]) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      metrics[key] = {
        top: node.offsetTop,
        range: Math.max(node.offsetHeight - window.innerHeight, 1),
      };
    });

    marquees.forEach((marquee) => {
      const trackStyles = window.getComputedStyle(marquee.track);
      const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0;
      marquee.loopWidth = marquee.baseGroup.getBoundingClientRect().width + gap;
      marquee.offset %= marquee.loopWidth || 1;
    });
  };

  const sceneProgress = (key) => {
    const metric = metrics[key];
    if (!metric) {
      return 0;
    }

    return clamp((window.scrollY - metric.top) / metric.range);
  };

  const applyView1 = (progress) => {
    const introComplete = document.body.dataset.introState === "complete";
    const exitProgress = easeInOut(segment(progress, 0.88, 1));

    if (view1Panel instanceof HTMLElement && introComplete) {
      view1Panel.style.transform = `translate3d(0, ${-48 * exitProgress}px, 0) scale(${1 - 0.024 * exitProgress})`;
      view1Panel.style.opacity = String(1 - 0.92 * exitProgress);
    }
  };

  const applyView2 = (progress) => {
    const enterProgress = easeOut(segment(progress, 0.12, 0.28));
    const exitProgress = easeInOut(segment(progress, 0.93, 1));
    const panelOpacity = enterProgress * (1 - exitProgress);
    const panelOffsetY = 42 * (1 - enterProgress) - 26 * exitProgress;
    const overviewProgress = enterProgress * (1 - 0.1 * exitProgress);
    const headingProgress = segment(progress, 0.26, 0.4);

    setElementVisibility(secondPanel, panelOpacity, `translate3d(0, ${panelOffsetY}px, 0)`, 0.22);
    setElementVisibility(
      secondOverview,
      overviewProgress,
      `translate3d(0, ${26 * (1 - overviewProgress)}px, 0) scale(${0.985 + 0.015 * easeOut(overviewProgress)})`,
      0.24,
    );

    setTransformOpacity(secondHeadingLeft, headingProgress, {
      xFrom: -46,
      yFrom: 0,
      scaleFrom: 0.98,
      pointerThreshold: 0.7,
    });
    setTransformOpacity(secondHeadingRight, headingProgress, {
      xFrom: 46,
      yFrom: 0,
      scaleFrom: 0.98,
      pointerThreshold: 0.7,
    });

    const ranges = [
      [0.42, 0.56],
      [0.58, 0.72],
      [0.74, 0.88],
    ];

    secondLeftItems.forEach((node, index) => {
      const [start, end] = ranges[index] ?? [0.22, 0.36];
      setTransformOpacity(node, segment(progress, start, end), {
        xFrom: -56,
        yFrom: 12,
        scaleFrom: 0.985,
        pointerThreshold: 0.4,
      });
    });

    secondRightItems.forEach((node, index) => {
      const [start, end] = ranges[index] ?? [0.22, 0.36];
      setTransformOpacity(node, segment(progress, start, end), {
        xFrom: 56,
        yFrom: 12,
        scaleFrom: 0.985,
        pointerThreshold: 0.34,
      });
    });
  };

  const applyView3 = (progress) => {
    const panelEnter = easeOut(segment(progress, 0.12, 0.28));
    const panelOpacity = panelEnter;
    const panelOffsetY = 42 * (1 - panelEnter);
    const entryProgress = segment(progress, 0.24, 0.42);
    const extrasProgress = segment(progress, 0.48, 0.66);
    const footerProgress = segment(progress, 0.84, 0.96);

    setElementVisibility(thirdPanel, panelOpacity, `translate3d(0, ${panelOffsetY}px, 0)`, 0.22);
    if (thirdFrame instanceof HTMLElement) {
      thirdFrame.style.transform = `translate3d(0, ${-26 * easeInOut(footerProgress)}px, 0)`;
    }
    setTransformOpacity(thirdEntry, entryProgress, {
      xFrom: 0,
      yFrom: 48,
      scaleFrom: 0.985,
      pointerThreshold: 0.42,
    });
    setTransformOpacity(thirdExtras, extrasProgress, {
      xFrom: 0,
      yFrom: 42,
      scaleFrom: 0.99,
      pointerThreshold: 0.42,
    });
    setTransformOpacity(thirdFooter, footerProgress, {
      xFrom: 0,
      yFrom: 34,
      scaleFrom: 0.985,
      pointerThreshold: 0.5,
    });

    const phase = progress < 0.34 ? "entry" : progress < 0.8 ? "marquee" : "footer";
    if (thirdPanel instanceof HTMLElement) {
      thirdPanel.dataset.phase = phase;
    }

    marquees.forEach((marquee) => {
      marquee.targetVelocity = phase !== "entry" && entryProgress > 0.9 && marquee.loopWidth > 0 ? marquee.loopWidth / marquee.speed : 0;
    });
  };

  const render = () => {
    renderQueued = false;

    const view1Progress = sceneProgress("view1");
    const view2Progress = sceneProgress("view2");
    const view3Progress = sceneProgress("view3");

    const activationLead = window.innerHeight * 0.18;
    const view2ActivationPoint = (metrics.view2?.top ?? Number.MAX_SAFE_INTEGER) - activationLead;
    if (homeButtonReturnLock && window.scrollY >= view2ActivationPoint + 18) {
      homeButtonReturnLock = false;
    }
    const activeView =
      window.scrollY >= (metrics.view3?.top ?? Number.MAX_SAFE_INTEGER) - activationLead
        ? "view3"
        : window.scrollY >= view2ActivationPoint
          ? "view2"
          : "view1";
    document.body.dataset.activeView = activeView;

    applyView1(view1Progress);
    applyView2(view2Progress);
    applyView3(view3Progress);
    updateChrome(activeView);

    const introComplete = document.body.dataset.introState === "complete";
    setCueVisibility(cues?.view1, activeView === "view1" && introComplete, 0.7);
    setCueVisibility(cues?.view2, activeView === "view2", 0.66);
    setCueVisibility(cues?.view3, activeView === "view3", 0.66);
  };

  const queueRender = () => {
    if (renderQueued) {
      return;
    }

    renderQueued = true;
    window.requestAnimationFrame(render);
  };

  const tickMarquee = (timestamp) => {
    const delta = lastMarqueeTimestamp ? Math.min(timestamp - lastMarqueeTimestamp, 48) : 16;
    lastMarqueeTimestamp = timestamp;

    marquees.forEach((marquee) => {
      if (marquee.loopWidth <= 0) {
        return;
      }

      const smoothing = 1 - Math.exp(-delta / 520);
      marquee.velocity += (marquee.targetVelocity - marquee.velocity) * smoothing;
      marquee.offset = (marquee.offset + marquee.velocity * (delta / 1000)) % marquee.loopWidth;
      if (marquee.offset < 0) {
        marquee.offset += marquee.loopWidth;
      }

      const translateX = marquee.direction === "ltr" ? -marquee.loopWidth + marquee.offset : -marquee.offset;
      marquee.track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    });

    window.requestAnimationFrame(tickMarquee);
  };

  measure();
  render();
  window.requestAnimationFrame(tickMarquee);

  window.addEventListener("scroll", queueRender, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    render();
  });
  window.addEventListener("load", () => {
    measure();
    render();
  });
  document.fonts?.ready?.then(() => {
    measure();
    render();
  });
}

function iconMarkup(icon) {
  const icons = {
    email: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.4-.5 7.6 6.1L19.6 5h-15.2Zm15.6 2.1-7.4 5.9a1 1 0 0 1-1.2 0L4 7.1v11.4c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V7.1Z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.2-1.4-4.2-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6A4.7 4.7 0 0 1 6.3 8c-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.3a11.7 11.7 0 0 1 6 0C18 4.5 19 4.8 19 4.8c.6 1.7.2 2.9.1 3.2a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>`,
    scholar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 9l10 6 9-5.4V17h1V9L12 3Zm-5 11.47V18l5 2.27L17 18v-3.53l-5 2.53-5-2.53Z"/></svg>`,
    cv: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.75A2.25 2.25 0 0 0 3.75 5v14A2.25 2.25 0 0 0 6 21.25h12A2.25 2.25 0 0 0 20.25 19V9.19a2.25 2.25 0 0 0-.66-1.59l-4.19-4.19a2.25 2.25 0 0 0-1.59-.66H6Zm7 .8v4.2c0 .69.56 1.25 1.25 1.25h4.2V19c0 .28-.22.5-.5.5H6a.5.5 0 0 1-.5-.5V5c0-.28.22-.5.5-.5h7Zm-5.25 8.7h8.5v1.5h-8.5v-1.5Zm0 3.5h8.5v1.5h-8.5v-1.5Zm0-7h3.5v1.5h-3.5v-1.5Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 8.75h3.94V21H3Zm6.33 0H13v1.68h.05c.55-1.04 1.9-2.14 3.92-2.14C21.07 8.29 21 12.25 21 15.92V21h-3.94v-4.62c0-1.1-.02-2.5-1.52-2.5-1.52 0-1.75 1.18-1.75 2.42V21H9.33Z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.2 3H21l-6.61 7.56L22 21h-6.86l-5.37-6.3L4.26 21H1l7.07-8.08L2 3h6.93l4.85 5.69L17.2 3Zm-1.2 15.95h1.9L7.9 4.95H5.86L16 18.95Z"/></svg>`,
  };

  return icons[icon] ?? "";
}

function magnifyIconMarkup() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.25 4.75a5.5 5.5 0 1 0 3.47 9.77l4.38 4.38 1.06-1.06-4.38-4.38a5.5 5.5 0 0 0-4.53-8.71Zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/></svg>`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function initHeroIntro(config) {
  const { pageShell, overlay, backdrop, stack, wordmarkText, introSignature, heroAnchor, heroSignature, wordmark } = config;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    !(pageShell instanceof HTMLElement) ||
    !(overlay instanceof HTMLElement) ||
    !(stack instanceof HTMLElement) ||
    !(wordmarkText instanceof HTMLElement) ||
    !(heroAnchor instanceof HTMLElement)
  ) {
    setSignatureState(heroSignature, "static");
    return;
  }

  if (prefersReducedMotion) {
    wordmarkText.textContent = wordmark;
    setSignatureState(heroSignature, "static");
    setSignatureState(introSignature, "static");
    overlay.hidden = true;
    overlay.setAttribute("hidden", "");
    document.body.dataset.introState = "complete";
    return;
  }

  const state = {
    status: "typing",
    progress: 0,
    threshold: window.innerHeight * 0.82,
    wheelDistance: 0,
    touchY: null,
    metrics: null,
    typingTimer: null,
    signatureTimer: null,
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const ease = (value) => 1 - Math.pow(1 - value, 3);

  const setStatus = (nextStatus) => {
    state.status = nextStatus;
    document.body.dataset.introState = nextStatus;
  };

  const resetStackTransform = () => {
    stack.style.transform = "translate3d(0px, 0px, 0) scale(1, 1)";
  };

  const measureMetrics = () => {
    resetStackTransform();
    const initialRect = stack.getBoundingClientRect();
    const finalRect = heroAnchor.getBoundingClientRect();

    state.metrics = {
      translateX: finalRect.left - initialRect.left,
      translateY: finalRect.top - initialRect.top,
      scaleX: finalRect.width / initialRect.width,
      scaleY: finalRect.height / initialRect.height,
    };
  };

  const updateHandoff = (progress) => {
    if (!state.metrics) {
      measureMetrics();
    }

    const metrics = state.metrics;
    if (!metrics) {
      return;
    }

    state.progress = clamp(progress, 0, 1);
    const eased = ease(state.progress);
    const translateX = metrics.translateX * eased;
    const translateY = metrics.translateY * eased;
    const scaleX = 1 + (metrics.scaleX - 1) * eased;
    const scaleY = 1 + (metrics.scaleY - 1) * eased;
    const pageOpacity = String(state.progress);
    const heroOpacity = String(clamp((state.progress - 0.72) / 0.28, 0, 1));
    const stackOpacity = String(clamp(1 - Math.max(0, state.progress - 0.88) / 0.12, 0, 1));
    const backdropOpacity = String(clamp(1 - state.progress * 1.08, 0, 1));

    setStatus(state.progress > 0 ? "handoff-active" : "handoff-ready");
    stack.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
    stack.style.opacity = stackOpacity;
    pageShell.style.opacity = pageOpacity;
    heroAnchor.style.opacity = heroOpacity;
    if (backdrop instanceof HTMLElement) {
      backdrop.style.opacity = backdropOpacity;
    }

    if (state.progress >= 1) {
      completeIntro();
    }
  };

  const completeIntro = () => {
    state.progress = 1;
    setStatus("complete");
    pageShell.style.opacity = "";
    heroAnchor.style.opacity = "";
    overlay.hidden = true;
    overlay.setAttribute("hidden", "");
    stack.style.opacity = "";
    if (backdrop instanceof HTMLElement) {
      backdrop.style.opacity = "";
    }
    resetStackTransform();
    document.removeEventListener("wheel", handleWheel, { passive: false });
    document.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("touchstart", handleTouchStart, { passive: false });
    window.removeEventListener("touchmove", handleTouchMove, { passive: false });
    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("touchcancel", handleTouchEnd);
    window.dispatchEvent(new Event("resize"));
  };

  const applyScrollDelta = (delta) => {
    if (state.status !== "handoff-ready" && state.status !== "handoff-active") {
      return;
    }

    state.wheelDistance = clamp(state.wheelDistance + delta, 0, state.threshold);
    updateHandoff(state.wheelDistance / state.threshold);
  };

  const handleWheel = (event) => {
    if (state.status !== "handoff-ready" && state.status !== "handoff-active") {
      return;
    }

    event.preventDefault();
    applyScrollDelta(event.deltaY);
  };

  const handleKeydown = (event) => {
    if (state.status !== "handoff-ready" && state.status !== "handoff-active") {
      return;
    }

    const forwardKeys = new Set(["ArrowDown", "PageDown", " ", "Enter"]);
    const backwardKeys = new Set(["ArrowUp", "PageUp"]);

    if (forwardKeys.has(event.key)) {
      event.preventDefault();
      applyScrollDelta(state.threshold / 7);
    }

    if (backwardKeys.has(event.key)) {
      event.preventDefault();
      applyScrollDelta(-state.threshold / 7);
    }
  };

  const handleTouchStart = (event) => {
    if (state.status !== "handoff-ready" && state.status !== "handoff-active") {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    state.touchY = touch.clientY;
  };

  const handleTouchMove = (event) => {
    if (state.status !== "handoff-ready" && state.status !== "handoff-active") {
      return;
    }

    const touch = event.touches[0];
    if (!touch || state.touchY === null) {
      return;
    }

    event.preventDefault();
    const delta = state.touchY - touch.clientY;
    state.touchY = touch.clientY;
    applyScrollDelta(delta * 1.2);
  };

  const handleTouchEnd = () => {
    state.touchY = null;
  };

  const handleResize = () => {
    state.threshold = window.innerHeight * 0.82;
    state.metrics = null;

    if (state.status === "handoff-ready" || state.status === "handoff-active") {
      updateHandoff(state.progress);
    }
  };

  const beginHandoff = () => {
    measureMetrics();
    setStatus("handoff-ready");
  };

  const beginSignature = () => {
    setStatus("signature");
    setSignatureState(introSignature, "animated");
    state.signatureTimer = window.setTimeout(beginHandoff, 2820);
  };

  const beginTyping = () => {
    setStatus("typing");
    wordmarkText.textContent = "";

    const letters = Array.from(wordmark);
    let index = 0;

    const typeNext = () => {
      index += 1;
      wordmarkText.textContent = letters.slice(0, index).join("");

      if (index < letters.length) {
        state.typingTimer = window.setTimeout(typeNext, 92);
        return;
      }

      state.typingTimer = window.setTimeout(beginSignature, 220);
    };

    state.typingTimer = window.setTimeout(typeNext, 160);
  };

  document.body.dataset.introState = "typing";
  pageShell.style.opacity = "0";
  heroAnchor.style.opacity = "0";
  overlay.hidden = false;
  overlay.removeAttribute("hidden");
  document.addEventListener("wheel", handleWheel, { passive: false });
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd);
  window.addEventListener("touchcancel", handleTouchEnd);
  beginTyping();
}
