/**
 * @typedef {Object} HeroContent
 * @property {string} wordmark
 */

/**
 * @typedef {Object} AboutContent
 * @property {string} heading
 * @property {string[]} paragraphs
 * @property {string} signatureLabel
 */

/**
 * @typedef {Object} SocialLink
 * @property {string} label
 * @property {string} href
 * @property {'email' | 'github' | 'scholar' | 'linkedin' | 'cv' | 'x'} icon
 */

/**
 * @typedef {Object} PortraitCard
 * @property {string} image
 * @property {string} alt
 * @property {string} fileName
 * @property {string} helper
 */

/**
 * @typedef {Object} ResearchItem
 * @property {string} title
 * @property {string} description
 * @property {string} href
 * @property {string} image
 * @property {string} imageAlt
 */

/**
 * @typedef {Object} ResearchSection
 * @property {string} label
 * @property {ResearchItem[]} items
 */

/**
 * @typedef {Object} CollaborationLogo
 * @property {'utdallas' | 'ntu' | 'iiith' | 'monash' | 'iitbombay' | 'nittrichy'} id
 * @property {string} name
 * @property {string} href
 */

/**
 * @typedef {Object} CompetitionImage
 * @property {string} src
 * @property {string} alt
 */

/**
 * @typedef {Object} CompetitionProject
 * @property {string} competitionLabel
 * @property {string} projectTitle
 * @property {string} focus
 * @property {string} timeframe
 * @property {string} summary
 * @property {string} outcome
 * @property {string[]} technologies
 * @property {CompetitionImage[]} collageImages
 * @property {string[]} detailParagraphs
 * @property {string} codeUrl
 * @property {string} deckWordmark
 */

/**
 * @typedef {Object} ProjectItem
 * @property {string} title
  * @property {string} description
  * @property {string} href
 * @property {string} ctaLabel
 * @property {'rpx' | 'memory' | 'pixel'} theme
 * @property {string} glyph
 */

/**
 * @typedef {Object} ExtracurricularItem
 * @property {string} role
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {string} imageAlt
 */

/**
 * @typedef {Object} FooterCta
 * @property {string} text
 * @property {string} linkLabel
 * @property {string} href
 */

/**
 * @typedef {Object} SiteContent
 * @property {HeroContent} hero
 * @property {AboutContent} about
 * @property {SocialLink[]} socialLinks
 * @property {PortraitCard} portraitCard
 * @property {ResearchSection} experiments
 * @property {{heading: string, logos: CollaborationLogo[]}} companyLogos
 * @property {{label: string, items: CompetitionProject[]}} competitions
 * @property {{label: string, items: ProjectItem[]}} projects
 * @property {{label: string, items: ExtracurricularItem[]}} extracurriculars
 * @property {FooterCta} footerCta
 */

