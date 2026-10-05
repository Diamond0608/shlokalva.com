import React, { Suspense, lazy, useEffect, useRef, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeInfo,
  Boxes,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  FileText,
  Github,
  Plane,
  Play,
  Radar,
  Rocket,
  Shield,
  type LucideIcon,
  Volume2,
  VolumeX,
  Wrench
} from "lucide-react";
import "./styles.css";
import { imageSizes } from "./imageSizes";

function Img(props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const size = imageSizes[props.src];
  return <img decoding="async" width={size?.[0]} height={size?.[1]} {...props} />;
}

const EngineViewer = lazy(() => import("./EngineViewer"));
const ProjectModelViewer = lazy(() => import("./ProjectModelViewer"));
const CharacterSelect = lazy(() => import("./CharacterSelect"));
import FlightTimeline from "./FlightTimeline";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  type?: "image" | "video" | "model" | "pdf";
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
  devlog?: string;
  status: { label: string; tone: "done" | "progress" | "fail"; note: string };
  learned: string;
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
  iitmLogo: "/assets/iitm.png",
  planeOutline: "/assets/outline.svg",
  hackClubLogo: "/assets/hackclub-2026.png",
  hkuAiChallenge: "/assets/hku-ai-challenge.jpg",
  blackShirtCohorts: "/assets/black-shirt-cohorts.webp",
  pcBuilding: "/assets/pc-building.webp",
  nrlDiscussion: "/assets/nrl-discussion.webp",
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
  turbofanAnimation: "/assets/turbofan-engine-animation.mp4"
};

const nav = [
  ["NAV", "Mission", "mission", "What drives me"],
  ["HGR", "Projects", "projects", "Robots, CAD and builds"],
  ["LOG", "Experiences", "experiences", "My Hack Club story"],
  ["SYS", "Skills", "skills", "Tools I build with"],
  ["INT", "Interests", "interests", "Flight sim, gaming, poems"],
  ["COM", "Contact", "contact", "Email and links"]
];

const projects: Project[] = [
  {
    id: "little-helper",
    devlog: "/beest/",
    status: { label: "Finished", tone: "done", note: "Built end to end and approved golden at Hack Club BEEST." },
    learned: "CAD only gets you halfway: friction-driven tracks, burnt-out motors and wiring only worked after real debugging on the bench.",
    title: "Little Helper",
    eyebrow: "Teacher Book-Carrying Robot",
    icon: Wrench,
    summary:
      "I built Little Helper as a track-based 4WD robot to carry books and papers for teachers, taking it from Fusion 360 CAD through 3D printed parts, wiring, code, and physical testing.",
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
    status: { label: "Competed", tone: "done", note: "Second in the playoff bracket, out in the quarter-finals." },
    learned: "A robot is only part of a competition: travel, documentation and your partner team decide the result as much as the build.",
    title: "Team Dinoco",
    eyebrow: "National Robotics League",
    icon: Radar,
    summary:
      "My Team Dinoco robotics work documents months of National Robotics League competition, including my role as team captain, mechanical build work, coordination, and competition preparation.",
    facts: [
      "As team captain, I handled coordination, travel planning, documentation, social media help, mechanical build work, development, and driving the bot.",
      "We reached a day late after our match had already started because our flight got cancelled, then paid for another flight because giving up was not really on the menu.",
      "A lot of us were sick, but we still grinded through the day and climbed from 92nd to second in the playoffs.",
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
      { src: "/assets/team-dinoco-video.mp4", alt: "Team Dinoco bot moving", caption: "The Bot Moving", type: "video" }
    ],
    caution: "Team Result: Second In Bracket For Playoffs; Quarter-Final Elimination.",
    stats: [
      { label: "Role", value: "Team Captain" },
      { label: "Event", value: "National Finals" },
      { label: "Focus", value: "Strategy + Build" },
      { label: "Playoffs", value: "Second In Bracket For Playoffs" }
    ]
  },
  {
    id: "dwello",
    status: { label: "Completed", tone: "done", note: "Three models, a report and an animation delivered." },
    learned: "I learnt how fuel flow rates actually work, how to bring that into numericals, and how to write project reports that go deep and explain every design choice.",
    title: "Aircraft Propulsion Internship",
    eyebrow: "Dwello Aerospace",
    icon: Rocket,
    summary:
      "During my one-month Dwello Aerospace internship, I worked on aircraft propulsion, including ramjet and turbofan CAD models, calculations, simulation, animation, and a final technical report.",
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
      { src: images.turbofanAnimation, alt: "Turbofan engine animation", caption: "Turbofan Engine Animation", type: "video" },
      { src: "/assets/dwello-propulsion-report.pdf", alt: "Aircraft propulsion internship report, PDF", caption: "Full Report (PDF)", type: "pdf" }
    ]
  },
  {
    id: "trinetra",
    status: { label: "Designed", tone: "progress", note: "Complete in CAD, with an electrical schematic. Not built." },
    learned: "Moving parts need room: most of the work was re-placing components and redoing joints until nothing collided.",
    title: "Trinetra",
    eyebrow: "Wearable Tech CAD Project",
    icon: Shield,
    summary:
      "I built Trinetra as a wearable-tech CAD project around a compact enclosure and extension mechanism, and I am presenting it here from the design side.",
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
    status: { label: "Didn't fly", tone: "fail", note: "Built and ground-tested, never flew." },
    learned: "A plan on paper and a plane that flies are different things, so test each system before trusting the whole.",
    title: "Self-Made RC Plane",
    eyebrow: "Scratch-Built Attempt",
    icon: Boxes,
    summary:
      "My self-made RC plane is a scratch-built aviation project that started from dimensions and sketches, with lessons from both the successful and unsuccessful parts of the build.",
    facts: [
      "I used a NACA 0012 airfoil and MotoCalc while working through the sizing and setup. The finished RC plane never managed to take flight, so the project remained a ground-tested build rather than a successful flight.",
      "Started with dimensions, electronics sketches, and a plan for how the plane should come together.",
      "Cut the body out of foamboard and 3D printed the wings, horizontal stabiliser, and vertical stabiliser.",
      "Used servo motors to control the ailerons, plus a transmitter, receiver, and 2600KV motors."
    ],
    stack: ["Aviation", "Scratch Build", "Iteration", "Failure Analysis"],
    stats: [
      { label: "Airfoil", value: "NACA 0012" },
      { label: "Flight Status", value: "Never Flew" },
      { label: "Motor", value: "2600KV" },
      { label: "Body", value: "Foamboard" },
      { label: "Controls", value: "Ailerons" }
    ],
    gallery: [
      { src: images.rcPlane, alt: "Scratch-built RC plane on a table", caption: "Scratch-Built RC Plane — Never Flew" },
      { src: "/assets/rc-plane-detail.mp4", alt: "RC plane detail video", caption: "Plane Detail Video", type: "video" },
      { src: "/assets/plane-video.mp4", alt: "Scratch-built RC plane ground video", caption: "Ground Test — Never Flew", type: "video" }
    ]
  }
];

