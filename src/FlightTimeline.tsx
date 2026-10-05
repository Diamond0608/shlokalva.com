import { useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";

type Milestone = { label: string; date: string; title: string; body: string };

const milestones: Milestone[] = [
  { label: "01", date: "6 Aug 2009", title: "Born", body: "The start of the flight plan." },
  { label: "02", date: "2012", title: "Montessori To Grade 12", body: "15 years at National Public School Koramangala, from Montessori to Grade 12." },
  { label: "03", date: "Grade 10", title: "Badminton", body: "Picked up badminton. Played casually, just for the fun of hitting things fast." },
  { label: "04", date: "May 2025", title: "Dwello Aerospace", body: "A month on aircraft propulsion: ramjet and turbofan CAD, simulation and a report." },
  { label: "05", date: "Summer, Grade 11", title: "Flying Academy Workshop", body: "A one-day aviation workshop that made the pilot-career side feel real." },
  { label: "06", date: "Grade 11", title: "IIT Madras Aerospace Course", body: "An eight-week aerospace certification course." },
  { label: "07", date: "Grades 11 & 12", title: "Cyber Club", body: "Led as Vice President and President, running events and guiding juniors." },
  { label: "08", date: "Grades 11 & 12", title: "Cyber Competitions", body: "Cybernautica, Odyssey Caipher and the HKU AI+ Challenge." },
  { label: "09", date: "Dec 2025", title: "Team Dinoco At The NRL", body: "Captained the team from 92nd to second in the playoffs, out in the quarter-finals." },
  { label: "10", date: "May 2026", title: "CERN, Geneva", body: "A week visiting ALICE, ISOLDE, CMS, ATLAS and the Antimatter Factory." },
  { label: "11", date: "May 2026", title: "Hack Club Bakebuild", body: "Submitted a project and received a grant for cookies." },
  { label: "12", date: "31 May - 19 Aug 2026", title: "Little Helper", body: "Designed and built a track-based robot that carries books for teachers." },
  { label: "13", date: "15 Jul 2026", title: "Hack Club BEEST", body: "Little Helper approved and golden. Could not travel; the grants bought a printer, drill and monitor." },
  { label: "14", date: "21 - 23 Aug 2026", title: "Trinetra", body: "A wearable-tech CAD project: enclosure, extension mechanism and an electrical schematic." },
  { label: "15", date: "Grade 12", title: "Helios And Iris", body: "Volunteered at the Helios robotics fest and was an event head for Robo-FC at Iris." },
  { label: "16", date: "Grade 12", title: "Robotics Club", body: "Founded the club to get more people into robotics and tech at school." }
];

const PHASES: Array<[number, string]> = [
  [0.14, "TAXI"],
  [0.5, "TAKEOFF ROLL"],
  [0.62, "ROTATE"],
  [1.01, "CLIMB"]
];

function phaseFor(progress: number) {
  return (PHASES.find(([limit]) => progress < limit) ?? PHASES[PHASES.length - 1])[1];
}

// Original front-view A350-style airliner drawn in SVG: swept wings with upturned winglets,
// two large engines, a swept tail fin above the fuselage and landing gear that retracts after liftoff.
function A350({ gearOpacity }: { gearOpacity: MotionValue<number> }) {
  return (
    <svg className="tl-plane" viewBox="0 0 900 420" role="img" aria-label="An A350-style airliner heading toward you">
      <defs>
        <linearGradient id="tlBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e3e9f1" />
          <stop offset="1" stopColor="#a9b4c4" />
        </linearGradient>
        <linearGradient id="tlWing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe6ef" />
          <stop offset="1" stopColor="#8e99ab" />
        </linearGradient>
        <linearGradient id="tlTail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffa24a" />
          <stop offset="1" stopColor="#d9601a" />
        </linearGradient>
        <radialGradient id="tlEngine" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#aeb9c9" />
        </radialGradient>
      </defs>

      {/* tail fin and stabilisers behind the fuselage */}
      <path d="M300 168 L600 168 L594 180 L306 180 Z" fill="#8e99ab" />
      <path d="M426 150 L444 34 L482 34 L476 150 Z" fill="url(#tlTail)" />

      {/* landing gear: nose and two main legs, fades out after liftoff */}
      <motion.g style={{ opacity: gearOpacity }}>
        <rect x="446" y="292" width="8" height="46" fill="#5b6574" />
        <rect x="436" y="332" width="9" height="22" rx="3" fill="#10141b" />
        <rect x="455" y="332" width="9" height="22" rx="3" fill="#10141b" />
        <rect x="334" y="262" width="8" height="82" fill="#5b6574" />
        <rect x="324" y="338" width="9" height="24" rx="3" fill="#10141b" />
        <rect x="343" y="338" width="9" height="24" rx="3" fill="#10141b" />
        <rect x="558" y="262" width="8" height="82" fill="#5b6574" />
        <rect x="548" y="338" width="9" height="24" rx="3" fill="#10141b" />
        <rect x="567" y="338" width="9" height="24" rx="3" fill="#10141b" />
      </motion.g>

      {/* wings with dihedral and upturned winglets */}
      <path d="M392 226 L64 188 L72 208 L394 252 Z" fill="url(#tlWing)" />
      <path d="M508 226 L836 188 L828 208 L506 252 Z" fill="url(#tlWing)" />
      <path d="M64 188 L48 146 L70 156 L80 190 Z" fill="#cfd8e4" />
      <path d="M836 188 L852 146 L830 156 L820 190 Z" fill="#cfd8e4" />
      <path d="M394 252 L72 208 L74 214 L396 258 Z" fill="#6f7a8c" opacity="0.7" />
      <path d="M506 252 L828 208 L826 214 L504 258 Z" fill="#6f7a8c" opacity="0.7" />

      {/* engines on pylons */}
      {[280, 620].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="226" width="14" height="36" fill="#8e99ab" />
          <circle cx={x} cy="278" r="48" fill="url(#tlEngine)" />
          <circle cx={x} cy="278" r="36" fill="#2b323e" />
          <circle cx={x} cy="278" r="30" fill="#161b24" />
          {Array.from({ length: 14 }, (_, k) => {
            const a = (k / 14) * Math.PI * 2;
            return <line key={k} x1={x} y1={278} x2={x + Math.cos(a) * 28} y2={278 + Math.sin(a) * 28} stroke="#3b4455" strokeWidth="3" />;
          })}
          <circle cx={x} cy="278" r="9" fill="#a3aebf" />
        </g>
      ))}

      {/* navigation lights: red on the left winglet, green on the right */}
      <circle className="tl-navlight tl-navlight-red" cx="52" cy="148" r="5" fill="#ff4d4d" />
      <circle className="tl-navlight tl-navlight-green" cx="848" cy="148" r="5" fill="#4dff88" />

      {/* fuselage, nose and cockpit */}
      <ellipse cx="450" cy="222" rx="76" ry="86" fill="url(#tlBody)" />
      <path d="M374 232 Q450 330 526 232 L526 262 Q450 350 374 262 Z" fill="#9aa5b6" opacity="0.35" />
      <path d="M396 178 Q450 156 504 178 L498 206 Q450 190 402 206 Z" fill="#111721" />
      <path d="M450 168 L450 198" stroke="#2b3444" strokeWidth="3" />
      <path d="M408 184 Q430 176 446 178" stroke="#5a6b86" strokeWidth="2" fill="none" opacity="0.7" />
      <circle cx="450" cy="244" r="20" fill="#e8edf4" />
      <circle cx="450" cy="244" r="12" fill="#c5cedb" />
      <path d="M376 236 Q450 330 524 236" stroke="#ff8a2a" strokeWidth="5" fill="none" opacity="0.9" />
    </svg>
  );
}

