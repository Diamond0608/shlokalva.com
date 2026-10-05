import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useBounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";
import { CutControls, initialCut, resolveCut, type CutState } from "./CutControls";

// Soft studio reflections so the inside of a cutaway is actually readable.
function StudioLight() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const env = generator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = 0.14;
    return () => {
      scene.environment = null;
      env.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return null;
}

// Slow cutaway cycle: closed, the top slides away to show the inside, long hold, closing again.
const CUT_CYCLE = 38;
const smooth = (t: number) => t * t * (3 - 2 * t);
function cutProgress(elapsed: number) {
  const phase = elapsed % CUT_CYCLE;
  if (phase < 3) return 0;
  if (phase < 13) return smooth((phase - 3) / 10);
  if (phase < 27) return 1;
  if (phase < 35) return 1 - smooth((phase - 27) / 8);
  return 0;
}

function ProjectModel({ src, cutaway, cut, liveRef }: { src: string; cutaway: boolean; cut: CutState; liveRef: { current: number } }) {
  const { scene } = useGLTF(src);
  const gl = useThree((state) => state.gl);
  const rootRef = useRef<THREE.Group>(null);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6)).current;
  const range = useRef<{ min: number; max: number } | null>(null);

  useEffect(() => {
    if (!cutaway) return;
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material: THREE.Material) => {
        material.side = THREE.DoubleSide; // the cutaway shows interior surfaces
        material.needsUpdate = true;
      });
    });
    gl.clippingPlanes = [plane];
    return () => {
      gl.clippingPlanes = [];
    };
  }, [cutaway, scene, gl, plane]);

  useFrame((state) => {
    if (!cutaway) return;
    const root = rootRef.current;
    if (!root) return;
    if (!range.current) {
      const box = new THREE.Box3().setFromObject(root);
      if (box.isEmpty()) return;
      range.current = { min: box.min.y, max: box.max.y };
    }
    const { min, max } = range.current;
    const auto = cutProgress(state.clock.elapsedTime);
    liveRef.current = auto;
    const amount = resolveCut(cut, auto);
    // Everything above the plane is removed; at full cut about the upper 80% is gone.
    const target = max - (max - min) * 0.8;
    plane.constant = max + 1 - amount * (max + 1 - target);
  });

  return (
    <group ref={rootRef}>
      <Center>
        <primitive object={scene} dispose={null} />
      </Center>
    </group>
  );
}

type BoundsApi = ReturnType<typeof useBounds>;

// Exposes the Bounds fit() so Reset can re-frame the model instead of
// returning to the pre-fit camera, which sits inside the model.
function BoundsHandle({ apiRef }: { apiRef: { current: BoundsApi | null } }) {
  const api = useBounds();
  apiRef.current = api;
  // The first fit can run before the model's geometry is laid out, which left the viewer blank until
  // the user dragged it. Re-fit once the model is really there, over a few frames to be safe.
  useEffect(() => {
    const refit = () => api.refresh().clip().fit();
    const timers = [60, 250, 700].map((delay) => window.setTimeout(refit, delay));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [api]);
  return null;
}

export default function ProjectModelViewer({ src, cutaway = false }: { src: string; cutaway?: boolean }) {
  const controlsRef = useRef<any>(null);
  const boundsRef = useRef<BoundsApi | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cut, setCut] = useState<CutState>(initialCut);
  const liveRef = useRef(0);

  const resetView = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.reset();
    boundsRef.current?.refresh().clip().fit();
  };

  // Native fullscreen where the browser allows it (not iPhone Safari, embedded
  // panes or restrictive policies); otherwise fall back to a fixed full-window view.
  const toggleFullscreen = async () => {
    const node = viewerRef.current;
    if (!node) return;
    if (expanded) {
      setExpanded(false);
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    try {
      if (!node.requestFullscreen) throw new Error("unsupported");
      // Some embedded browsers neither enter nor reject; don't wait on them forever.
      await Promise.race([
        node.requestFullscreen(),
        new Promise((_, reject) => window.setTimeout(reject, 600))
      ]);
      if (!document.fullscreenElement) setExpanded(true);
    } catch {
      if (!document.fullscreenElement) setExpanded(true);
    }
  };

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [expanded]);

  return (
    <div ref={viewerRef} className={expanded ? "project-model-viewer is-expanded" : "project-model-viewer"}>
      <Canvas
        camera={{ position: [4, 3, 5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = cutaway ? 0.34 : 0.52;
        }}
      >
        {cutaway && <StudioLight />}
        <hemisphereLight intensity={cutaway ? 0.3 : 0.82} color="#ffffff" groundColor="#202020" />
        <directionalLight position={[5, 6, 7]} intensity={cutaway ? 0.8 : 1.85} />
        <directionalLight position={[-4, 2, 3]} intensity={cutaway ? 0.35 : 0.82} />
        <directionalLight position={[2, -2, -5]} intensity={cutaway ? 0.25 : 0.65} />

        <Suspense fallback={null}>
          <Bounds fit clip margin={1.25}>
            <ProjectModel src={src} cutaway={cutaway} cut={cut} liveRef={liveRef} />
            <BoundsHandle apiRef={boundsRef} />
          </Bounds>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.7}
          zoomSpeed={0.85}
          autoRotate={autoRotate}
          autoRotateSpeed={1.6}
        />
      </Canvas>

      <div className="model-hud" aria-label="3D model controls">
        <span className="model-hud-title">3D INSPECTION MODE</span>
        <span className="model-hud-subtitle">{cutaway ? "ROTATE • ZOOM • SEE INSIDE" : "ROTATE • ZOOM • INSPECT"}</span>
        <div className="model-controls">
          <button onClick={() => setAutoRotate((value) => !value)} aria-label={autoRotate ? "Pause auto rotation" : "Start auto rotation"}>
            {autoRotate ? <Pause size={15} /> : <Play size={15} />}
            <span>{autoRotate ? "Pause" : "Auto Rotate"}</span>
          </button>
          <button onClick={resetView} aria-label="Reset model view">
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
          <button onClick={toggleFullscreen} aria-label="Toggle fullscreen">
            <Maximize2 size={15} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
      {cutaway && <CutControls state={cut} setState={setCut} liveRef={liveRef} className="cut-controls-bar" />}
      <div className="project-model-hint">Drag To Inspect • Scroll To Zoom</div>
    </div>
  );
}
