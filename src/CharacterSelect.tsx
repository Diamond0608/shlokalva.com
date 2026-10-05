import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Kind = "engineer" | "pilot" | "captain" | "explorer" | "philosopher" | "friend";

type Character = {
  id: Kind;
  name: string;
  tagline: string;
  cutout: string;
  cutoutSize: [number, number]; // pixel size of the cutout
  cardHeight: number; // world units
  cutoutAlt: string;
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
    cutout: "/assets/cut-engineer.webp",
    cutoutSize: [1097, 1000],
    cardHeight: 1.9,
    cutoutAlt: "Shlok speaking at a podium",
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
    cutout: "/assets/cut-pilot.webp",
    cutoutSize: [523, 1000],
    cardHeight: 2.4,
    cutoutAlt: "Shlok in a navy suit",
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
    cutout: "/assets/cut-captain.webp",
    cutoutSize: [520, 800],
    cardHeight: 2.3,
    cutoutAlt: "Shlok in a blazer and lanyard at an event",
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
    cutout: "/assets/cut-explorer.webp",
    cutoutSize: [449, 1000],
    cardHeight: 2.4,
    cutoutAlt: "Shlok sitting on an ice formation during a trip",
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
    cutout: "/assets/cut-philosopher.webp",
    cutoutSize: [559, 1000],
    cardHeight: 2.3,
    cutoutAlt: "Shlok sitting thoughtfully outdoors",
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
    cutout: "/assets/cut-friend.webp",
    cutoutSize: [1200, 900],
    cardHeight: 1.9,
    cutoutAlt: "Shlok with friends in Geneva during the CERN trip",
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

const palette: Record<Kind, { accent: string; ring: string }> = {
  engineer: { accent: "#f5c542", ring: "#ff8a2a" },
  pilot: { accent: "#89d8ff", ring: "#89d8ff" },
  captain: { accent: "#b3392d", ring: "#ff8a2a" },
  explorer: { accent: "#4aa3d9", ring: "#89d8ff" },
  philosopher: { accent: "#e9dcc3", ring: "#e9dcc3" },
  friend: { accent: "#ff5a5f", ring: "#7dff9a" }
};

const LAYERS = 9;
const DEPTH = 0.09;

// A cutout of Shlok's photo as a thick 3D card: a bright front, a darkened mirrored
// back, and stacked dark layers between them that read as the card's edge.
function PhotoCard({ character, ring, still }: { character: Character; ring: string; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(character.cutout);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const [pw, ph] = character.cutoutSize;
  const height = character.cardHeight;
  const width = (height * pw) / ph;

  useEffect(() => {
    if (group.current) group.current.scale.setScalar(0.55);
  }, [character.id]);

  useFrame(({ clock }, delta) => {
    const node = group.current;
    if (!node) return;
    node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, 1, 7, delta));
    node.position.y = height / 2 + 0.06 + Math.sin(clock.elapsedTime * 1.4) * 0.03;
    // Sway through a front-facing arc instead of a full turn, so the flat card never goes edge-on.
    node.rotation.y = still ? 0 : Math.sin(clock.elapsedTime * 0.7) * 0.75;
  });

  const edge = new THREE.Color(ring).multiplyScalar(0.28).getStyle();

  return (
    <group ref={group}>
      {Array.from({ length: LAYERS }, (_, i) => {
        const z = -DEPTH / 2 + ((i + 1) / (LAYERS + 1)) * DEPTH;
        return (
          <mesh key={i} position={[0, 0, z]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial map={texture} color={edge} alphaTest={0.5} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, DEPTH / 2]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} alphaTest={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -DEPTH / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} color="#8a8f99" alphaTest={0.5} toneMapped={false} />
      </mesh>
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
          camera={{ position: [0, 1.4, 5.6], fov: 32 }}
          gl={{ antialias: true, alpha: true }}
          aria-label={`Spinning 3D photo card: ${current.name}. ${current.cutoutAlt}`}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          <directionalLight position={[-4, 2, -3]} intensity={1.1} color={pal.ring} />
          <pointLight position={[0, 0.2, 2]} intensity={0.9} color={pal.ring} />
          <Suspense fallback={null}>
            <PhotoCard key={current.id} character={current} ring={pal.ring} still={!!reduced} />
          </Suspense>
          <Platform ring={pal.ring} />
          <OrbitControls
            target={[0, 1.1, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
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
        <div className="cs-dots" role="group" aria-label="Choose a character">
          {characters.map((character, i) => (
            <button
              key={character.id}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
              aria-label={character.name}
              aria-pressed={i === index}
            />
          ))}
        </div>
        <div className="cs-stage-hint">Drag To Turn • Arrow Keys To Switch</div>
      </div>

      <div className="cs-panel" key={current.id} aria-live="polite">
        <div className="cs-head">
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
    </div>
  );
}