function Milestones({ active, onPick }: { active: number; onPick: (index: number) => void }) {
  return (
    <div className="tl-rail" role="group" aria-label="Jump to a milestone">
      {milestones.map((milestone, i) => (
        <button
          key={milestone.label}
          className={i === active ? "tl-dot active" : "tl-dot"}
          onClick={() => onPick(i)}
          aria-label={`Milestone ${milestone.label}`}
          aria-current={i === active ? "step" : undefined}
        >
          <span>{milestone.label}</span>
        </button>
      ))}
    </div>
  );
}

function StaticTimeline() {
  return (
    <ol className="tl-static">
      {milestones.map((milestone) => (
        <li key={milestone.label}>
          <span>{milestone.date}</span>
          <h3>{milestone.title}</h3>
          <p>{milestone.body}</p>
        </li>
      ))}
      <li>
        <span>Next</span>
        <h3>College????</h3>
        <p>Aerospace engineering is the plan. Where is still being decided.</p>
      </li>
    </ol>
  );
}

// Milestone i appears once the plane has flown this far; earlier ones stay on screen.
const appearAt = (index: number) => 0.04 + index * (0.78 / (milestones.length - 1));

// Static night skyline at the far end of the runway: terminal blocks, a control tower and lit windows.
const SKYLINE: Array<[number, number, number]> = [
  [20, 70, 40], [96, 54, 62], [156, 80, 34], [244, 46, 74], [296, 90, 44], [392, 38, 90],
  [436, 64, 36], [506, 100, 52], [612, 52, 30], [670, 76, 66], [752, 60, 40], [818, 94, 56], [918, 62, 34]
];

function Skyline() {
  return (
    <svg className="tl-skyline" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
      <g fill="#0a0e15">
        {SKYLINE.map(([x, w, h], k) => (
          <rect key={k} x={x} y={120 - h} width={w} height={h} />
        ))}
        <rect x="470" y="30" width="10" height="90" />
        <path d="M455 34 L495 34 L488 22 L462 22 Z" />
      </g>
      <g fill="#ffcf8a">
        {SKYLINE.flatMap(([x, w, h], k) =>
          Array.from({ length: Math.floor(w / 12) * Math.floor(h / 14) }, (_, n) => {
            const cols = Math.floor(w / 12);
            const cx = x + 5 + (n % cols) * 12;
            const cy = 120 - h + 6 + Math.floor(n / cols) * 14;
            return (k * 7 + n * 3) % 5 === 0 ? <rect key={`${k}-${n}`} x={cx} y={cy} width="3" height="3" opacity="0.8" /> : null;
          })
        )}
        <rect x="464" y="25" width="26" height="5" fill="#89d8ff" opacity="0.9" />
      </g>
    </svg>
  );
}