const experiences = [
  {
    title: "CERN Visit",
    subtitle: "Geneva Learning Experience",
    image: images.cernGroup,
    body: "A one-week school masterclass where we visited ALICE, ISOLDE, CMS, ATLAS, the Antimatter Factory, and a lot of places I had only read about before."
  },
  {
    title: "Cyber Club Leadership",
    subtitle: "President And Vice President",
    image: images.pcBuilding,
    body: "I helped run events, guide juniors through hands-on tech work, and make the cyber side of school life feel active instead of just theoretical."
  },
  {
    title: "Robotics Club",
    subtitle: "Founder And Committee Member",
    image: images.blackShirtCohorts,
    body: "I helped get more people into robotics and tech at school, while learning that explaining a build can be harder than building it."
  },
  {
    title: "Helios And Iris",
    subtitle: "Robotics Fest Volunteer And Event Head",
    image: images.cyberRoboticsOne,
    body: "Volunteered at Helios Interschool Robotics Fest and was one of the event heads for Robo-FC at Iris."
  }
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
    title: "Cyber Competitions",
    body: "Cybernautica, Odyssey Caipher, and the HKU AI+ Challenge are the competition/problem-solving side of the portfolio.",
    image: images.hkuAiChallenge
  }
];

const spotlight: Array<{ title: string; body: string; gallery: GalleryImage[] }> = [
  {
    title: "CERN Evenings",
    body:
      "Evening walks through Chamonix, Carouge and Geneva Old Town.",
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
      "Helios, Iris and Cyber Club (President, earlier Vice President) events, on stage and behind the scenes.",
    gallery: [
      { src: images.cyberPodium, alt: "Speaking at a Cyber Club or Helios event", caption: "On Stage" },
      { src: images.cyberLabOne, alt: "Running a school tech event", caption: "Running Events" },
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
  { title: "Engineering Analysis", detail: "Wind-tunnel airflow and thermal simulation, plus hand-solved thrust and mass-flow calculations." },
  { title: "Propulsion Design", detail: "Ramjet and turbofan layouts, blade shaping, and material choices such as titanium and Al-Li." },
  { title: "3D Printing", detail: "Designing parts around print constraints and assembly." },
  { title: "Technical Writing", detail: "Reports, documentation, BOMs, and build guides." }
];
const interests = [
  {
    title: "Flight Simulation And Aviation",
    body: "I have spent a lot of hours in Microsoft Flight Simulator 2020 with my own flight sim equipment. I also follow aviation influencers and news feeds, so I keep up with new aircraft, airlines and the industry."
  },
  {
    title: "Gaming",
    body: "Valorant, Fortnite, Sea Of Thieves, RDR2, Ghost Of Tsushima, Titanfall 2, and whatever else is currently stealing my sleep."
  },
  {
    title: "Badminton",
    body: "Started playing in Grade 10 and went for coaching for a year to improve my skills. Not everything needs a medal table; sometimes it's just fun to hit things very fast."
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

function useMozartLoop(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const startingRef = useRef(false);
  const melodyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;

    const music = musicRef.current ?? new Audio(
      "https://upload.wikimedia.org/wikipedia/commons/e/e2/Mozart%2C_The_Marriage_of_Figaro_%28overture%29.ogg"
    );
    musicRef.current = music;
    music.loop = true;
    // "none": do not pull the 6 MB overture on page load. It starts downloading when the first gesture
    // primes playback, which is well before the synth intro hands off to it.
    music.preload = "none";
    music.volume = 0.42;
    music.muted = true;

    const firstSynth = [
      392, 587, 784, 587, 392, 587, 784, 587,
      494, 587, 784, 587, 523, 659, 784, 659
    ];

    const secondSynth = [
      392, 494, 587, 659, 587, 494, 440, 494,
      523, 659, 784, 659, 587, 523, 494, 440,
      392, 494, 587, 659, 698, 659, 587, 523,
      494, 587, 659, 784, 880, 784, 659, 587,
      523, 659, 784, 988, 880, 784, 698, 659,
      587, 659, 698, 784, 659, 587, 523, 494
    ];

    const stopSynth = () => {
      if (melodyTimerRef.current !== null) {
        window.clearTimeout(melodyTimerRef.current);
        melodyTimerRef.current = null;
      }
    };

    const playSequence = (melody: number[], step: number, onDone: () => void) => {
      let index = 0;

      const playNext = () => {
        if (index >= melody.length) {
          melodyTimerRef.current = null;
          onDone();
          return;
        }

        const now = context.currentTime;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.type = "sine";
        osc.frequency.value = melody[index++];
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.065, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain).connect(context.destination);
        osc.start(now);
        osc.stop(now + 0.24);

        melodyTimerRef.current = window.setTimeout(playNext, step);
      };

      playNext();
    };

    const handoffToMozart = () => {
      music.currentTime = 0;
      music.muted = false;
      music.play().catch(() => {
        startedRef.current = false;
      });
    };

    const startMusic = () => {
      if (startedRef.current || startingRef.current) return;
      startingRef.current = true;

      context.resume().then(() => {
        // The audio element is primed during the user gesture while muted.
        // This avoids the later Mozart handoff being blocked by autoplay policy.
        music.muted = true;
        music.currentTime = 0;
        music.play().then(() => {
          startedRef.current = true;
          startingRef.current = false;
          stopSynth();
          playSequence(firstSynth, 185, () => {
            playSequence(secondSynth, 155, handoffToMozart);
          });
        }).catch(() => {
          startedRef.current = false;
          startingRef.current = false;
        });
      }).catch(() => {
        startedRef.current = false;
        startingRef.current = false;
      });
    };

    const unlockMusic = () => {
      startMusic();
    };

    // Do not attempt to mark audio as started on page load: browsers can keep
    // the AudioContext suspended until an actual user gesture.
    window.addEventListener("wheel", unlockMusic, { passive: true });
    window.addEventListener("scroll", unlockMusic, { passive: true });
    window.addEventListener("touchmove", unlockMusic, { passive: true });
    window.addEventListener("touchstart", unlockMusic, { passive: true });
    window.addEventListener("pointerdown", unlockMusic, { passive: true });
    window.addEventListener("keydown", unlockMusic);

    return () => {
      window.removeEventListener("wheel", unlockMusic);
      window.removeEventListener("scroll", unlockMusic);
      window.removeEventListener("touchmove", unlockMusic);
      window.removeEventListener("touchstart", unlockMusic);
      window.removeEventListener("pointerdown", unlockMusic);
      window.removeEventListener("keydown", unlockMusic);

      stopSynth();
      music.pause();
      music.currentTime = 0;
      music.muted = true;
      startedRef.current = false;
      startingRef.current = false;
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
      <p className="concorde-line">Concorde Raced The Sun And Won, And I'm Racing Against The Universe And Hoping To Win Too.</p>
      <div className="concorde-photo-wrap">
        <Img src={images.concordePhoto} alt="Air France Concorde taking off" />
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
        {gallery.map((image) =>
          image.type === "pdf" ? (
            <a key={image.src} className="photo-tile photo-tile-doc" href={image.src} target="_blank" rel="noreferrer" aria-label={`${image.caption}, opens in a new tab`}>
              <FileText size={44} aria-hidden="true" />
              <span>{image.caption}</span>
              <small aria-hidden="true">PDF</small>
            </a>
          ) : (
          <button key={`${image.src}-${image.caption}`} className="photo-tile" aria-label={image.youtubeId || image.type === "video" ? `${image.caption} (video)` : image.caption} onClick={() => onOpen(image)}>
            {image.type === "video" ? (
              <video src={image.src} muted loop playsInline preload="metadata" />
            ) : (
              <Img src={image.src} alt={image.alt} loading="lazy" />
            )}
            <span>{image.caption}</span>
            {image.youtubeId || image.type === "video" || image.type === "model" ? (
              <small aria-hidden="true">{image.type === "model" ? "3D" : <Play size={14} />}</small>
            ) : null}
          </button>
          )
        )}
      </div>
      <button className="media-scroll media-scroll-right" onClick={() => scroll(1)} aria-label="Scroll media right">
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

// Each project is a boxed panel with its own star colour: media beside the text, quick-glance stat boxes,
// tech chips, status and lesson on show, and the full detail behind a button.
const projectStars: Record<string, string> = {
  "little-helper": "#ff9a4a",
  "team-dinoco": "#7aa8ff",
  dwello: "#4fd1c5",
  trinetra: "#c79bff",
  "rc-plane": "#ffd166"
};

function ProjectRow({ project, index, onOpen }: { project: Project; index: number; onOpen: (image: GalleryImage) => void }) {
  const [open, setOpen] = useState(false);
  const Icon = project.icon;
  const hero = project.gallery[0];
  const backImage =
    project.gallery.find((item, i) => i > 0 && !item.youtubeId && item.type !== "video" && item.type !== "model" && item.type !== "pdf") ?? hero;
  return (
    <motion.article
      className={index % 2 === 1 ? "proj proj-rev" : "proj"}
      style={{ "--pc": projectStars[project.id] ?? "#89d8ff" } as CSSProperties}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
    >
      <button className="proj-media proj-media-flip" onClick={() => onOpen(hero)} aria-label={`Open image: ${hero.caption}`}>
        <span className="project-face project-front">
          <Img src={hero.src} alt={hero.alt} loading="lazy" />
          <span className="proj-index">{String(index + 1).padStart(2, "0")}</span>
        </span>
        <span className="project-face project-back" aria-hidden="true">
          <Img className="project-back-img" src={backImage.src} alt="" loading="lazy" />
          <span className="project-back-scrim" />
          <span className="project-emblem">
            <i />
            <i />
            <i />
            <b />
            <Icon size={30} />
          </span>
          <span className="project-back-eyebrow">{project.eyebrow}</span>
          <strong className="pf-title">{project.title}</strong>
          <span className="pf-note">Flight Notes</span>
        </span>
      </button>
      <div className="proj-body">
        <span className="proj-eyebrow">
          <Icon size={16} /> {project.eyebrow}
        </span>
        <div className="proj-titlerow">
          <h3 className="proj-title">{project.title}</h3>
          {project.devlog && (
            <a className="proj-devlog" href={project.devlog}>
              Read The Devlog <ChevronRight size={15} />
            </a>
          )}
        </div>
        <p className={`proj-status proj-status-${project.status.tone}`}>
          <b>Status: {project.status.label}</b> {project.status.note}
        </p>
        <p className="proj-sum">{project.summary}</p>
        {project.caution && <p className="caution">{project.caution}</p>}
        <p className="proj-learned">
          <span>What I learned</span> {project.learned}
        </p>
        <div className="chip-row">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="proj-statboxes" aria-label={`${project.title} at a glance`}>
          {project.stats.map((stat) => (
            <div key={stat.label} className="proj-statbox">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
        <div className="proj-actions">
          <button className="proj-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? "Hide Details" : "Details And Media"} <ChevronRight size={16} className={open ? "proj-chev open" : "proj-chev"} />
          </button>
          {project.link && (
            <a className="text-link" href={project.link} target="_blank" rel="noreferrer">
              Open Source Link <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
      {open && (
        <div className="proj-more">
          <ul>
            {project.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <details className="spec-sheet">
            <summary>Technical Spec Sheet</summary>
            <div className="spec-sheet-grid">
              <div><span>Project</span><strong>{project.title}</strong></div>
              <div><span>Creator</span><strong>Shlok Alva</strong></div>
              <div><span>Category</span><strong>{project.eyebrow}</strong></div>
              <div><span>Stack</span><strong>{project.stack.join(" • ")}</strong></div>
            </div>
          </details>
          <PhotoStrip gallery={project.gallery} onOpen={onOpen} />
        </div>
      )}
    </motion.article>
  );
}

// An original sleek black dragon: dark scales with a teal rim light, big glowing green eyes, swept crest and a spade tail.
function DragonCompanion() {
  return (
    <>
    <div className="dragon" aria-hidden="true">
      <svg viewBox="0 0 230 150" className="dragon-svg">
        <defs>
          <linearGradient id="dgBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b3342" />
            <stop offset="1" stopColor="#07090e" />
          </linearGradient>
          <linearGradient id="dgWing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#222a3a" />
            <stop offset="1" stopColor="#0a0d14" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="dgPlasma" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e9d2ff" />
            <stop offset="0.45" stopColor="#b86bff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#6a1fd6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dgEye" cx="0.4" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#d9ff9a" />
            <stop offset="0.6" stopColor="#5fe06a" />
            <stop offset="1" stopColor="#1d8f45" />
          </radialGradient>
        </defs>
        <g className="dragon-bob">
          <g className="dragon-wing dragon-wing-far">
            <path d="M126 78 C112 44 86 30 58 34 C68 44 74 52 80 60 C88 58 96 60 102 64 C112 66 120 72 126 78 Z" fill="#10141d" opacity="0.9" />
          </g>
          <path className="dragon-tail" d="M26 120 C46 130 74 122 96 100 L108 108 C80 138 46 142 20 130 Z" fill="url(#dgBody)" />
          <path d="M12 126 L26 117 L31 133 Z" fill="#1e3a44" stroke="#58d6c2" strokeWidth="1.2" />
          <path d="M88 94 C104 72 146 70 164 86 C172 94 166 110 146 114 C124 120 96 114 88 94 Z" fill="url(#dgBody)" stroke="#2f8f8a" strokeWidth="0.8" />
          <path d="M120 112 C122 124 130 128 138 122" stroke="#10141d" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M156 84 C166 68 176 60 188 58" stroke="url(#dgBody)" strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d="M176 50 C187 43 205 46 213 55 C218 61 216 67 207 69 C198 71 187 67 181 63 Z" fill="url(#dgBody)" stroke="#2f8f8a" strokeWidth="0.8" />
          <path d="M184 47 L168 40 L180 52 Z" fill="#161c28" stroke="#58d6c2" strokeWidth="0.8" />
          <path d="M192 46 L178 34 L188 50 Z" fill="#161c28" stroke="#58d6c2" strokeWidth="0.8" />
          <g fill="#161c28" stroke="#58d6c2" strokeWidth="0.7">
            <path d="M104 78 L109 67 L116 78 Z" />
            <path d="M122 74 L127 63 L134 74 Z" />
            <path d="M140 76 L145 65 L152 77 Z" />
          </g>
          <ellipse cx="199" cy="56" rx="6" ry="5.4" fill="url(#dgEye)" />
          <ellipse cx="200" cy="56" rx="1.6" ry="4.2" fill="#04060a" />
          <circle cx="197.4" cy="53.8" r="1.4" fill="#fff" />
          <path d="M203 65 Q208 68 212 63" stroke="#58d6c2" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <g className="dragon-wing dragon-wing-near">
            <path d="M132 80 C118 38 88 18 50 22 C62 34 70 46 78 58 C88 54 98 54 106 58 C114 62 124 70 132 80 Z" fill="url(#dgWing)" stroke="#2f8f8a" strokeWidth="0.8" />
            <path d="M132 80 L50 22 M132 80 L78 58 M132 80 L106 58" stroke="#58d6c2" strokeWidth="1.1" fill="none" opacity="0.55" />
          </g>
          <g className="dragon-charge">
            <circle cx="216" cy="63" r="11" fill="url(#dgPlasma)" />
            <circle cx="216" cy="63" r="4.2" fill="#f6ebff" />
          </g>
        </g>
      </svg>
    </div>
    </>
  );
}

function CockpitPanel() {
  return (
    <div className="cockpit-panel" aria-label="A350-inspired flight deck instrumentation">
      <div className="cockpit-panel-header">
        <span>FLIGHT DECK / VT-PLN</span>
        <strong>CONFIG / VT-PLN</strong>
        <span className="cockpit-log">LAST UPDATED ON <b>5 OCT 2026</b></span>
      </div>
      <div className="cockpit-instruments">
        <div className="pfd-mini">
          <div className="pfd-attitude">
            <div className="pfd-sky" />
            <div className="pfd-ground" />
            <div className="pfd-horizon" />
          </div>
          <div className="pfd-tape pfd-tape-l" aria-hidden="true"><i /></div>
          <div className="pfd-tape pfd-tape-r" aria-hidden="true"><i /></div>
          <div className="pfd-aircraft"><i /><i /><i /></div>
          <div className="pfd-label pfd-alt">ALT <strong>PORTFOLIO</strong></div>
          <div className="pfd-label pfd-spd">SPD <strong>BUILD</strong></div>
          <div className="pfd-vsi">↕</div>
        </div>
        <div className="nd-mini">
          <div className="nd-grid" />
          <div className="nd-sweep" aria-hidden="true" />
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
        <span><b>PHASE</b> BUILDING<span className="phase-dots" aria-hidden="true" /></span>
        <span><b>STATUS</b> <em>NORMAL</em></span>
      </div>
    </div>
  );
}

const contactEmail = atob("YWx2YXNobG9rQGdtYWlsLmNvbQ==");
const contactPhone = atob("KzkxIDk4NDUzOTQ4ODU=");

function LazyMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);
  return <div ref={ref} className="lazy-mount">{visible ? <Suspense fallback={null}>{children}</Suspense> : null}</div>;
}

function App() {
  const [booted, setBooted] = useState(false);
  const [activeNav, setActiveNav] = useState("");

  // Seat-map nav: the row for the section currently on screen lights up.
  useEffect(() => {
    const targets = nav.map(([, , id]) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let current = "";
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) current = el.id;
      });
      setActiveNav(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const reducedMotion = useReducedMotion();
  useMozartLoop(soundEnabled);

  // When the tab is left, the title waves for attention; it goes back when the visitor returns.
  useEffect(() => {
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? "I'll wait for you! ✈" : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, []);

  // External links always open in a new tab so the portfolio stays open.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target) return;
      let url: URL;
      try { url = new URL(link.href, location.href); } catch { return; }
      if (/^https?:$/.test(url.protocol) && url.origin !== location.origin) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // The /beest/ page reads this so the sound choice carries across pages.
  useEffect(() => {
    try { localStorage.setItem("portfolio-sound", soundEnabled ? "on" : "off"); } catch { /* storage unavailable */ }
  }, [soundEnabled]);

  const handleSoundToggle = () => {
    setSoundEnabled((value) => {
      const next = !value;
      window.dispatchEvent(new CustomEvent("portfolio:sound-toggle", { detail: { enabled: next } }));
      try { localStorage.setItem("portfolio-sound", next ? "on" : "off"); } catch { /* storage unavailable */ }
      return next;
    });
  };

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeImage]);

  // Pause looping CSS animations on panels that are scrolled out of view.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("anim-off", !entry.isIntersecting));
    });
    document
      .querySelectorAll(".aviation-compass, .concorde-photo-wrap, .mini-runway, .flight-card, .engine-visual, .cockpit-panel")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [booted]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setBooted(true), reducedMotion ? 100 : 1200);
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

      <DragonCompanion />

      <aside className="flight-nav" aria-label="Flight Deck Navigation">
        <a className="seat-brand" href="#top">
          VT-PLN
        </a>
        {nav.map(([seat, label, target, hint], index) => (
          <a key={seat} href={`#${target}`} className={activeNav === target ? "on" : undefined} aria-current={activeNav === target ? "location" : undefined}>
            <span className="seat-row" aria-hidden="true">
              <b>Row {index + 1}</b>
              <i /><i /><i />
              <u />
              <i /><i /><i />
            </span>
            <strong>{label}</strong>
            <small>{hint}</small>
          </a>
        ))}
        <button className="audio-control" onClick={handleSoundToggle} aria-label="Toggle Interface Sound">
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>AUDIO</span>
        </button>
      </aside>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="aviation-compass" aria-hidden="true">
            <div className="compass-ring compass-ring-outer" />
            <div className="compass-ring compass-ring-inner" />
            <div className="compass-crosshair" />
                    <div className="compass-cardinal compass-e">E</div>
            <div className="compass-cardinal compass-s">S</div>
            <div className="compass-cardinal compass-w">W</div>
            <div className="compass-aviation-label">AVIATION</div>
            <div className="compass-needle">
              <span className="compass-needle-tip" />
              <span className="compass-needle-tail" />
            </div>
            <div className="compass-plane-orbit">
              <Plane size={22} strokeWidth={2.4} />
            </div>
            <div className="compass-center">✦</div>
          </div>
          <p className="eyebrow">Boarding Pass / Engineering Portfolio</p>
          <h1>Shlok Alva</h1>
          <p className="lede">
            Robotics, Aerospace, CAD, Software, And The Habit Of Trying To Build The Thing Instead Of Just Talking About It.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="primary">
              Enter Project Hangar <ChevronRight size={18} />
            </a>
            <a href="/beest/" className="secondary">
              Read The Devlogs <ChevronRight size={18} />
            </a>
            <a href="https://github.com/Diamond0608" target="_blank" rel="noreferrer" className="secondary">
              GitHub <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/shlokalva/" target="_blank" rel="noreferrer" className="secondary">
              LinkedIn <ExternalLink size={18} />
            </a>
            <a href="https://www.instagram.com/teamdinoco_nrl?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="secondary">
              Team Dinoco Instagram <ExternalLink size={18} />
            </a>
          </div>
          <p className="hero-ai-note">This site was built with AI assistance. The projects it shows are my own work.</p>
        </div>
        <div className="hero-board">
          <CockpitPanel />
          <FlightMascot />
        </div>
      </section>

      <section className="glance" aria-label="At a glance">
        <div>
          <span>Studying</span>
          <strong>Grade 12</strong>
          <p>National Public School Koramangala</p>
        </div>
        <div>
          <span>Aiming For</span>
          <strong>Aerospace Engineering</strong>
          <p>Robotics, CAD and propulsion</p>
        </div>
        <div>
          <span>Best Work</span>
          <strong>Little Helper</strong>
          <p>Hack Club BEEST, approved and golden.</p>
          <a className="glance-btn" href="#projects">
            See The Projects <ChevronRight size={15} />
          </a>
        </div>
        <div>
          <span>Also</span>
          <strong>Cyber Club President</strong>
          <p>Earlier Vice President. Robotics Club founder and committee member.</p>
          <a className="glance-btn" href="#timeline">
            See The Timeline <ChevronRight size={15} />
          </a>
        </div>
      </section>

      <section id="mission" className="section mission">
        <div>
          <p className="eyebrow">Mission</p>
          <h2>Mostly Robots, Planes, And Questionable Sleep Schedules</h2>
        </div>
        <div className="mission-copy">
          <p>I like building things that can actually be tested, argued with, broken, fixed, and looked back upon with pride.</p>
          <p>Most of my favorite projects started with a sketch, a CAD file, or a very optimistic “yeah, this should work.”</p>
          <div className="mission-status">
            <span>Current Mission</span>
            <strong>Making It To The World Of Aviation</strong>
            <em>Status: In Progress</em>
          </div>
        </div>
      </section>

      <section id="timeline" className="section timeline-section" aria-label="Flight timeline">
        <div className="section-head">
          <p className="eyebrow">Timeline</p>
          <h2>Flight Timeline</h2>
        </div>
        <FlightTimeline />
      </section>

      <section id="characters" className="section character-section">
        <div className="section-head">
          <h2>Character Select</h2>
        </div>
        <LazyMount><CharacterSelect /></LazyMount>
      </section>

      <section id="projects" className="section band">
        <div className="section-head">
          <p className="eyebrow">Projects</p>
          <h2>Project Hangar</h2>
          <p>Things I Built, Helped Build, Or Learned From The Hard Way.</p>
        </div>
        <div className="proj-list">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} onOpen={setActiveImage} />
          ))}
        </div>
      </section>

      <section id="experiences" className="section band">
        <div className="section-head">
          <p className="eyebrow">Experiences</p>
          <h2>Flight Log</h2>
        </div>
        <div className="experience-grid">
          {experiences.map((experience) => (
            <article key={experience.title} className="experience-card">
              <Img src={experience.image} alt="" loading="lazy" />
              <div>
                <span>{experience.subtitle}</span>
                <h3>{experience.title}</h3>
                <p>{experience.body}</p>
              </div>
            </article>
          ))}
        </div>
        <article id="beest" className="beest-card beest-solo">
          <div className="beest-gallery">
            <img
              className="beest-hero"
              src="/assets/beest-project-card.webp"
              alt="The Little Helper project card on Hack Club BEEST, marked Hardware, Approved and Golden"
              width={684}
              height={230}
              loading="lazy"
            />
            <div className="beest-tiles">
              <figure>
                <img src="/assets/beest/log24-3.webp" alt="CAD render of Little Helper with its book box" width={728} height={500} loading="lazy" />
                <figcaption>CAD</figcaption>
              </figure>
              <figure>
                <img src="/assets/beest/log27-2.webp" alt="KiCad electrical schematic for Little Helper" width={820} height={551} loading="lazy" />
                <figcaption>Schematic</figcaption>
              </figure>
              <figure>
                <img src="/assets/beest/log38-1.webp" alt="3D printed and painted panels for Little Helper's chassis" width={1100} height={828} loading="lazy" />
                <figcaption>Panels</figcaption>
              </figure>
              <figure>
                <img src="/assets/beest/log65-1.webp" alt="Little Helper's electronics mounted inside the chassis" width={1100} height={828} loading="lazy" />
                <figcaption>Electronics</figcaption>
              </figure>
              <figure>
                <img src="/assets/beest/log65-3.webp" alt="Little Helper mid-build with its LED lit" width={1100} height={828} loading="lazy" />
                <figcaption>Mid-build</figcaption>
              </figure>
              <figure>
                <img src="/assets/beest/log69-1.webp" alt="The finished Little Helper build" width={1100} height={828} loading="lazy" />
                <figcaption>Finished build</figcaption>
              </figure>
            </div>
          </div>
          <div>
            <p className="eyebrow">Hack Club</p>
            <h3 className="beest-title">Hack Club BEEST</h3>
            <p className="beest-sub">Shipped To Hack Club&apos;s Standards</p>
            <p>
              Little Helper was my Hack Club BEEST project, and shipping it meant following Hack Club&apos;s standards
              meticulously:
            </p>
            <ul>
              <li>Electrical schematics for the whole build.</li>
              <li>Full CAD of every part and the assembly.</li>
              <li>A devlog every hour of work.</li>
              <li>Every hour recorded, with timelapses.</li>
              <li>Extensive documentation of the whole project.</li>
            </ul>
            <p>
              I had been planning to go to Hack Club Fallout, but realised my visa would not come in time, so I tried
              for BEEST again. I was selected as one of the 30 participants scheduled to travel to the Netherlands. I
              could not go because of travel-related issues, and instead received grants, which I used to buy a drill, a
              monitor, 3D printing filament, a Bambu Lab A1 3D printer and a mouse to work on my projects better.
            </p>
            <p>I also submitted a project to Hack Club Bakebuild and received a grant for cookies.</p>
            <p className="beest-note">
              The hourly recordings and timelapses exist too. The devlog page has the written logs and the photos from each
              one. Trinetra was devlogged the same way, but those logs are not published here.
            </p>
            <a className="primary" href="/beest/">
              Read The Full Devlog <ChevronRight size={17} />
            </a>
          </div>
        </article>
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
              <Img src={signal.image} alt="" loading="lazy" />
              <div>
                <Radar size={18} />
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="interests" className="section interests band">
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
          <p>The can-type turbofan from my Dwello Aerospace internship, with its core and bypass ducts. I modelled it in aluminium with the Al-Li alloy in mind, then animated it.</p>
        </div>
        <div className="engine-stage" aria-label="Interactive 3D turbofan CAD model">
          <div className="engine-stage-glow engine-stage-glow-one" />
          <div className="engine-stage-glow engine-stage-glow-two" />
          <LazyMount><EngineViewer /></LazyMount>
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
            <p>Rotate and zoom the full CAD assembly.</p>
          </div>
          <LazyMount><ProjectModelViewer src="/assets/little-helper.glb" cutaway /></LazyMount>
        </div>
        <div className="engine-project-model">
          <div className="section-head">
            <p className="eyebrow">Engineering Model</p>
            <h3>Trinetra — Interactive CAD Model</h3>
            <p>Rotate and zoom the enclosure and mechanism.</p>
          </div>
          <LazyMount><ProjectModelViewer src="/assets/trinetra.glb" /></LazyMount>
        </div>
      </section>

      <section id="contact" className="section contact">
        <div>
          <p className="eyebrow">Contact</p>
          <div className="final-boarding-image">
            <Img
              src="/assets/a350-cockpit.jpg"
              alt="Airbus A350 cockpit"
              loading="lazy"
            />
          </div>
          <h2>Ready For Final Boarding</h2>
          <p>Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
          <p>Phone: <a href={`tel:${contactPhone}`}>{contactPhone}</a></p>
        </div>
        <div className="contact-actions">
          <a href="/beest/">
            Little Helper Devlog <ChevronRight size={17} />
          </a>
          <a href="https://github.com/Diamond0608" target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={17} />
          </a>
          <a href="https://www.linkedin.com/in/shlokalva/" target="_blank" rel="noreferrer">
            LinkedIn <ExternalLink size={17} />
          </a>
          <a href="https://www.instagram.com/teamdinoco_nrl?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
            Team Dinoco Instagram <ExternalLink size={17} />
          </a>
        </div>
      </section>


      <footer className="site-footer">
        <p>
          <strong>Made with AI.</strong> This site was built with AI assistance (Claude, by Anthropic). The site’s code, layout and some of its wording were produced with AI under my direction. The projects, devlogs, photos and results it describes are my own work.
        </p>
      </footer>

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
              <Suspense fallback={null}><ProjectModelViewer src={activeImage.modelPath} /></Suspense>
            ) : (
              <Img src={activeImage.src} alt={activeImage.alt} />
            )}
            <figcaption>{activeImage.caption}</figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);