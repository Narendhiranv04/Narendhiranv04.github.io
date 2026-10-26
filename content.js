// Portfolio content. Publication metadata and figures are verified against arXiv.
export const siteContent = {
  "profile": {
    "name": "Narendhiran Vijayakumar",
    "greetingName": "Narendhiran",
    "nickname": "(Naren)",
    "paragraphs": [
      "I'm a Research Assistant at IIIT Hyderabad, exploring robotic manipulation at the intersection of robot learning, task and motion planning, and embodied intelligence. My research revolves around a deceptively simple question: what happens when robots encounter the limits of their own intelligence? I'm particularly interested in reasoning about infeasibility and recovering from failures where even powerful embodied foundation models—VLAs, VLM-guided planners, and world models—struggle to translate intelligence into physical action.",
      "There's never been a more exciting time to build robots. The gap between what they can reason and what they can actually do is what keeps me curious, grounded, and endlessly captivated by what comes next."
    ],
    "links": {
      "IIIT Hyderabad": "https://www.iiit.ac.in/",
      "NIT Trichy": "https://www.nitt.edu/"
    },
    "emphasis": [
      "what happens when robots encounter the limits of their own intelligence?"
    ],
    "caption": "Bachelors Grad at NIT-Tiruchirappalli. Looking for PhD opportunities in Robot learning!"
  },
  "socialLinks": [
    {
      "label": "GitHub",
      "href": "https://github.com/Narendhiranv04",
      "icon": "github"
    },
    {
      "label": "Scholar",
      "href": "https://scholar.google.com/citations?user=ge9liYgAAAAJ&hl=en",
      "icon": "scholar"
    },
    {
      "label": "CV",
      "href": "https://drive.google.com/file/d/1YmHWeGVPjrDUXH3FvxaLoqsFc2yfGTDT/view?usp=sharing",
      "icon": "cv"
    },
    {
      "label": "LinkedIn",
      "href": "https://www.linkedin.com/in/narendhiranv/",
      "icon": "linkedin"
    },
    {
      "label": "X",
      "href": "https://x.com/narendhiranv04",
      "icon": "x"
    },
    {
      "label": "Mail",
      "href": "mailto:narendhiranv.nitt@gmail.com",
      "icon": "email"
    }
  ],
  "portraitCard": {
    "image": "./assets/images/portrait.webp",
    "alt": "Narendhiran Vijayakumar smiling outdoors."
  },
  "companyLogos": {
    "heading": "Collaborations with",
    "logos": [
      {
        "id": "utdallas",
        "name": "The University of Texas at Dallas",
        "href": "https://utdallas.edu/",
        "shortName": "UT Dallas"
      },
      {
        "id": "ntu",
        "name": "Nanyang Technological University",
        "href": "https://www.ntu.edu.sg/",
        "shortName": "NTU Singapore"
      },
      {
        "id": "iiith",
        "name": "IIIT Hyderabad",
        "href": "https://www.iiit.ac.in/",
        "shortName": "IIIT Hyderabad"
      },
      {
        "id": "monash",
        "name": "Monash University",
        "href": "https://www.monash.edu/",
        "shortName": "Monash"
      },
      {
        "id": "iitbombay",
        "name": "IIT Bombay",
        "href": "https://www.iitb.ac.in/",
        "shortName": "IIT Bombay"
      },
      {
        "id": "nittrichy",
        "name": "NIT Tiruchirappalli",
        "href": "https://www.nitt.edu/",
        "shortName": "NIT Trichy"
      }
    ]
  },
  "competitions": {
    "label": "Competition Projects",
    "items": [
      {
        "competitionLabel": "SAE AeroTHON",
        "projectTitle": "Autonomous UAS",
        "focus": "Aerial Robotics · Systems Lead",
        "timeframe": "2024",
        "summary": "Led the systems team delivering a competition-ready quadcopter with onboard vision and dynamic replanning.",
        "outcome": "Top-15 national finish across endurance, payload-drop, and navigation.",
        "technologies": [
          "ROS 2",
          "uXRCE-DDS",
          "PX4",
          "Raspberry Pi 5"
        ],
        "collageImages": [
          {
            "src": "./assets/images/uas-system.webp",
            "alt": "Autonomous UAS system diagram showing onboard perception, ROS 2, and PX4."
          },
          {
            "src": "./assets/images/uas-drone.webp",
            "alt": "The autonomous quadcopter on the SAE AeroTHON launch platform."
          },
          {
            "src": "./assets/images/uas-team.webp",
            "alt": "The Autonomous UAS team at SAE AeroTHON 2024."
          }
        ],
        "detailParagraphs": [
          "Raspberry Pi 5 runs vision and the route planner. SSD-MobileNet-v2 was converted to NCNN, delivering around 20 ms per frame while ROS 2 over uXRCE-DDS linked the Pi to PX4 on a Pixhawk 6C for low-latency updates.",
          "SWEEP coverage alternated with SERVICE nearest-neighbour updates, inserting fresh ROIs immediately so the path could reshape in flight. Safety layers covered GPS geofence return-to-home, RF-loss return, and battery-triggered landing logic."
        ],
        "codeUrl": "https://drive.google.com/drive/folders/1kKaMLSFk3kYxo7mgzinFKQgGFMAoyrcK?usp=sharing",
        "thumbnail": {
          "src": "./assets/images/uas-drone.webp",
          "alt": "The autonomous quadcopter built for SAE AeroTHON 2024."
        }
      },
      {
        "competitionLabel": "MathWorks Minidrone",
        "projectTitle": "Parrot Mambo Autonomy Challenge",
        "focus": "Embedded Autonomy · Controls Engineer",
        "timeframe": "2024",
        "summary": "Built an autonomy stack for the Parrot Mambo minidrone using MATLAB and Simulink.",
        "outcome": "Achieved fully autonomous line-following with reliable gate traversal in final demos.",
        "technologies": [
          "MATLAB",
          "Simulink",
          "Stateflow",
          "PID Control"
        ],
        "collageImages": [
          {
            "src": "./assets/images/mambo.webp",
            "alt": "Parrot Mambo image-processing, planning, and control architecture."
          },
          {
            "src": "./assets/images/mambo-arena.webp",
            "alt": "MathWorks Minidrone competition arena with the Parrot Mambo on track."
          },
          {
            "src": "./assets/images/mambo-simulink.webp",
            "alt": "Simulink environment visualising the Parrot Mambo autonomy stack."
          }
        ],
        "detailParagraphs": [
          "A custom image-processing pipeline performed path detection through channel filtering, binarization, and morphological erosion, extracting clean contours for trajectory estimation.",
          "A Stateflow path planner in Simulink drove cascaded PID loops for roll, pitch, and yaw, enabling virtual target point tracking and stable autonomous course correction under varying lighting and path curvature."
        ],
        "codeUrl": "https://drive.google.com/drive/folders/1aYSyzn0AptxgAfXk2vBQw_lc9TUsJ8UO?usp=sharing",
        "thumbnail": {
          "src": "./assets/images/mambo.webp",
          "alt": "Parrot Mambo autonomy pipeline with image processing, planning, and PID control."
        }
      },
      {
        "competitionLabel": "Smart India Hackathon",
        "projectTitle": "PixelBot Multimodal Assistant",
        "focus": "Multimodal AI · Team Lead",
        "timeframe": "2024",
        "summary": "Developed a multimodal conversational image recognition chatbot for segmentation, inpainting, and generation.",
        "outcome": "Secured second place in the national qualifier while open-sourcing reusable evaluation utilities.",
        "technologies": [
          "Python",
          "PyTorch",
          "React",
          "TypeScript"
        ],
        "collageImages": [
          {
            "src": "./assets/images/pixelbot-system.webp",
            "alt": "PixelBot multimodal assistant system architecture."
          },
          {
            "src": "./assets/images/pixelbot-chat.webp",
            "alt": "PixelBot multimodal assistant interface answering a user prompt."
          },
          {
            "src": "./assets/images/pixelbot.webp",
            "alt": "PixelBot chatbot workflow showing multimodal editing tools."
          }
        ],
        "detailParagraphs": [
          "The chatbot fused LLaVA Interactive, SAM2, and Stable Diffusion with GLIGEN into a single multimodal pipeline capable of describe, segment, inpaint, and generate interactions through dialogue.",
          "An LSTM memory buffer maintained conversational continuity, while a React and TypeScript frontend with a Flask and MongoDB backend orchestrated PyTorch models and iterative RAKE or YAKE keyword extraction."
        ],
        "codeUrl": "https://github.com/Narendhiranv04/Multimodal-Conversational-Image-Recognition-Chatbot.git",
        "thumbnail": {
          "src": "./assets/images/pixelbot.webp",
          "alt": "The PixelBot conversational image editing interface."
        }
      }
    ]
  },
  "projects": {
    "label": "Personal Projects",
    "items": [
      {
        "title": "RPX",
        "description": "A unified real-world benchmark for evaluating robot perception under embodied deployment conditions.",
        "href": "https://huggingface.co/IRVLUTD",
        "category": "Robot perception"
      },
      {
        "title": "GeoClean-3D",
        "description": "A perception-to-planning framework for cleaning irregular 3D basin surfaces by reconstructing geometry, parameterizing and unwrapping the surface, and generating geometry-aware cleaning actions.",
        "href": "",
        "category": "Perception → planning"
      },
      {
        "title": "Moto-Memory-VLA",
        "description": "Latent-action retrieval, FAISS memory, and contrastive learning for better generalization in embodied control.",
        "href": "https://github.com/Narendhiranv04/Moto",
        "category": "Robot learning"
      },
      {
        "title": "Fuzzy-GRU Exoskeleton",
        "description": "A lightweight encoder-decoder GRU with a Mamdani fuzzy inference system for real-time sit-to-walk torque estimation in robotic exoskeletons.",
        "href": "https://github.com/Narendhiranv04/gru_fis_framework",
        "category": "Assistive robotics"
      }
    ]
  },
  "extracurriculars": {
    "label": "Extracurricular Activities",
    "items": [
      {
        "role": "Technical Mentor · 2024 - Present",
        "title": "Third Dimension Aeromodelling Club",
        "description": "Developed autonomous drones, led workshops, and represented NIT Trichy.",
        "image": "./assets/images/3d-club.webp",
        "imageAlt": "A student-built wheeled robot from the Third Dimension aeromodelling club."
      },
      {
        "role": "Vice President · 2025 - Present",
        "title": "Maximus - Math & Physics Society",
        "description": "Designed the induction pipeline, curated ML projects, and mentored juniors.",
        "image": "./assets/images/maximus.webp",
        "imageAlt": "A Maximus workshop in a classroom at NIT Trichy."
      },
      {
        "role": "Head of Workshops · 2023 - Present",
        "title": "Synergy, Mechanical Symposium",
        "description": "Organized a robotics workshop while managing logistics, speakers, and audience flow.",
        "image": "./assets/images/synergy.webp",
        "imageAlt": "The Synergy mechanical engineering symposium team."
      },
      {
        "role": "Physics Manager · 2024",
        "title": "IGNITTE - Teaching Club",
        "description": "Led free JEE training and mentored rural students with physics and career guidance.",
        "image": "./assets/images/ignitte.webp",
        "imageAlt": "Students and mentors gathered for an IGNITTE teaching club event."
      }
    ]
  },
  "footerCta": {
    "text": "Have a robotics idea, research collaboration, or ambitious prototype in mind?",
    "linkLabel": "Let's talk.",
    "href": "mailto:narendhiranv.nitt@gmail.com"
  },
  "recognition": [
    {
      "title": "Top 15 nationally",
      "event": "SAE AeroTHON · 2024"
    },
    {
      "title": "2nd in national qualifier",
      "event": "Smart India Hackathon · 2024"
    }
  ],
  "publications": {
    "label": "Publications",
    "scholarUrl": "https://scholar.google.com/citations?user=ge9liYgAAAAJ&hl=en",
    "items": [
      {
        "id": "grab-tamp",
        "title": "Search, Ground, Plan: Functional Sufficiency for Task and Motion Planning under Incomplete Scene Knowledge",
        "authors": [
          "Narendhiran Vijayakumar",
          "Nav Singhal",
          "Girish Varma",
          "Antony Thomas"
        ],
        "year": "2026",
        "type": "arXiv",
        "arxivId": "2609.23113",
        "href": "https://arxiv.org/abs/2609.23113",
        "pdfUrl": "https://arxiv.org/pdf/2609.23113",
        "links": [
          {
            "label": "Code",
            "href": "https://github.com/Narendhiranv04/GRAB-TAMP"
          }
        ],
        "description": "GRAB-TAMP searches for task-relevant objects, verifies their functional roles, and grounds a complete assignment before planning under incomplete scene knowledge.",
        "image": "./assets/publications/grab-tamp.webp",
        "thumbnail": "./assets/publications/grab-tamp-thumb.webp",
        "imageAlt": "GRAB-TAMP functional grounding and task-and-motion planning pipeline, Figure 2.",
        "figureSource": "https://arxiv.org/pdf/2609.23113"
      },
      {
        "id": "robust-tamp",
        "title": "Deciding If, When, and Where to Replan for Robust Manipulation",
        "authors": [
          "Narendhiran Vijayakumar",
          "Puru Ojha",
          "Nav Singhal",
          "Girish Varma",
          "Antony Thomas"
        ],
        "year": "2026",
        "type": "arXiv",
        "arxivId": "2608.28075",
        "href": "https://arxiv.org/abs/2608.28075",
        "pdfUrl": "https://arxiv.org/pdf/2608.28075",
        "links": [
          {
            "label": "Project",
            "href": "https://narendhiranv04.github.io/ROBUST-TAMP/"
          },
          {
            "label": "Code",
            "href": "https://github.com/Narendhiranv04/ROBUST-TAMP"
          }
        ],
        "description": "ROBUST-TAMP decides whether a newly discovered object needs a correction, continues independent actions during planning, and inserts corrective actions according to urgency.",
        "image": "./assets/publications/robust-tamp.webp",
        "thumbnail": "./assets/publications/robust-tamp-thumb.webp",
        "imageAlt": "ROBUST-TAMP architecture showing the IF, WHEN, and WHERE replanning decisions, Figure 2.",
        "figureSource": "https://arxiv.org/pdf/2608.28075"
      },
      {
        "id": "auraseg",
        "title": "AURASeg: Attention-Guided Upsampling with Residual-Assisted Boundary Refinement for Drivable-Area Segmentation",
        "authors": [
          "Narendhiran Vijayakumar"
        ],
        "year": "2025",
        "type": "arXiv",
        "arxivId": "2510.21536",
        "href": "https://arxiv.org/abs/2510.21536",
        "pdfUrl": "https://arxiv.org/pdf/2510.21536",
        "links": [
          {
            "label": "Code",
            "href": "https://github.com/Narendhiranv04/AURASeg"
          }
        ],
        "description": "A ResNet-18 segmentation framework combining attention-guided upsampling and residual boundary refinement to identify drivable areas with more precise contours.",
        "image": "./assets/publications/auraseg.webp",
        "thumbnail": "./assets/publications/auraseg-thumb.webp",
        "imageAlt": "AURASeg architecture with a ResNet-18 encoder, ASPPLite, APUD stages, and boundary refinement, Figure 2.",
        "figureSource": "https://arxiv.org/html/2510.21536v6#S3.F2"
      },
      {
        "id": "micro-uav",
        "title": "Design and Structural Validation of a Micro-UAV with On-Board Dynamic Route Planning",
        "authors": [
          "Inbazhagan Ravikumar",
          "Ram Sundhar",
          "Narendhiran Vijayakumar"
        ],
        "year": "2025",
        "type": "arXiv",
        "arxivId": "2510.21648",
        "href": "https://arxiv.org/abs/2510.21648",
        "pdfUrl": "https://arxiv.org/pdf/2510.21648",
        "links": [],
        "description": "A custom search-and-rescue quadcopter combining structural validation, onboard perception, and dynamic route planning with low-cost hardware and open-source software.",
        "image": "./assets/publications/micro-uav.webp",
        "thumbnail": "./assets/publications/micro-uav-thumb.webp",
        "imageAlt": "Onboard autonomous navigation pipeline connecting perception, communication, planning, and telemetry, Figure 2 on page 4.",
        "figureSource": "https://arxiv.org/pdf/2510.21648"
      }
    ]
  }
};