export default function FlightTimeline() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState("TAXI");
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // The runway and scenery stay still: only the plane moves. It rolls toward you, rotates, then climbs out over you.
  const planeX = useTransform(scrollYProgress, [0, 0.55, 1], ["0vw", "0vw", "34vw"]);
  const planeY = useTransform(scrollYProgress, [0, 0.55, 1], ["0vh", "26vh", "-46vh"]);
  const planeScale = useTransform(scrollYProgress, [0, 0.55, 1], [0.2, 0.95, 2.2]);
  const planeRotate = useTransform(scrollYProgress, [0, 0.45, 0.62, 0.8, 1], [0, 0, 2, -3, 4]);
  const planeOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0]);
  const gearOpacity = useTransform(scrollYProgress, [0.56, 0.68], [1, 0]);
  const shadowY = useTransform(scrollYProgress, [0, 0.55, 1], ["0vh", "26vh", "26vh"]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.04, 0.55, 0.8], [0, 0.55, 0.55, 0]);
  const collegeY = useTransform(scrollYProgress, [0.88, 0.985], ["100%", "0%"]);
  const cloudsY = useTransform(scrollYProgress, [0.55, 1], ["-25%", "115%"]);
  const cloudsOpacity = useTransform(scrollYProgress, [0.5, 0.62, 1], [0, 0.9, 0.9]);
  const barWidth = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const count = milestones.reduce((total, _m, index) => (value >= appearAt(index) ? index + 1 : total), 0);
    setShown((current) => (current === count ? current : count));
    setPhase((current) => {
      const next = phaseFor(value);
      return next === current ? current : next;
    });
  });

  const skip = () => {
    document.getElementById("characters")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const pick = (index: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const travel = wrap.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (appearAt(index) + 0.02) * travel, behavior: reduced ? "auto" : "smooth" });
  };

  if (reduced) {
    return (
      <div className="tl-reduced">
        <StaticTimeline />
      </div>
    );
  }

  return (
    <div className="tl-wrap" ref={wrapRef}>
      <div className="tl-stage" style={{ "--n": milestones.length, "--shown": shown } as CSSProperties}>
        <div className="tl-sky" aria-hidden="true">
          <i className="tl-moon" />
        </div>
        <motion.div className="tl-clouds" style={{ y: cloudsY, opacity: cloudsOpacity }} aria-hidden="true">
          <i />
          <i />
          <i />
        </motion.div>

        <Skyline />
        <div className="tl-runway" aria-hidden="true" />

        <motion.div className="tl-shadow" style={{ y: shadowY, scale: planeScale, opacity: shadowOpacity }} aria-hidden="true" />
        <motion.div className="tl-plane-wrap" style={{ x: planeX, y: planeY, scale: planeScale, rotate: planeRotate, opacity: planeOpacity }}>
          <A350 gearOpacity={gearOpacity} />
        </motion.div>
        <div className="tl-spine" aria-hidden="true">
          <i />
        </div>
        <div className="tl-vignette" aria-hidden="true" />

        <div className="tl-hud">
          <span className="tl-phase">{phase}</span>
          <div className="tl-progress" aria-hidden="true">
            <motion.i style={{ width: barWidth }} />
          </div>
        </div>

        <button className="tl-skip" onClick={skip}>
          Skip Timeline <ArrowDown size={15} />
        </button>

        <ol className="tl-cards" aria-live="polite">
          {shown > 6 && <li className="tl-earlier" aria-hidden="true">+{shown - 6} earlier</li>}
          {milestones.map((milestone, i) => (
            <li
              key={milestone.label}
              className={["tl-row", i < shown ? "shown" : "", i === shown - 1 ? "latest" : "", i % 2 === 0 ? "left" : "right", i < shown - 6 ? "old" : ""].join(" ")}
              style={{ "--i": i } as CSSProperties}
              aria-hidden={i >= shown}
            >
              <span className="tl-date-side">{milestone.date}</span>
              <span className="tl-node">{milestone.label}</span>
              <div className="tl-card-box">
                <span className="tl-card-date-m">{milestone.date}</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <Milestones active={Math.max(0, shown - 1)} onPick={pick} />

        <motion.div className="tl-college" style={{ y: collegeY }}>
          <i className="tl-college-moon" aria-hidden="true" />
          <span className="tl-college-eyebrow">Next Destination</span>
          <h3>College????</h3>
          <p>Aerospace engineering is the plan. Where is still being decided.</p>
        </motion.div>
      </div>
    </div>
  );
}
