import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Trail, useGLTF, useTexture } from "@react-three/drei";
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
  stats: string[]; // stat names; every bar is shown full, each in its own colour
  ultimate: { name: string; text: string }; // "press X" move
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
    cutoutSize: [1000, 937],
    cardHeight: 1.9,
    cutoutAlt: "Shlok wiring a robot with tools on the table",
    stats: ["CAD", "Electronics", "Debugging", "Patience"],
    ultimate: { name: "Overclock Build", text: "Time slows, the wires sort themselves out, and the prototype is suddenly done." },
    signature: "Tunnel-visioned",
    weakness: "“Yeah, this should work.”",
    quests: ["Little Helper", "Trinetra", "Dwello Turbofan"]
  },
  {
    id: "pilot",
    name: "The Pilot",
    tagline: "Racing against the universe and hoping to win too.",
    cutout: "/assets/cut-pilot.webp",
    cutoutSize: [1100, 1000],
    cardHeight: 2.0,
    cutoutAlt: "Shlok in a black airline pilot cap, sitting on an ice formation",
    stats: ["Aerodynamics", "Propulsion", "Ambition", "Persistence"],
    ultimate: { name: "V1 Rotate", text: "Pulls the nose up and climbs straight into the clouds. Landing not included." },
    signature: "Obsessed with planes",
    weakness: "Just thinks of planes.",
    quests: ["Self-Made RC Plane", "IIT Madras Aerospace Course", "Flying Academy Workshop"]
  },
  {
    id: "captain",
    name: "The Captain",
    tagline: "Coordination, travel plans, and driving the bot.",
    cutout: "/assets/cut-captain.webp",
    cutoutSize: [1097, 1000],
    cardHeight: 1.9,
    cutoutAlt: "Shlok speaking at a podium",
    stats: ["Leadership", "Coordination", "Public Speaking", "Crisis Handling"],
    ultimate: { name: "Rally Call", text: "Everyone gets a plan, and maybe some angry yelling." },
    signature: "Makes the plan, then the backup plan, then the group chat",
    weakness: "Stressed.",
    quests: ["Team Dinoco", "Cyber Club", "Robotics Club"]
  },
  {
    id: "explorer",
    name: "The Explorer",
    tagline: "Follows the science, and the evening walks.",
    cutout: "/assets/cut-explorer.webp",
    cutoutSize: [720, 1201],
    cardHeight: 2.4,
    cutoutAlt: "Shlok checking a compass and a trail map in Chamonix",
    stats: ["Curiosity", "Adaptability", "Cold Tolerance", "Travel Stamina"],
    ultimate: { name: "Trailhead Teleport", text: "Follows a compass and a vague hunch straight to the next peak." },
    signature: "CERN and IIT Mumbai",
    weakness: "Cancelled flights.",
    quests: ["CERN Visit", "IIT Mumbai"]
  },
  {
    id: "philosopher",
    name: "The Philosopher",
    tagline: "Writes poems to say it better.",
    cutout: "/assets/cut-philosopher.webp",
    cutoutSize: [559, 1000],
    cardHeight: 2.3,
    cutoutAlt: "Shlok sitting thoughtfully outdoors",
    stats: ["Reflection", "Wordcraft", "Overthinking", "Tweaking Out"],
    ultimate: { name: "Memento Mori", text: "Freezes the moment and turns it into a poem." },
    signature: "Contemplative",
    weakness: "Questionable sleep schedule.",
    quests: ["Poems"]
  },
  {
    id: "friend",
    name: "The Friend",
    tagline: "Evening walks, friend-group moments, and one more match.",
    cutout: "/assets/cut-friend.webp",
    cutoutSize: [1200, 782],
    cardHeight: 1.7,
    cutoutAlt: "Shlok and friends piled together",
    stats: ["Loyalty", "Humour", "Gaming Skill", "Sleep Debt"],
    ultimate: { name: "Squad Revive", text: "Brings the whole team back from the brink." },
    signature: "Feeling at home",
    weakness: "Too many hours on Valorant.",
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
type CardSource = { id: string; cutout: string; cutoutSize: [number, number]; cardHeight: number };

function PhotoCard({ character, ring, still }: { character: CardSource; ring: string; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(character.cutout);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const [pw, ph] = character.cutoutSize;
  const height = character.cardHeight;
  const width = (height * pw) / ph;
  // Shrink wide cards so they always fit the stage, whatever its width.
  const viewport = useThree((state) => state.viewport);
  const fit = Math.min(1, (viewport.width * 0.86) / width, (viewport.height * 0.8) / height);

  useEffect(() => {
    if (group.current) group.current.scale.setScalar(0.55 * fit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.id]);

  useFrame(({ clock }, delta) => {
    const node = group.current;
    if (!node) return;
    node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, fit, 7, delta));
    node.position.y = (height * node.scale.x) / 2 + 0.06 + Math.sin(clock.elapsedTime * 1.4) * 0.03;
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

const STAT_COLOURS = ["#ff8a2a", "#89d8ff", "#7dff9a", "#ff5a8a"];
const GLYPHS = "!<>-_\/[]{}=+*^?#%&$@01";

// Endlessly scrambling text for values that are deliberately not revealed.
function Garble({ length, className }: { length: number; className?: string }) {
  const reduced = useReducedMotion();
  const make = () =>
    Array.from({ length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");
  const [text, setText] = useState(make);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setText(make()), 90);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, length]);
  return (
    <span className={className} aria-hidden="true">
      {text}
    </span>
  );
}

function StatBar({ label, colour }: { label: string; colour: string }) {
  return (
    <div className="cs-stat" style={{ "--c": colour } as CSSProperties}>
      <span className="cs-stat-label">{label}</span>
      <div className="cs-bar cs-bar-full" role="img" aria-label={`${label}: maxed out`}>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <Garble className="cs-stat-value" length={9} />
    </div>
  );
}

function AbilityPop({ fire, name }: { fire: number; name: string }) {
  if (!fire) return null;
  return (
    <div className="cs-pop" key={fire} role="status">
      <span>Ability Activated</span>
      <strong>{name}</strong>
    </div>
  );
}

function MainSelect({ index, setIndex, fire }: { index: number; setIndex: (value: number | ((v: number) => number)) => void; fire: number }) {
  const reduced = useReducedMotion();
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
        <AbilityPop fire={fire} name={current.ultimate.name} />
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
            <dd>17</dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>5&apos;6&quot;</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>
              <Garble className="cs-garble" length={7} />
            </dd>
          </div>
        </dl>

        <div className="cs-stats">
          {current.stats.map((label, i) => (
            <StatBar key={label} label={label} colour={STAT_COLOURS[i % STAT_COLOURS.length]} />
          ))}
        </div>

        <div className="cs-ult" key={`ult-${fire}`} data-fired={fire > 0 ? "true" : undefined}>
          <kbd>X</kbd>
          <div>
            <span>Ultimate Ability (Press X)</span>
            <strong>{current.ultimate.name}</strong>
            <p>{current.ultimate.text}</p>
          </div>
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

type SideId = "trixie" | "helper" | "goldfish";

type SideCharacter = {
  id: SideId;
  name: string;
  tagline: string;
  stats: string[];
  ultimate: { name: string; text: string };
  signature: string;
  weakness: string;
  ring: string;
  card?: CardSource;
};

const sideCharacters: SideCharacter[] = [
  {
    id: "trixie",
    name: "Trixie",
    tagline: "German shepherd. Fat sunglasses wearer.",
    stats: ["Loyalty", "Fluff", "Bark"],
    ultimate: { name: "Asks For Treats", text: "Sits, stares, and wins every single time." },
    signature: "Sunglasses",
    weakness: "Treats.",
    ring: "#c79bff",
    card: { id: "trixie", cutout: "/assets/cut-trixie.webp", cutoutSize: [640, 1495], cardHeight: 2.25 }
  },
  {
    id: "helper",
    name: "Little Helper",
    tagline: "Carries the teachers’ books so nobody else has to.",
    stats: ["Traction", "Carrying", "Safety"],
    ultimate: { name: "Emergency Stop", text: "The ultrasonic sensor halts everything before the wall does." },
    signature: "RFID and PIN lock",
    weakness: "Needs its PS3 controller.",
    ring: "#ff8a2a"
  },
  {
    id: "goldfish",
    name: "Souls Of My Childhood Goldfish",
    tagline: "Still swimming, just not in water.",
    stats: ["Ghost Glow", "Bubble Count", "Memory"],
    ultimate: { name: "Final Splash", text: "One dramatic bubble, right on cue." },
    signature: "Glowing",
    weakness: "About three seconds of memory.",
    ring: "#ffb15a"
  }
];

function HelperModel() {
  const { scene } = useGLTF("/assets/little-helper.glb");
  const group = useRef<THREE.Group>(null);
  const model = useRef<THREE.Object3D | null>(null);
  if (!model.current) {
    const copy = scene.clone(true);
    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale = 1.7 / Math.max(size.x, size.y, size.z);
    copy.position.sub(centre);
    const wrap = new THREE.Group();
    wrap.add(copy);
    wrap.scale.setScalar(scale);
    wrap.position.y = (size.y * scale) / 2 + 0.1;
    model.current = wrap;
  }
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.7;
  });
  return (
    <group ref={group}>
      <primitive object={model.current} />
    </group>
  );
}

const FISH = [
  { r: 0.95, y: 1.2, speed: 0.6, phase: 0, scale: 1 },
  { r: 0.72, y: 1.65, speed: -0.8, phase: 2.2, scale: 0.8 },
  { r: 1.05, y: 0.95, speed: 0.5, phase: 4.1, scale: 0.9 }
];
const SPARKS = 56;

function fanShape(points: Array<[number, number]>) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

// A glowing goldfish spirit: round body, big eyes, flowing forked tail and fins, a halo, and a light trail.
function GhostFish({ spec, index, setRef }: { spec: (typeof FISH)[number]; index: number; setRef: (node: THREE.Group | null) => void }) {
  const tail = useRef<THREE.Group>(null);
  const finL = useRef<THREE.Mesh>(null);
  const finR = useRef<THREE.Mesh>(null);
  const geoms = useRef<{ tail: THREE.ShapeGeometry; dorsal: THREE.ShapeGeometry; fin: THREE.ShapeGeometry } | null>(null);
  if (!geoms.current) {
    geoms.current = {
      tail: fanShape([[0, 0], [-0.2, 0.05], [-0.42, 0.24], [-0.56, 0.2], [-0.5, 0.08], [-0.58, 0], [-0.5, -0.08], [-0.56, -0.2], [-0.42, -0.24], [-0.2, -0.05]]),
      dorsal: fanShape([[-0.12, 0.17], [-0.04, 0.38], [0.06, 0.34], [0.16, 0.16]]),
      fin: fanShape([[0, 0], [-0.14, 0.05], [-0.2, -0.04], [-0.08, -0.08]])
    };
  }
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 6 + index * 1.7;
    if (tail.current) tail.current.rotation.y = Math.sin(t) * 0.55;
    const flap = Math.sin(t * 0.8) * 0.4;
    if (finL.current) finL.current.rotation.x = 0.5 + flap;
    if (finR.current) finR.current.rotation.x = -0.5 - flap;
  });
  const glow = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide } as const;
  return (
    <group ref={setRef} scale={spec.scale}>
      <mesh scale={[1.55, 1.05, 0.8]}>
        <sphereGeometry args={[0.2, 24, 16]} />
        <meshBasicMaterial color="#ff8a2a" opacity={0.85} {...glow} />
      </mesh>
      <mesh scale={[1.25, 0.8, 0.62]} position={[0.03, 0.02, 0]}>
        <sphereGeometry args={[0.2, 20, 14]} />
        <meshBasicMaterial color="#ffe0a8" opacity={0.7} {...glow} />
      </mesh>
      <group ref={tail} position={[-0.28, 0, 0]}>
        <mesh geometry={geoms.current.tail}>
          <meshBasicMaterial color="#ff9a3c" opacity={0.6} {...glow} />
        </mesh>
        <Trail width={0.7} length={7} color="#ffb15a" attenuation={(t) => t * t}>
          <mesh position={[-0.48, 0, 0]}>
            <sphereGeometry args={[0.01, 4, 4]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </Trail>
      </group>
      <mesh geometry={geoms.current.dorsal}>
        <meshBasicMaterial color="#ff9a3c" opacity={0.6} {...glow} />
      </mesh>
      <mesh ref={finL} geometry={geoms.current.fin} position={[0.08, -0.07, 0.12]}>
        <meshBasicMaterial color="#ffc27a" opacity={0.6} {...glow} />
      </mesh>
      <mesh ref={finR} geometry={geoms.current.fin} position={[0.08, -0.07, -0.12]}>
        <meshBasicMaterial color="#ffc27a" opacity={0.6} {...glow} />
      </mesh>
      {[0.13, -0.13].map((z) => (
        <group key={z} position={[0.25, 0.07, z]}>
          <mesh>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.025, 0, z > 0 ? 0.02 : -0.02]}>
            <sphereGeometry args={[0.024, 8, 8]} />
            <meshBasicMaterial color="#10131a" />
          </mesh>
        </group>
      ))}
      <mesh position={[0.02, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.016, 8, 24]} />
        <meshBasicMaterial color="#fff2b0" {...glow} />
      </mesh>
    </group>
  );
}

