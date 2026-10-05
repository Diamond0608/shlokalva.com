import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Kind = "engineer" | "pilot" | "captain" | "explorer" | "philosopher" | "friend";

type Character = {
  id: Kind;
  name: string;
  tagline: string;
  portrait: string;
  portraitAlt: string;
  // Generic RPG fields. null renders as PLACEHOLDER until Shlok supplies the value.
  age: string | null;
  height: string | null;
  level: string | null;
  alignment: string;
  stats: Array<{ label: string; value: number | null }>; // value is 1-10 (self-rated) or null
  signature: string;
  weakness: string;
  quests: string[];
};

const characters: Character[] = [
  {
    id: "engineer",
    name: "The Engineer",
    tagline: "Sketch it, CAD it, print it, break it, fix it.",
    portrait: "/assets/little-helper-real.jpg",
    portraitAlt: "Little Helper, the track-based robot Shlok built",
    age: null,
    height: null,
    level: null,
    alignment: "Lawful Tinkerer",
    stats: [
      { label: "CAD", value: null },
      { label: "Electronics", value: null },
      { label: "Debugging", value: null },
      { label: "Patience", value: null }
    ],
    signature: "Fusion 360 to a working robot",
    weakness: "“Yeah, this should work.”",
    quests: ["Little Helper", "Trinetra", "Dwello Turbofan"]
  },
  {
    id: "pilot",
    name: "The Pilot",
    tagline: "Racing against the universe and hoping to win too.",
    portrait: "/assets/rc-plane.jpg",
    portraitAlt: "The scratch-built RC plane",
    age: null,
    height: null,
    level: null,
    alignment: "Neutral Aviator",
    stats: [
      { label: "Aerodynamics", value: null },
      { label: "Propulsion", value: null },
      { label: "Ambition", value: null },
      { label: "Persistence", value: null }
    ],
    signature: "NACA 0012 sizing in MotoCalc",
    weakness: "The RC plane has not flown yet.",
    quests: ["Self-Made RC Plane", "IIT Madras Aerospace Course", "Flying Academy Workshop"]
  },
  {
    id: "captain",
    name: "The Captain",
    tagline: "Coordination, travel plans, and driving the bot.",
    portrait: "/assets/char-captain.webp",
    portraitAlt: "Shlok in a navy suit",
    age: null,
    height: null,
    level: null,
    alignment: "Lawful Organiser",
    stats: [
      { label: "Leadership", value: null },
      { label: "Coordination", value: null },
      { label: "Public Speaking", value: null },
      { label: "Crisis Handling", value: null }
    ],
    signature: "Climbing from 92nd to second in the playoffs",
    weakness: "Brands everything when stressed.",
    quests: ["Team Dinoco", "Cyber Club", "Robotics Club"]
  },
  {
    id: "explorer",
    name: "The Explorer",
    tagline: "Follows the science, and the evening walks.",
    portrait: "/assets/char-explorer.webp",
    portraitAlt: "Shlok sitting on an ice formation during a trip",
    age: null,
    height: null,
    level: null,
    alignment: "Chaotic Curious",
    stats: [
      { label: "Curiosity", value: null },
      { label: "Adaptability", value: null },
      { label: "Cold Tolerance", value: null },
      { label: "Travel Stamina", value: null }
    ],
    signature: "A week at CERN",
    weakness: "Cancelled flights.",
    quests: ["CERN Visit", "Hack Club BEEST (selected)"]
  },
  {
    id: "philosopher",
    name: "The Philosopher",
    tagline: "Writes poems to say it better.",
    portrait: "/assets/char-philosopher.webp",
    portraitAlt: "Shlok sitting thoughtfully outdoors",
    age: null,
    height: null,
    level: null,
    alignment: "Neutral Thinker",
    stats: [
      { label: "Reflection", value: null },
      { label: "Wordcraft", value: null },
      { label: "Overthinking", value: null },
      { label: "Empathy", value: null }
    ],
    signature: "Memento Mori and Magnum Opus",
    weakness: "Questionable sleep schedule.",
    quests: ["Poems"]
  },
  {
    id: "friend",
    name: "The Friend",
    tagline: "Evening walks, friend-group moments, and one more match.",
    portrait: "/assets/char-friend.webp",
    portraitAlt: "Shlok smiling in a framed portrait",
    age: null,
    height: null,
    level: null,
    alignment: "Chaotic Good",
    stats: [
      { label: "Loyalty", value: null },
      { label: "Humour", value: null },
      { label: "Gaming Skill", value: null },
      { label: "Sleep Debt", value: null }
    ],
    signature: "Chamonix, Carouge and Geneva Old Town",
    weakness: "Whatever game is stealing the sleep this week.",
    quests: ["CERN Evenings", "Valorant, Fortnite, RDR2 and more"]
  }
];

