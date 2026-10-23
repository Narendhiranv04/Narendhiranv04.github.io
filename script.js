import { siteContent as content } from "./content.js";

const icons = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  zoom: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M10.5 7.5v6m-3-3h6"/>',
  research: '<path d="M9 18h6m-6 3h6M8 14c-5-5-1-11 4-11s9 6 4 11l-1 3H9l-1-3Z"/><path d="m10 8 2 5 2-5m-2 5v4"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  plane: '<path d="m22 2-7 20-4-9-9-4L22 2ZM11 13 22 2Z"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-2-4.5"/>',
  trophy: '<path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-4 2h8"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3a5.7 5.7 0 0 0-1.5-4c.1-1 .1-2-.3-3 0 0-1.2-.4-4 1.5a13.5 13.5 0 0 0-7 0C5.2.6 4 1 4 1c-.4 1-.4 2-.3 3a5.7 5.7 0 0 0-1.5 4c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 8 18v4"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4"/>',
  scholar: '<path d="m2 9 10-6 10 6-10 6L2 9Zm4 3v6c4 3 8 3 12 0v-6m4-3v7"/>',
  cv: '<path d="M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8m-8 4h8"/>',
  x: '<path d="m4 3 16 18h-4L0 3h4Zm16 0L4 21" transform="translate(2 0) scale(.9 1)"/>',
};
const icon = (name, className = "") => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const external = (href, label, className = "") => `<a class="${className}" href="${escape(href)}"${href.startsWith("https://") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
function biography(text) {
  let html = escape(text);
  Object.entries(content.profile.links).forEach(([label, href]) => {
    html = html.replace(escape(label), external(href, escape(label)));
  });
  content.profile.emphasis.forEach(label => {
    html = html.replace(escape(label), `<strong>${escape(label)}</strong>`);
  });
  return html;
}

function robotMark() {
  return `<svg class="robot-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 8v6" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="6" r="3" fill="currentColor"/><rect x="9" y="15" width="30" height="24" rx="8" stroke="currentColor" stroke-width="2"/><path d="M5 23v8m38-8v8M18 33h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="24" r="2.5" fill="currentColor"/><circle cx="30" cy="24" r="2.5" fill="currentColor"/></svg>`;
}
function sectionHead(id, symbol, title, accent, note = "") {
  return `<div class="section-heading"><h2 id="${id}">${icon(symbol)}<span>${title} <em>${accent}</em></span></h2>${note ? `<span class="section-note">${note}</span>` : ""}</div>`;
}
function researchRow(item, index) {
  return `<article class="research-row">
    <button class="research-image image-button" data-research="${index}" aria-label="Enlarge ${escape(item.title)} overview">
      <img src="${escape(item.image)}" alt="${escape(item.imageAlt)}" width="240" height="150" loading="lazy" /><span class="zoom-hint">${icon("zoom")}</span>
    </button>
    <div class="research-copy">
      <div class="item-meta"><span class="badge">${escape(item.label)}</span><span>${escape(item.category)}</span></div>
      <h3>${external(item.href, escape(item.title))}</h3>
      <p class="research-subtitle">${escape(item.subtitle)}</p><p>${escape(item.description)}</p>
      <div class="research-bottom"><div class="topic-list">${item.tags.map(tag => `<span>${escape(tag)}</span>`).join("")}</div>${external(item.href, `Project ${icon("arrow")}`, "text-link")}</div>
    </div></article>`;
}
function projectCard(item, index) {
  return `<article class="project-card project-card--${item.theme}">
    <div class="project-card-top"><span class="project-number">0${index + 1}</span><span class="project-category">${escape(item.category)}</span></div>
    <h3>${escape(item.title)}</h3><p>${escape(item.description)}</p>
    ${item.href ? external(item.href, `Repository ${icon("arrow")}`, "text-link") : '<span class="work-status"><span class="status-dot"></span> Work in progress</span>'}
  </article>`;
}
function competitionRow(item, index) {
  return `<article class="competition-row">
    <button class="competition-image image-button" data-competition="${index}" aria-label="Explore ${escape(item.projectTitle)}"><img src="${escape(item.thumbnail.src)}" alt="${escape(item.thumbnail.alt)}" width="200" height="140" loading="lazy" /><span class="zoom-hint">${icon("arrow")}</span></button>
    <div class="competition-copy"><div class="item-meta"><span>${escape(item.competitionLabel)}</span><span class="meta-separator">/</span><span>${escape(item.timeframe)}</span></div>
      <h3><button class="title-button" data-competition="${index}">${escape(item.projectTitle)} ${icon("arrow")}</button></h3><p>${escape(item.summary)}</p>
      <div class="competition-bottom"><span class="outcome">${escape(item.outcome)}</span><button class="text-link" data-competition="${index}">Explore project ${icon("arrow")}</button></div>
    </div></article>`;
}
function communityRow(item) {
  return `<article class="community-row"><img src="${escape(item.image)}" alt="${escape(item.imageAlt)}" width="112" height="92" loading="lazy" /><div><p class="community-role">${escape(item.role)}</p><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></div></article>`;
}

