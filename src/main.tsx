import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeInfo,
  Boxes,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Github,
  Plane,
  Radar,
  Rocket,
  Shield,
  type LucideIcon,
  Volume2,
  VolumeX,
  Wrench
} from "lucide-react";
import "./styles.css";
import EngineViewer from "./EngineViewer";
import ProjectModelViewer from "./ProjectModelViewer";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  type?: "image" | "video" | "model";
  modelPath?: string;
  youtubeId?: string;
};

type Project = {
  id: string;
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  summary: string;
  facts: string[];
  stack: string[];
  gallery: GalleryImage[];
  link?: string;
  caution?: string;
  stats: Array<{ label: string; value: string }>;
};

const images = {
  littleHelperCad: "/assets/little-helper-cad.jpg",
    littleHelperFront: "/assets/little-helper-front.jpg",
  littleHelperWiring: "/assets/little-helper-wiring.jpg",
  littleHelperReal: "/assets/little-helper-real.jpg",
  dinocoGroup: "/assets/team-dinoco-group.jpg",
  dinocoLogo: "/assets/team-dinoco-logo.jpg",
  dinocoJourney: "/assets/team-dinoco-journey.jpg",
  dinocoBuildOne: "/assets/team-dinoco-build-1.jpg",
  dinocoBuildTwo: "/assets/team-dinoco-build-2.jpg",
  nrlEvent: "/assets/nrl-event.jpg",
  cernGroup: "/assets/cern-group.jpg",
  cernLandscape: "/assets/cern-landscape.jpg",
  cernCampus: "/assets/cern-campus.jpg",
  dwelloOne: "/assets/dwello-turbofan-1.jpg",
  dwelloTwo: "/assets/dwello-turbofan-2.jpg",
  dwelloThree: "/assets/dwello-turbofan-3.jpg",
  trinetraOne: "/assets/trinetra-cad-1.jpg",
  trinetraTwo: "/assets/trinetra-cad-2.jpg",
  trinetraThree: "/assets/trinetra-cad-3.jpg",
  cyberPodium: "/assets/cyber-podium.jpg",
  teachingOne: "/assets/teaching-screenshot.jpg",
  captainBadge: "/assets/teaching-screenshot-2.jpg",
  iitmLogo: "/assets/iitm-logo.svg",
  planeOutline: "/assets/plane-outline.svg",
  hackClubLogo: "/assets/hackclub-2026.png",
  hkuAiChallenge: "/assets/hku-ai-challenge.jpg",
  blackShirtCohorts: "/assets/black-shirt-cohorts.png",
  pcBuilding: "/assets/pc-building.png",
  nrlDiscussion: "/assets/nrl-discussion.png",
  concordePhoto: "/assets/concorde-photo.png",
  cernGeneva: "/assets/cern-geneva.jpg",
  cernLab: "/assets/cern-lab.jpg",
  cernChamonix: "/assets/cern-chamonix.jpg",
  cernAtrium: "/assets/cern-atrium.jpg",
  cyberLabOne: "/assets/cyber-lab-1.jpg",
  cyberLabTwo: "/assets/cyber-lab-2.jpg",
  cyberRoboticsOne: "/assets/cyber-robotics-1.jpg",
  cyberRoboticsTwo: "/assets/cyber-robotics-2.jpg",
  cyberClipOne: "/assets/cyber-robotics-clip-1.mp4",
  cyberClipTwo: "/assets/cyber-robotics-clip-2.mp4",
  rcPlane: "/assets/rc-plane.jpg",
  turbofanAnimation: "https://raw.githubusercontent.com/Diamond0608/shlokalva.com/main/Turbofan%20Engine%20Animation.mp4"
};

const nav = [
  ["NAV", "Mission", "mission"],
  ["HGR", "Projects", "projects"],
  ["AERO", "Aerospace", "aerospace"],
  ["LOG", "Experiences", "experiences"],
  ["SYS", "Skills", "skills"],
  ["INT", "Interests", "interests"],
  ["COM", "Contact", "contact"]
];