const palette: Record<Kind, { top: string; pants: string; accent: string; ring: string }> = {
  engineer: { top: "#e8873a", pants: "#2b3340", accent: "#f5c542", ring: "#ff8a2a" },
  pilot: { top: "#3a4a63", pants: "#1b2230", accent: "#89d8ff", ring: "#89d8ff" },
  captain: { top: "#1a2748", pants: "#141a2e", accent: "#b3392d", ring: "#ff8a2a" },
  explorer: { top: "#2a2f36", pants: "#1b1b1f", accent: "#4aa3d9", ring: "#89d8ff" },
  philosopher: { top: "#5b4a3a", pants: "#2a2320", accent: "#e9dcc3", ring: "#e9dcc3" },
  friend: { top: "#2e7d5b", pants: "#233342", accent: "#ff5a5f", ring: "#7dff9a" }
};

const SKIN = "#b07a52";
const HAIR = "#14110f";

function Mat({ color, metal = 0.1, rough = 0.7 }: { color: string; metal?: number; rough?: number }) {
  return <meshStandardMaterial color={color} metalness={metal} roughness={rough} />;
}

function Accessories({ kind, accent }: { kind: Kind; accent: string }) {
  switch (kind) {
    case "engineer":
      return (
        <>
          {/* hard hat */}
          <mesh position={[0, 2.2, 0]} scale={[1, 0.7, 1]}>
            <sphereGeometry args={[0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat color={accent} rough={0.45} />
          </mesh>
          <mesh position={[0, 2.16, 0.12]}>
            <boxGeometry args={[0.5, 0.025, 0.3]} />
            <Mat color={accent} rough={0.45} />
          </mesh>
          {/* wrench */}
          <group position={[0.56, 0.98, 0.16]} rotation={[0.2, 0, -0.5]}>
            <mesh>
              <boxGeometry args={[0.05, 0.5, 0.04]} />
              <Mat color="#c8ccd2" metal={0.8} rough={0.3} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <torusGeometry args={[0.07, 0.025, 8, 16, Math.PI * 1.6]} />
              <Mat color="#c8ccd2" metal={0.8} rough={0.3} />
            </mesh>
          </group>
          {/* tool belt */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.33, 0.33, 0.07, 20]} />
            <Mat color="#3b2a1c" />
          </mesh>
        </>
      );
    case "pilot":
      return (
        <>
          {/* headset */}
          <mesh position={[0, 2.08, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.28, 0.025, 8, 24, Math.PI]} />
            <Mat color="#1d2330" metal={0.4} />
          </mesh>
          {[-0.28, 0.28].map((x) => (
            <mesh key={x} position={[x, 2.0, 0]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <Mat color={accent} metal={0.3} rough={0.4} />
            </mesh>
          ))}
          <mesh position={[0.2, 1.88, 0.2]} rotation={[0, 0.5, -0.4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
            <Mat color="#1d2330" />
          </mesh>
          {/* model plane */}
          <group position={[0.58, 1.0, 0.22]} rotation={[0.1, 0.6, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.04, 0.3, 4, 8]} />
              <Mat color="#eef2f6" rough={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.38, 0.012, 0.09]} />
              <Mat color={accent} rough={0.4} />
            </mesh>
            <mesh position={[0, 0.04, -0.15]}>
              <boxGeometry args={[0.012, 0.09, 0.07]} />
              <Mat color={accent} rough={0.4} />
            </mesh>
          </group>
        </>
      );
    case "captain":
      return (
        <>
          {/* tie */}
          <mesh position={[0, 1.4, 0.345]}>
            <boxGeometry args={[0.07, 0.5, 0.02]} />
            <Mat color={accent} rough={0.5} />
          </mesh>
          {/* lanyard badge */}
          <mesh position={[0.14, 1.28, 0.35]}>
            <boxGeometry args={[0.13, 0.17, 0.015]} />
            <Mat color="#f1f1f1" />
          </mesh>
          <mesh position={[0.14, 1.28, 0.36]}>
            <boxGeometry args={[0.09, 0.04, 0.005]} />
            <Mat color="#ff8a2a" />
          </mesh>
        </>
      );
    case "explorer":
      return (
        <>
          {/* backpack (rear, -z) */}
          <mesh position={[0, 1.35, -0.34]}>
            <boxGeometry args={[0.5, 0.65, 0.22]} />
            <Mat color={accent} rough={0.8} />
          </mesh>
          <mesh position={[0, 1.2, -0.46]}>
            <boxGeometry args={[0.38, 0.28, 0.06]} />
            <Mat color="#1f6d9c" rough={0.8} />
          </mesh>
          {/* camera */}
          <group position={[0.56, 0.98, 0.18]} rotation={[0, 0.4, 0]}>
            <mesh>
              <boxGeometry args={[0.2, 0.13, 0.1]} />
              <Mat color="#1a1a1c" metal={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.05, 0.08, 12]} />
              <Mat color="#26262a" metal={0.6} rough={0.3} />
            </mesh>
          </group>
        </>
      );
    case "philosopher":
      return (
        <>
          {/* long coat skirt */}
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.32, 0.42, 0.62, 20]} />
            <Mat color="#5b4a3a" rough={0.9} />
          </mesh>
          {/* glasses */}
          {[-0.1, 0.1].map((x) => (
            <mesh key={x} position={[x, 2.03, 0.27]}>
              <torusGeometry args={[0.07, 0.01, 8, 18]} />
              <Mat color="#1d1d1d" metal={0.5} />
            </mesh>
          ))}
          {/* book */}
          <group position={[0.54, 1.0, 0.2]} rotation={[0.3, 0.3, 0.1]}>
            <mesh>
              <boxGeometry args={[0.24, 0.32, 0.06]} />
              <Mat color="#7a1f1f" rough={0.7} />
            </mesh>
            <mesh position={[0.005, 0, 0.032]}>
              <boxGeometry args={[0.21, 0.29, 0.005]} />
              <Mat color={accent} rough={0.9} />
            </mesh>
          </group>
        </>
      );
    case "friend":
      return (
        <>
          {/* headphones */}
          <mesh position={[0, 2.08, 0]}>
            <torusGeometry args={[0.29, 0.03, 8, 24, Math.PI]} />
            <Mat color={accent} rough={0.5} />
          </mesh>
          {[-0.29, 0.29].map((x) => (
            <mesh key={x} position={[x, 2.0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.07, 14]} />
              <Mat color="#1c1c20" rough={0.5} />
            </mesh>
          ))}
          {/* controller */}
          <group position={[0.54, 0.98, 0.22]} rotation={[0.5, 0.2, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 0.07, 0.15]} />
              <Mat color="#2a2d36" rough={0.5} />
            </mesh>
            {[-0.09, 0.09].map((x) => (
              <mesh key={x} position={[x, 0.045, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.03, 10]} />
                <Mat color={accent} />
              </mesh>
            ))}
          </group>
        </>
      );
  }
}

