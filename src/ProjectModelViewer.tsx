import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useBounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";

function ProjectModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);

  return (
    <Center>
      <primitive object={scene} dispose={null} />
    </Center>
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

export default function ProjectModelViewer({ src }: { src: string }) {
  const controlsRef = useRef<any>(null);
  const boundsRef = useRef<BoundsApi | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
          gl.toneMappingExposure = 0.52;
        }}
      >
        <hemisphereLight intensity={0.82} color="#ffffff" groundColor="#202020" />
        <directionalLight position={[5, 6, 7]} intensity={1.85} />
        <directionalLight position={[-4, 2, 3]} intensity={0.82} />
        <directionalLight position={[2, -2, -5]} intensity={0.65} />

        <Suspense fallback={null}>
          <Bounds fit clip margin={1.25}>
            <ProjectModel src={src} />
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
        <span className="model-hud-subtitle">ROTATE • ZOOM • INSPECT</span>
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
      <div className="project-model-hint">Drag To Inspect • Scroll To Zoom</div>
    </div>
  );
}