const projects: Project[] = [
  {
    id: "little-helper",
    title: "Little Helper",
    eyebrow: "Teacher Book-Carrying Robot",
    icon: Wrench,
    summary:
      "A track-based 4WD robot built to carry books and papers for teachers, moving from Fusion CAD to 3D printed parts, wiring, code, and physical testing.",
    facts: [
      "The current version runs on a PS3 controller, with room to tweak the code for phone control later.",
      "Uses an ESP32 and ESP8266 architecture with separate code paths.",
      "Includes RFID and PIN authentication, LCD prompts, buzzer feedback, and a lock state.",
      "Uses an ultrasonic front sensor that stops motion near obstacles unless the safety mode is intentionally toggled.",
      "The chassis is custom CAD-designed and 3D printed. The tracks are rubber/bicycle tubing style, not 3D printed."
    ],
    stack: ["Fusion 360", "ESP32", "ESP8266", "Arduino IDE", "RFID", "LCD", "Motor Control"],
    link: "https://github.com/Diamond0608/Little-Helper",
    stats: [
      { label: "Build Time", value: "~70 hrs" },
      { label: "Controllers", value: "ESP32 + ESP8266" },
      { label: "Drive", value: "4WD Tracks" },
      { label: "Auth", value: "RFID + PIN" }
    ],
    gallery: [
      { src: images.littleHelperReal, alt: "Little Helper physical robot with LEDs on", caption: "Physical Build" },
      { src: images.littleHelperCad, alt: "Little Helper CAD render with cargo box", caption: "CAD Assembly" },
      { src: images.littleHelperFront, alt: "Little Helper front CAD view", caption: "Front Plate And Tracks" },
      { src: images.littleHelperWiring, alt: "Little Helper electronics layout in CAD", caption: "Electronics Layout" },
      { src: "/assets/image_2026-09-18_132632793.png", alt: "Little Helper additional project image", caption: "Additional Project Image" },
      { src: "https://img.youtube.com/vi/gsAc9kgTfto/hqdefault.jpg", alt: "Little Helper project video", caption: "Little Helper — Project Video", youtubeId: "gsAc9kgTfto" }
    ]
  },
  {
    id: "team-dinoco",
    title: "Team Dinoco",
    eyebrow: "National Robotics League",
    icon: Radar,
    summary:
      "Months of robotics work, one cancelled flight, a very late arrival, and a bracket run that somehow turned into one of my favorite chaos stories.",
    facts: [
      "I was team captain, which in practice meant coordination, travel planning, documentation, social media help, mechanical build work, development, and driving the bot.",
      "We reached a day late after our match had already started because our flight got cancelled, then paid for another flight because giving up was not really on the menu.",
      "A lot of us were sick, but we still grinded through the day and climbed from 92nd to second in our playoffs bracket.",
      "We became a captain team, reached the quarter finals, and were eliminated after an error by our partner team.",
      "We also made custom name badges and a full team identity around the bot, because apparently we cope with stress by branding things."
    ],
    stack: ["Robotics Strategy", "CAD", "Team Coordination", "Competition Prep", "Mechanical Systems"],
    link: "https://www.instagram.com/teamdinoco_nrl?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
    gallery: [
      { src: images.nrlDiscussion, alt: "Team Dinoco talking during the NRL event", caption: "Event Floor" },
      { src: images.nrlEvent, alt: "Team Dinoco at the robotics event field", caption: "Event Field" },
      { src: images.dinocoGroup, alt: "Team Dinoco group photo", caption: "Team Photo" },
      { src: images.captainBadge, alt: "Team Dinoco custom captain badge", caption: "Custom Name Badge" },
      { src: images.dinocoLogo, alt: "Team Dinoco logo", caption: "Team Identity" },
      { src: images.dinocoJourney, alt: "Team Dinoco journey document cover", caption: "Journey Document" },
      { src: "/assets/team-dinoco-video.mp4", alt: "Team Dinoco video", caption: "Team Dinoco — Competition Video", type: "video" }
    ],
    caution: "Team Result: Second In Playoffs Bracket; Quarter-Final Elimination.",
    stats: [
      { label: "Role", value: "Team Captain" },
      { label: "Bracket", value: "2nd Place" },
      { label: "Event", value: "National Finals" },
      { label: "Focus", value: "Strategy + Build" }
    ]
  },
  {
    id: "dwello",
    title: "Aircraft Propulsion Internship",
    eyebrow: "Dwello Aerospace",
    icon: Rocket,
    summary:
      "A one-month aircraft propulsion internship focused on designing ramjet and turbofan engine models, with calculations, simulation, animation, and a final report.",
    facts: [
      "Designed three propulsion models around ramjet and turbofan problem statements.",
      "Produced CAD models including turbofan and ramjet variants.",
      "Created simulation and animation work alongside a written aircraft propulsion report.",
      "Documented propulsion concepts and the methodology behind the model choices."
    ],
    stack: ["Fusion 360", "CAD Modelling", "Aircraft Propulsion", "Simulation", "Technical Reporting"],
    stats: [
      { label: "Duration", value: "1 Month" },
      { label: "Domain", value: "Propulsion" },
      { label: "Models", value: "3" },
      { label: "Output", value: "Report + Animation" }
    ],
    gallery: [
      { src: images.dwelloOne, alt: "Turbofan can type CAD render", caption: "Turbofan CAD Render" },
      { src: images.dwelloTwo, alt: "Turbofan side CAD render", caption: "Propulsion Assembly" },
      { src: images.dwelloThree, alt: "Turbofan front CAD render", caption: "Fan Geometry" },
      { src: images.turbofanAnimation, alt: "Turbofan engine animation", caption: "Turbofan Engine Animation", type: "video" }
    ]
  },
  {
    id: "trinetra",
    title: "Trinetra",
    eyebrow: "Wearable Tech CAD Project",
    icon: Shield,
    summary:
      "A wearable-tech CAD project built around a compact enclosure and extension mechanism, shown here from the design side.",
    facts: [
      "Designed in Fusion 360 with separate CAD, STEP, STL, and print files.",
      "The project includes an enclosure, moving parts, and print planning.",
      "On this site I am keeping it to the CAD/design side instead of turning it into a build manual."
    ],
    stack: ["Fusion 360", "3D Printing", "Mechanism Design", "Assembly Planning"],
    link: "https://github.com/Diamond0608/Trinetra",
    stats: [
      { label: "CAD", value: "Fusion 360" },
      { label: "Format", value: "STEP + STL" },
      { label: "Focus", value: "Wearable Tech" },
      { label: "Type", value: "Mechanism" }
    ],
    gallery: [
      { src: images.trinetraOne, alt: "Trinetra CAD exploded view", caption: "CAD View" },
      { src: images.trinetraTwo, alt: "Trinetra enclosure CAD render", caption: "Enclosure Render" },
      { src: "https://img.youtube.com/vi/FA887wvikZQ/hqdefault.jpg", alt: "Trinetra project video", caption: "Trinetra — Project Video", youtubeId: "FA887wvikZQ" }
    ]
  },
  {
    id: "rc-plane",
    title: "Self-Made RC Plane",
    eyebrow: "Scratch-Built Attempt",
    icon: Boxes,
    summary:
      "A scratch-built RC plane attempt where I started from dimensions and sketches instead of a tutorial, then learned a lot from the parts that worked and the parts that absolutely did not.",
    facts: [
      "Used a NACA 0012 airfoil and MotoCalc while working through the sizing and setup.",
      "Started with dimensions, electronics sketches, and a plan for how the plane should come together.",
      "Cut the body out of foamboard and 3D printed the wings, horizontal stabiliser, and vertical stabiliser.",
      "Used servo motors to control the ailerons, plus a transmitter, receiver, and 2600KV motors."
    ],
    stack: ["Aviation", "Scratch Build", "Iteration", "Failure Analysis"],
    stats: [
      { label: "Airfoil", value: "NACA 0012" },
      { label: "Motor", value: "2600KV" },
      { label: "Body", value: "Foamboard" },
      { label: "Controls", value: "Ailerons" }
    ],
    gallery: [
      { src: images.rcPlane, alt: "Scratch-built RC plane on a table", caption: "Scratch-Built RC Plane" },
      { src: "/assets/rc-plane-detail.mp4", alt: "RC plane detail video", caption: "Plane Detail Video", type: "video" },
      { src: "/assets/plane-video.mp4", alt: "RC plane moving video", caption: "Plane Moving", type: "video" }
    ]
  }
];

