---
layout: default
title: Narendhiran Vijayakumar — Robotics Researcher
---

<header class="site-header" role="banner">
  <div class="site-header__inner">
    <a href="{{ '/' | relative_url }}" class="brand">NV</a>
    <nav aria-label="Primary" role="navigation">
      <ul class="nav-tabs">
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#publications">Publications</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#leadership">Leadership</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">
      <span class="theme-toggle__icon" aria-hidden="true">☀️</span>
      <span class="theme-toggle__label">Theme</span>
    </button>
  </div>
</header>

<section class="hero" aria-labelledby="site-title">
  <div class="hero__intro">
    <h1 id="site-title">Narendhiran Vijayakumar</h1>
    <p class="hero__tagline">Designing embodied AI and task &amp; motion planning systems that earn trust outside the lab.</p>
    <div class="hero__cta">
      <a class="button" href="mailto:narendhiranv.nitt@gmail.com">Let&rsquo;s collaborate</a>
      <a class="button button--outline" href="https://drive.google.com/file/d/1SyGD0DjldZzbLfe_uZA7Cfn02GoxvzdS/view?usp=sharing" target="_blank" rel="noopener">View CV</a>
    </div>
  </div>

  <div class="hero__panels">
    <div class="hero__panel">
      <h2 class="hero__panel-title">Focus areas</h2>
      <ul>
        <li>Embodied AI for dependable autonomy</li>
        <li>Robotics perception &amp; control</li>
        <li>Task and motion planning</li>
      </ul>
    </div>
    <div class="hero__panel">
      <h2 class="hero__panel-title">Connect</h2>
      <ul>
        <li><a href="mailto:narendhiranv.nitt@gmail.com">narendhiranv.nitt@gmail.com</a></li>
        <li><a href="https://www.linkedin.com/in/narendhiranv04" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="https://github.com/NarendhiranV04" target="_blank" rel="noopener">GitHub</a></li>
      </ul>
    </div>
  </div>
</section>

<section id="about" class="content-section" aria-labelledby="about-heading">
  <h2 id="about-heading">About</h2>
  <p>
    I connect machine learning, controls and experimentation to deploy autonomy that feels reliable from the very first demo.
    My work spans adaptive controllers, lightweight neural architectures and multimodal perception for robots that operate alongside people.
  </p>
  <p>
    Across labs and competitions I enjoy building full-stack robotics systems&mdash;from sensing pipelines and motion planning to
    evaluation frameworks that highlight real-world readiness.
  </p>
</section>

<section id="experience" class="content-section" aria-labelledby="experience-heading">
  <h2 id="experience-heading">Experience</h2>
  <div class="card-grid">
    <article class="card">
      <h3>Monash University</h3>
      <p class="card__meta">Research Intern &middot; Jan 2025 &ndash; May 2025</p>
      <ul>
        <li>Built a lightweight GRU that matched attention-LSTM accuracy for sit-to-walk torque prediction while reducing latency by 25%.</li>
        <li>Embedded a Mamdani fuzzy controller in an ONNX-powered C/C++ runtime to guarantee sub-2&nbsp;ms actuation for exoskeleton joints.</li>
      </ul>
    </article>
    <article class="card">
      <h3>IIT Bombay</h3>
      <p class="card__meta">Summer Research Intern &middot; Jun 2024 &ndash; Sep 2024</p>
      <ul>
        <li>Authored APUD, ASPP-Lite and RBRM modules to capture multi-scale context in drivable-area segmentation for compact platforms.</li>
        <li>Delivered state-of-the-art mIoU and F1 scores on Gazebo and GMRPD datasets, outperforming YOLOP in dense traffic scenes.</li>
      </ul>
    </article>
    <article class="card">
      <h3>NIT Tiruchirappalli</h3>
      <p class="card__meta">Student Researcher &middot; 2023 &ndash; 2024</p>
      <ul>
        <li>Crafted performance feedback for Bharatanatyam using temporal alignment and skeletal keypoints tuned for classical dance.</li>
        <li>Implemented YOLOv5-OBB on FAIR1M to capture rotated bounding boxes and benchmarked a novel fIoU metric.</li>
      </ul>
    </article>
  </div>
</section>

