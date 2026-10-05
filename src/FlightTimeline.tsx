import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";

type Milestone = { label: string; date: string; title: string; body: string };

// Placeholder content: Shlok will supply the real milestones, dates and text.
const milestones: Milestone[] = [
  { label: "01", date: "Date TBD", title: "Milestone One", body: "Placeholder. The real milestone goes here." },
  { label: "02", date: "Date TBD", title: "Milestone Two", body: "Placeholder. The real milestone goes here." },
  { label: "03", date: "Date TBD", title: "Milestone Three", body: "Placeholder. The real milestone goes here." },
  { label: "04", date: "Date TBD", title: "Milestone Four", body: "Placeholder. The real milestone goes here." },
  { label: "05", date: "Date TBD", title: "Milestone Five", body: "Placeholder. The real milestone goes here." },
  { label: "06", date: "Date TBD", title: "Milestone Six", body: "Placeholder. The real milestone goes here." }
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
    </ol>
  );
}

export default function FlightTimeline() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState("TAXI");
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // Plane path: roll along the runway, rotate, then climb out toward the viewer.
  const planeX = useTransform(scrollYProgress, [0, 0.55, 1], ["0vw", "0vw", "34vw"]);
  const planeY = useTransform(scrollYProgress, [0, 0.55, 1], ["0vh", "26vh", "-46vh"]);
  const planeScale = useTransform(scrollYProgress, [0, 0.55, 1], [0.2, 0.95, 2.2]);
  const planeRotate = useTransform(scrollYProgress, [0, 0.45, 0.62, 0.8, 1], [0, 0, 2, -3, 4]);
  const planeOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0]);
  const gearOpacity = useTransform(scrollYProgress, [0.56, 0.68], [1, 0]);
  const dashY = useTransform(scrollYProgress, (v) => (v * 4200) % 120);
  const dashOpacity = useTransform(scrollYProgress, [0, 0.6, 0.72], [1, 1, 0.15]);
  const skyShift = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const cloudsY = useTransform(scrollYProgress, [0.5, 1], ["-10%", "120%"]);
  const barWidth = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive((current) => {
      const next = Math.min(milestones.length - 1, Math.max(0, Math.floor(value * milestones.length)));
      return next === current ? current : next;
    });
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
    window.scrollTo({ top: top + ((index + 0.5) / milestones.length) * travel, behavior: reduced ? "auto" : "smooth" });
  };

  if (reduced) {
    return (
      <div className="tl-reduced">
        <StaticTimeline />
      </div>
    );
  }

  const current = milestones[active];

  return (
    <div className="tl-wrap" ref={wrapRef}>
      <div className="tl-stage">
        <motion.div className="tl-sky" style={{ y: skyShift }} aria-hidden="true" />
        <motion.div className="tl-clouds" style={{ y: cloudsY }} aria-hidden="true">
          <i />
          <i />
          <i />
        </motion.div>

        <div className="tl-runway" aria-hidden="true">
          <motion.div className="tl-dashes" style={{ y: dashY, opacity: dashOpacity }} />
        </div>

        <motion.div className="tl-plane-wrap" style={{ x: planeX, y: planeY, scale: planeScale, rotate: planeRotate, opacity: planeOpacity }}>
          <A350 gearOpacity={gearOpacity} />
        </motion.div>

        <div className="tl-hud">
          <span className="tl-phase">{phase}</span>
          <div className="tl-progress" aria-hidden="true">
            <motion.i style={{ width: barWidth }} />
          </div>
        </div>

        <button className="tl-skip" onClick={skip}>
          Skip Timeline <ArrowDown size={15} />
        </button>

        <div className="tl-card" key={current.label} aria-live="polite">
          <span className="tl-card-date">{current.date}</span>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
        </div>

        <Milestones active={active} onPick={pick} />
      </div>
    </div>
  );
}