const experiences = [
  {
    title: "CERN Visit",
    subtitle: "Geneva Learning Experience",
    image: images.cernGroup,
    body:
      "A one-week school masterclass where we visited ALICE, ISOLDE, CMS, ATLAS, the Antimatter Factory, and a lot of places I had only read about before."
  },
  {
    title: "Dwello Aerospace",
    subtitle: "Aircraft Propulsion Internship",
    image: images.dwelloTwo,
    body:
      "Worked on propulsion model design, report writing, and simulation/animation work across ramjet and turbofan concepts."
  },
  {
    title: "Cyber Club Leadership",
    subtitle: "Vice-President And President",
    image: images.pcBuilding,
    body:
      "I helped run events, guide juniors through hands-on tech work, and make the cyber side of school life feel active instead of just theoretical."
  },
  {
    title: "Robotics Club",
    subtitle: "President And Vice President",
    image: images.blackShirtCohorts,
    body:
      "I helped get more people into robotics and tech at school, while learning that explaining a build can be harder than building it."
  }
];

const spotlight: Array<{ title: string; body: string; gallery: GalleryImage[] }> = [
  {
    title: "CERN Evenings",
    body:
      "The science was the point, but the best memories were also the evening walks through Chamonix, Carouge, Geneva Old Town, and the random friend-group moments between the serious bits.",
    gallery: [
      { src: images.cernGroup, alt: "CERN visit group photo", caption: "CERN With Friends" },
      { src: images.cernLab, alt: "CERN laboratory visit photo", caption: "CERN Lab" },
      { src: images.cernAtrium, alt: "CERN atrium with detector display", caption: "CERN Atrium" },
      { src: images.cernChamonix, alt: "Chamonix mountain view", caption: "Chamonix Evening" },
      { src: images.cernGeneva, alt: "Geneva old town view with rainbow", caption: "Geneva Evening" }
    ]
  },
  {
    title: "Cyber Club, Helios And Iris",
    body:
      "A mix of speaking, helping younger students, and robotics-event work. It is the part of school tech where I was not just building my own things.",
    gallery: [
      { src: images.cyberPodium, alt: "Speaking at a Cyber Club or Helios event", caption: "On Stage" },
      { src: images.cyberLabOne, alt: "Running a school tech event", caption: "Running Events" },
      { src: images.cyberRoboticsOne, alt: "Robotics event field", caption: "Robotics Event" },
      { src: images.blackShirtCohorts, alt: "Group photo in black shirts at an event", caption: "Event Crew" }
    ]
  }
];