<section id="publications" class="content-section" aria-labelledby="publications-heading">
  <h2 id="publications-heading">Publications</h2>
  <ol class="stacked-list">
    <li>
      <article>
        <h3>Robotic Perception Through Drivable Area Segmentation Using a Hybrid Attention-Guided Approach</h3>
        <p class="item-meta">IEEE Transactions on Artificial Intelligence &middot; under review</p>
      </article>
    </li>
    <li>
      <article>
        <h3>Fuzzy Logic&ndash;GRU Framework for Real-Time Sit-to-Walk Joint Torque Estimation in Robotic Exoskeletons</h3>
        <p class="item-meta">IEEE Transactions on Neural Networks and Learning Systems &middot; in draft</p>
      </article>
    </li>
    <li>
      <article>
        <h3>Design and Structural Validation of a Sub-2&nbsp;kg Autonomous Micro-UAV with On-Board Dynamic Route Planning</h3>
        <p class="item-meta">Mechatronics and Robotics Engineering (MRAE) 2025 Conference &middot; in draft</p>
      </article>
    </li>
  </ol>
</section>

<section id="projects" class="content-section" aria-labelledby="projects-heading">
  <h2 id="projects-heading">Selected projects</h2>
  <div class="card-grid">
    <article class="card">
      <h3>Autonomous UAS &mdash; SAE AeroTHON</h3>
      <p class="card__meta">Apr 2024 &ndash; Nov 2024</p>
      <p>Led avionics and autonomy for a top-15 quadcopter, fusing Pixhawk and Raspberry Pi controllers with ROS&nbsp;2 comms and NCNN-optimised SSD-MobileNetv2 detectors for 20&nbsp;ms tracking.</p>
    </article>
    <article class="card">
      <h3>PixelBot &mdash; Smart India Hackathon</h3>
      <p class="card__meta">Aug 2024 &ndash; Sep 2024</p>
      <p>Built a multimodal assistant blending LLaVA, SAM2 and GLIGEN for segmentation, inpainting and visual reasoning with persistent memory.</p>
    </article>
    <article class="card">
      <h3>MathWorks Minidrone Challenge</h3>
      <p class="card__meta">Jul 2024 &ndash; Aug 2024</p>
      <p>Created a computer-vision guidance stack for the Parrot Mambo using adaptive morphology, cascaded PID control and virtual target tracking for agile indoor flight.</p>
    </article>
    <article class="card">
      <h3>Occlusion-Aware Navigation Toolkit</h3>
      <p class="card__meta">Mar 2024</p>
      <p>Authored a Python toolkit to compute tangent arcs, mask occlusions and generate tunable circular trajectories from right-angle start poses.</p>
    </article>
  </div>
</section>

<section id="leadership" class="content-section" aria-labelledby="leadership-heading">
  <h2 id="leadership-heading">Leadership</h2>
  <div class="card-grid">
    <article class="card">
      <h3>Technical Head &middot; Third Dimension Aeromodelling Club</h3>
      <p class="card__meta">Mar 2024 &ndash; Present</p>
      <p>Guides autonomous drone development, curates avionics workshops and mentors teams representing NIT Trichy in national competitions.</p>
    </article>
    <article class="card">
      <h3>Vice President &middot; Maximus Math &amp; Physics Society</h3>
      <p class="card__meta">May 2025 &ndash; Present</p>
      <p>Leads project-based learning across mathematical modelling and physics-informed ML while mentoring juniors through research pipelines.</p>
    </article>
    <article class="card">
      <h3>Workshops Manager &middot; Synergy Symposium</h3>
      <p class="card__meta">Nov 2023 &ndash; Present</p>
      <p>Orchestrates robotics workshops end-to-end, from speaker engagements to logistics for the flagship mechanical engineering symposium.</p>
    </article>
    <article class="card">
      <h3>STEM Outreach &amp; Public Relations</h3>
      <p class="card__meta">Mar 2023 &ndash; Jul 2024</p>
      <p>Led IGNITTE physics mentoring, directed Pragyan public relations for 1,500+ attendees and delivered robotics demonstrations for school students.</p>
    </article>
  </div>
</section>

<section id="contact" class="content-section content-section--accent" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Let's collaborate</h2>
  <p>I am excited to partner on research, internships and conversations around embodied AI, perception and autonomy.</p>
  <div class="cta-row">
    <a class="button" href="mailto:narendhiranv.nitt@gmail.com">Email me</a>
    <a class="button button--outline" href="https://www.linkedin.com/in/narendhiranv04" target="_blank" rel="noopener">LinkedIn</a>
    <a class="button button--outline" href="https://drive.google.com/file/d/1SyGD0DjldZzbLfe_uZA7Cfn02GoxvzdS/view?usp=sharing" target="_blank" rel="noopener">View CV</a>
  </div>
</section>

<footer class="page-footer" role="contentinfo">
  <p>&copy; 2025 Narendhiran Vijayakumar.</p>
</footer>

<script src="{{ '/assets/js/site.js' | relative_url }}" defer></script>