function GoldfishSouls() {
  const fish = useRef<Array<THREE.Group | null>>([]);
  const sparks = useRef<THREE.Points>(null);
  const sparkData = useRef<Float32Array | null>(null);
  if (!sparkData.current) {
    const arr = new Float32Array(SPARKS * 3);
    for (let i = 0; i < SPARKS; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.45;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 0.8 + Math.random() * 1.6;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    sparkData.current = arr;
  }
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    FISH.forEach((spec, i) => {
      const node = fish.current[i];
      if (!node) return;
      const a = t * spec.speed + spec.phase;
      node.position.set(Math.cos(a) * spec.r, spec.y + Math.sin(t * 1.1 + i * 2) * 0.14, Math.sin(a) * spec.r);
      // swim along the circle (nose follows the direction of travel)
      node.rotation.y = -a + (spec.speed > 0 ? 0 : Math.PI);
      node.rotation.z = Math.sin(t * 1.5 + i) * 0.1;
    });
    const pts = sparks.current;
    const data = sparkData.current;
    if (pts && data) {
      for (let i = 0; i < SPARKS; i++) {
        data[i * 3 + 1] += 0.006 + (i % 5) * 0.001;
        if (data[i * 3 + 1] > 2.5) data[i * 3 + 1] = 0.8;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <group>
      {/* the childhood goldfish bowl, glass and open at the top */}
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.58, 36, 24, 0, Math.PI * 2, 0.5, Math.PI - 0.5]} />
        <meshBasicMaterial color="#bfe9ff" transparent opacity={0.13} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.012, 8, 40]} />
        <meshBasicMaterial color="#d8f2ff" transparent opacity={0.7} />
      </mesh>
      {FISH.map((spec, i) => (
        <GhostFish
          key={i}
          spec={spec}
          index={i}
          setRef={(node) => {
            fish.current[i] = node;
          }}
        />
      ))}
      <points ref={sparks}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkData.current, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffd9a0" size={0.05} transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function SideSelect({ index, setIndex, fire }: { index: number; setIndex: (value: number | ((v: number) => number)) => void; fire: number }) {
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const current = sideCharacters[index];
  const go = (delta: number) => setIndex((value) => (value + delta + sideCharacters.length) % sideCharacters.length);

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
    <div className="cs-side" onKeyDown={onKey}>
      <div className="cs-side-stage" ref={stageRef}>
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.2, 6.2], fov: 32 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera }) => camera.lookAt(0, 1.1, 0)}
          aria-label={`3D scene: ${current.name}`}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 5, 4]} intensity={1.5} />
          <pointLight position={[0, 0.4, 2]} intensity={0.9} color={current.ring} />
          <Suspense fallback={null}>
            {current.id === "helper" && <HelperModel />}
            {current.id === "goldfish" && <GoldfishSouls />}
            {current.card && <PhotoCard key={current.id} character={current.card} ring={current.ring} still={!!reduced} />}
          </Suspense>
          <Platform ring={current.ring} />
        </Canvas>
        <button className="cs-arrow cs-arrow-left" onClick={() => go(-1)} aria-label="Previous side character">
          <ChevronLeft size={18} />
        </button>
        <button className="cs-arrow cs-arrow-right" onClick={() => go(1)} aria-label="Next side character">
          <ChevronRight size={18} />
        </button>
        <div className="cs-stage-tag">
          <span>SIDE CHARACTER</span>
          <strong>{current.name}</strong>
        </div>
        <AbilityPop fire={fire} name={current.ultimate.name} />
        <div className="cs-dots" role="group" aria-label="Choose a side character">
          {sideCharacters.map((side, i) => (
            <button
              key={side.id}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
              aria-label={side.name}
              aria-pressed={i === index}
            />
          ))}
        </div>
      </div>

      <div className="cs-panel cs-side-panel" key={current.id} aria-live="polite">
        <div>
          <p className="eyebrow">Side Character</p>
          <h3>{current.name}</h3>
          <p className="cs-tagline">{current.tagline}</p>
        </div>
        <div className="cs-stats">
          {current.stats.map((label, i) => (
            <StatBar key={label} label={label} colour={STAT_COLOURS[i % STAT_COLOURS.length]} />
          ))}
        </div>
        <div className="cs-ult" key={`ult-${fire}`} data-fired={fire > 0 ? "true" : undefined}>
          <kbd>X</kbd>
          <div>
            <span>Ultimate Ability (Press X)</span>
            <strong>{current.ultimate.name}</strong>
            <p>{current.ultimate.text}</p>
          </div>
        </div>
        <div className="cs-lore">
          <p>
            <span>Signature</span> {current.signature}
          </p>
          <p>
            <span>Weakness</span> {current.weakness}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CharacterSelect() {
  const [index, setIndex] = useState(0);
  const [sideIndex, setSideIndex] = useState(1);
  const [fire, setFire] = useState(0);

  // Easter egg: pressing X triggers both ultimate abilities.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "x" || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      setFire((value) => value + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="cs-wrap">
      <MainSelect index={index} setIndex={setIndex} fire={fire} />
      <SideSelect index={sideIndex} setIndex={setSideIndex} fire={fire} />
    </div>
  );
}