const skills = [
  { title: "Python", detail: "Project scripting, technical tools, and software foundations." },
  { title: "Fusion 360", detail: "CAD assemblies, mechanical parts, propulsion models, and print-ready design." },
  { title: "MySQL", detail: "Database fundamentals and structured data work." },
  { title: "ESP32 / ESP8266", detail: "Embedded robotics architecture and hardware control." },
  { title: "Arduino IDE", detail: "Board setup, code upload, and electronics debugging." },
  { title: "3D Printing", detail: "Designing parts around print constraints and assembly." },
  { title: "Technical Writing", detail: "Reports, documentation, BOMs, and build guides." }
];

const signals = [
  {
    title: "IIT Madras Aerospace Course",
    body: "Completed an eight-week aerospace certification course. It sits neatly beside the propulsion internship and RC plane work.",
    image: images.iitmLogo
  },
  {
    title: "My Flying Academy Workshop",
    body: "A one-day aviation workshop that made the pilot-career side of aviation feel less abstract and more real.",
    image: images.planeOutline
  },
  {
    title: "Hack Club BEEST",
    body: "Selected for Hack Club BEEST and worked through the project track. I could not make the Netherlands travel piece work out, but the build-and-ship mindset stuck hard.",
    image: images.hackClubLogo
  },
  {
    title: "Cyber Competitions",
    body: "Cybernautica, Odyssey Caipher, and the HKU AI+ Challenge are the competition/problem-solving side of the portfolio.",
    image: images.hkuAiChallenge
  },
  {
    title: "Helios And Iris",
    body: "Volunteered at Helios Interschool Robotics Fest and served as Deputy Event Head for Robo-FC at Iris.",
    image: images.blackShirtCohorts
  }
];

const interests = [
  {
    title: "Gaming",
    body: "Valorant, Fortnite, Sea Of Thieves, RDR2, Ghost Of Tsushima, Titanfall 2, and whatever else is currently stealing my sleep."
  },
  {
    title: "Badminton",
    body: "Played casually. Not everything needs a medal table; sometimes it is just fun to hit things very fast."
  }
];