document.querySelector("#app").innerHTML = `
  <div class="site-shell" id="top">
    <header class="site-header">
      <a href="#top" class="brand" aria-label="${escape(content.profile.name)}, back to top"><span class="brand-mark">${robotMark()}</span><span class="brand-name">naren<span>.</span><small>robots & a little curiosity</small></span></a>
      <div class="header-actions">${external(content.footerCta.href, `Say hello ${icon("arrow")}`, "hello-link")}<span class="header-divider"></span><button class="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false">${icon("sun", "theme-sun")}${icon("moon", "theme-moon")}</button></div>
    </header>
    <main id="main" tabindex="-1">
      <section class="hero" aria-labelledby="intro-title">
        <div class="hero-copy">
          <h1 id="intro-title">Hi! I'm <span>${escape(content.profile.greetingName)}.</span></h1><p class="hero-pronunciation">${escape(content.profile.nickname)}</p>
          <div class="bio">${content.profile.paragraphs.map(p => `<p>${biography(p)}</p>`).join("")}</div>
          <div class="social-links" aria-label="Find me online">${content.socialLinks.map(link => external(link.href, `${icon(link.icon === "email" ? "mail" : link.icon)}${escape(link.label)}`, "social-link")).join("")}</div>
        </div>
        <figure class="portrait">
          <svg class="portrait-spark" viewBox="0 0 90 75" fill="none" aria-hidden="true"><path d="m10 35 14 6M25 13l9 18M49 5l-2 22M72 15 60 32M85 39l-18 5" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>
          <div class="portrait-frame"><img src="${escape(content.portraitCard.image)}" alt="${escape(content.portraitCard.alt)}" width="900" height="900" fetchpriority="high" /></div>
          <figcaption><span class="status-dot"></span> ${escape(content.profile.caption)} <svg viewBox="0 0 40 25" fill="none" aria-hidden="true"><path d="M2 19C13 21 29 17 33 4m-8 3 9-5 4 10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></figcaption>
        </figure>
      </section>
      <nav class="section-nav" aria-label="On this page"><a href="#research" class="is-active">Research</a><a href="#projects">Projects</a><a href="#competitions">Competitions</a><a href="#community">Community</a><a href="#contact">Contact ${icon("arrow")}</a></nav>
      <section class="content-section research-section" aria-labelledby="research" data-section>${sectionHead("research", "research", "Selected", "research", "Perception, planning & everything between")}<div class="research-list">${content.experiments.items.map(researchRow).join("")}</div></section>
      <aside class="affiliations" aria-label="Research collaborations"><p>Learning & building<br />with people at</p><div>${content.companyLogos.logos.map(logo => external(logo.href, escape(logo.shortName), "affiliation-link")).join("")}</div></aside>
      <section class="content-section" aria-labelledby="projects" data-section>${sectionHead("projects", "code", "Things I'm", "building", "A few ongoing explorations")}<div class="projects-grid">${content.projects.items.map(projectCard).join("")}</div></section>
      <section class="content-section" aria-labelledby="competitions" data-section>
        ${sectionHead("competitions", "plane", "From idea to", "flight", "Competition projects")}<div class="competition-list">${content.competitions.items.map(competitionRow).join("")}</div>
        <div class="recognition">${content.recognition.map((item, index) => `${index ? '<span class="recognition-divider"></span>' : ""}<div>${icon("trophy")}<p><strong>${escape(item.title)}</strong><span>${escape(item.event)}</span></p></div>`).join("")}</div>
      </section>
      <section class="content-section community-section" aria-labelledby="community" data-section>${sectionHead("community", "people", "Beyond the", "lab", "Clubs, classrooms & good company")}<div class="community-grid">${content.extracurriculars.items.map(communityRow).join("")}</div></section>
      <section class="contact-section" aria-labelledby="contact" data-section><span class="contact-kicker">THERE'S ALWAYS MORE TO EXPLORE</span><h2 id="contact">Good ideas start with<br />a <em>conversation.</em></h2><p>${escape(content.footerCta.text)}</p>${external(content.footerCta.href, `Let's talk ${icon("arrow")}`, "contact-link")}<span class="contact-email">narendhiranv.nitt@gmail.com</span></section>
    </main>
    <footer class="site-footer"><div><a href="#top" class="footer-brand">naren<span>.</span></a><p>Thanks for stopping by. Stay curious.</p></div><a href="#top" class="back-top">Back to top ${icon("arrow")}</a></footer>
  </div>
  <dialog class="detail-dialog" aria-labelledby="dialog-title"><div class="dialog-header"><h2 id="dialog-title"></h2><button class="dialog-close icon-button" aria-label="Close detail view">${icon("close")}</button></div><div class="dialog-content"></div></dialog>