/** @type {SiteContent} */
export const siteContent = {
  hero: {
    wordmark: "narendhiran.",
  },
  about: {
    heading: "About me",
    paragraphs: [
      "I like robots, and I keep finding more reasons to study them. My interest and work mostly revolve around robotic manipulation, embodied AI, and robot perception.",
      "I completed my bachelor's at NIT Trichy and am currently working as a research assistant at IIIT Hyderabad. Honestly, robots are still the coolest things to me, and being part of this fast-evolving space keeps me curious, grounded, and driven every day.",
    ],
    signatureLabel: "Narendhiran",
  },
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/Narendhiranv04",
      icon: "github",
    },
    {
      label: "Scholar",
      href: "https://scholar.google.com/citations?user=ge9liYgAAAAJ&hl=en",
      icon: "scholar",
    },
    {
      label: "CV",
      href: "https://drive.google.com/file/d/1YmHWeGVPjrDUXH3FvxaLoqsFc2yfGTDT/view?usp=sharing",
      icon: "cv",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/narendhiranv/",
      icon: "linkedin",
    },
    {
      label: "X",
      href: "https://x.com/narendhiranv04",
      icon: "x",
    },
    {
      label: "Mail",
      href: "mailto:narendhiranv.nitt@gmail.com",
      icon: "email",
    },
  ],
  portraitCard: {
    image: "./assets/naren-portrait-card.jpg",
    alt: "Portrait of Narendhiran Vijayakumar.",
    fileName: "yep, that's me!",
    helper: "scratch?",
  },
  experiments: {
    label: "Selected research",
    items: [
      {
        title: "RPX",
        description:
          "A unified real-world benchmark for evaluating robot perception under embodied deployment conditions.",
        href: "https://huggingface.co/IRVLUTD",
        image: "./assets/research-rpx-overview.png",
        imageAlt: "Overview diagram for the RPX benchmark.",
      },
      {
        title: "segLLM-TAMP",
        description: "Failure recovery and generalization for long-horizon language-guided manipulation.",
        href: "https://github.com/Narendhiranv04/seg-LLM-TAMP",
        image: "./assets/research-concept-2.jpg",
        imageAlt: "System concept diagram for segLLM-TAMP.",
      },
      {
        title: "AURASeg",
        description: "Boundary-aware drivable-area segmentation for resource-constrained navigation.",
        href: "https://github.com/Narendhiranv04/AURASeg",
        image: "./assets/architecture-1-preview.png",
        imageAlt: "Architecture diagram for AURASeg.",
      },
    ],
  },
  companyLogos: {
    heading: "Collaborations with",
    logos: [
      {
        id: "utdallas",
        name: "The University of Texas at Dallas",
        href: "https://utdallas.edu/",
      },
      {
        id: "ntu",
        name: "Nanyang Technological University",
        href: "https://www.ntu.edu.sg/",
      },
      {
        id: "iiith",
        name: "IIIT Hyderabad",
        href: "https://www.iiit.ac.in/",
      },
      {
        id: "monash",
        name: "Monash University",
        href: "https://www.monash.edu/",
      },
      {
        id: "iitbombay",
        name: "IIT Bombay",
        href: "https://www.iitb.ac.in/",
      },
      {
        id: "nittrichy",
        name: "NIT Tiruchirappalli",
        href: "https://www.nitt.edu/",
      },
    ],
  },
  competitions: {
    label: "Competition Projects",
    items: [
      {
        competitionLabel: "SAE AeroTHON",
        projectTitle: "Autonomous UAS",
        focus: "Aerial Robotics · Systems Lead",
        timeframe: "2024",
        summary:
          "Led the systems team delivering a competition-ready quadcopter with onboard vision and dynamic replanning.",
        outcome: "Top-15 national finish across endurance, payload-drop, and navigation.",
        technologies: ["ROS 2", "uXRCE-DDS", "PX4", "Raspberry Pi 5"],
        collageImages: [
          {
            src: "./assets/competition/uas-main.jpg",
            alt: "Autonomous quadcopter at the SAE AeroTHON.",
          },
          {
            src: "./assets/competition/uas-team.jpg",
            alt: "Autonomous UAS systems team preparing the quadcopter before flight.",
          },
          {
            src: "./assets/competition/uas-flight.jpg",
            alt: "Autonomous quadcopter ready on the launch pad at SAE AeroTHON.",
          },
        ],
        detailParagraphs: [
          "Raspberry Pi 5 runs vision and the route planner. SSD-MobileNet-v2 was converted to NCNN, delivering around 20 ms per frame while ROS 2 over uXRCE-DDS linked the Pi to PX4 on a Pixhawk 6C for low-latency updates.",
          "SWEEP coverage alternated with SERVICE nearest-neighbour updates, inserting fresh ROIs immediately so the path could reshape in flight. Safety layers covered GPS geofence return-to-home, RF-loss return, and battery-triggered landing logic.",
        ],
        codeUrl: "https://drive.google.com/drive/folders/1kKaMLSFk3kYxo7mgzinFKQgGFMAoyrcK?usp=sharing",
        deckWordmark: "AEROTHON",
      },
      {
        competitionLabel: "MathWorks Minidrone",
        projectTitle: "Parrot Mambo Autonomy Challenge",
        focus: "Embedded Autonomy · Controls Engineer",
        timeframe: "2024",
        summary: "Built an autonomy stack for the Parrot Mambo minidrone using MATLAB and Simulink.",
        outcome: "Achieved fully autonomous line-following with reliable gate traversal in final demos.",
        technologies: ["MATLAB", "Simulink", "Stateflow", "PID Control"],
        collageImages: [
          {
            src: "./assets/competition/mambo-main.jpg",
            alt: "Parrot Mambo drone on display at the MathWorks challenge.",
          },
          {
            src: "./assets/competition/mambo-real.png",
            alt: "MathWorks Minidrone competition arena with the Parrot Mambo on track.",
          },
          {
            src: "./assets/competition/mambo-simulink.png",
            alt: "Simulink environment visualising the Parrot Mambo autonomy stack.",
          },
        ],
        detailParagraphs: [
          "A custom image-processing pipeline performed path detection through channel filtering, binarization, and morphological erosion, extracting clean contours for trajectory estimation.",
          "A Stateflow path planner in Simulink drove cascaded PID loops for roll, pitch, and yaw, enabling virtual target point tracking and stable autonomous course correction under varying lighting and path curvature.",
        ],
        codeUrl: "https://drive.google.com/drive/folders/1aYSyzn0AptxgAfXk2vBQw_lc9TUsJ8UO?usp=sharing",
        deckWordmark: "MAMBO",
      },
      {
        competitionLabel: "Smart India Hackathon",
        projectTitle: "PixelBot Multimodal Assistant",
        focus: "Multimodal AI · Team Lead",
        timeframe: "2024",
        summary:
          "Developed a multimodal conversational image recognition chatbot for segmentation, inpainting, and generation.",
        outcome: "Secured second place in the national qualifier while open-sourcing reusable evaluation utilities.",
        technologies: ["Python", "PyTorch", "React", "TypeScript"],
        collageImages: [
          {
            src: "./assets/competition/pixelbot-main.jpg",
            alt: "PixelBot multimodal assistant interface mockup.",
          },
          {
            src: "./assets/competition/pixelbot-chatbot.png",
            alt: "PixelBot multimodal assistant interface answering a user prompt.",
          },
          {
            src: "./assets/competition/pixelbot-interface.png",
            alt: "PixelBot chatbot workflow showing multimodal editing tools.",
          },
        ],
        detailParagraphs: [
          "The chatbot fused LLaVA Interactive, SAM2, and Stable Diffusion with GLIGEN into a single multimodal pipeline capable of describe, segment, inpaint, and generate interactions through dialogue.",
          "An LSTM memory buffer maintained conversational continuity, while a React and TypeScript frontend with a Flask and MongoDB backend orchestrated PyTorch models and iterative RAKE or YAKE keyword extraction.",
        ],
        codeUrl: "https://github.com/Narendhiranv04/Multimodal-Conversational-Image-Recognition-Chatbot.git",
        deckWordmark: "PIXELBOT",
      },
    ],
  },
  projects: {
    label: "Personal Projects",
    items: [
      {
        title: "GeoClean-3D",
        description:
          "A perception-to-planning framework for cleaning irregular 3D basin surfaces by reconstructing geometry, parameterizing and unwrapping the surface, and generating geometry-aware cleaning actions.",
        href: "",
        ctaLabel: "Currently working",
        theme: "rpx",
        glyph: "G",
      },
      {
        title: "Moto-Memory-VLA",
        description:
          "Latent-action retrieval, FAISS memory, and contrastive learning for better generalization in embodied control.",
        href: "https://github.com/Narendhiranv04/Moto",
        ctaLabel: "View more",
        theme: "memory",
        glyph: "M",
      },
      {
        title: "Fuzzy-GRU Exoskeleton",
        description:
          "A lightweight encoder-decoder GRU with a Mamdani fuzzy inference system for real-time sit-to-walk torque estimation in robotic exoskeletons.",
        href: "https://github.com/Narendhiranv04/gru_fis_framework",
        ctaLabel: "View more",
        theme: "pixel",
        glyph: "F",
      },
    ],
  },
  extracurriculars: {
    label: "Extracurricular Activities",
    items: [
      {
        role: "Technical Mentor · 2024 - Present",
        title: "Third Dimension Aeromodelling Club",
        description: "Developed autonomous drones, led workshops, and represented NIT Trichy.",
        image: "./assets/extracurriculars/3d.jpg",
        imageAlt: "Students building an RC aircraft in the Third Dimension aeromodelling club.",
      },
      {
        role: "Vice President · 2025 - Present",
        title: "Maximus - Math & Physics Society",
        description: "Designed the induction pipeline, curated ML projects, and mentored juniors.",
        image: "./assets/extracurriculars/maximus.jpg",
        imageAlt: "Students solving math and physics problems together at Maximus.",
      },
      {
        role: "Head of Workshops · 2023 - Present",
        title: "Synergy, Mechanical Symposium",
        description: "Organized a robotics workshop while managing logistics, speakers, and audience flow.",
        image: "./assets/extracurriculars/synergy.jpg",
        imageAlt: "Workshop audience at the Synergy mechanical engineering symposium.",
      },
      {
        role: "Physics Manager · 2024",
        title: "IGNITTE - Teaching Club",
        description: "Led free JEE training and mentored rural students with physics and career guidance.",
        image: "./assets/extracurriculars/ignitte.jpg",
        imageAlt: "High school students trying a robot demo through the IGNITTE teaching club.",
      },
    ],
  },
  footerCta: {
    text: "Have a robotics idea, research collaboration, or ambitious prototype in mind?",
    linkLabel: "Let's talk.",
    href: "mailto:narendhiranv.nitt@gmail.com",
  },
};