const poems = [
  {
    title: "Memento Mori",
    body: `The fibres that lay in our heart's core,
The litteral heartstrings that always leave us wanting more,
The all consuming power of our mind,
Something that can be both crushing and divine.

The uncertainty of life is an endless mystery,
Somehow being forgotten despite it being our whole existence's tapestry.
Our entire lives spent with ego, constantly looking down,
And all we have to say is don't worry there's enough hate to go around.

The brutality that is seen in humanity,
The stone cold truth about our apathy.
Cruelty, brutality, torture and disunity,
And yet the glimpse of progress justifies the cowardice devouring our anatomy.

The whole world is clung to hurt and pain,
Stuck staring out of the window in sorrow at the endless rain.
To those who don't remember that this is your legacy and story,
Only one thing is left to be said - Memento Mori

-SHLOK ALVA`
  },
  {
    title: "Magnum Opus",
    body: `The vast expanses spread across the sky,
The bright stars they say we go to when we die.
The beauty in realms such smaller than our own,
The grandeur of galaxies - to us unshown.

Some of us may always feel alone,
Pushing people away inorder for our sins to atone,
However together our fate has a singular flow,
That secretly together carries the entire universe in tow.

It is said that all of existence has a creator,
Someone who sees within us the good that is greater.
Inadvertent though it may seem,
Create a menace said the powers supreme.

The entire world we have wrecked,
So we must be some miscalculation or side project.
But maybe in reality the paradise was hopeless,
And by being the chaos we are infact God's Magnum Opus.`
  }
];

function useOpeningSynth(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);
  const timersRef = useRef<number[]>([]);
  const startedRef = useRef(false);

  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (!enabled || startedRef.current) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    startedRef.current = true;

    // Opening synth cue: deliberately one-shot. There is NO interval or loop.
    const synth = [392, 587, 784, 587, 392, 587, 784, 587, 494, 587, 784, 587, 523, 659, 784, 659];
    const step = 185;

    context.resume().catch(() => {});

    synth.forEach((frequency, index) => {
      const timer = window.setTimeout(() => {
        const now = context.currentTime;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain).connect(context.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      }, index * step);

      timersRef.current.push(timer);
    });

    // Mozart is allowed only after the final synth note has finished.
    const finishedTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event("portfolio:synth-finished"));
    }, (synth.length - 1) * step + 300);

    timersRef.current.push(finishedTimer);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [enabled]);
}

function FlightLoader() {
  return (
    <div className="flight-loader" aria-live="polite">
      <div className="loader-radar" />
      <div className="raceway">
        <Plane className="loader-plane-one" size={42} />
        <Plane className="loader-plane-two" size={42} />
      </div>
      <p>VT-PLN Flight Deck Initializing</p>
      <span>Routing Project Hangar, Photo Systems, And Flight Log</span>
    </div>
  );
}

function FlightMascot() {
  return (
    <div className="mascot-card" aria-label="Animated Concorde Flight Board">
      <p className="concorde-line">Concorde Raced The Sun And Won, And I'm Racing Against The Universe And Winning Too.</p>
      <div className="concorde-photo-wrap">
        <img src={images.concordePhoto} alt="Air France Concorde taking off" />
      </div>
      <div className="mini-runway">
        <i />
        <i />
        <i />
      </div>
      <div className="mascot-readout">
        <span>VT-PLN</span>
        <strong>Flying Towards Aviation • Status: In Progress</strong>
      </div>
    </div>
  );
}