function Figure({ kind }: { kind: Kind }) {
  const pop = useRef<THREE.Group>(null);
  const pal = palette[kind];

  // Spin-in each time the character changes.
  useEffect(() => {
    if (pop.current) pop.current.scale.setScalar(0.55);
  }, [kind]);

  useFrame((_, delta) => {
    const node = pop.current;
    if (!node) return;
    node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, 1, 7, delta));
  });

  return (
    <group ref={pop}>
      {/* shoes + legs */}
      {[-0.17, 0.17].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.07, 0.06]}>
            <boxGeometry args={[0.22, 0.14, 0.42]} />
            <Mat color="#ece9e2" rough={0.6} />
          </mesh>
          <mesh position={[x, 0.55, 0]}>
            <cylinderGeometry args={[0.105, 0.095, 0.82, 14]} />
            <Mat color={pal.pants} rough={0.85} />
          </mesh>
        </group>
      ))}
      {/* torso */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.34, 0.3, 0.85, 20]} />
        <Mat color={pal.top} rough={0.8} />
      </mesh>
      <mesh position={[0, 1.74, 0]}>
        <sphereGeometry args={[0.34, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat color={pal.top} rough={0.8} />
      </mesh>
      {/* arms */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.45, 1.42, 0]} rotation={[0, 0, s * 0.14]}>
          <mesh position={[0, -0.32, 0]}>
            <capsuleGeometry args={[0.085, 0.62, 4, 10]} />
            <Mat color={pal.top} rough={0.8} />
          </mesh>
          <mesh position={[0, -0.72, 0]}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <Mat color={SKIN} rough={0.6} />
          </mesh>
        </group>
      ))}
      {/* neck + head */}
      <mesh position={[0, 1.88, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.12, 12]} />
        <Mat color={SKIN} rough={0.6} />
      </mesh>
      <mesh position={[0, 2.03, 0]}>
        <sphereGeometry args={[0.27, 28, 20]} />
        <Mat color={SKIN} rough={0.6} />
      </mesh>
      {/* hair (swept back and up; opens at the face, +z) */}
      <mesh position={[0, 2.1, -0.03]} scale={[1, 0.82, 1.02]}>
        <sphereGeometry args={[0.285, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <Mat color={HAIR} rough={0.9} />
      </mesh>
      <mesh position={[0, 2.21, 0.1]} rotation={[0.3, 0, 0]} scale={[1, 0.5, 0.9]}>
        <sphereGeometry args={[0.21, 16, 12]} />
        <Mat color={HAIR} rough={0.9} />
      </mesh>
      {/* eyes + brows */}
      {[-0.09, 0.09].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.03, 0.245]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.4} />
          </mesh>
          <mesh position={[x, 2.09, 0.245]}>
            <boxGeometry args={[0.07, 0.014, 0.014]} />
            <Mat color={HAIR} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.93, 0.255]}>
        <boxGeometry args={[0.09, 0.015, 0.012]} />
        <Mat color="#6d3a28" />
      </mesh>
      <Accessories kind={kind} accent={pal.accent} />
    </group>
  );
}