`;

// Use the saved preference across visits; otherwise follow the operating system.
const themeButton = document.querySelector(".theme-toggle");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let themePreference;
try { themePreference = localStorage.getItem("naren-theme"); } catch {}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
  themeButton.title = `Switch to ${dark ? "light" : "dark"} mode`;
  document.querySelector('meta[name="theme-color"]').content = dark ? "#191a1c" : "#faf9f6";
}
applyTheme(document.documentElement.dataset.theme);
themeButton.addEventListener("click", () => {
  themePreference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(themePreference);
  try { localStorage.setItem("naren-theme", themePreference); } catch {}
});
systemTheme.addEventListener("change", (event) => {
  if (themePreference !== "light" && themePreference !== "dark") applyTheme(event.matches ? "dark" : "light");
});
window.addEventListener("storage", (event) => {
  if (event.key !== "naren-theme" && event.key !== null) return;
  themePreference = event.key === null ? null : event.newValue;
  applyTheme(themePreference === "light" || themePreference === "dark" ? themePreference : systemTheme.matches ? "dark" : "light");
});

// Native dialogs provide keyboard focus management and Escape-to-close.
const dialog = document.querySelector(".detail-dialog");
const dialogContent = dialog.querySelector(".dialog-content");
let dialogTrigger;
function openDetail(trigger, title, html, imageOnly = false) {
  dialogTrigger = trigger;
  dialog.querySelector("#dialog-title").textContent = title;
  dialogContent.innerHTML = html;
  dialog.classList.toggle("detail-dialog--image", imageOnly);
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add("dialog-open");
  dialog.querySelector(".dialog-close").focus({ preventScroll: true });
}
document.querySelectorAll("[data-research]").forEach(button => button.addEventListener("click", () => {
  const item = content.experiments.items[Number(button.dataset.research)];
  openDetail(button, item.title, `<div class="research-full-image"><img src="${escape(item.image)}" alt="${escape(item.imageAlt)}" /></div><p>${escape(item.description)}</p>${external(item.href, `Explore project ${icon("arrow")}`, "text-link")}`, true);
}));
document.querySelectorAll("[data-competition]").forEach(button => button.addEventListener("click", () => {
  const item = content.competitions.items[Number(button.dataset.competition)];
  openDetail(button, item.projectTitle, `<p class="dialog-eyebrow">${escape(item.competitionLabel)} · ${escape(item.timeframe)} · ${escape(item.focus)}</p><div class="dialog-gallery">${item.collageImages.map((img, index) => `<figure${index === 0 ? ' class="dialog-gallery-main"' : ""}><img src="${escape(img.src)}" alt="${escape(img.alt)}" /></figure>`).join("")}</div><p class="dialog-summary">${escape(item.summary)}</p>${item.detailParagraphs.map(p => `<p>${escape(p)}</p>`).join("")}<p class="dialog-outcome">${escape(item.outcome)}</p><div class="dialog-tags">${item.technologies.map(tech => `<span>${escape(tech)}</span>`).join("")}</div>${external(item.codeUrl, `View project resources ${icon("arrow")}`, "text-link")}`);
}));
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", event => {
  if (event.key !== "Tab") return;
  const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')]
    .filter(element => element.getClientRects().length);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
let pointerStartedOutside = false;
dialog.addEventListener("pointerdown", event => {
  const rect = dialog.getBoundingClientRect();
  pointerStartedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
});
dialog.addEventListener("click", event => {
  const rect = dialog.getBoundingClientRect();
  if (pointerStartedOutside && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  pointerStartedOutside = false;
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  dialogTrigger?.focus({ preventScroll: true });
});

// Keep the section index in sync without intercepting normal anchor navigation.
const navigationLinks = [...document.querySelectorAll(".section-nav a")];
const sections = [...document.querySelectorAll("[data-section]")];
let scrollScheduled = false;
function updateNavigation() {
  let current = "research";
  sections.forEach(section => {
    const heading = section.querySelector("h2");
    if (heading.getBoundingClientRect().top <= Math.min(300, window.innerHeight * 0.4)) current = section.getAttribute("aria-labelledby");
  });
  // Several short sections can share the last scroll position on tall screens.
  // Honor an explicitly selected, visible section there.
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    const selected = sections.find(section => `#${section.getAttribute("aria-labelledby")}` === window.location.hash);
    const top = selected?.querySelector("h2").getBoundingClientRect().top;
    current = selected && top >= 0 && top < window.innerHeight ? selected.getAttribute("aria-labelledby") : "contact";
  }
  navigationLinks.forEach(link => {
    const active = link.hash === `#${current}`;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scrollScheduled = false;
}
window.addEventListener("scroll", () => {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener("hashchange", updateNavigation);
window.addEventListener("resize", updateNavigation);
updateNavigation();