function PhotoStrip({ gallery, onOpen }: { gallery: GalleryImage[]; onOpen: (image: GalleryImage) => void }) {
  const stripRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    stripRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  return (
    <div className="media-strip-wrap">
      <button className="media-scroll media-scroll-left" onClick={() => scroll(-1)} aria-label="Scroll media left">
        <ChevronLeft size={17} />
      </button>
      <div ref={stripRef} className="photo-strip" aria-label="Scrollable Photo Gallery">
        {gallery.map((image) => (
          <button key={`${image.src}-${image.caption}`} className="photo-tile" onClick={() => onOpen(image)}>
            {image.type === "video" ? (
              <video src={image.src} muted loop playsInline preload="metadata" />
            ) : (
              <img src={image.src} alt={image.alt} loading="lazy" />
            )}
            <span>{image.caption}</span>
            {image.youtubeId || image.type === "video" || image.type === "model" ? (
              <small>{image.type === "model" ? "3D MODEL • CLICK TO OPEN" : "CLICK TO OPEN"}</small>
            ) : null}
          </button>
        ))}
      </div>
      <button className="media-scroll media-scroll-right" onClick={() => scroll(1)} aria-label="Scroll media right">
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (image: GalleryImage) => void }) {
  const Icon = project.icon;
  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
    >
      <div className="project-flip">
        <div className="project-face project-front">
          <img src={project.gallery[0].src} alt={project.gallery[0].alt} loading="lazy" />
          <div className="project-overlay">
            <span>{project.eyebrow}</span>
            <h3>{project.title}</h3>
          </div>
        </div>
        <div className="project-face project-back">
          <Icon size={28} />
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <span>Flight Notes</span>
        </div>
      </div>
      <div className="project-copy">
        <p>{project.summary}</p>
        <ul>
          {project.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        {project.caution && <p className="caution">{project.caution}</p>}
        <div className="chip-row">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        {project.link && (
          <a className="text-link" href={project.link} target="_blank" rel="noreferrer">
            Open Source Link <ExternalLink size={15} />
          </a>
        )}
      </div>
      <div className="project-stats" aria-label={`${project.title} project statistics`}>
        {project.stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </motion.div>
        ))}
      </div>
      <details className="spec-sheet">
        <summary>Technical Spec Sheet</summary>
        <div className="spec-sheet-grid">
          <div><span>Project</span><strong>{project.title}</strong></div>
          <div><span>Category</span><strong>{project.eyebrow}</strong></div>
          <div><span>Stack</span><strong>{project.stack.join(" • ")}</strong></div>
        </div>
      </details>
      <div className="media-timeline" aria-label="Project media timeline">
        {project.gallery.map((item, index) => (
          <button key={`${item.caption}-timeline`} onClick={() => onOpen(item)} title={item.caption}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.type === "model" ? "3D" : item.youtubeId || item.type === "video" ? "VIDEO" : "MEDIA"}</strong>
          </button>
        ))}
      </div>
      <PhotoStrip gallery={project.gallery} onOpen={onOpen} />
    </motion.article>
  );
}

function CockpitPanel() {
  return (
    <div className="cockpit-panel" aria-label="A350-inspired flight deck instrumentation">
      <div className="cockpit-panel-header">
        <span>FLIGHT DECK / VT-PLN</span>
        <strong>CRZ PROFILE</strong>
      </div>
      <div className="cockpit-instruments">
        <div className="pfd-mini">
          <div className="pfd-sky" />
          <div className="pfd-ground" />
          <div className="pfd-horizon" />
          <div className="pfd-aircraft"><i /><i /><i /></div>
          <div className="pfd-label pfd-alt">ALT <strong>PORTFOLIO</strong></div>
          <div className="pfd-label pfd-spd">SPD <strong>BUILD</strong></div>
          <div className="pfd-vsi">↕</div>
        </div>
        <div className="nd-mini">
          <div className="nd-grid" />
          <div className="nd-compass">N <span>3</span> <b>E</b> <span>6</span> S <span>12</span> W</div>
          <div className="nd-track">▲</div>
          <div className="nd-readout"><span>HDG</span><strong>VT-PLN</strong></div>
        </div>
        <div className="ecam-mini">
          <span className="ecam-title">SYSTEMS</span>
          <div><b>HYD</b><i>GREEN</i></div>
          <div><b>ELEC</b><i>NOMINAL</i></div>
          <div><b>ENG</b><i>ONLINE</i></div>
          <div><b>DATA</b><i>READY</i></div>
        </div>
      </div>
      <div className="cockpit-readouts">
        <span><b>FLT</b> PORTFOLIO</span>
        <span><b>PHASE</b> BUILDING</span>
        <span><b>STATUS</b> <em>NORMAL</em></span>
      </div>
    </div>
  );
}