function Platform({ ring }: { ring: string }) {
  return (
    <group position={[0, -0.04, 0]}>
      <mesh>
        <cylinderGeometry args={[1.1, 1.18, 0.08, 40]} />
        <meshStandardMaterial color="#0e1219" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.018, 8, 64]} />
        <meshStandardMaterial color={ring} emissive={ring} emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.01, 8, 64]} />
        <meshStandardMaterial color={ring} emissive={ring} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function StatBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="cs-stat">
      <span className="cs-stat-label">{label}</span>
      <div
        className={value === null ? "cs-bar cs-bar-empty" : "cs-bar"}
        role="img"
        aria-label={value === null ? `${label}: placeholder` : `${label}: ${value} out of 10, self-rated`}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} className={value !== null && i < value ? "on" : ""} />
        ))}
      </div>
      <span className="cs-stat-value">{value === null ? "PLACEHOLDER" : `${value}/10`}</span>
    </div>
  );
}

export default function CharacterSelect() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const current = characters[index];
  const pal = palette[current.id];
  const go = (delta: number) => setIndex((value) => (value + delta + characters.length) % characters.length);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <div className="cs" onKeyDown={onKey}>
      <div className="cs-stage" ref={stageRef}>
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.45, 5.4], fov: 32 }}
          gl={{ antialias: true, alpha: true }}
          aria-label={`Spinning 3D figure: ${current.name}`}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          <directionalLight position={[-4, 2, -3]} intensity={1.1} color={pal.ring} />
          <pointLight position={[0, 0.2, 2]} intensity={0.9} color={pal.ring} />
          <Figure kind={current.id} />
          <Platform ring={pal.ring} />
          <OrbitControls
            target={[0, 1.1, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.9}
            autoRotate={!reduced}
            autoRotateSpeed={2.4}
          />
        </Canvas>
        <button className="cs-arrow cs-arrow-left" onClick={() => go(-1)} aria-label="Previous character">
          <ChevronLeft size={22} />
        </button>
        <button className="cs-arrow cs-arrow-right" onClick={() => go(1)} aria-label="Next character">
          <ChevronRight size={22} />
        </button>
        <div className="cs-stage-tag">
          <span>PLAYER {String(index + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}</span>
          <strong>{current.name}</strong>
        </div>
        <div className="cs-stage-hint">Drag To Spin • Arrow Keys To Switch</div>
      </div>

      <div className="cs-panel" key={current.id} aria-live="polite">
        <div className="cs-head">
          <img src={current.portrait} alt={current.portraitAlt} width={96} height={120} loading="lazy" decoding="async" />
          <div>
            <p className="eyebrow">Class</p>
            <h3>{current.name}</h3>
            <p className="cs-tagline">{current.tagline}</p>
          </div>
        </div>

        <dl className="cs-info">
          <div>
            <dt>Age</dt>
            <dd className={current.age === null ? "cs-ph" : ""}>{current.age ?? "PLACEHOLDER"}</dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd className={current.height === null ? "cs-ph" : ""}>{current.height ?? "PLACEHOLDER"}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd className={current.level === null ? "cs-ph" : ""}>{current.level ?? "PLACEHOLDER"}</dd>
          </div>
          <div>
            <dt>Alignment</dt>
            <dd>{current.alignment}</dd>
          </div>
        </dl>

        <div className="cs-stats">
          {current.stats.map((stat) => (
            <StatBar key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="cs-lore">
          <p>
            <span>Signature</span> {current.signature}
          </p>
          <p>
            <span>Weakness</span> {current.weakness}
          </p>
        </div>
        <div className="chip-row">
          {current.quests.map((quest) => (
            <span key={quest}>{quest}</span>
          ))}
        </div>
      </div>

      <div className="cs-roster" role="group" aria-label="Choose a character">
        {characters.map((character, i) => (
          <button
            key={character.id}
            className={i === index ? "cs-pick active" : "cs-pick"}
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
          >
            <img src={character.portrait} alt="" width={56} height={70} loading="lazy" decoding="async" />
            <span>{character.name.replace("The ", "")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
