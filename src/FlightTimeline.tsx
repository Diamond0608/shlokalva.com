import { useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";

type Milestone = { label: string; date: string; title: string; body: string };

const milestones: Milestone[] = [
  { label: "01", date: "6 Aug 2009", title: "Born", body: "The start of the flight plan." },
  { label: "02", date: "2012", title: "Montessori To Grade 12", body: "15 years at National Public School Koramangala, Montessori to Grade 12." },
  { label: "03", date: "Grade 10", title: "Badminton", body: "Started playing, then a year of coaching to improve my skills." },
  { label: "04", date: "May 2025", title: "Dwello Aerospace", body: "A month on aircraft propulsion: ramjet and turbofan CAD, simulation, report." },
  { label: "05", date: "Summer, Grade 11", title: "Flying Academy Workshop", body: "A one-day aviation workshop that made the pilot path feel real." },
  { label: "06", date: "Grade 11", title: "IIT Madras Aerospace Course", body: "An eight-week aerospace certification course." },
  { label: "07", date: "Grades 11 & 12", title: "Cyber Club", body: "Led as Vice President and President, running events and guiding juniors." },
  { label: "08", date: "Grades 11 & 12", title: "Cyber Competitions", body: "Cybernautica, Odyssey Caipher and the HKU AI+ Challenge." },
  { label: "09", date: "Dec 2025", title: "Team Dinoco At The NRL", body: "Captain: 92nd to second in the playoffs, out in the quarter-finals." },
  { label: "10", date: "May 2026", title: "CERN, Geneva", body: "A week at ALICE, ISOLDE, CMS, ATLAS and the Antimatter Factory." },
  { label: "11", date: "May 2026", title: "Hack Club Bakebuild", body: "Submitted a project and received a grant for cookies." },
  { label: "12", date: "31 May - 19 Aug 2026", title: "Little Helper", body: "Designed and built a track-based robot that carries books for teachers." },
  { label: "13", date: "15 Jul 2026", title: "Hack Club BEEST", body: "Approved and golden. Could not travel; the grants bought a 3D printer and more." },
  { label: "14", date: "21 - 23 Aug 2026", title: "Trinetra", body: "A wearable-tech CAD project: enclosure, mechanism and electrical schematic." },
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

// Original front-view A350-900 style airliner: swept wings with blended winglets, two big Trent-style engines
// with spinners and 24-blade fans, the A350's black wrap-around windscreen mask, a swept fin, and landing gear
// that retracts after liftoff. Drawn from scratch in SVG (no third-party artwork).
function A350({ gearOpacity }: { gearOpacity: MotionValue<number> }) {
  const mirror = (x: number) => 1000 - x;
  return (
    <svg className="tl-plane" viewBox="0 0 1000 460" role="img" aria-label="An A350-style airliner heading toward you">
      <defs>
        <linearGradient id="a3Body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#e9eef5" />
          <stop offset="1" stopColor="#a4afbf" />
        </linearGradient>
        <radialGradient id="a3Sheen" cx="0.36" cy="0.2" r="0.75">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="a3WingTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2f5f9" />
          <stop offset="1" stopColor="#cfd7e2" />
        </linearGradient>
        <linearGradient id="a3WingEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3ccd8" />
          <stop offset="1" stopColor="#6c788b" />
        </linearGradient>
        <linearGradient id="a3Fin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb25a" />
          <stop offset="1" stopColor="#d6591a" />
        </linearGradient>
        <radialGradient id="a3Nacelle" cx="0.42" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#dde4ed" />
          <stop offset="1" stopColor="#8f9bad" />
        </radialGradient>
        <radialGradient id="a3Fan" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#4a5262" />
          <stop offset="1" stopColor="#12161d" />
        </radialGradient>
        <radialGradient id="a3Spinner" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#9aa6b8" />
        </radialGradient>
        <radialGradient id="a3Glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tail fin and stabilisers behind the fuselage */}
      <path d="M332 192 L668 192 L654 212 L346 212 Z" fill="#8a96a8" />
      <path d="M322 190 L338 186 L346 212 L330 214 Z" fill="#a6b0bf" />
      <path d="M678 190 L662 186 L654 212 L670 214 Z" fill="#a6b0bf" />
      <path d="M470 196 L486 26 L526 26 L534 196 Z" fill="url(#a3Fin)" />
      <path d="M486 26 L526 26 L524 40 L488 40 Z" fill="#ffd9a6" opacity="0.85" />

      {/* landing gear: nose leg with taxi light, two main bogies; fades out after liftoff */}
      <motion.g style={{ opacity: gearOpacity }}>
        <rect x="495" y="316" width="10" height="60" fill="#6b7585" />
        <rect x="481" y="372" width="14" height="32" rx="4" fill="#0d1117" />
        <rect x="505" y="372" width="14" height="32" rx="4" fill="#0d1117" />
        <circle cx="500" cy="338" r="9" fill="url(#a3Glow)" />
        {[374, 626].map((x) => (
          <g key={x}>
            <rect x={x - 5} y="292" width="10" height="76" fill="#6b7585" />
            <rect x={x - 22} y="360" width="14" height="38" rx="4" fill="#0d1117" />
            <rect x={x - 6} y="360" width="14" height="38" rx="4" fill="#0d1117" />
            <rect x={x + 10} y="360" width="14" height="38" rx="4" fill="#0d1117" />
          </g>
        ))}
      </motion.g>

      {/* wings: swept leading edge, thin trailing edge with flap lines, blended winglets */}
      {[false, true].map((flip) => {
        const X = (x: number) => (flip ? mirror(x) : x);
        return (
          <g key={flip ? "r" : "l"}>
            <path d={`M${X(436)} 246 L${X(72)} 204 L${X(88)} 232 L${X(440)} 294 Z`} fill="url(#a3WingTop)" />
            <path d={`M${X(440)} 294 L${X(88)} 232 L${X(92)} 240 L${X(444)} 304 Z`} fill="url(#a3WingEdge)" />
            <path d={`M${X(436)} 246 L${X(72)} 204`} stroke="#ffffff" strokeWidth="3" opacity="0.7" fill="none" />
            {[0.2, 0.42, 0.64, 0.84].map((t, k) => (
              <path
                key={k}
                d={`M${X(436 - 364 * t)} ${246 - 42 * t} L${X(440 - 352 * t)} ${294 - 62 * t}`}
                stroke="#aab4c3"
                strokeWidth="1.6"
                fill="none"
                opacity="0.8"
              />
            ))}
            <path d={`M${X(72)} 204 C${X(60)} 178 ${X(56)} 146 ${X(62)} 110 L${X(78)} 118 C${X(82)} 148 ${X(90)} 178 ${X(98)} 208 Z`} fill="#dfe6ef" />
            <path d={`M${X(62)} 110 L${X(78)} 118 L${X(74)} 128 L${X(64)} 124 Z`} fill="#b7c2d0" />
          </g>
        );
      })}

      {/* engines on pylons: nacelle lip, dark intake, 24 fan blades and a spinner */}
      {[300, 700].map((x) => (
        <g key={x}>
          <path d={`M${x - 9} 262 L${x + 9} 262 L${x + 14} 296 L${x - 14} 296 Z`} fill="#8793a6" />
          <circle cx={x} cy="316" r="66" fill="#6c788b" opacity="0.5" transform="translate(5 8)" />
          <circle cx={x} cy="316" r="64" fill="url(#a3Nacelle)" />
          <circle cx={x} cy="316" r="52" fill="#1a1f29" />
          <circle cx={x} cy="316" r="50" fill="url(#a3Fan)" />
          {Array.from({ length: 24 }, (_, k) => {
            const a = (k / 24) * Math.PI * 2;
            return (
              <path
                key={k}
                d={`M${x + Math.cos(a) * 12} ${316 + Math.sin(a) * 12} Q${x + Math.cos(a + 0.35) * 32} ${316 + Math.sin(a + 0.35) * 32} ${x + Math.cos(a + 0.16) * 49} ${316 + Math.sin(a + 0.16) * 49}`}
                stroke="#5a6477"
                strokeWidth="3.4"
                fill="none"
              />
            );
          })}
          <circle cx={x} cy="316" r="14" fill="url(#a3Spinner)" />
          <path d={`M${x - 8} ${316 + 2} Q${x} ${316 - 12} ${x + 9} ${316 - 2}`} stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
          <path d={`M${x - 58} ${316 - 18} A60 60 0 0 1 ${x - 10} ${316 - 60}`} stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" strokeLinecap="round" />
        </g>
      ))}

      {/* navigation lights on the winglet tips */}
      <circle className="tl-navlight tl-navlight-red" cx="64" cy="112" r="6" fill="#ff4d4d" />
      <circle className="tl-navlight tl-navlight-green" cx="936" cy="112" r="6" fill="#4dff88" />

      {/* fuselage: sheen, belly shading, panel lines, black windscreen mask, nose radome and livery line */}
      <ellipse cx="500" cy="254" rx="98" ry="114" fill="url(#a3Body)" />
      <ellipse cx="500" cy="254" rx="98" ry="114" fill="url(#a3Sheen)" />
      <path d="M404 262 Q500 400 596 262 L596 300 Q500 420 404 300 Z" fill="#8f9bad" opacity="0.4" />
      <path d="M420 236 Q500 214 580 236" stroke="#c4cdd9" strokeWidth="1.4" fill="none" />
      <path d="M414 262 Q500 244 586 262" stroke="#c4cdd9" strokeWidth="1.2" fill="none" />
      <path d="M418 188 C440 164 470 156 500 156 C530 156 560 164 582 188 L576 228 C550 216 526 212 500 212 C474 212 450 216 424 228 Z" fill="#0c1018" />
      <path d="M426 228 L418 188 L412 200 L418 238 Z" fill="#161c28" />
      <path d="M574 228 L582 188 L588 200 L582 238 Z" fill="#161c28" />
      <path d="M468 158 L474 212 M500 156 L500 212 M532 158 L526 212" stroke="#2a3446" strokeWidth="3.4" />
      <path d="M432 186 Q466 168 494 170" stroke="#9fb3d1" strokeWidth="2.4" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M510 170 Q536 168 566 184" stroke="#9fb3d1" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      <ellipse cx="500" cy="262" rx="30" ry="24" fill="#d5dce6" />
      <ellipse cx="500" cy="262" rx="18" ry="14" fill="#b3bdcb" />
      <path d="M488 246 L486 238 M512 246 L514 238" stroke="#59657a" strokeWidth="2" />
      <path d="M404 296 Q500 372 596 296" stroke="#ff8a2a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M410 306 Q500 380 590 306" stroke="#1a2030" strokeWidth="2" fill="none" opacity="0.5" />

      {/* landing lights at the wing roots */}
      <circle cx="456" cy="290" r="20" fill="url(#a3Glow)" opacity="0.8" />
      <circle cx="544" cy="290" r="20" fill="url(#a3Glow)" opacity="0.8" />
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
              <div className="tl-card-box" tabIndex={0}>
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