function App() {
  const [booted, setBooted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const reducedMotion = useReducedMotion();
  useOpeningSynth(soundEnabled);

  useEffect(() => {
    const timeout = window.setTimeout(() => setBooted(true), reducedMotion ? 100 : 5000);
    return () => window.clearTimeout(timeout);
  }, [reducedMotion]);

  return (
    <main className="shell">
      <div className="flight-background" aria-hidden="true">
        <Plane className="bg-plane bg-plane-one" size={32} />
        <Plane className="bg-plane bg-plane-two" size={24} />
        <Plane className="bg-plane bg-plane-three" size={28} />
        <div className="radar-sweep" />
      </div>
      {!booted && <FlightLoader />}

      <aside className="flight-nav" aria-label="Flight Deck Navigation">
        <a className="seat-brand" href="#top">
          VT-PLN
        </a>
        {nav.map(([seat, label, target]) => (
          <a key={seat} href={`#${target}`}>
            <span>{seat}</span>
            <strong>{label}</strong>
          </a>
        ))}
        <button className="audio-control" onClick={() => setSoundEnabled((value) => !value)} aria-label="Toggle Interface Sound">
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>AUDIO</span>
        </button>
      </aside>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Boarding Pass / Engineering Portfolio</p>
          <h1>Shlok Alva</h1>
          <p className="lede">
            Robotics, Aerospace, CAD, Software, And The Habit Of Trying To Build The Thing Instead Of Just Talking About It.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="primary">
              Enter Project Hangar <ChevronRight size={18} />
            </a>
            <a href="https://github.com/Diamond0608" target="_blank" rel="noreferrer" className="secondary">
              GitHub <Github size={18} />
            </a>
          </div>
        </div>
        <div className="hero-board">
          <div className="flight-card">
            <div className="runway-approach" aria-hidden="true">
              <div className="runway-perspective">
                <i /><i /><i /><i />
              </div>
              <Plane className="approach-plane" size={54} strokeWidth={1.8} />
              <span className="approach-glow" />
            </div>
            <div className="flight-card-copy">
              <span>Aircraft Registry</span>
              <strong>VT-PLN</strong>
              <p>Engineering • Robotics • Aerospace • Software</p>
              <div className="flight-card-status">
                <span>FLIGHT DECK</span>
                <b>CONFIG / VT-PLN</b>
                <i />
              </div>
            </div>
          </div>
          <CockpitPanel />
          <FlightMascot />
        </div>
      </section>

      <section id="mission" className="section mission">
        <div>
          <p className="eyebrow">Mission</p>
          <h2>Mostly Robots, Planes, And Questionable Sleep Schedules</h2>
        </div>
        <div className="mission-copy">
          <p>I like building things that can actually be tested, argued with, broken, fixed, and photographed looking slightly dramatic.</p>
          <p>Most of my favorite projects started with a sketch, a CAD file, or a very optimistic “yeah, this should work.”</p>
          <div className="mission-status">
            <span>Current Mission</span>
            <strong>Making It To The World Of Aviation</strong>
            <em>Status: In Progress</em>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-head">
          <p className="eyebrow">Projects</p>
          <h2>Project Hangar</h2>
          <p>Things I Built, Helped Build, Or Learned From The Hard Way.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={setActiveImage} />
          ))}
        </div>
      </section>

      <section id="aerospace" className="section aerospace">
        <div className="section-head">
          <p className="eyebrow">Aerospace</p>
          <h2>Propulsion, Flight, And Systems Thinking</h2>
        </div>
        <div className="cockpit-grid">
          <button onClick={() => setActiveImage(projects[2].gallery[0])}>
            <img src={images.dwelloOne} alt="Turbofan CAD render" loading="lazy" />
            <span>Dwello Turbofan CAD</span>
          </button>
          <button
            onClick={() =>
              setActiveImage({ src: images.rcPlane, alt: "Scratch-built RC plane", caption: "NACA 0012 RC Plane" })
            }
          >
            <img src={images.rcPlane} alt="Scratch-built RC plane" loading="lazy" />
            <span>NACA 0012 RC Plane</span>
          </button>
          <div className="instrument-panel">
            <h3>Flight Thread</h3>
            <p>Dwello Propulsion, IIT Madras Aerospace Coursework, My Flying Academy, And The RC Plane All Sit In The Same Aviation Obsession.</p>
          </div>
        </div>
      </section>

      <section id="experiences" className="section">
        <div className="section-head">
          <p className="eyebrow">Experiences</p>
          <h2>Flight Log</h2>
        </div>
        <div className="experience-grid">
          {experiences.map((experience) => (
            <article key={experience.title} className="experience-card">
              <img src={experience.image} alt="" loading="lazy" />
              <div>
                <span>{experience.subtitle}</span>
                <h3>{experience.title}</h3>
                <p>{experience.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Scenes</p>
          <h2>More Than Just Project Cards</h2>
        </div>
        <div className="spotlight-grid">
          {spotlight.map((item) => (
            <article className="spotlight-card" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <PhotoStrip gallery={item.gallery} onOpen={setActiveImage} />
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="section skills">
        <div className="section-head">
          <p className="eyebrow">Skills</p>
          <h2>Skills And Tech Stack</h2>
          <p>Tools I Use Across Hardware Builds, CAD Work, Robotics, Documentation, And Software-Backed Projects.</p>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <article key={skill.title}>
              <BadgeInfo size={20} />
              <h3>{skill.title}</h3>
              <p>{skill.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Signals</p>
          <h2>Other Stuff Worth Keeping On The Radar</h2>
          <p>A few more pieces of the story that still matter, even when they do not need a giant project card.</p>
        </div>
        <div className="signal-grid">
          {signals.map((signal) => (
            <article key={signal.title}>
              <img src={signal.image} alt="" loading="lazy" />
              <div>
                <Radar size={18} />
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="interests" className="section interests">
        <div className="section-head">
          <p className="eyebrow">Other Interests</p>
          <h2>Outside The Hangar</h2>
          <p>I like having a life outside CAD files too, even if the CAD files keep trying to win.</p>
        </div>
        <div className="interest-grid">
          {interests.map((interest) => (
            <article key={interest.title}>
              <h3>{interest.title}</h3>
              <p>{interest.body}</p>
            </article>
          ))}
          <article className="poem-card">
            <h3>Poems</h3>
            <p>I often write poems to express myself better. A couple of examples:</p>
            <div className="poem-grid">
              {poems.map((poem) => (
                <details key={poem.title}>
                  <summary>{poem.title}</summary>
                  <pre>{poem.body}</pre>
                </details>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section engine-showcase">
        <div className="section-head">
          <p className="eyebrow">Propulsion System</p>
          <h2>Engine Room</h2>
          <p>The turbofan from my Dwello Aerospace internship, brought into the portfolio as a live engineering display.</p>
        </div>
        <div className="engine-stage" aria-label="Interactive 3D turbofan CAD model">
          <div className="engine-stage-glow engine-stage-glow-one" />
          <div className="engine-stage-glow engine-stage-glow-two" />
          <EngineViewer />
          <div className="engine-overlay engine-overlay-top">
            <span>DWELLO / TURBOFAN</span>
            <strong>PROPULSION CORE</strong>
          </div>
          <div className="engine-overlay engine-overlay-bottom">
            <span>MOTION STUDY</span>
            <p>Drag to inspect • Internal inspection cycle</p>
          </div>
        </div>
        <div className="engine-project-model">
          <div className="section-head">
            <p className="eyebrow">Engineering Model</p>
            <h3>Little Helper — Interactive CAD Model</h3>
            <p>Inspect the uploaded Little Helper model directly here instead of opening it from the project image gallery.</p>
          </div>
          <ProjectModelViewer src="/assets/little-helper.glb" />
        </div>
        <div className="engine-project-model">
          <div className="section-head">
            <p className="eyebrow">Engineering Model</p>
            <h3>Trinetra — Interactive CAD Model</h3>
            <p>Inspect the uploaded Trinetra model directly here as part of the Engine Room.</p>
          </div>
          <ProjectModelViewer src="/assets/trinetra.glb" />
        </div>
      </section>

      <section id="contact" className="section contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Ready For Final Boarding</h2>
          <p>Email: alvashlok@gmail.com</p>
          <p>Phone: +91 9845394885</p>
        </div>
        <div className="contact-actions">
          <a href="https://github.com/Diamond0608" target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={17} />
          </a>
          <a href="https://www.instagram.com/teamdinoco_nrl?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
            Team Dinoco Instagram <ExternalLink size={17} />
          </a>
        </div>
      </section>

      {activeImage && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeImage.caption} onClick={() => setActiveImage(null)}>
          <button aria-label="Close Image Preview">Close</button>
          <figure className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            {activeImage.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeImage.youtubeId}?autoplay=1&rel=0`}
                title={activeImage.alt}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : activeImage.type === "video" ? (
              <video src={activeImage.src} controls autoPlay muted loop playsInline />
            ) : activeImage.type === "model" && activeImage.modelPath ? (
              <ProjectModelViewer src={activeImage.modelPath} />
            ) : (
              <img src={activeImage.src} alt={activeImage.alt} />
            )}
            <figcaption>{activeImage.caption}</figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
