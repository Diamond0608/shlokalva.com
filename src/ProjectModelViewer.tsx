import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
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

export default function ProjectModelViewer({ src }: { src: string }) {
  const controlsRef = useRef<any>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  const resetView = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.reset();
  };

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerRef.current.requestFullscreen();
      }
    } catch {
      // Fullscreen is optional and can be unavailable on some mobile browsers.
    }
  };

  return (
    <div ref={viewerRef} className="project-model-viewer">
      <Canvas
        camera={{ position: [4, 3, 5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.82;
        }}
      >
        <hemisphereLight intensity={1.25} color="#ffffff" groundColor="#202020" />
        <directionalLight position={[5, 6, 7]} intensity={2.9} />
        <directionalLight position={[-4, 2, 3]} intensity={1.35} />
        <directionalLight position={[2, -2, -5]} intensity={1.1} />

        <Suspense fallback={null}>
          <Bounds fit clip margin={1.25}>
            <ProjectModel src={src} />
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
